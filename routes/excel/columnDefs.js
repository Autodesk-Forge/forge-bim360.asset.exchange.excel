
const assetColumns = [
   { id: 'clientAssetId', propertyName: 'clientAssetId', columnTitle: 'clientAssetId', columnWidth: 8, locked: true },
   { id: 'version', propertyName: 'version', columnTitle: 'version', columnWidth: 2, locked: false },
   { id: 'description', propertyName: 'description', columnTitle: 'description', columnWidth: 16, locked: false },
   { id: 'isActive', propertyName: 'isActive', columnTitle: 'isActive', columnWidth: 4, locked: false },
   { id: 'barcode', propertyName: 'barcode', columnTitle: 'barcode', columnWidth: 4, locked: false },
   { id: 'serialNumber', propertyName: 'serialNumber', columnTitle: 'serialNumber', columnWidth: 4, locked: false },
   { id: 'installationDate', propertyName: 'installationDate', columnTitle: 'installationDate', columnWidth: 4, locked: false },
   { id: 'installedBy', propertyName: 'installedBy', columnTitle: 'installedBy', columnWidth: 4, locked: false },
   { id: 'warrantyStartDate', propertyName: 'warrantyStartDate', columnTitle: 'warrantyStartDate', columnWidth: 4, locked: false },
   { id: 'warrantyEndDate', propertyName: 'warrantyEndDate', columnTitle: 'warrantyEndDate', columnWidth: 4, locked: false },
   { id: 'expectedLifeYears', propertyName: 'expectedLifeYears', columnTitle: 'expectedLifeYears', columnWidth: 4, locked: false },
   { id: 'manufacturer', propertyName: 'manufacturer', columnTitle: 'manufacturer', columnWidth: 4, locked: false },

   //sorted columns with readable string
   { id: 'createdBy', propertyName: 'createdBy', columnTitle: 'createdBy', columnWidth: 4, locked: true },
   { id: 'createdAt', propertyName: 'createdAt', columnTitle: 'createdAt', columnWidth: 4, locked: false },
   { id: 'category', propertyName: 'category', columnTitle: 'category', columnWidth: 4, locked: false },
   { id: 'status', propertyName: 'status', columnTitle: 'status', columnWidth: 2, locked: false },
   { id: 'company', propertyName: 'company', columnTitle: 'company', columnWidth: 4, locked: false },
   //issue,checklist,attachment list. put them together as string because Excel does not support embeded array
   { id: 'issues', propertyName: 'issues', columnTitle: 'issues', columnWidth: 8, locked: false },
   { id: 'checklists', propertyName: 'checklists', columnTitle: 'checklists', columnWidth: 8, locked: false },
   { id: 'attachments', propertyName: 'attachments', columnTitle: 'attachments', columnWidth: 8, locked: false },
   
   //dynamic columns: custom attributes. make them flat view. depending on how many ca definitions
   //......

];

const categoryColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 16, locked: false },
   { id: 'trade', propertyName: 'trade', columnTitle: 'Tratradede', columnWidth: 16, locked: false },
   { id: 'erp_id', propertyName: 'erp_id', columnTitle: 'erp_id', columnWidth: 16, locked: true },
   { id: 'website_url', propertyName: 'website_url', columnTitle: 'website_url', columnWidth: 16, locked: false }
];

const customAttributeColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 16, locked: false },
   { id: 'role', propertyName: 'role', columnTitle: 'role', columnWidth: 16, locked: false },
   { id: 'company_name', propertyName: 'company_name', columnTitle: 'company_name', columnWidth: 16, locked: true },
   { id: 'website_url', propertyName: 'website_url', columnTitle: 'website_url', columnWidth: 16, locked: false },
   { id: 'last_sign_in', propertyName: 'last_sign_in', columnTitle: 'last_sign_in', columnWidth: 16, locked: false },
   { id: 'email', propertyName: 'email', columnTitle: 'email', columnWidth: 16, locked: false },
   { id: 'uid', propertyName: 'uid', columnTitle: 'uid', columnWidth: 16, locked: false },
   { id: 'city', propertyName: 'city', columnTitle: 'city', columnWidth: 16, locked: false },
   { id: 'country', propertyName: 'country', columnTitle: 'country', columnWidth: 16, locked: true },
   { id: 'created_at', propertyName: 'created_at', columnTitle: 'created_at', columnWidth: 16, locked: false },
   { id: 'job_title', propertyName: 'job_title', columnTitle: 'job_title', columnWidth: 16, locked: false },
   { id: 'industry', propertyName: 'industry', columnTitle: 'industry', columnWidth: 16, locked: false }

];


const statusColumns = [
   { id: 'project', propertyName: 'project', columnTitle: 'project', columnWidth: 8, locked: true },
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 16, locked: false },
   { id: 'autodeskId', propertyName: 'autodeskId', columnTitle: 'autodeskId', columnWidth: 16, locked: false },
   { id: 'email', propertyName: 'email', columnTitle: 'email', columnWidth: 16, locked: false },
   { id: 'jobTitle', propertyName: 'jobTitle', columnTitle: 'jobTitle', columnWidth: 16, locked: true },

   { id: 'industry', propertyName: 'industry', columnTitle: 'industry', columnWidth: 16, locked: false },
   { id: 'company', propertyName: 'company', columnTitle: 'company', columnWidth: 16, locked: false },

   { id: 'accessLevels_accountAdmin', propertyName: 'accessLevels_accountAdmin', columnTitle: 'accessLevels_accountAdmin', columnWidth: 16, locked: false },
   { id: 'accessLevels_projectAdmin', propertyName: 'accessLevels_projectAdmin', columnTitle: 'accessLevels_projectAdmin', columnWidth: 16, locked: false },
   { id: 'accessLevels_executive', propertyName: 'accessLevels_executive', columnTitle: 'accessLevels_executive', columnWidth: 16, locked: false },

   { id: 'services_documentManagement', propertyName: 'services_documentManagement', columnTitle: 'services_documentManagement', columnWidth: 16, locked: false },
   { id: 'services_projectAdministration', propertyName: 'services_projectAdministration', columnTitle: 'services_projectAdministration', columnWidth: 16, locked: false },
   { id: 'services_costManagement', propertyName: 'services_costManagement', columnTitle: 'services_costManagement', columnWidth: 16, locked: false },
   { id: 'services_assets', propertyName: 'services_assets', columnTitle: 'services_assets', columnWidth: 16, locked: false },
   { id: 'services_designCollaboration', propertyName: 'services_designCollaboration', columnTitle: 'services_designCollaboration', columnWidth: 16, locked: false },
   { id: 'services_fieldManagement', propertyName: 'services_fieldManagement', columnTitle: 'services_fieldManagement', columnWidth: 16, locked: false },
   { id: 'services_insight', propertyName: 'services_insight', columnTitle: 'services_insight', columnWidth: 16, locked: false }

]; 

module.exports = {
    assetColumns,
    categoryColumns,
    customAttributeColumns,
    statusColumns
};
