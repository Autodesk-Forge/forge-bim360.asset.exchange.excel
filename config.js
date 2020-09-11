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
module.exports = {
    // Set environment variables or hard-code here
    credentials: {
        client_id: process.env.FORGE_CLIENT_ID,
        client_secret: process.env.FORGE_CLIENT_SECRET,
        callback_url: process.env.FORGE_CALLBACK_URL
    },
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
    ForgeBaseUrl:'https://developer.api.autodesk.com',

    bim360Admin:{ 
        get_project_companies:  `https://developer.api.autodesk.com/hq/v1/accounts/{0}/projects/{1}/companies` ,
        get_project_users:  `https://developer.api.autodesk.com/bim360/admin/v1/projects/{0}/users`,
        get_project_roles:  `https://developer.api.autodesk.com/hq/v2/accounts/{0}/projects/{1}/industry_roles`

      }, 
    bim360Asset:{
        get_assets:`https://developer.api.autodesk.com/bim360/assets/v1/projects/{0}/assets`,
        get_status_set:`https://developer.api.autodesk.com/bim360/assets/v1/projects/{0}/asset-statuses`,
        get_categories:`https://developer.api.autodesk.com/bim360/assets/v1/projects/{0}/categories`,
        get_custom_attributes:`https://developer.api.autodesk.com/bim360/assets/v1/projects/{0}/custom-attributes`,
        get_categories_custom_attributes:`https://developer.api.autodesk.com/bim360/assets/v1/projects/{0}/categories/{1}/custom-attributes`
    },
    bim360Relationship:{
         search:`https://developer.api.autodesk.com/bim360/relationship/v2/containers/{0}/relationships:search`,
    },
    httpHeaders: function (access_token) {
        return {
          Authorization: 'Bearer ' + access_token
        }
    } 
};
