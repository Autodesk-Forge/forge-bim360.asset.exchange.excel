
const fs = require('fs');
const excelJS = require('exceljs');
const columnDefs = require('./columnDefs');
const asset_service = require('../services/asset');
const asyncPool = require('tiny-async-pool')
const { chunk } =  require('lodash');
const utility = require('../utility'); 

module.exports = {
    _export: _export,
    _importAssets: _importAssets,
    _deleteAssets: _deleteAssets
};

//each element of the array will export one sheet in the same Excel file
async function _export(exportName, dataArray) {
    try {
        const workbook = new excelJS.Workbook();
        workbook.creator = 'bim360-asset-export';
        const sheets = ['assets', 'categories', 'customAttDefs', 'statuses']

        sheets.forEach(s => {

            const worksheet = workbook.addWorksheet(`${s}`)
            const data = dataArray[s]
            const fixColumnsDef = columnDefs[s + 'Columns'].slice()
            var columnDef = fixColumnsDef
            if (s == 'assets') {

                //append custom attributes columns 
                //
                for (var i in dataArray['customAttDefs']) {
                    const oneDef = dataArray['customAttDefs'][i]
                    columnDef.push(
                        { id: `${oneDef.name}`, propertyName: `${oneDef.name}`, columnTitle: `${oneDef.displayName}`, columnWidth: 8, locked: false },
                    )
                }
            }
            worksheet.columns = columnDef.map(col => {
                return { key: col.id, header: col.columnTitle, width: col.columnWidth };
            });

            for (const d of data) {
                let rowData = {};
                for (const column of columnDef) {
                    if (column.format) {
                        rowData[column.id] = column.format(d[column.propertyName]);
                    }
                    else {
                        rowData[column.id] = d[column.propertyName];
                    }
                }
                var row = worksheet.addRow(rowData);
            }
            worksheet.properties.defaultRowHeight = 25;
            worksheet.properties.defaultColWidth = 30;
            worksheet.eachRow(async (row, rowNumber) => {
                rowNumber == 1 ?
                    row.font = { size: 15, bold: true } : row.font = { size: 15, bold: false }
                // rowNumber %2 ==0 ? 
                //     row.fill = {
                //             type: 'pattern',
                //             pattern:'solid',
                //             bgColor:{argb:'#E0E0E0'} 
                //         }:
                //         row.fill = {
                //             type: 'pattern',
                //             pattern:'solid',
                //             bgColor:{argb:'#FFFFFF'}

                //}
            })

            // Setup data validation and protection where needed
            for (const column of columnDef) {
                if (column.locked || column.validation) {
                    worksheet.getColumn(column.id).eachCell(function (cell) {
                        if (column.locked) {
                            cell.protection = {
                                locked: true
                            };
                        }
                        if (column.validation) {
                            cell.dataValidation = column.validation;
                        }
                    });
                }
            }


        })

        //now dump custom attributes.

        const buffer = await workbook.xlsx.writeBuffer();
        fs.writeFileSync(`./Excel_Exports/${exportName}.xlsx`, buffer, "binary")
        console.log(`./Excel_Exports/${exportName}.xlsx is saved`);
        return true
    } catch (e) {
        console.log(`./Excel_Exports/${exportName}.xlsx failed`);
        return false 
    } 
}

async function _importAssets(projectId, buffer) {

    var results = {assets:{total:'N/A',success:'N/A',fail:'N/A'}} 

    try { 

        //since the exported excel should have columns with status id and category id
        //we do not need to dump status and category

        //but we need to dump custom attributes defs.
        var allCustomAttdefs = []
        allCustomAttdefs = await asset_service.getAllCustomAttdefs(projectId, allCustomAttdefs)

        console.log('Parsing XLSX spreadsheet.');
        const workbook = new excelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const assets_worksheet = workbook.getWorksheet('assets'); 
        const jobsRes = await importAssets(projectId, assets_worksheet, allCustomAttdefs)
        results.assets = jobsRes 
        return results  
    } catch (e) {
        console.error(`import assets exception ${e}`)
        return results
    }

}


async function importAssets(projectId, assets_worksheet, allCustomAttdefs) {
    
    var results = {assets:{total:'N/A',success:'N/A',fail:'N/A'}} 

    //note the difference between payloads schemas of batch create and batch patch.
    var createArray = []
    var patchDic= {} 

    assets_worksheet.eachRow((row, rowNumber) => { 
        if (rowNumber === 1) {
            return; // Skip the header row
        } 
        try {
            //the index depends on how the columns are defined
            //see columnDefs.js
            const id = row.values[1]
            const clientAssetId = row.values[2]
            const categoryId = row.values[3]
            const statusId = row.values[5] 

            const body = {
                //required attributes
                clientAssetId: clientAssetId,
                categoryId: categoryId,
                statusId: statusId, 
                //from v2, some standard attributes will be moved to custom attributes
                //so it will assume these definitions in custom attributes have been created. 
                //...
            } 
            //starting to input values of custom attributes  
            var i = 0
            body.customAttributes = {}

            //hard-coded the start index of custom attributes
            //depending on how the excel columns are arranged. 
            const Hard_Coded_Start_Index = 20
            allCustomAttdefs.forEach(async def => {
                if (row.values[Hard_Coded_Start_Index + i] != undefined) {
                    if (def.dataType == 'select'){ 
                         //find id of the option
                         const option_value = row.values[Hard_Coded_Start_Index + i]
                         const find = def.values.find(i=>i.displayName == option_value)
                         const option_id = find?find.id:'<invalid>'
                         body.customAttributes[def.name] =  option_id
                    }
                    else if (def.dataType == 'multi_select'){
                        //find id of the options 
                        const option_values = JSON.parse(row.values[Hard_Coded_Start_Index + i])
                        var option_ids = []
                        option_values.forEach(async (o)=>{
                            const find = def.values.find(i=>i.displayName == o)
                            const option_id = find?find.id:'<invalid>' 
                            option_ids.push(option_id)
                        })  
                        body.customAttributes[def.name] = option_ids
                    }
                    else if (def.dataType == 'numeric')
                        body.customAttributes[def.name] = Number(row.values[Hard_Coded_Start_Index + i]).toString()
                    else
                        body.customAttributes[def.name] = row.values[Hard_Coded_Start_Index + i]
                }
                i++
            }) 
            //if it is to create new asset or patch the old asset
            id? patchDic[id] = body:createArray.push(body)
        }
        catch (err) {
            console.error(`Error when parsing spreadsheet row of assets: ${err}`, rowNumber);
        }
    })

    console.log(`starting to create new assets... ${createArray.length}`)  
    //split to 100 per each payload
    const create_paloads = createArray.chunk_inefficient(100) 
    var promiseCreator = async (payload) => {
        await utility.delay(utility.DELAY_MILISECOND)
        try{
            const createRes = await asset_service.createAsset_Batch(projectId, payload)
            if(createRes) {
                console.log(`create ${payload.length} assets succeeded`) 
                return payload.length
            }
            else{
                // currently, if any asset data is incorrect
                // batch create will refuse to handle all assets in the payload
                //so  no assets will be created.
                console.log(`create ${payload.length} assets failed`) 
                return 0 
            }        }catch(e){
            console.log(`create ${payload.length} assets exception`) 
            return 0
        }
    }
    var res = await asyncPool(2, create_paloads, promiseCreator); 

    console.log(`end to patch old assets...${patchDic.length}`) 
    var patch_paloads = [];
    for ( const cols = Object.entries( patchDic ); cols.length; )
        patch_paloads.push( cols.splice(0, 100).reduce( (o,[k,v])=>(o[k]=v,o), {}));
    promiseCreator = async (payload) => {
        await utility.delay(utility.DELAY_MILISECOND)
        try{
            const patchRes = await asset_service.patchAsset_Batch(projectId, payload)
            if(patchRes) {
                console.log(`patch ${Object.keys(payload).length} assets succeeded`) 
                return Object.keys(payload).length
            }
            else{
                // currently, if any asset data is incorrect
                // batch patch will refuse to handle all assets in the payload
                //so no assets will be patched.
                console.log(`patch ${Object.keys(payload).length} assets failed`) 
                return 0 
            }
        }catch(e){
            console.log(`patch ${payload.length} assets exception`) 
            return 0
        }
    }
    res = res?res.concat(await asyncPool(2, patch_paloads, promiseCreator)):
                         await asyncPool(2, patch_paloads, promiseCreator);
    console.log('end to patch old  assets...')  

    const total = createArray.length + Object.keys(patchDic).length 
    const success = res?res.reduce((a, b) => a + b, 0):0
    result = {total:total,success:success,fail:total -success }

    return result
}
 

async function _deleteAssets(projectId, buffer) {

    var results = {assets:{total:'N/A',success:'N/A',fail:'N/A'}} 

    try {   
        console.log('Parsing XLSX spreadsheet.');
        const workbook = new excelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const assets_worksheet = workbook.getWorksheet('assets');

        var jobsRes = await deleteAssets(projectId, assets_worksheet) 
        results.assets = jobsRes
        return results
    } catch (e) {
        console.error(`delete excel exception ${e}`)
        return results
    } 
}

//batch delete assets
async function deleteAssets(projectId, assets_worksheet) {

    var result = {total:'N/A',success:'N/A',fail:'N/A'}

    var ids = []
    assets_worksheet.eachRow((row, rowNumber) => { 
        if (rowNumber === 1) {
            return; // Skip the header row
        } 
        try {
            const id = row.values[1]
            ids.push(id)
        }
        catch (err) {
            console.error(`Error when parsing spreadsheet row of assets:`);
        }
    })

    //split to 100 per each payload
    const paload_array = ids.chunk_inefficient(100) 
    const effectiveConcurrency = Math.min(2, paload_array.length);
    var promiseCreator = async (each_ids) => {
        await utility.delay(utility.DELAY_MILISECOND)
        try{
            const deleteRes = await asset_service.deleteAsset_Batch(projectId, each_ids)
            if(deleteRes) {
                console.log(`delete ${ids.length} assets succeeded`) 
                return each_ids.length
            }
            else{
                // currently, if any asset id is incorrect
                //batch delete will refuse to handle all assets in the payload
                //so no assets are deleted.
                console.log(`delete ${each_ids.length} assets failed`) 
                return 0 
            }
        }catch(e){
            console.error(`delete ${each_ids.length} assets exception`) 
            return 0
        }
    }
    const res = await asyncPool(effectiveConcurrency, paload_array, promiseCreator); 
    const success = res.reduce((a, b) => a + b, 0)
    result = {total:ids.length,success:success,fail:ids.length -success }
    return result
}


