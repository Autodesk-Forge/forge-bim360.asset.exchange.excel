
const fs = require('fs');
const excelJS = require('exceljs');
const columnDefs = require('./columnDefs');

module.exports = { 
    _export:_export
};

//each element of the array will export one sheet in the same Excel file
async function _export(exportName,dataArray){ 

    const workbook = new excelJS.Workbook();
    workbook.creator = 'bim360-asset-export'; 

    dataArray.forEach(data => {

        const dataType = data.dataType
        const fixColumnsDef = columnDefs[dataType]
        
    });


    const worksheet = workbook.addWorksheet(`${exportName}`)
    
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

    //now dump custom attributes.
                
    const buffer = await workbook.xlsx.writeBuffer();
    fs.writeFile(`./Exported_Data/BIM360-${exportName}-${subName}.xlsx`, buffer, "binary",err => {
        if(err) {
        console.log(err);
        } else {
         console.log(`./exportData/BIM360-${exportName}-${subName}.xlsx is saved`);
        }
    }) 
} 

  