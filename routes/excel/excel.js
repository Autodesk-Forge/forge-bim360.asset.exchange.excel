
const fs = require('fs');
const excelJS = require('exceljs');
const columnDefs = require('./columnDefs');
const asset_service = require('../services/asset');
const utility = require('../utility');



module.exports = {
    _export: _export,
    _import: _import
};

//each element of the array will export one sheet in the same Excel file
async function _export(exportName, dataArray) {

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
            let row = {};
            for (const column of columnDef) {
                if (column.format) {
                    row[column.id] = column.format(d[column.propertyName]);
                }
                else {
                    row[column.id] = d[column.propertyName];
                }
            }
            worksheet.addRow(row);
        }

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
    fs.writeFile(`./Excel_Exports/${exportName}.xlsx`, buffer, "binary", err => {
        if (err) {
            console.log(err);
        } else {
            console.log(`./Excel_Exports/${exportName}.xlsx is saved`);
        }
    })
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

        //return results

        // //firstly, create/update definitions
        // total = 0
        // categories_worksheet.eachRow(async (row, rowNumber) => {
        //     if (rowNumber === 1) {
        //         return; // Skip the header row
        //     }

        //     try {
        //         const id = row.values[1]
        //         total++
        //         if (id && id != '') {
        //             const body = {
        //                 name: row.values[2],
        //                 description: row.values[3]
        //             }
        //             const postRes = await asset_service.patchCategory(projectId, id, body)
        //             postRes ? results.categories.success++ : results.categories.fail++

        //         } else {
        //             const body = {
        //                 name: row.values[2],
        //                 description: row.values[3],
        //                 parentId: row.values[4].toString()
        //             }
        //             const postRes = await asset_service.createCategory(projectId, body)
        //             postRes ? results.categories.success++ : results.categories.fail++
        //         }

        //     }
        //     catch (err) {
        //         console.error('Error when parsing spreadsheet row of categories', rowNumber);
        //         results.categories.fail++
        //     }
        // })
        // results.categories.total = total

        // total = 0
        // customAttDefs_worksheet.eachRow(async (row, rowNumber) => {
        //     if (rowNumber === 1) {
        //         return; // Skip the header row
        //     }

        //     try {
        //         const id = row.values[1]
        //         total++
        //         if (id && id != '') {
        //             const body = {
        //                 displayName: row.values[3],
        //                 description: row.values[4],
        //                 defaultValue: row.values[6],
        //                 enumValues: JSON.parse(row.values[7])
        //             }
        //             const postRes = await asset_service.patchCustomAttDef(projectId, id, body)
        //             postRes ? results.customAttDefs.success++ : results.customAttDefs.fail++

        //         } else {
        //             const body = {
        //                 displayName: row.values[3],
        //                 description: row.values[4],
        //                 dataType: row.values[5],
        //                 defaultValue: row.values[6],
        //                 enumValues: JSON.parse(row.values[7])
        //             }
        //             const postRes = await asset_service.createCustomAttDef(projectId, body)
        //             postRes ? results.customAttDefs.success++ : results.customAttDefs.fail++
        //         }

        //     }
        //     catch (err) {
        //         console.error('Error when parsing spreadsheet row of customAttDefs', rowNumber);
        //         results.customAttDefs.fail++
        //     }

        // })
        // results.customAttDefs.total = total

        // total = 0
        // statuses_worksheet.eachRow(async (row, rowNumber) => {
        //     if (rowNumber === 1) {
        //         return; // Skip the header row
        //     }

        //     try {
        //         const id = row.values[1]
        //         total++
        //         if (id && id != '') {
        //             const body = {
        //                 label: row.values[3],
        //                 description: row.values[4],
        //                 color: row.values[5]
        //             }
        //             const postRes = await asset_service.patchStatus(projectId, id, body)
        //             postRes ? results.statuses.success++ : results.statuses.fail++

        //         } else {
        //             const findSet = allStatusSets.find(i => i.name == row.values[2])

        //             if (findSet) {
        //                 const body = {
        //                     statusStepSetId: findSet.id,
        //                     label: row.values[3],
        //                     description: row.values[4],
        //                     color: row.values[5]
        //                 }
        //                 const postRes = await asset_service.createStatus(projectId, body)
        //                 postRes ? results.statuses.success++ : results.statuses.fail++
        //             } else {
        //                 results.statuses.fail++
        //             }
        //         }
        //     }
        //     catch (err) {
        //         console.error('Error when parsing spreadsheet row of statuses', rowNumber);
        //         results.statuses.fail++
        //     }
        // })
        // results.statuses.total = total



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

             const cat = allCategories.find(i => i.name == row.values[3])
             const st = allStatuses.find(i => i.label == row.values[4]) 

             const body = {
                 clientAssetId: row.values[2],
                 categoryId: cat ? cat.id : allCategories[0].id,
                 statusId: st ? st.id : allStatusSets[0].id,
                 description: row.values[5],
                 barcode: row.values[6],
                 serialNumber: row.values[7],
                 specSection: row.values[8],
                 purchaseOrder: row.values[9],
                 purchaseDate: row.values[10],
                 installedBy: row.values[11],
                 installationDate: row.values[12],
                 warrantyStartDate: row.values[13],
                 warrantyEndDate: row.values[14],
                 expectedLifeYears: row.values[15],
                 manufacturer: row.values[16],
                 model: row.values[17]
             }
             //skip some uneditable columns
             var i = 0
             body.customAttributes = {} 

             allCustomAttdefs.forEach(async c => {
                 if(row.values[26 + i] !=undefined){
                     if(c.dataType == 'multi_select')
                        body.customAttributes[c.name] = JSON.parse(row.values[26 + i])
                    else if(c.dataType == 'numeric')
                        body.customAttributes[c.name] = Number(row.values[26 + i]).toString()

                     else
                        body.customAttributes[c.name] = row.values[26 + i]
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


