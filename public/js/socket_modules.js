
const SocketEnum = {
  ASSET_TOPIC: 'asset topic',
  EXPORT_ONEPAGE_DONE:'export one page done', 

  EXPORT_DONE: 'export done',
  IMPORT_ASSETS_DONE: 'import assets done',
  DELETE_ASSETS_DONE: 'delete assets done'
};

const HOST_URL =  window.location.host; 
socketio = io(HOST_URL);
socketio.on(SocketEnum.ASSET_TOPIC, async (d) => {
  const jsonData = JSON.parse(d) 
  const isRaw = $('input[name="dataTypeToDisplay"]:checked').val() === 'rawData' 

  switch (jsonData.message) {
    case SocketEnum.EXPORT_ONEPAGE_DONE:
      
      asset_view._data.assetTable = asset_view._data.assetTable.concat(jsonData.data)

      await asset_view.refreshTable('assetTable',isRaw)  
      await asset_view.refreshTable('categoryTable',isRaw)  
      await asset_view.refreshTable('customAttdefTable',isRaw)  
      await asset_view.refreshTable('statusTable',isRaw)  
      $('.clsInProgress').hide(); 
      console.log('export one page  done')
      break;
    case SocketEnum.EXPORT_DONE: 
        const projectName = jsonData.data.projectName
        if(jsonData.data.result){
            window.location = `/api/forge/asset/downloadExcel/${projectName}`; 
        }else{
            $.notify('Export Excel Failed', 'warn'); 
        }

        console.log('export done')
        $('.importInProgress').hide(); 

        break;
    case SocketEnum.IMPORT_ASSETS_DONE: 
      var totalInfo = `Asset Total: ${jsonData.data.result.assets.total} | Success: ${jsonData.data.result.assets.success} |  Fail: ${jsonData.data.result.assets.fail}\n`
      $.notify(totalInfo, 'warn');


      $('.importInProgress').hide();  
      console.log('import done')
      break;
    case SocketEnum.DELETE_ASSETS_DONE: 
      var totalInfo = `Asset Total: ${jsonData.data.result.assets.total} | Success: ${jsonData.data.result.assets.success} |  Fail: ${jsonData.data.result.assets.fail}\n`
      $.notify(totalInfo, 'warn'); 
      
      $('.importInProgress').hide();  
      console.log('delete done')
      break; 
  }

})
