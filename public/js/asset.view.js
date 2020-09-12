class AssetView {

  constructor() { 
    this._assetTable = null
    this._categoryTable = null
    this._customAttDefTable = null
    this._statusTable = null 
  }

  async initAssetTableFixComlumns(){
    var cols = [
      { field: 'clientAssetId',title:"clientAssetId",align:'center'},
      { field: 'version',title:"version",align:'center'},
      { field: 'description',title:"description",align:'center'},
      { field: 'isActive',title:"isActive",align:'center'},
      { field: 'status',title:"status",align:'center'},
      { field: 'barcode',title:"barcode",align:'center'},
      { field: 'serialNumber',title:"serialNumber",align:'center'}, 
      { field: 'installationDate',title:"installationDate",align:'center'},
      { field: 'installedBy',title:"installedBy",align:'center'},
      { field: 'warrantyStartDate',title:"warrantyStartDate",align:'center'},
      { field: 'warrantyEndDate',title:"warrantyEndDate",align:'center'},
      { field: 'expectedLifeYears',title:"expectedLifeYears",align:'center'},
      { field: 'manufacturer',title:"manufacturer",align:'center'},
      { field: 'createdAt',title:"createdAt",align:'center'},
      { field: 'createdBy',title:"createdBy",align:'center'},
      { field: 'category',title:"category",align:'center'},
      { field: 'status',title:"status",align:'center'},
      { field: 'company',title:"company",align:'center'},
      { field: 'issues',title:"issues",align:'center'},
      { field: 'checklists',title:"checklists",align:'center'},
      { field: 'attachments',title:"attachments",align:'center'}  
    ]
    return cols
  }

  async initAssetTable(domId,columns){
    $(`#${domId}`).bootstrapTable('destroy');
    
    $(`#${domId}`).bootstrapTable({
      data: [],
      editable: false,
      clickToSelect: true,
      cache: false,
      showToggle: false,
      showPaginationSwitch: true,
      pagination: true,
      pageList: [5, 10, 25, 50, 100],
      pageSize: 5,
      pageNumber: 1,
      uniqueId: 'id',
      striped: true,
      search: true,
      showRefresh: true,
      minimumCountColumns: 2,
      smartDisplay: true,
      columns: columns
    });
  }

  async appendColumsToAssetTable(cols,customAttDefs){
     
    for (var i in customAttDefs) {
      const oneDef = customAttDefs[i]
      cols.push(
        { id: `${oneDef.name}`,title:`${oneDef.displayName}`,orderable:false}  
      )
    }   
    return cols
  }

  async  refreshAssetTable(domId,allAssets,fixCols,customAttDefs) {
    $(`#${domId}`).bootstrapTable('destroy');

    fixCols = await this.appendColumsToAssetTable(fixCols,customAttDefs)
    $(`#${domId}`).bootstrapTable({
      data: allAssets,
      editable: false,
      clickToSelect: true,
      cache: false,
      showToggle: false,
      showPaginationSwitch: true,
      pagination: true,
      pageList: [5, 10, 25, 50, 100],
      pageSize: 5,
      pageNumber: 1,
      uniqueId: 'id',
      striped: true,
      search: true,
      showRefresh: true,
      minimumCountColumns: 2,
      smartDisplay: true,
      columns: fixCols
    });  }


  async renderAssetTable(assets){
    //render the table
    // var rows =[]
    // assets.forEach(async a=>{

    //   var row={}
    //   rows.push(row)

    // })

    // for (let index in assets) {
    //   var eachItem = this._clashJsonObj.clashes[index];

    //   var ins = this._clashInsJsonObj.instances.filter(
    //     function (data) { return data.cid == eachItem.id }
    //   ); 
      
    // }
    this._assetTable.rows.add(assets).draw( false );  
  }

  async getAssets(accountId,projectId) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/asset/all/${accountId}/${projectId}`,
        type: 'GET',
        success: (data) => { 
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async getCategories(projectId) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/asset/categories/${projectId}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async getCustomAttdef(projectId) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/asset/custom_attdef/${projectId}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async getStatus(projectId) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/asset/status/${projectId}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }
}