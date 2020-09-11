
const fs = require('fs');
const excelJS = require('exceljs');

module.exports = { 
    _export:_export
};

async function _export(exportName,subName,columnDef,data){ 

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${exportName}-${subName}`)
    workbook.creator = 'bim360-asset-export'; 
    
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
                
    const buffer = await workbook.xlsx.writeBuffer();
    fs.writeFile(`./Exported_Data/BIM360-${exportName}-${subName}.xlsx`, buffer, "binary",err => {
        if(err) {
        console.log(err);
        } else {
         console.log(`./exportData/BIM360-${exportName}-${subName}.xlsx is saved`);
        }
    }) 
} 

  