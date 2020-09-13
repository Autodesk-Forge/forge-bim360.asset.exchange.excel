
const fs = require('fs');
const excelJS = require('exceljs');
const columnDefs = require('./columnDefs');

module.exports = {
    _export: _export
};

//each element of the array will export one sheet in the same Excel file
async function _export(exportName, dataArray) {

    const workbook = new excelJS.Workbook();
    workbook.creator = 'bim360-asset-export';

    const sheets = ['assets', 'categories', 'customAttributes', 'statuses']

    sheets.forEach(s => {

        const worksheet = workbook.addWorksheet(`${s}`)

        const data = dataArray[s]
        const fixColumnsDef = columnDefs[s + 'Columns']
        var columnDef = fixColumnsDef
        if (s == 'assets') {

            //append custom attributes columns 
            //
            for (var i in dataArray['customAttributes']) {
                const oneDef = dataArray['customAttributes'][i]
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
    })

//now dump custom attributes.

const buffer = await workbook.xlsx.writeBuffer();
fs.writeFile(`./Exported_Data/${exportName}.xlsx`, buffer, "binary", err => {
    if (err) {
        console.log(err);
    } else {
        console.log(`./exportData/${exportName}.xlsx is saved`);
    }
}) 
}

