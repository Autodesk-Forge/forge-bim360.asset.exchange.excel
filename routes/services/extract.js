
const config = require('../../config');
const asset_service = require('../services/asset');
const admin_service = require('../services/admin');
const relationship_service = require('../services/relationship');

const utility = require('../utility');


var Defs = {
  allCustomAttdefs: null,
  allStatusSets: null,
  allStatuses:null,
  allCategories: null,
  allProjectUsers: null

}

async function exportAssets(accountId, projectId) {
  var allAssets = []
  allAssets = await asset_service.getAllAssets(projectId, null, allAssets,0)
  var allStatusSets = []
  allStatusSets = await asset_service.getAllStatusSets(projectId, null, allStatusSets)
  var allCategories = []
  allCategories = await asset_service.getAllCategories(projectId, null, allCategories)
  var allCustomAttdefs = []
  allCustomAttdefs = await asset_service.getAllCustomAttdefs(projectId, null, allCustomAttdefs)
  var allProjectUsers = []
  allProjectUsers = await admin_service.getProjectUsers(projectId, config.limit, 0, allProjectUsers)
  var allProjectCompanies = []
  allProjectCompanies = await admin_service.getProjectCompanies(accountId, projectId, config.limit, 0, allProjectCompanies)


  Defs.allCustomAttdefs = allCustomAttdefs
  Defs.allCategories = allCategories
  Defs.allStatusSets = allStatusSets
  Defs.allProjectUsers = allProjectUsers
  Defs.allProjectCompanies = allProjectCompanies


  //sorting out with customized data 
  //prepare both raw id and human readble string for some properties
  Defs.allCategories.forEach(async ct => {  
    var find = Defs.allProjectUsers.find(i => i.autodeskId == ct.createdBy)
    ct.createdById = ct.createdBy  
    ct.createdBy = find ? find.name : ct.createdBy   

    find = Defs.allCategories.find(i=>i.id == ct.parentId)
    ct.parent = find?find.name:'<invalid>'

    ct.subcategories = []
    ct.subcategoryIds.forEach(async subc => { 
      find = Defs.allCategories.find(i=>i.id == subc.id)
      ct.subcategories.push(find?find.name:'<invalid>')
    })
  });

  Defs.allCustomAttdefs.forEach(async cadef => {  
    var find = Defs.allProjectUsers.find(i => i.autodeskId == cadef.createdBy)
    cadef.createdById = cadef.createdBy
    cadef.createdBy = find ? find.name : cadef.createdBy
    switch(cadef.dataType){
      case 'text':
        //do nothing 
        cadef.enumValues = '<none>' 
        break;
      case 'numeric':
         //do nothing
         cadef.enumValues = '<none>' 
        break;
      case 'date':
        //do nothing 
        cadef.enumValues = '<none>'
        break;
      case 'select':
        //do nothing 
        break;
      case 'multi_select':
        //do nothing  
        break;
    }
  });

  Defs.allStatuses = []
  Defs.allStatusSets.forEach(async set => { 
    const setName = set.name
    const statuses = set.values 
    statuses.forEach(async st=>{
      var find = Defs.allProjectUsers.find(i => i.autodeskId == st.createdBy)
      st.createdById =  st.createdBy
      st.createdBy = find ? find.name : st.createdBy
      st.setId = set.id
      st.set = setName
      Defs.allStatuses.push(st)
    }) 
  }); 

  let promiseArr = allAssets.map(async (a, index) => {

    const assetId = a.id 
    var find = Defs.allProjectUsers.find(i => i.autodeskId == a.createdBy)
    a.createdById = a.createdBy
    a.createdBy = find ? find.name : '<invalid>'

    find = Defs.allProjectUsers.find(i => i.autodeskId == a.updatedBy)
    a.updatedById = a.updatedBy
    a.updatedBy = find ? find.name : '<invalid>'

    find = Defs.allCategories.find(i => i.id == a.categoryId)
    a.categoryId = a.categoryId
    a.category = find ? find.name : '<invalid>' 

    find = Defs.allStatuses.find(i => i.id == a.statusId)
    a.statusId = a.statusId
    a.status = find ? find.label : '<invalid>'  

    //custom attributes [name] must be unique, so do not worry duplicated name
    for (const ca in a.customAttributes) {
      find = Defs.allCustomAttdefs.find(i => i.name == ca)
      a[ca] = find?a.customAttributes[ca]:''
    } 

    //how find the relationships of the asset 
    await utility.delay(utility.DELAY_MILISECOND)
    var allWithEntities = []
    allWithEntities = await relationship_service.searchRelationships(projectId, assetId, 0, allWithEntities)
 
    let subPromiseArr = allWithEntities.map(async (r, index) => {
      var eachEntity=null
      const with_entity_index = r.entities.findIndex(i => i.domain != 'autodesk-bim360-asset')
      const with_entity = r.entities[with_entity_index]
      if (with_entity.domain == 'autodesk-bim360-issue' && with_entity.type == 'issue') {
        const issueData = await relationship_service.getIssue(accountId, projectId, with_entity.id)
        if (issueData)
          eachEntity = issueData
      }
      if (with_entity.domain == 'autodesk-bim360-checklist' && with_entity.type == 'checklist') {
        const checklistData = await relationship_service.getChecklist(accountId, projectId, with_entity.id)
        if (checklistData)
          eachEntity = checklistData 
      }
      if (with_entity.domain == 'autodesk-bim360-documentmanagement' && with_entity.type == 'documentlineage') {
        const attachmentData = await relationship_service.getAttachment(accountId, projectId, with_entity.id)
        if (attachmentData)
          eachEntity = attachmentData 
      } 
      return eachEntity
    })

    return Promise.all(subPromiseArr).then((resultsArray) => {
      resultsArray = utility.flatDeep(resultsArray, Infinity)
    
      a.issues = resultsArray.filter(i=>i.type == 'issue')
      a.checklists = resultsArray.filter(i=>i.type == 'checklist')
      a.attachments = resultsArray.filter(i=>i.type == 'attachment') 
      return a
    }).catch(function (err) {
      console.error(`exception when Promise.all sorting out allWithEntities: ${err}`);
      //although exception, we can still return asset with the data that have been avaialble 
      return a
    })
  });

  return Promise.all(promiseArr).then((resultsArray) => {
    resultsArray = utility.flatDeep(resultsArray, Infinity)
    return resultsArray;
  }).catch(function (err) {
    console.log(`exception when Promise.all sorting out assets: ${err}`);
    return []
  })
}



async function exportCategory(projectId) {
  

  var allCategories = []
  allCategories = await asset_service.getAllCategories(projectId, null, allCategories) 
  var allProjectUsers = []
  allProjectUsers = await admin_service.getProjectUsers(projectId, config.limit, 0, allProjectUsers)
   
  //sorting out with customized data  
  allCategories.forEach(async ct => {  
    var find = allProjectUsers.find(i => i.autodeskId == ct.createdBy)
    ct.createdById = ct.createdBy  
    ct.createdBy = find ? find.name : ct.createdBy   

    find = allCategories.find(i=>i.id == ct.parentId)
    ct.parent = find?find.name:'-'

    ct.subcategories = []
    ct.subcategoryIds.forEach(async subc => { 
      find = allCategories.find(i=>i.id == subc)
      ct.subcategories.push(find?find.name:'<invalid>')
    })
  });

  return allCategories
}



async function exportCustomAttDef(projectId) {
  
  var allCustomAttdefs = []
  allCustomAttdefs = await asset_service.getAllCustomAttdefs(projectId, null, allCustomAttdefs)
  var allProjectUsers = []
  allProjectUsers = await admin_service.getProjectUsers(projectId, config.limit, 0, allProjectUsers)
   

  allCustomAttdefs.forEach(async cadef => {  
    var find = allProjectUsers.find(i => i.autodeskId == cadef.createdBy)
    cadef.createdById = cadef.createdBy 
    cadef.createdBy = find ? find.name : cadef.createdBy
    switch(cadef.dataType){
      case 'text':
        //do nothing 
        cadef.enumValues = '<none>' 
        break;
      case 'numeric':
         //do nothing
         cadef.enumValues = '<none>' 
        break;
      case 'date':
        //do nothing 
        cadef.enumValues = '<none>'
        break;
      case 'select':
        //do nothing 
        break;
      case 'multi_select':
        //do nothing  
        break;
    }
  });

  return allCustomAttdefs
}


async function exportStatus(projectId) {
  
  var allStatusSets = []
  allStatusSets = await asset_service.getAllStatusSets(projectId, null, allStatusSets)
  var allProjectUsers = []
  allProjectUsers = await admin_service.getProjectUsers(projectId, config.limit, 0, allProjectUsers) 
  
  var allStatuses = []
  allStatusSets.forEach(async set => { 
    const setName = set.name
    const statuses = set.values 
    statuses.forEach(async st=>{
      var find = allProjectUsers.find(i => i.autodeskId == st.createdBy)
      st.createdById =  st.createdBy
      st.createdBy = find ? find.name : st.createdBy
      st.setId = set.id
      st.set = setName
      allStatuses.push(st)
    }) 
  }); 
  return allStatuses
}


module.exports = {
  exportAssets,
  exportCategory,
  exportCustomAttDef,
  exportStatus,
  Defs
 } 
