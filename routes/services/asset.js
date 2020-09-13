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
const { get,post,patch } = require('./fetch_common'); 
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


async function getAllStatusSets(projectId, nextUrl, allStatusSets) {
  try {
    //limit and offset have no effect on GET:Catrgories, no either cursorState and nextUrl -- bug?

    //const endpoint = nextUrl?nextUrl:str.format.format()`${config.bim360Asset.get_categories}`,projectId)
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/status-step-sets`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting assets ${projectId} status`)
      allStatusSets = allStatusSets.concat(response.results);
      if(response.pagination.nextUrl!=null){
         //placeholder for nextUrl...
         await utility.delay(utility.DELAY_MILISECOND)   
         return getAllStatusSets(projectId, response.pagination.nextUrl, allStatusSets);
      }
      else{ 
        return allStatusSets 
      }
    } else {
       return []
    }
  } catch (e) {
    console.error(`allStatusSets ${projectId} failed: ${e}`)
    return []
  }
}


async function createCategory(projectId,body) {
  try {
 
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/categories`
    const headers = config.httpHeaders(config.token_3legged) 
    await utility.delay(utility.DELAY_MILISECOND)  
    const response = await post(endpoint, headers,JSON.stringify(body)); 
    return true 
  } catch (e) {
    console.error(`createCategory failed: ${e}`)
    return false
  }
}

async function createCustomAttDef(projectId,body) {
  try {
 
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/custom-attributes`
    const headers = config.httpHeaders(config.token_3legged) 
    await utility.delay(utility.DELAY_MILISECOND)  
    const response = await post(endpoint, headers,JSON.stringify(body)); 
    return true 
  } catch (e) {
    console.error(`createCustomAttDef failed: ${e}`)
    return false
  }
}

async function createStatus(projectId,body) {
  try {
 
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/asset-statuses`
    const headers = config.httpHeaders(config.token_3legged) 
    await utility.delay(utility.DELAY_MILISECOND)  
    const response = await post(endpoint, headers,JSON.stringify(body)); 
    return true 
  } catch (e) {
    console.error(`createStatus failed: ${e}`)
    return false
  }
}
async function createAsset(projectId,body) {
  try {
 
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/assets`
    const headers = config.httpHeaders(config.token_3legged) 
    await utility.delay(utility.DELAY_MILISECOND)  
    const response = await post(endpoint, headers,JSON.stringify(body)); 
    return true 
  } catch (e) {
    console.error(`createAssets failed: ${e}`)
    return false
  }
}

////PATCH
async function patchCategory(projectId,categoryId,body) {
  try {
 
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/categories/${categoryId}`
    const headers = config.httpHeaders(config.token_3legged) 
    await utility.delay(utility.DELAY_MILISECOND)  
    const response = await patch(endpoint, headers,JSON.stringify(body)); 
    return true 
  } catch (e) {
    console.error(`patchCategory failed: ${e}`)
    return false
  }
}

async function patchCustomAttDef(projectId,customAttDefId,body) {
  try {
 
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/custom-attributes/${customAttDefId}`
    const headers = config.httpHeaders(config.token_3legged) 
    await utility.delay(utility.DELAY_MILISECOND)  
    const response = await post(endpoint, headers,JSON.stringify(body)); 
    return true 
  } catch (e) {
    console.error(`patchCustomAttDef failed: ${e}`)
    return false
  }
}

async function patchStatus(projectId,statusId,body) {
  try {
 
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/asset-statuses/${statusId}`
    const headers = config.httpHeaders(config.token_3legged) 
    await utility.delay(utility.DELAY_MILISECOND)  
    const response = await post(endpoint, headers,JSON.stringify(body)); 
    return true 
  } catch (e) {
    console.error(`patchStatus failed: ${e}`)
    return false
  }
}
async function patchAsset(projectId,assetId,body) {
  try {
 
    const endpoint = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/assets/${assetId}`
    const headers = config.httpHeaders(config.token_3legged) 
    await utility.delay(utility.DELAY_MILISECOND)  
    const response = await post(endpoint, headers,JSON.stringify(body)); 
    return true 
  } catch (e) {
    console.error(`patchAsset failed: ${e}`)
    return false
  }
}

module.exports = {
  //getAssets,
  getAllAssets,
  getAllCategories,
  getAllCustomAttdefs,
  getAllStatusSets,

  createAsset,
  patchAsset,

  createCategory,
  patchCategory,

  createCustomAttDef,
  patchCustomAttDef,

  createStatus,
  patchStatus

}