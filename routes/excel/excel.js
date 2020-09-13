
const fs = require('fs');
const excelJS = require('exceljs');
const columnDefs = require('./columnDefs');
const asset_service = require('../services/asset');


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
        const fixColumnsDef = columnDefs[s + 'Columns']
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

        //firstly, create/update definitions
        var total = 0
        categories_worksheet.eachRow(async (row, rowNumber) => {
            if (rowNumber === 1) {
                return; // Skip the header row
            }

            try {
                const id = row.values[1]
                const body = {
                    name: row.values[2],
                    description: row.values[3],
                    parentId: row.values[4]
                }
                if (id && id!='') {
                } else {
                    const postRes = await asset_service.createCategory(projectId, body)
                    postRes?results.categories.success++:results.categories.fail++
                }

            }
            catch (err) {
                console.error('Error when parsing spreadsheet row of categories', rowNumber);

                throw new Error(err);
            }
        })
        customAttDefs_worksheet.eachRow(async (row, rowNumber) => {


        })
        statuses_worksheet.eachRow(async (row, rowNumber) => {

        })

        //finally create/update assets
        assets_worksheet.eachRow(async (row, rowNumber) => {

        })
    } catch (e) {
        console.error(`import excel exception ${e}`)
    }

}


