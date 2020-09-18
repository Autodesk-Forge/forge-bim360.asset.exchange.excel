 


$(document).ready(function () {

    $('#executeExcel').click(async ()  =>{
        const batchjob = $('input[name="batchjob"]:checked').val();

        const accountId_without_b = $('#labelAccountId').text()
        const projectId_without_b = $('#labelProjectId').text() 
        const projectName = $('#labelProjectName').text()  

        if (batchjob == 'export') {

            $('.importInProgress').show(); 
            await asset_view.getAllAssets(accountId_without_b,projectId_without_b,projectName)  
            //wait the result at socket modules.... 

        } else if (batchjob == 'import') {
            $('#hidden-upload-file').click();
        }else if(batchjob == 'delete'){
            $('#hidden-upload-file').click(); 
        }
    })

    $('#hidden-upload-file').on('change', async (evt) => {

        $('.importInProgress').show();

        const batchjob = $('input[name="batchjob"]:checked').val(); 
        const projectId_without_b = $('#labelProjectId').text() 

        const files = evt.target.files
        if (files.length === 1) {
            const formData = new FormData();
            formData.append('xlsx', files[0]);
            const endpoint = batchjob=='import'?`/api/forge/asset/importExcel/${projectId_without_b}`:
                                                `/api/forge/asset/delete/${projectId_without_b}`;

            const response = await fetch(endpoint, { method: 'POST', body: formData});
            if (response.ok) {
                 
                 //wait the result at socket modules.... 

            } else {
                $.notify('Exception to import records.', 'error');
                $('.importInProgress').hide(); 
            }
        } else {
            $.notify('Please select single xlxs file only!', 'warn')
            $('.importInProgress').hide();
        }

    });

});