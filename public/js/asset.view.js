class AssetView {

  constructor() { 
    this._assetTable = null
    this._categoryTable = null
    this._customAttDefTable = null
    this._statusTable = null 
  }
  issueFormatter(value, row, index) {
    var re = ``
    value.forEach(async element => {
      re +=  `<a href="${element.href}">${element.title}</a>|${element.status}\n`; 
    });
    return re
  }
  checklistFormatter(value, row, index) {

    var re = ``
    value.forEach(async element => {
      re +=  `<a href="${element.href}">${element.title}</a>|${element.status}\n`; 
    });
    return re
   }
  attachmentFormatter(value, row, index) {
    return ''
  }
  async initAssetTableFixComlumns(){
    var cols = [
      { field: 'clientAssetId',title:"clientAssetId",align:'center'},
      { field: 'version',title:"version",align:'center'},
      { field: 'description',title:"description",align:'left'},
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
      { field: 'issues',title:"issues",align:'center',formatter:this.issueFormatter},
      { field: 'checklists',title:"checklists",align:'center',formatter:this.checklistFormatter},
      { field: 'attachments',title:"attachments",align:'center'}  
    ]
    return cols
  }


  async initCagoryTableFixComlumns(){
    var cols = [
      { field: 'name',title:"name",align:'center'},
      { field: 'description',title:"description",align:'left'},
      { field: 'isActive',title:"isActive",align:'center'},
      { field: 'parentId',title:"parentId",align:'center'}, 
      { field: 'subcategoryIds',title:"subcategoryIds",align:'center'},
      { field: 'isRoot',title:"isRoot",align:'center'},
      { field: 'isLeaf',title:"isLeaf",align:'center'}, 
      { field: 'createdAt',title:"createdAt",align:'left'},
      { field: 'createdBy',title:"createdBy",align:'center'} 
    ]
    return cols
  }


  async initCustomAttDefTableFixComlumns(){
    var cols = [
      { field: 'name',title:"name",align:'center'},
      { field: 'displayName',title:"displayName",align:'left'},
      { field: 'dataType',title:"dataType",align:'center'},
      { field: 'isActive',title:"isActive",align:'center'},
      { field: 'createdAt',title:"createdAt",align:'left'},
      { field: 'defaultValue',title:"defaultValue",align:'center'},
      { field: 'enumValues',title:"enumValues",align:'center'}, 
      { field: 'createdBy',title:"createdBy",align:'center'} 
    ]
    return cols
  }

  async initStatusTableFixComlumns(){
    var cols = [
      { field: 'set',title:"set",align:'center'}, 
      { field: 'label',title:"label",align:'center'},
      { field: 'version',title:"version",align:'center'},
      { field: 'color',title:"color",align:'center'},
      { field: 'bucket',title:"bucket",align:'center'},
      { field: 'description',title:"description",align:'left'},
      { field: 'isActive',title:"isActive",align:'center'},
      { field: 'createdAt',title:"createdAt",align:'left'}, 
      { field: 'createdBy',title:"createdBy",align:'center'} 
    ]
    return cols
  }

  async initTable(domId,columns){
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
        { field: `${oneDef.name}`,title:`${oneDef.displayName}`,align:'left'}  
      )
    }   
    return cols
  }

  async  refreshTable(domId,data,fixCols,customAttDefs=null) {
    $(`#${domId}`).bootstrapTable('destroy');

    if(customAttDefs){
      //this is for asset list
      fixCols = await this.appendColumsToAssetTable(fixCols,customAttDefs)
       
    }
    $(`#${domId}`).bootstrapTable({
      data: data,
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
    });  
  }

  

  async getAssets(accountId,projectId,projectName) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/asset/all/${accountId}/${projectId}/${encodeURIComponent(projectName)}`,
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