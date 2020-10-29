
/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////
const config = require('../../config');
const asset_service = require('../services/asset');
const admin_service = require('../services/admin');
const relationship_service = require('../services/relationship');

const utility = require('../utility');


var Defs = {
  allCustomAttdefs: [],
  allStatusSets: [],
  allStatuses:[],
  allCategories: [],
  allProjectUsers: []

} 

async function exportAssets(accountId,projectId,cursorState=null,onePage=false) {

  //get cursorState
  var allAssets = []
  allAssets = await asset_service.getAssets(projectId, allAssets,cursorState,onePage)

  var allStatusSets = Defs.allStatusSets
  if(allStatusSets==null || allStatusSets.length==0)
     allStatusSets = await asset_service.getAllStatusSets(projectId,allStatusSets)


  var allCategories = Defs.allCategories
  if(allCategories==null || allCategories.length==0)
    allCategories = await asset_service.getAllCategories(projectId, allCategories)

  var allCustomAttdefs = Defs.allCustomAttdefs
  if(allCustomAttdefs==null || allCustomAttdefs.length==0)
    allCustomAttdefs = await asset_service.getAllCustomAttdefs(projectId, allCustomAttdefs)
  
  var allProjectUsers = Defs.allProjectUsers
  if(allProjectUsers==null || allProjectUsers.length==0)
    allProjectUsers = await admin_service.getProjectUsers(projectId, 20, 0, allProjectUsers)
  
  var allProjectCompanies = []
  allProjectCompanies = await admin_service.getProjectCompanies(accountId, projectId, 20, 0, allProjectCompanies)


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
    console.log(`sorting one assert ${assetId}`);

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
    await utility.delay(utility.DELAY_MILISECOND*index)
    var allWithEntities = []
    allWithEntities = await relationship_service.searchRelationships(projectId, assetId, 0, allWithEntities)
 
    let subPromiseArr = allWithEntities.map(async (r, index) => {
      await utility.delay(utility.DELAY_MILISECOND*index)

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
      console.log(`sorting one withEntities of assert ${assetId} done`);

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
    console.log(`Promise.all sorting out assets done`); 
    resultsArray = utility.flatDeep(resultsArray, Infinity)
    return resultsArray;
  }).catch(function (err) {
    console.error(`exception when Promise.all sorting out assets: ${err}`);
    return []
  })
}



async function exportCategory(projectId) {
  
  var allCategories = []
  allCategories = await asset_service.getAllCategories(projectId, allCategories) 
  var allProjectUsers = []
  allProjectUsers = await admin_service.getProjectUsers(projectId, 20, 0, allProjectUsers)
   
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
  allCustomAttdefs = await asset_service.getAllCustomAttdefs(projectId, allCustomAttdefs )
  var allProjectUsers = []
  allProjectUsers = await admin_service.getProjectUsers(projectId, 20, 0, allProjectUsers)
   

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
  allStatusSets = await asset_service.getAllStatusSets(projectId, allStatusSets )
  var allProjectUsers = []
  allProjectUsers = await admin_service.getProjectUsers(projectId, 20, 0, allProjectUsers) 
  
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
