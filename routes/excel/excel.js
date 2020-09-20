
const fs = require('fs');
const excelJS = require('exceljs');
const columnDefs = require('./columnDefs');
const asset_service = require('../services/asset');
const utility = require('../utility');



module.exports = {
    _export: _export,
    _import: _import,
    _delete:_delete
};

//each element of the array will export one sheet in the same Excel file
async function _export(exportName, dataArray) {


    try{
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
        worksheet.eachRow( async (row, rowNumber) => {
            rowNumber == 1 ? 
                row.font = {  size: 15, bold: true }:row.font = {  size: 15, bold: false }
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
}catch(e){
    console.log(`./Excel_Exports/${exportName}.xlsx failed`);
    return false

}
 
}

async function _import(projectId, buffer) {



    try {

        var allStatusSets = []
        allStatusSets = await asset_service.getAllStatusSets(projectId, null, allStatusSets)
        var allStatuses = []
        allStatusSets.forEach(async set => {
            const setName = set.name
            const statuses = set.values
            statuses.forEach(async st => { 
                st.set = setName
                allStatuses.push(st)
            })
        });
        var allCategories = []
        allCategories = await asset_service.getAllCategories(projectId, null, allCategories)
        var allCustomAttdefs = []
        allCustomAttdefs = await asset_service.getAllCustomAttdefs(projectId, null, allCustomAttdefs)

        let results = {
            assets: { total: 0, success: 0, fail: 0 },
            categories: { total: 0, success: 0, fail: 0 },
            customAttDefs: { total: 0, success: 0, fail: 0 },
            statuses: { total: 0, success: 0, fail: 0 }
        };

        console.log('Parsing XLSX spreadsheet.');
        const workbook = new excelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const assets_worksheet = workbook.getWorksheet('assets');
        const categories_worksheet = workbook.getWorksheet('categories');
        const customAttDefs_worksheet = workbook.getWorksheet('customAttDefs');
        const statuses_worksheet = workbook.getWorksheet('statuses');


        var jobsRes = await importAssets(projectId,assets_worksheet,allCategories,allStatuses,allCustomAttdefs)
        var count = {};
        jobsRes.forEach(function(i) { count[i] = (count[i]||0) + 1;});  
        results.assets.total = jobsRes.length 
        results.assets.success = count.true?count.true:0
        results.assets.fail = count.false?count.false:0 

        return results

    } catch (e) {
        console.error(`import excel exception ${e}`)
        return { importJob: false }
    }

}


async function importAssets(projectId,assets_worksheet,allCategories,allStatuses,allCustomAttdefs){
     //create/update assets 
     var jobArray  = [] 
     assets_worksheet.eachRow( (row, rowNumber) => {

         if (rowNumber === 1) {
             return; // Skip the header row
         }

         try {
             const id = row.values[1]

             //find category and status by name
             //can also use the ids directly. excel data contains both name and ids
             const cat = allCategories.find(i => i.name == row.values[4])
             const st = allStatuses.find(i => i.label == row.values[6]) 

             const body = {
                 clientAssetId: row.values[2],
                 categoryId: cat ? cat.id : allCategories[0].id,
                 statusId: st ? st.id : allStatusSets[0].id,

                 description: row.values[7],
                 barcode: row.values[8],
                 serialNumber: row.values[9],
                 specSection: row.values[10],
                 purchaseOrder: row.values[11],
                 purchaseDate: row.values[12],
                 installedBy: row.values[13],
                 installationDate: row.values[14],
                 warrantyStartDate: row.values[15],
                 warrantyEndDate: row.values[16],
                 expectedLifeYears: row.values[17],
                 manufacturer: row.values[18],
                 model: row.values[19]
             }
             //skip some uneditable columns
             var i = 0
             body.customAttributes = {} 

             allCustomAttdefs.forEach(async c => {
                 if(row.values[29 + i] !=undefined){
                     if(c.dataType == 'multi_select')
                        body.customAttributes[c.name] = JSON.parse(row.values[29 + i])
                    else if(c.dataType == 'numeric')
                        body.customAttributes[c.name] = Number(row.values[29 + i]).toString()

                     else
                        body.customAttributes[c.name] = row.values[29 + i]
                 }
                 i++
             }) 
             jobArray.push({projectId:projectId,body:body,id:id})
         }
         catch (err) {
             console.error(`Error when parsing spreadsheet row of assets: ${err}`, rowNumber);
         }
     })

     console.log('starting to import...')
     let promiseArr = jobArray.map(async (job, index) => {  
        await utility.delay(utility.DELAY_MILISECOND*index)
         const postRes = await asset_service.importAsset(job.projectId, job.body,job.id )  
         console.log(`import ${job.id} , ${job.body.clientAssetId} ${postRes}` )              
         return postRes  
     }) 
      
     return Promise.all(promiseArr).then((results) => { 
            console.log('importing done...')

          return results

      }).catch(function (err) {
         console.log(`exception when Promise.all import assets: ${err}`);
         return []
     }) 
}




async function _delete(projectId, buffer) { 

    try {

        var allStatusSets = []
        allStatusSets = await asset_service.getAllStatusSets(projectId, null, allStatusSets)
        var allStatuses = []
        allStatusSets.forEach(async set => {
            const setName = set.name
            const statuses = set.values
            statuses.forEach(async st => { 
                st.set = setName
                allStatuses.push(st)
            })
        });
        var allCategories = []
        allCategories = await asset_service.getAllCategories(projectId, null, allCategories)
        var allCustomAttdefs = []
        allCustomAttdefs = await asset_service.getAllCustomAttdefs(projectId, null, allCustomAttdefs)

        let results = {
            assets: { total: 0, success: 0, fail: 0 },
            categories: { total: 0, success: 0, fail: 0 },
            customAttDefs: { total: 0, success: 0, fail: 0 },
            statuses: { total: 0, success: 0, fail: 0 }
        };

        console.log('Parsing XLSX spreadsheet.');
        const workbook = new excelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const assets_worksheet = workbook.getWorksheet('assets'); 

        var jobsRes = await deleteAssets(projectId,assets_worksheet,allCategories,allStatuses,allCustomAttdefs)
        var count = {};
        jobsRes.forEach(function(i) { count[i] = (count[i]||0) + 1;});  
        results.assets.total = jobsRes.length 
        results.assets.success = count.true?count.true:0
        results.assets.fail = count.false?count.false:0 
        return results
    } catch (e) {
        console.error(`import excel exception ${e}`)
        return []
    }

}


async function deleteAssets(projectId,assets_worksheet,allCategories,allStatuses,allCustomAttdefs){
    //create/update assets 
    var ids  = [] 
    assets_worksheet.eachRow( (row, rowNumber) => {

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

    const deletRes = await asset_service.deleteAssets(projectId,ids) 
    return deletRes 
}


