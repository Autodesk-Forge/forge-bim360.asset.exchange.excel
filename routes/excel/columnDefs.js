
const issueListFormat = (list) => {
   var res = ''
   for(var i in list){
     res+=`${list[i].title} | ${list[i].status}  \n`
    }
   return res
};
const checklistListFormat = (list) => {
  var res = ''
  for(var i in list){
    res+=`${list[i].title} | ${list[i].status}  \n` 
  }
  return res
};
const attachmentListFormat = (list) => {
  var res = ''
  for(var i in list){
    //res+=`${list[i].title} | ${list[i].href} \n`
    res+=`${list[i].title} in folder [${list[i].folder}] \n`
   }
  return res
};
 

const assetsColumns = [
  { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },

   { id: 'clientAssetId', propertyName: 'clientAssetId', columnTitle: 'clientAssetId', columnWidth: 8, locked: true },
   { id: 'categoryId', propertyName: 'categoryId', columnTitle: 'categoryId', columnWidth: 6, locked: false },
   { id: 'category', propertyName: 'category', columnTitle: 'category', columnWidth: 6, locked: false },
   { id: 'statusId', propertyName: 'statusId', columnTitle: 'statusId', columnWidth: 6, locked: false },
   { id: 'status', propertyName: 'status', columnTitle: 'status', columnWidth: 6, locked: false },
   { id: 'description', propertyName: 'description', columnTitle: 'description', columnWidth: 16, locked: false },
   { id: 'barcode', propertyName: 'barcode', columnTitle: 'barcode', columnWidth: 8, locked: false },
   { id: 'serialNumber', propertyName: 'serialNumber', columnTitle: 'serialNumber', columnWidth: 8, locked: false },
   { id: 'specSection', propertyName: 'specSection', columnTitle: 'specSection', columnWidth: 6, locked: false },
   { id: 'purchaseOrder', propertyName: 'purchaseOrder', columnTitle: 'purchaseOrder', columnWidth: 6, locked: false },
   { id: 'purchaseDate', propertyName: 'purchaseDate', columnTitle: 'purchaseDate', columnWidth: 6, locked: false },
   { id: 'installedBy', propertyName: 'installedBy', columnTitle: 'installedBy', columnWidth: 8, locked: false },
   { id: 'installationDate', propertyName: 'installationDate', columnTitle: 'installationDate', columnWidth: 8, locked: false },
   { id: 'warrantyStartDate', propertyName: 'warrantyStartDate', columnTitle: 'warrantyStartDate', columnWidth: 8, locked: false },
   { id: 'warrantyEndDate', propertyName: 'warrantyEndDate', columnTitle: 'warrantyEndDate', columnWidth: 8, locked: false },
   { id: 'expectedLifeYears', propertyName: 'expectedLifeYears', columnTitle: 'expectedLifeYears', columnWidth: 8, locked: false },
   { id: 'manufacturer', propertyName: 'manufacturer', columnTitle: 'manufacturer', columnWidth: 8, locked: false },
   { id: 'model', propertyName: 'model', columnTitle: 'model', columnWidth: 6, locked: false },
   { id: 'locationId', propertyName: 'locationId', columnTitle: 'locationId', columnWidth: 8, locked: false },

   
   { id: 'isActive', propertyName: 'isActive', columnTitle: 'isActive', columnWidth: 6, locked: false },
   { id: 'version', propertyName: 'version', columnTitle: 'version', columnWidth: 4, locked: false },
   { id: 'createdAt', propertyName: 'createdAt', columnTitle: 'createdAt', columnWidth: 6, locked: false },
   //sorted columns with readable string
   { id: 'createdById', propertyName: 'createdById', columnTitle: 'createdById', columnWidth: 6, locked: true },
   { id: 'createdBy', propertyName: 'createdBy', columnTitle: 'createdBy', columnWidth: 6, locked: true },
   //issue,checklist,attachment list. put them together as string because Excel does not support embeded array
   { id: 'issues', propertyName: 'issues', columnTitle: 'issues', columnWidth: 8, locked: false,format: issueListFormat },
   { id: 'checklists', propertyName: 'checklists', columnTitle: 'checklists', columnWidth: 8, locked: false,format: checklistListFormat },
   { id: 'attachments', propertyName: 'attachments', columnTitle: 'attachments', columnWidth: 8, locked: false,format: attachmentListFormat },

   //dynamic columns: custom attributes. make them flat view. depending on how many ca definitions
   //......

];


const categoriesColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 8, locked: false },
   { id: 'description', propertyName: 'description', columnTitle: 'description', columnWidth: 16, locked: false },
   { id: 'parentId', propertyName: 'parentId', columnTitle: 'parentId', columnWidth: 8, locked: false }, 
   { id: 'subcategoryIds', propertyName: 'subcategoryIds', columnTitle: 'subcategoryIds', columnWidth: 16, locked: false },
   { id: 'isRoot', propertyName: 'isRoot', columnTitle: 'isRoot', columnWidth: 6, locked: false },
   { id: 'isLeaf', propertyName: 'isLeaf', columnTitle: 'isLeaf', columnWidth: 6, locked: false },
   { id: 'isActive', propertyName: 'isActive', columnTitle: 'isActive', columnWidth: 6, locked: false },
   { id: 'createdAt', propertyName: 'createdAt', columnTitle: 'createdAt', columnWidth: 6, locked: false },

   //sorted columns with readable string
   { id: 'createdBy', propertyName: 'createdBy', columnTitle: 'createdBy', columnWidth: 6, locked: true },
    
];

const customAttDefsColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 8, locked: false },
   { id: 'displayName', propertyName: 'displayName', columnTitle: 'displayName', columnWidth: 6, locked: false },
   { id: 'description', propertyName: 'description', columnTitle: 'description', columnWidth: 6, locked: false },
   { id: 'dataType', propertyName: 'dataType', columnTitle: 'dataType', columnWidth: 6, locked: false },
   { id: 'defaultValue', propertyName: 'defaultValue', columnTitle: 'defaultValue', columnWidth: 6, locked: false },
   //includes the array option of list type
   { id: 'enumValues', propertyName: 'enumValues', columnTitle: 'enumValues', columnWidth: 6, locked: false },

   { id: 'isActive', propertyName: 'isActive', columnTitle: 'isActive', columnWidth: 6, locked: false },
   { id: 'createdAt', propertyName: 'createdAt', columnTitle: 'createdAt', columnWidth: 6, locked: false },

   //sorted columns with readable string
   { id: 'createdBy', propertyName: 'createdBy', columnTitle: 'createdBy', columnWidth: 6, locked: true },
];


const statusesColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   
   //customized columns
   { id: 'set', propertyName: 'set', columnTitle: 'set', columnWidth: 6, locked: true },

   { id: 'label', propertyName: 'label', columnTitle: 'label', columnWidth: 8, locked: false },
   { id: 'description', propertyName: 'description', columnTitle: 'description', columnWidth: 8, locked: false },
   { id: 'color', propertyName: 'color', columnTitle: 'color', columnWidth: 8, locked: false },
   { id: 'version', propertyName: 'version', columnTitle: 'version', columnWidth: 8, locked: false },

   { id: 'bucket', propertyName: 'bucket', columnTitle: 'bucket', columnWidth: 8, locked: false },
   { id: 'isActive', propertyName: 'isActive', columnTitle: 'isActive', columnWidth: 6, locked: false },
   { id: 'createdAt', propertyName: 'createdAt', columnTitle: 'createdAt', columnWidth: 6, locked: false },

   //sorted columns with readable string
   { id: 'createdBy', propertyName: 'createdBy', columnTitle: 'createdBy', columnWidth: 6, locked: true },

]; 

module.exports = {
    assetsColumns,
    categoriesColumns,
    customAttDefsColumns,
    statusesColumns
};
