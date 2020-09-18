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
const { stream } = require('exceljs');




async function getAssets(projectId, cursorState, allAssets, index, isOnePage = false) {
  try {
    //limit and offset have no effect on GET:Catrgories, no either cursorState and nextUrl -- bug?
    index++

    //const endpoint = nextUrl?nextUrl:str.format.format()`${config.bim360Asset.get_categories}`,projectId)
    const endpoint = cursorState ?
      `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/assets` +
      `?includeCustomAttributes=true&cursorState=${cursorState}` :
      `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/assets` +
      `?includeCustomAttributes=true`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting assets of project ${projectId}`)
      allAssets = allAssets.concat(response.results);
      if (!isOnePage && response.pagination.nextUrl != null) {
        //placeholder for nextUrl...
        await utility.delay(utility.DELAY_MILISECOND * index)
        return getAssets(projectId, response.pagination.cursorState, allAssets, index);
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
      if (response.pagination.nextUrl != null) {
        //placeholder for nextUrl...
        await utility.delay(utility.DELAY_MILISECOND)
        return getAllCategories(projectId, response.pagination.nextUrl, allCategories);
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
      if (response.pagination.nextUrl != null) {
        //placeholder for nextUrl...
        await utility.delay(utility.DELAY_MILISECOND)
        return getAllCustomAttdefs(projectId, response.pagination.nextUrl, allCustomAttdefs);
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
      if (response.pagination.nextUrl != null) {
        //placeholder for nextUrl...
        await utility.delay(utility.DELAY_MILISECOND)
        return getAllStatusSets(projectId, response.pagination.nextUrl, allStatusSets);
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

async function importAsset(projectId, body, assetId) {
  try {

    const endpoint = assetId ? `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/assets/${assetId}` :
      `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectId}/assets`
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



async function deleteAssets(projectId, ids) {
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

  importAsset,
  importCategory,
  importCustomAttDef,
  importStatus,
  deleteAssets
}