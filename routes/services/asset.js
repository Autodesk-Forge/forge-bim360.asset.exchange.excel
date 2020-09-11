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

'use strict';    
 
const config = require('../../config');
const { get } = require('./fetch_common'); 
const utility = require('../utility');
const { stream } = require('exceljs');

 


async function getAllAssets(projectId, nextUrl, allAssets) {
  try {
    //limit and offset have no effect on GET:Catrgories, no either cursorState and nextUrl -- bug?

    //const endpoint = nextUrl?nextUrl:str.format.format()`${config.bim360Asset.get_categories}`,projectId)
    const endpoint = nextUrl?`${nextUrl}&includeCustomAttributes=true`:`https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/assets`+
                                      `?includeCustomAttributes=true`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting assets of project ${projectId}`)
      allAssets = allAssets.concat(response.results);
      if(response.pagination.nextUrl!=null){
         //placeholder for nextUrl...
         await utility.delay(utility.DELAY_MILISECOND)   
         return getAllAssets(projectId, response.pagination.nextUrl, allCategories);
      }
      else{
        return allAssets 
      }
    } else {
       return []
    }
  } catch (e) {
    console.error(`allAssets of  ${projectId} failed: ${e}`)
    return []
  }
}


async function getAllCategories(projectId, nextUrl, allCategories) {
  try {
    //limit and offset have no effect on GET:Catrgories, no either cursorState and nextUrl -- bug?

    //const endpoint = nextUrl?nextUrl:str.format.format()`${config.bim360Asset.get_categories}`,projectId)
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/categories`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting assets ${projectId} categories`)
      allCategories = allCategories.concat(response.results);
      if(response.pagination.nextUrl!=null){
         //placeholder for nextUrl...
         await utility.delay(utility.DELAY_MILISECOND)   
         return getAllCategories(projectId, response.pagination.nextUrl, allCategories);
      }
      else{
        return allCategories 
      }
    } else {
       return []
    }
  } catch (e) {
    console.error(`getAllCategories ${projectId} failed: ${e}`)
    return []
  }
}



async function getAllCustomAttdefs(projectId, nextUrl, allCustomAttdefs) {
  try {
    //limit and offset have no effect on GET:Catrgories, no either cursorState and nextUrl -- bug?

    //const endpoint = nextUrl?nextUrl:str.format.format()`${config.bim360Asset.get_categories}`,projectId)
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/custom-attributes`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting assets ${projectId} custom attributes`)
      allCustomAttdefs = allCustomAttdefs.concat(response.results);
      if(response.pagination.nextUrl!=null){
         //placeholder for nextUrl...
         await utility.delay(utility.DELAY_MILISECOND)   
         return getAllCustomAttdefs(projectId, response.pagination.nextUrl, allCustomAttdefs);
      }
      else{
        return allCustomAttdefs 
      }
    } else {
       return []
    }
  } catch (e) {
    console.error(`getAllCustomAttdefs ${projectId} failed: ${e}`)
    return []
  }
}


async function getAllStatuses(projectId, nextUrl, allStatuses) {
  try {
    //limit and offset have no effect on GET:Catrgories, no either cursorState and nextUrl -- bug?

    //const endpoint = nextUrl?nextUrl:str.format.format()`${config.bim360Asset.get_categories}`,projectId)
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/asset-statuses`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting assets ${projectId} status`)
      allStatuses = allStatuses.concat(response.results);
      if(response.pagination.nextUrl!=null){
         //placeholder for nextUrl...
         await utility.delay(utility.DELAY_MILISECOND)   
         return getAllStatuses(projectId, response.pagination.nextUrl, allStatuses);
      }
      else{
        return allStatuses 
      }
    } else {
       return []
    }
  } catch (e) {
    console.error(`getAllStatuses ${projectId} failed: ${e}`)
    return []
  }
}

module.exports = {
  //getAssets,
  getAllAssets,
  getAllCategories,
  getAllCustomAttdefs,
  getAllStatuses
}