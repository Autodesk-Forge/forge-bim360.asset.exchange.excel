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
const { get, post, patch, mydelete } = require('./fetch_common');
const utility = require('../utility'); 

async function getAssets(projectId, allAssets,cursorState=null,onePage=false) {
  try {
    const endpoint = cursorState ?
      config.endpoints.bim360Asset.get_assets.format(projectId) + `?includeCustomAttributes=true&cursorState=${cursorState}` : 
      config.endpoints.bim360Asset.get_assets.format(projectId) + `?includeCustomAttributes=true`
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)

    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting assets of project ${projectId}`)
      allAssets = allAssets.concat(response.results);
      if (!onePage && response.pagination.nextUrl != null) {
        return getAssets(projectId,allAssets, response.pagination.cursorState);
      }
      else {
        return allAssets
      }
    } else {
      return allAssets
    }
  } catch (e) {
    console.error(`allAssets of  ${projectId} failed: ${e}`)
    return []
  }
}


async function getAllCategories(projectId, allCategories,cursorState=null) {
  try { 
    const endpoint = cursorState ?
    config.endpoints.bim360Asset.get_categories.format(projectId) + `?includeCustomAttributes=true&cursorState=${cursorState}` : 
    config.endpoints.bim360Asset.get_categories.format(projectId) + `?includeCustomAttributes=true`
    
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting assets ${projectId} categories`)
      allCategories = allCategories.concat(response.results);
      if (response.pagination.nextUrl != null) {
        return getAllCategories(projectId, allCategories,response.pagination.cursorState);
      }
      else {
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



async function getAllCustomAttdefs(projectId, allCustomAttdefs,cursorState=null) {
  try {
    const endpoint = cursorState ?
    config.endpoints.bim360Asset.get_custom_attributes.format(projectId) + `?includeCustomAttributes=true&cursorState=${cursorState}` : 
    config.endpoints.bim360Asset.get_custom_attributes.format(projectId) + `?includeCustomAttributes=true`
    
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting assets ${projectId} custom attributes`)
      allCustomAttdefs = allCustomAttdefs.concat(response.results);
      if (response.pagination.nextUrl != null) {
        return getAllCustomAttdefs(projectId, allCustomAttdefs,cursorState);
      }
      else {
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


async function getAllStatusSets(projectId, allStatusSets,cursorState=null) {
  try {

    const endpoint = cursorState ?
    config.endpoints.bim360Asset.get_status_sets.format(projectId) + `?includeCustomAttributes=true&cursorState=${cursorState}` : 
    config.endpoints.bim360Asset.get_status_sets.format(projectId) + `?includeCustomAttributes=true`
    
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)

    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting assets ${projectId} status`)
      allStatusSets = allStatusSets.concat(response.results);
      if (response.pagination.nextUrl != null) { 
        return getAllStatusSets(projectId, allStatusSets,cursorState);
      }
      else {
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


// create single asset
async function createAsset_Single(projectId, body) {
  try { 
    const endpoint = config.endpoints.bim360Asset.single_post_asset.format(projectId)
    var headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    headers['Content-Type'] = 'application/json'
    await utility.delay(utility.DELAY_MILISECOND)
    const response = await post(endpoint, headers, JSON.stringify(body))
    return true
  } catch (e) {
    console.error(`importAsset failed: ${e}`)
    return false
  }
}

// modify single asset
async function patchAsset_Single(projectId, body, assetId) {
  try { 
    const endpoint = config.endpoints.bim360Asset.single_patch_asset.format(projectId,assetId) 
    var headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    headers['Content-Type'] = 'application/json'
    await utility.delay(utility.DELAY_MILISECOND)
    const response =  await patch(endpoint, headers, JSON.stringify(body)) 
    return true
  } catch (e) {
    console.error(`importAsset failed: ${e}`)
    return false
  }
}

//batch create assets
async function createAsset_Batch(projectId, body) {
  try {

    const endpoint = config.endpoints.bim360Asset.batch_post_assets.format(projectId) 
    var headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    headers['Content-Type'] = 'application/json'
    await utility.delay(utility.DELAY_MILISECOND)
    const response = await post(endpoint, headers, JSON.stringify(body)) 
    return true
  } catch (e) {
    console.error(`importAsset failed: ${e}`)
    return false
  }
}

//batch modify assets
async function patchAsset_Batch(projectId, body) {
  try {

    const endpoint = config.endpoints.bim360Asset.batch_patch_assets.format(projectId) 
    var headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    headers['Content-Type'] = 'application/json'
    await utility.delay(utility.DELAY_MILISECOND)
    const response = await patch(endpoint, headers, JSON.stringify(body)) 
    return true
  } catch (e) {
    console.error(`patchAsset_Batch failed: ${e}`)
    return false
  }
}

//batch delete assets
async function deleteAsset_Batch(projectId, ids) {
  try {

    const endpoint = config.endpoints.bim360Asset.batch_delete_assets.format(projectId) 
    var headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    headers['Content-Type'] = 'application/json'
    await utility.delay(utility.DELAY_MILISECOND)
    const body = {ids:ids}
    const response = await post(endpoint, headers, JSON.stringify(body)) 
    return true
  } catch (e) {
    console.error(`deleteAsset_Batch failed: ${e}`)
    return false
  }
}

//prereserve for future use
async function importCategory(projectId, body, categoryId) {
  try {

    const endpoint = categoryId ? `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/categories/${categoryId}` :
      `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/categories`
    var headers = config.httpHeaders(config.token_3legged)
    headers['Content-Type'] = 'application/json'
    await utility.delay(utility.DELAY_MILISECOND)
    const response = assetId ? await patch(endpoint, headers, JSON.stringify(body)) :
      await post(endpoint, headers, JSON.stringify(body))
    return true
  } catch (e) {
    console.error(`importAsset failed: ${e}`)
    return false
  }
} 

//prereserve for future use
async function importCustomAttDef(projectId, body, customAttDefId) {
  try {

    const endpoint = customAttDefId ? `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/custom-attributes/${customAttDefId}` :
      `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/custom-attributes`
    var headers = config.httpHeaders(config.token_3legged)
    headers['Content-Type'] = 'application/json'
    await utility.delay(utility.DELAY_MILISECOND)
    const response = assetId ? await patch(endpoint, headers, JSON.stringify(body)) :
      await post(endpoint, headers, JSON.stringify(body))
    return true
  } catch (e) {
    console.error(`importAsset failed: ${e}`)
    return false
  }
} 

//prereserve for future use
async function importStatus(projectId, body, statusId) {
  try {

    const endpoint = statusId ? `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/asset-statuses/${statusId}` :
      `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/asset-statuses`
    var headers = config.httpHeaders(config.token_3legged)
    headers['Content-Type'] = 'application/json'
    await utility.delay(utility.DELAY_MILISECOND)
    const response = assetId ? await patch(endpoint, headers, JSON.stringify(body)) :
      await post(endpoint, headers, JSON.stringify(body))
    return true
  } catch (e) {
    console.error(`importAsset failed: ${e}`)
    return false
  }
}



async function deleteAsset_Single(projectId, ids) {
  try { 
    const endpoint =
      `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/assets`
    const headers = config.httpHeaders(config.token_3legged)

    let promiseArr = ids.map(async (id, index) => {
      await utility.delay(utility.DELAY_MILISECOND * index)
      const res = await mydelete(endpoint + `/${id}`, headers)
      console.log(`delete ${id}  ${res}`)
      return res
    })

    return Promise.all(promiseArr).then((results) => {
      console.log('deleting done...')
      return results
    }).catch(function (err) {
      console.log(`exception when Promise.all import assets: ${err}`);
      return []
    })

  } catch (e) {
    console.error(`deleting all assets  ${projectId} failed: ${e}`)
    return []
  }
}


module.exports = {
  getAssets,
  getAllCategories,
  getAllCustomAttdefs,
  getAllStatusSets,

  createAsset_Single,
  patchAsset_Single,
  deleteAsset_Single,

  createAsset_Batch,
  patchAsset_Batch,
  deleteAsset_Batch ,

  importCategory,
  importCustomAttDef,
  importStatus 
}