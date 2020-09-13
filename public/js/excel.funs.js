
$(document).ready(function () {
   
    $('#executeExcel').click(function () {
        const exporting = $('input[name="exportOrImport"]:checked').val() === 'export';
        if(exporting){
            const projectName = $('#labelProjectName').text()
            window.location  = `/api/forge/asset/downloadExcel/${projectName}`;  
        } 
    }) 
  
  });