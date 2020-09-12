
const config = require('../../config');
const asset_service = require('../services/asset');
const admin_service = require('../services/admin');
const relationship_service = require('../services/relationship');

const utility = require('../utility');


var Defs = {
  allCustomAttdefs: null,
  allStatus: null,
  allCategories: null,
  allProjectUsers: null
}

async function exportAssets(accountId, projectId) {
  var allAssets = []
  allAssets = await asset_service.getAllAssets(projectId, null, allAssets)
  var allStatus = []
  allStatus = await asset_service.getAllStatuses(projectId, null, allStatus)
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
  Defs.allStatus = allStatus
  Defs.allProjectUsers = allProjectUsers
  Defs.allProjectCompanies = allProjectCompanies

  //sorting out with 
  let promiseArr = allAssets.map(async (a, index) => {

    const assetId = a.id //GUID for relationship 
    var find = Defs.allProjectUsers.find(i => i.autodeskId == a.createdBy)
    a.createdBy = find ? find.name : '<invalid>'
    find = Defs.allProjectUsers.find(i => i.autodeskId == a.updatedBy)
    a.updatedBy = find ? find.name : '<invalid>'
    find = Defs.allCategories.find(i => i.id == a.categoryId)
    a.category = find ? find.name : '<invalid>'
    find = Defs.allCategories.find(i => i.id == a.categoryId)
    a.category = find ? find.name : '<invalid>'
    find = Defs.allStatus.find(i => i.id == a.statusId)
    a.status = find ? find.label : '<invalid>'
    find = Defs.allStatus.find(i => i.id == a.companyId)
    a.company = find ? find.name : '<invalid>'

    //const calist = await sortCustomAtt(a.customAttributes)
    //better make it flat, fiendly for table view
    // var calist = {}
    // for (const ca in a.customAttributes) {
    //   find = Defs.allCustomAttdefs.find(i => i.name == ca)
    //   calist[ca] = {
    //     displayName: find ? find.displayName : '<none>',
    //     value: a.customAttributes[ca]
    //   }
    // }
    // a.calist = calist

    //custom attributes name must be unique, so do not worry duplicated name
    for (const ca in a.customAttributes) {
      find = Defs.allCustomAttdefs.find(i => i.name == ca)
      a[find.displayName] = find?a.customAttributes[ca]:''
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
        eachEntity = {type:'attachment',name:'name',href:'href'}
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
    console.log(`exception when Promise.all sorting out companies: ${err}`);
    return []
  })
}


module.exports = {
  exportAssets,
  Defs
 } 
