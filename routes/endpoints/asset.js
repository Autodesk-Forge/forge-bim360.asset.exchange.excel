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
const fs = require('fs');  
const path = require('path');
const multer = require('multer')
const upload = multer({ dest: './Excel_Uploads/' });
const utility = require('../utility');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const config = require('../../config');
const { OAuth } = require('../services/oauth');
const asset_service = require('../services/asset');
const extract = require('../services/extract');
const _excel = require('../excel/excel');
const excel = require('../excel/excel');

router.use(async (req, res, next) => {
  const oauth = new OAuth(req.session);
  if (!oauth.isAuthorized()) {
    console.log('no valid authorization!')
    res.status(401).end('Please login first')
    return
  }
  req.oauth_client = oauth.getClient();
  req.oauth_token = await oauth.getInternalToken();
  var twoleggedoauth = oauth.get2LeggedClient()
  var twoleggedres = await twoleggedoauth.authenticate()
  config.token_3legged = req.oauth_token.access_token
  config.token_2legged = twoleggedres.access_token

  next();
});


router.get('/asset/onepage/:accountId/:projectId/:projectName/:limit/:offset', async (req, res, next) => {

  try {
    const accountId = req.params['accountId'] 
    const projectId = req.params['projectId'] 
    const limit = req.params['limit']
    const offset = req.params['offset'] 

    res.status(200).end()

    const cursorState = new Buffer(`{"limit":${limit},"offset":${offset}}`).toString('base64');
    const onePageAssets = await extract.exportAssets(accountId,projectId,cursorState,0,true) 

    utility.socketNotify(utility.SocketEnum.ASSET_TOPIC,
                         utility.SocketEnum.EXPORT_ONEPAGE_DONE,
                         onePageAssets)

  } catch (e) {
    // here goes out error handler
    console.log('allAssets failed: ' + e.message)
    res.status(500).end()
  }
});
 
router.get('/asset/categories/:projectId', async (req, res, next) => {

  //normally, volumns of category records would be small.
  //fine to dump in one time
  try {
    const projectId = req.params['projectId']
    const allCategories = await  extract.exportCategory(projectId)  
    extract.Defs.allCategories = allCategories
    res.send(allCategories)
  } catch (e) {
    // here goes out error handler
    console.log('allCategories failed: ' + e.message)
    res.status(500).end()
  }
});

router.get('/asset/custom_attdef/:projectId', async (req, res, next) => {

  //normally, volumns of customAttDef records would be small. fine to dump in one time
  //otherwise, follow the same format of get assets

  try {
    const projectId = req.params['projectId']
    var allCustomAttdefs = await  extract.exportCustomAttDef(projectId)  
    extract.Defs.allCustomAttdefs = allCustomAttdefs

    res.send(allCustomAttdefs)
  } catch (e) {
    // here goes out error handler
    console.log('getAllCustomAttdefs failed: ' + e.message)
    res.status(500).end()
  }
});


router.get('/asset/status/:projectId', async (req, res, next) => {

  //normally, volumns of statues records would be small. fine to dump in one time
  //otherwise, follow the same format of get assets
  try {
    const projectId = req.params['projectId']
    var allStatuses = await  extract.exportStatus(projectId) 
    extract.Defs.allStatuses = allStatuses
  
    res.send(allStatuses)
  } catch (e) {
    // here goes out error handler
    console.log('getAllStatuses failed: ' + e.message)
    res.status(500).end()
  }
});



router.get('/asset/all/:accountId/:projectId/:projectName', async (req, res) => {

  const accountId = req.params['accountId']  
  const projectId = req.params['projectId'] 
  const projectName = req.params['projectName']
 
  res.status(200).end()   

  const allAssets = await extract.exportAssets(accountId,projectId,null,0,false) 
  const result = await _excel._export(`bim360-assets-report<${projectName}>`,{
          assets:allAssets,
          categories:extract.Defs.allCategories,
          customAttDefs:extract.Defs.allCustomAttdefs,
          statuses: extract.Defs.allStatuses 
      }
  ) 

   utility.socketNotify(utility.SocketEnum.ASSET_TOPIC,
    utility.SocketEnum.EXPORT_DONE,
    {result:result,projectName:projectName})
  
}); 


router.get('/asset/:jobId', async (req, res) => {

  try {   
    const jobId = req.params['jobId'] 
    const status = utility.readStatus(jobId) 

    if(status == 'succeeded')
      // now delete this status file
      utility.deleteStatus(jobId)

    if(status) 
      res.status(200).json({status:status});  
    else 
      res.status(200).json({status:'failed'});
   } catch(e) {
      console.log('get job failed: '+ e.message)  
      res.status(500).end('get job failed!')
  }  
}); 

router.get('/asset/downloadExcel/:projectName', async (req, res) => {

  var projectName = req.params['projectName']

  projectName = `bim360-assets-report<${projectName}>.xlsx`
 
  var file_full_csv_name = path.join(__dirname, 
      '../../Excel_Exports/' + projectName);   
  if(fs.existsSync(file_full_csv_name)){ 
      res.download(file_full_csv_name);  
  }
  else{
      res.status(500).json({error:'no such excel file!'} );   
  } 
}); 



// POST /api/issues/:issue_container/import
router.post('/asset/importExcel/:projectId', upload.single('xlsx'), async function (req, res) {
  const { projectId } = req.params;
  const xlsx = fs.readFileSync(req.file.path);
  try { 

      res.status(200).end()    
      const result = await excel._import(projectId,xlsx)

      utility.socketNotify(utility.SocketEnum.ASSET_TOPIC,
        utility.SocketEnum.IMPORT_DONE,
        {result:result,projectId:projectId})
  } catch (err) {
    res.status(500).end()  
  }
});



// POST /api/issues/:issue_container/import
router.post('/asset/delete/:projectId', upload.single('xlsx'),async function (req, res) {
   
  const { projectId } = req.params;
  const xlsx = fs.readFileSync(req.file.path);
  try { 

      res.status(200).end()    
      const result = await excel._import(projectId,xlsx)

      utility.socketNotify(utility.SocketEnum.ASSET_TOPIC,
        utility.SocketEnum.DELETE_DONE,
        {result:result,projectId:projectId})
  } catch (err) {
    res.status(500).end()  
  }
     
}); 
 


module.exports = router