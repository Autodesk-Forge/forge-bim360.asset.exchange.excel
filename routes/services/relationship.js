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
  searchRelationships,
  getIssue,
  getChecklist,
  getAttachment
}


async function searchRelationships(projectId, assetId, continuationToken, allWithEntities) {
  try {
    const endpoint = config.endpoints.bim360Relationship.search.format(projectId) +
      `?domain=autodesk-bim360-asset&type=asset&id=${assetId}&continuationToken=${continuationToken}`

    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    const response = await get(endpoint, headers);

    if (response.relationships && response.relationships.length > 0) {
      console.log(`getting relationships of project ${projectId}`)
      allWithEntities = allWithEntities.concat(response.relationships);
      if (response.page.continuationToken > 0) {
        await utility.delay(utility.DELAY_MILISECOND)
        return search(projectId, assetId, response.page.continuationToken, allWithEntities);
      }
      else {
        return allWithEntities
      }
    } else {
      return []
    }
  } catch (e) {
    console.error(`allAssets of  ${projectId} failed: ${e}`)
    return []
  }
}



async function getIssue(accountId, projectId, issueId) {
  try {

    //find container id firstly
    const endpoint = config.endpoints.bim360DM.get_project.format(`b.${accountId}`,`b.${projectId}`)
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    const response = await get(endpoint, headers);
    if (response.data &&
      response.data.relationships &&
      response.data.relationships.issues) {

      const issueContainerId = response.data.relationships.issues.data.id
      const endpoint1 = config.endpoints.bimField.get_issue.format(issueContainerId,issueId)
      const headers1 = config.endpoints.httpHeaders(config.credentials.token_3legged)
      const response1 = await get(endpoint1, headers1);
      if (response1.data) {
        return {
          type: 'issue',
          id: issueId,
          title: response1.data.attributes.title,
          status: response1.data.attributes.status,
          href: `https://docs.b360.autodesk.com/projects/${projectId}/issues/${issueId}`
        }
      } else {
        return   {
          type: 'checklist',
          id: checklistId,
          title: 'N/A',
          status: 'N/A',
          href: 'N/A'
        }
      }
    } else {
      return   {
        type: 'checklist',
        id: checklistId,
        title: 'N/A',
        status: 'N/A',
        href: 'N/A'
      }
    }
  } catch (e) {
    console.error(`getIssue of ${issueId} failed: ${e}`)
    return null
  }
}


async function getChecklist(accountId, projectId, checklistId) {
  try {

    //find container id firstly
    const endpoint = config.endpoints.bim360DM.get_project.format(`b.${accountId}`,`b.${projectId}`)
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    const response = await get(endpoint, headers);
    if (response.data &&
      response.data.relationships &&
      response.data.relationships.checklists) {

      const cksContainerId = response.data.relationships.checklists.data.id
      const endpoint1 = config.endpoints.bimField.get_checkList.format(`${cksContainerId}`,`${checklistId}`)
      const headers1 = config.endpoints.httpHeaders(config.credentials.token_3legged)
      const response1 = await get(endpoint1, headers1);
      if (response1.data) {
        return {
          type: 'checklist',
          id: checklistId,
          title: response1.data.attributes.title,
          status: response1.data.attributes.status.name,
          href: `https://field.b360.autodesk.com/projects/${projectId}/checklists/${checklistId}`
        }
      } else {
        return  {
          type: 'checklist',
          id: checklistId,
          title: 'N/A',
          status: 'N/A',
          href: 'N/A'
        }
      }
    } else {
      return   {
        type: 'checklist',
        id: checklistId,
        title: 'N/A',
        status: 'N/A',
        href: 'N/A'
      }
    }
  } catch (e) {
    console.error(`getChecklist of ${checklistId} failed: ${e}`)
    return null
  }
}


async function getAttachment(accountId, projectId, version_id) {
  try {

    //find container id firstly
    const endpoint =  config.endpoints.bim360DM.get_item.format(`b.${projectId}`,`${version_id}`)
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    const response = await get(endpoint, headers);
    if (response.data &&
      response.data.attributes &&
      response.data.attributes.displayName) { 

      const endpoint1 = config.endpoints.bim360DM.get_item_parent.format(`b.${projectId}`,`${version_id}`)
      const headers1 = config.endpoints.httpHeaders(config.credentials.token_3legged)
      const response1 = await get(endpoint1, headers1);
      if (response1.data) {
        return {
          type: 'attachment',
          id:version_id,
          title: response.data.attributes.displayName,
          folder: response1.data.attributes.displayName,
          href: `https://docs.b360.autodesk.com/projects/${projectId}/folders/${response1.data.id}/detail/viewer/items/${version_id}`
        }
      } else {
        return   {
          type: 'checklist',
          id: checklistId,
          title: 'N/A',
          status: 'N/A',
          href: 'N/A'
        }
      }
    }
    else {
      return   {
        type: 'checklist',
        id: checklistId,
        title: 'N/A',
        status: 'N/A',
        href: 'N/A'
      }
    }
  } catch (e) {
    console.error(`getAttachment of ${version_id} failed: ${e}`)
    return null
  }
}




