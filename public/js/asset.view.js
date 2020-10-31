class AssetView {

  constructor() {
    this._assetTable = null
    this._categoryTable = null
    this._customAttDefTable = null
    this._statusTable = null

    this._pageLimit = 25
    this._pageOffset = 0


    this._data ={
      assetTable:[],
      categoryTable:null,
      customAttdefTable:null,
      statusTable:null
    } 

    this._tableFixComlumns = {
      parent:this,
      assetTable: function (isRaw) {
        return [
          { field: 'clientAssetId', title: "clientAssetId", align: 'center' },
          { field: 'version', title: "version", align: 'center' },
          { field: 'description', title: "description", align: 'left' },
          { field: 'isActive', title: "isActive", align: 'center' },
          isRaw ? { field: 'categoryId', title: "category", align: 'left', halign:'center',color:'red'} : { field: 'category', title: "category", align: 'center' },
          isRaw ? { field: 'statusId', title: "status", align: 'left', halign:'center' } : { field: 'status', title: "status", align: 'center' },
          { field: 'barcode', title: "barcode", align: 'center' },
          // { field: 'serialNumber', title: "serialNumber", align: 'left' },
          // { field: 'installationDate', title: "installationDate", align: 'center' },
          // { field: 'installedBy', title: "installedBy", align: 'center' },
          // { field: 'warrantyStartDate', title: "warrantyStartDate", align: 'center' },
          // { field: 'warrantyEndDate', title: "warrantyEndDate", align: 'center' },
          // { field: 'expectedLifeYears', title: "expectedLifeYears", align: 'center' },
          // { field: 'manufacturer', title: "manufacturer", align: 'center' },
          { field: 'locationId', title: "locationId", align: 'left' },  
          { field: 'createdAt', title: "createdAt", align: 'center' },
          isRaw ? { field: 'createdById', title: "createdById", align: 'center' } : { field: 'createdBy', title: "createdBy", align: 'left' },
          isRaw ? { field: 'companyId', title: "companyId", align: 'center' } : { field: 'company', title: "company", align: 'left' },
          isRaw ? { field: 'issues', title: "issues", align: 'left', halign:'center',formatter: this.parent.rawFormatter, width: 180 } : { field: 'issues', title: "issues", align: 'left', halign:'center', formatter: this.parent.humanIssueFormatter, width: 180 },
          isRaw ? { field: 'checklists', title: "checklists", align: 'left', halign:'center', formatter: this.parent.rawFormatter, width: 20 } : { field: 'checklists', title: "checklists", align: 'left', halign:'center', formatter: this.parent.humanChecklistFormatter, width: 20 },
          isRaw ? { field: 'attachments', title: "attachments", align: 'left', halign:'center', formatter: this.parent.rawFormatter, width: 10 } : { field: 'attachments', title: "attachments", align: 'left', halign:'center', formatter: this.parent.humanAttachmentFormatter, width: 10 }
        ]
      },

      categoryTable: function (isRaw) {
        return [
          //this raw property is a human readable string already
          { field: 'id', title: "id", align: 'center' },  

          { field: 'name', title: "name", align: 'center' },
          { field: 'description', title: "description", align: 'left' },
          { field: 'isActive', title: "isActive", align: 'center' },

          isRaw ? { field: 'parentId', title: "parentId", align: 'center' } : { field: 'parent', title: "parent", align: 'left' },
          isRaw ? { field: 'subcategoryIds', title: "subcategoryIds", align: 'center' } : { field: 'subcategories', title: "subcategories", align: 'left' },

          { field: 'isRoot', title: "isRoot", align: 'center' },
          { field: 'isLeaf', title: "isLeaf", align: 'center' },

          { field: 'createdAt', title: "createdAt", align: 'left' },
          isRaw ? { field: 'createdById', title: "createdById", align: 'center' } : { field: 'createdBy', title: "createdBy", align: 'center' }
        ]
      },
      customAttdefTable: function (isRaw) {
        return [

          { field: 'name', title: "name", align: 'center' },
          { field: 'displayName', title: "displayName", align: 'left' },
          { field: 'description', title: "description", align: 'left' },
          { field: 'dataType', title: "dataType", align: 'center' },
          { field: 'isActive', title: "isActive", align: 'center' },

          { field: 'createdAt', title: "createdAt", align: 'left' },
          { field: 'defaultValue', title: "defaultValue", align: 'center' },
          { field: 'enumValues', title: "enumValues", align: 'center' },
          isRaw ? { field: 'createdById', title: "createdById", align: 'left' } : { field: 'createdBy', title: "createdBy", align: 'left' },
        ]
      },
      statusTable: function (isRaw) {
        return [
          isRaw ? { field: 'setId', title: "setId", align: 'center' } : { field: 'set', title: "set", align: 'center' },
          { field: 'label', title: "label", align: 'center' },
          { field: 'version', title: "version", align: 'center' },
          { field: 'color', title: "color", align: 'center' },
          { field: 'bucket', title: "bucket", align: 'center' },
          { field: 'description', title: "description", align: 'left' },
          { field: 'isActive', title: "isActive", align: 'center' },
          isRaw ? { field: 'createdById', title: "createdById", align: 'left' } : { field: 'createdBy', title: "createdBy", align: 'left' },
          { field: 'createdAt', title: "createdAt", align: 'left' },
        ]
      }

    }
  }

  resetData(){
    this._data ={
      assetTable:[],
      categoryTable:null,
      customAttdefTable:null,
      statusTable:null
    } 
  }

  //colum formats
  rawFormatter(value, row, index) {
    var re = `<ul>`
    value.forEach(async element => {
      re += `<li>${element.id}</li>`;
    });
    re += `</ul>`

    return re
  }

  humanIssueFormatter(value, row, index) {
    var re = `<ul>`
    value.forEach(async element => {
      const href = element.href 
      const title = element.title.split(' ').join('&nbsp')
      const status = element.status.split(' ').join('&nbsp')

      re += `<li><a href="${href}">${title}</a>&nbsp|&nbsp${status}</li>`;
    });
    re += `</ul>`
    return re
  }

  humanChecklistFormatter(value, row, index) {

    var re = `<ul>`
    value.forEach(async element => {
      const href = element.href 
      const title = element.title.split(' ').join('&nbsp')
      const status = element.status.split(' ').join('&nbsp')
      re += `<li><a href="${href}">${title}</a>&nbsp|&nbsp${status}</li>`;
    });
    re += `</ul>`

    return re
  }
  humanAttachmentFormatter(value, row, index) {
    var re = `<ul>`
    value.forEach(async element => {
      const href = element.href 
      const title = element.title.split(' ').join('&nbsp')
      re += `<li><a href="${href}">${title}</a></li>`;
    });
    re += `</ul>`

    return re
  } 

  initTable(domId,isRaw) {
    $(`#${domId}`).bootstrapTable('destroy');
    const columns  = this._tableFixComlumns[domId](isRaw)
    $(`#${domId}`).bootstrapTable({
      parent:this,
      data: [],
      editable: false,
      clickToSelect: true,
      cache: false,
      showToggle: false,
      showPaginationSwitch: true,
      pagination: true,
      pageList: [5, 10, 25, 50, 100],
      pageSize: 10,
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

  appendColumsToAssetTable(cols, customAttDefs, isRaw = false) {

    for (var i in customAttDefs) {
      const oneDef = customAttDefs[i]
      cols.push(
        isRaw ? { field: `${oneDef.name}`, title: `${oneDef.name}`, align: 'left' } : { field: `${oneDef.name}`, title: `${oneDef.displayName}`, align: 'left' }
      )
    }
    return cols
  }

  async refreshTable(domId, isRaw = false) {
    $(`#${domId}`).bootstrapTable('destroy'); 

    var fixCols = this._tableFixComlumns[domId](isRaw)
     
    if (domId == 'assetTable') {
      //this is for asset list
      fixCols = this.appendColumsToAssetTable(fixCols, this._data.customAttdefTable, isRaw)
       
    }
    $(`#${domId}`).bootstrapTable({
      data: this._data[domId],
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
      columns: fixCols//,
      // onPageChange: async ( number, size)=> {
      //   await this.parent.getAssets(accountId_without_b,projectId_without_b,projectName,size,number*size*2)

      // }
    });
  }

  async getAssets(accountId, projectId, projectName,limit,offset) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/asset/onepage/${accountId}/${projectId}/${encodeURIComponent(projectName)}/${limit}/${offset}`,
        type: 'GET',
        success: (data) => {
          //this._data.assetTable = this._data.assetTable.concat(data)
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  } 


  async getAllAssets(accountId, projectId, projectName) {
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
          this._data.categoryTable = data
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
          this._data.customAttdefTable = data
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
          this._data.statusTable = data
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

 

}