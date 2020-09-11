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


const express = require('express'); 
const router = express.Router(); 

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json(); 
const config = require('../../config'); 
const { OAuth } = require('../services/oauth');
const asset_service = require('../services/asset'); 
const admin_service = require('../services/admin'); 

 
router.use(async (req, res, next) => {
  const oauth = new OAuth(req.session);
  if(!oauth.isAuthorized()){ 
    console.log('no valid authorization!')
    res.status(401).end('Please login first')
    return  
  } 
  req.oauth_client = oauth.getClient();
  req.oauth_token = await oauth.getInternalToken();  
  const token_2legged = await oauth.get2LeggedClient().authenticate().access_token
  config.token_3legged = req.oauth_token.access_token
  config.token_2legged = token_2legged

  next();   
});

var Defs ={
  allCustomAttdefs:null,
  allStatus:null,
  allCategories:null,
  allProjectUsers:null
}

router.get('/asset/all/:projectId', async (req, res, next) => {

  try {  
    const projectId = req.params['projectId']  
    var allAssets = []
    allAssets = await asset_service.getAllAssets(projectId,null,allAssets) 
    var allStatus = [] 
    allStatus = await asset_service.getAllStatuses(projectId,null,allStatus) 
    var allCategories = [] 
    allCategories = await asset_service.getAllCategories(projectId,null,allCategories) 
    var allCustomAttdefs= [] 
    allCustomAttdefs = await asset_service.getAllCustomAttdefs(projectId,null,allCustomAttdefs) 
    var allProjectUsers= [] 
    allProjectUsers = await admin_service.getProjectUsers(projectId,null,allProjectUsers) 
    
    Defs.allCustomAttdefs = allCustomAttdefs
    Defs.allCategories = allCategories
    Defs.allStatus = allStatus

    //sorting out with 


    res.send(allAssets)  
   } catch(e) {
      // here goes out error handler
      console.log('allAssets failed: '+ e.message)
      res.status(500).end()
  }   
}); 

router.get('/asset/categories/:projectId', async (req, res, next) => {

  try {  
    const projectId = req.params['projectId']  
    var allCategories = []
    allCategories = await asset_service.getAllCategories(projectId,null,allCategories) 
    res.send(allCategories)  
   } catch(e) {
      // here goes out error handler
      console.log('allCategories failed: '+ e.message)
      res.status(500).end()
  }   
}); 

router.get('/asset/custom_attdef/:projectId', async (req, res, next) => {

  try {  
    const projectId = req.params['projectId']  
    var allCustomAttdefs = []
    allCustomAttdefs = await asset_service.getAllCustomAttdefs(projectId,null,allCustomAttdefs) 
    res.send(allCustomAttdefs)  
   } catch(e) {
      // here goes out error handler
      console.log('getAllCustomAttdefs failed: '+ e.message)
      res.status(500).end()
  }   
}); 


router.get('/asset/status/:projectId', async (req, res, next) => {

  try {  
    const projectId = req.params['projectId']  
    var allStatuses = []
    allStatuses = await asset_service.getAllStatuses(projectId,null,allStatuses) 
    res.send(allStatuses)  
   } catch(e) {
      // here goes out error handler
      console.log('getAllStatuses failed: '+ e.message)
      res.status(500).end()
  }   
}); 

module.exports = router