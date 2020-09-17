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

const asset_view = new AssetView()
 

$(document).ready(function () {

  $.notify.defaults({
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut'
  });

  var isRaw = false // by default: human readable form
  asset_view.initTable('assetTable', isRaw)
  asset_view.initTable('categoryTable', isRaw)
  asset_view.initTable('customAttdefTable', isRaw)
  asset_view.initTable('statusTable', isRaw)
 

  $('#btnRefresh').click(async () => {

    const herf = $('#labelProjectHref').text()
    const projectName = $('#labelProjectName').text()

    try {
      $('.clsInProgress').show();

      const isRaw = $('input[name="dataTypeToDisplay"]:checked').val() === 'rawData'
      asset_view.initTable('assetTable', isRaw)
      asset_view.initTable('categoryTable', isRaw)
      asset_view.initTable('customAttdefTable', isRaw)
      asset_view.initTable('statusTable', isRaw)
      
      const accountId = herf.split('/')[6]
      const projectId = herf.split('/')[8]
      const accountId_without_b = accountId.split('b.')[1]
      const projectId_without_b = projectId.split('b.')[1]
      $('#labelProjectId').text(projectId_without_b); 

      await asset_view.getCategories(projectId_without_b)
      await asset_view.getCustomAttdef(projectId_without_b)
      await asset_view.getStatus(projectId_without_b)
      await asset_view.getAssets(accountId_without_b, projectId_without_b, projectName)

      
      
      asset_view.refreshTable('assetTable',isRaw)  
        asset_view.refreshTable('categoryTable',isRaw)  
        asset_view.refreshTable('customAttdefTable',isRaw)  
        asset_view.refreshTable('statusTable',isRaw)  
      $('.clsInProgress').hide();
    } catch (e) {
      $('.clsInProgress').hide();
    }
  }) 

  $('.input-group').click(function(){

    const isRaw = $('input[name="dataTypeToDisplay"]:checked').val() === 'rawData'
    asset_view.refreshTable('assetTable',isRaw)  
    asset_view.refreshTable('categoryTable',isRaw)  
    asset_view.refreshTable('customAttdefTable',isRaw)  
    asset_view.refreshTable('statusTable',isRaw)  
  }); 

});

