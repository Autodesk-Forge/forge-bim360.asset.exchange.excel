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

module.exports = {
  getProjectCompanies,
  getProjectUsers 
 }


//export BIM 360 project users , recursive function
async function getProjectUsers(projectId, limit, offset, allUsers) {
  try {
    const endpoint = `https://developer.api.autodesk.com/bim360/admin/v1/projects/${projectId}/users?limit=${limit}&offset=${offset}`
    const headers = config.httpHeaders(config.token_2legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting project users ${offset} to ${offset + limit}`)
      allUsers = allUsers.concat(response.results);
      await utility.delay(utility.DELAY_MILISECOND)  
      return getProjectUsers(projectId, limit, allUsers.length, allUsers);
    } else {

       let promiseArr = allUsers.map(async (u, index) => {
          //var eachUser = {}
          //eachUser.name = u.name 
          return u;
      });

      return Promise.all(promiseArr).then((resultsArray) => {
        resultsArray = utility.flatDeep(resultsArray,Infinity)
        return resultsArray;
      }).catch(function (err) { 
        console.log(`exception when Promise.all sorting out users: ${err}`);
        return []
      })
    }
  } catch (e) {
    console.error(`exportProjectsUsers failed: ${e}`)
    return []
  }
}


//export BIM 360 project users , recursive function
async function getProjectCompanies(accountId,projectId, limit, offset, allCompanies) {
  try {
    const endpoint = `https://developer.api.autodesk.com/hq/v1/accounts/${accountId}/projects/${projectId}//companies?limit=${limit}&offset=${offset}`
    const headers = config.httpHeaders(config.token_2legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting project users ${offset} to ${offset + limit}`)
      allCompanies = allCompanies.concat(response.results);
      await utility.delay(utility.DELAY_MILISECOND)  
      return getProjectCompanies(accountId,projectId, limit, allCompanies.length, allCompanies);
    } else {

       let promiseArr = allCompanies.map(async (c, index) => {
          //var eachCom = {}
          //eachCom.name = u.name 
          return c;
      });

      return Promise.all(promiseArr).then((resultsArray) => {
        resultsArray = utility.flatDeep(resultsArray,Infinity)
        return resultsArray;
      }).catch(function (err) { 
        console.log(`exception when Promise.all sorting out companies: ${err}`);
        return []
      })
    }
  } catch (e) {
    console.error(`getProjectCompanies failed: ${e}`)
    return []
  }
}