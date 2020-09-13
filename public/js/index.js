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
   
  (async()=>{
    var cols = await asset_view.initAssetTableFixComlumns();
    asset_view.initTable('assetTable',cols)
    cols = await asset_view.initCagoryTableFixComlumns();
    asset_view.initTable('categoryTable',cols)
    cols = await asset_view.initCustomAttDefTableFixComlumns();
    asset_view.initTable('customAttdefTable',cols)
    cols = await asset_view.initStatusTableFixComlumns();
    asset_view.initTable('statusTable',cols) 

  })()


});

 