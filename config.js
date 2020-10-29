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

// Autodesk Forge configuration

const credentials = {
    client_id: process.env.FORGE_CLIENT_ID,
    client_secret: process.env.FORGE_CLIENT_SECRET,
    callback_url: process.env.FORGE_CALLBACK_URL,
    scopes: {
        // Required scopes for the server-side application
        internal: ['data:read', 'data:write'], 
        // Required scopes for the server-side BIM360 Account Admin
        internal_2legged: ['account:read'],
        // Required scope for the client-side viewer
        public: ['viewables:read']
    },
    token_2legged:'',
    token_3legged:'',
    ForgeBaseUrl:'https://developer.api.autodesk.com' 
}

const endpoints = {
    bim360Admin:{ 
        get_project_companies: `${credentials.ForgeBaseUrl}/hq/v1/accounts/{0}/projects/{1}/companies` ,
        get_project_users:  `${credentials.ForgeBaseUrl}/bim360/admin/v1/projects/{0}/users`,
        get_project_roles:  `${credentials.ForgeBaseUrl}/hq/v2/accounts/{0}/projects/{1}/industry_roles`

      }, 
    bim360DM:{
        get_project:`${credentials.ForgeBaseUrl}/project/v1/hubs/{0}/projects/{1}`,
        get_item:`${credentials.ForgeBaseUrl}/data/v1/projects/{0}/items/{1}`,
        get_item_parent:`${credentials.ForgeBaseUrl}/data/v1/projects/{0}/items/{1}/parent`
    },
    bimField:{ 
        get_issue: `${credentials.ForgeBaseUrl}/issues/v1/containers/{0}/quality-issues/{1}`,
        get_checkList:`${credentials.ForgeBaseUrl}/bim360/checklists/v1/containers/{0}/instances/{1}`
    },
    bim360Asset:{
        get_assets:`${credentials.ForgeBaseUrl}/bim360/assets/v1/projects/{0}/assets`,
        get_status_sets:`${credentials.ForgeBaseUrl}/bim360/assets/v1/projects/{0}/status-step-sets`,

        get_status:`${credentials.ForgeBaseUrl}/bim360/assets/v1/projects/{0}/asset-statuses`,
        get_categories:`${credentials.ForgeBaseUrl}/bim360/assets/v1/projects/{0}/categories`,
        get_custom_attributes:`${credentials.ForgeBaseUrl}/bim360/assets/v1/projects/{0}/custom-attributes`,
        get_categories_custom_attributes:`${credentials.ForgeBaseUrl}/bim360/assets/v1/projects/{0}/categories/{1}/custom-attributes`,

        single_post_asset: `${credentials.ForgeBaseUrl}/bim360/assets/v1/projects/{0}/assets`,
        single_patch_asset: `${credentials.ForgeBaseUrl}/bim360/assets/v1/projects/{0}/assets/{1}`,
        single_delete_asset: `${credentials.ForgeBaseUrl}/bim360/assets/v1/projects/{0}/assets/{1}`,

        batch_post_assets: `${credentials.ForgeBaseUrl}/bim360/assets/v2/projects/{0}/assets:batch-create`,
        batch_patch_assets: `${credentials.ForgeBaseUrl}/bim360/assets/v2/projects/{0}/assets:batch-patch`,
        batch_delete_assets: `${credentials.ForgeBaseUrl}/bim360/assets/v2/projects/{0}/assets:batch-delete`
    },
    bim360Relationship:{
         search:`${credentials.ForgeBaseUrl}/bim360/relationship/v2/containers/{0}/relationships:search`,
    },

    httpHeaders: function (access_token) {
        return {
          Authorization: 'Bearer ' + access_token
        }
    } 
}

module.exports = {
    credentials,
    endpoints
};
