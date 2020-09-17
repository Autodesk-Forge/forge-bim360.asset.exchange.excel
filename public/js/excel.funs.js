 


$(document).ready(function () {

    $('#executeExcel').click(function () {
        const exporting = $('input[name="exportOrImport"]:checked').val() === 'export';
        if (exporting) {
            const projectName = $('#labelProjectName').text()
            window.location = `/api/forge/asset/downloadExcel/${projectName}`;
        } else {
            $('#hidden-upload-file').click();
        }
    })

    $('#hidden-upload-file').on('change', async (evt) => {

        $('.importInProgress').show();
        const projectId = $('#labelProjectId').text()
        const files = evt.target.files
        if (files.length === 1) {
            const formData = new FormData();
            formData.append('xlsx', files[0]);
            const response = await fetch(`/api/forge/asset/importExcel/${projectId}`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const results = await response.json();
                if (results.importJob == false) {
                    $.notify('importing exception', 'warn'); 

                } else { 
                    //check how many records are imported successfully 

                    const totalInfo = `Asset Total: ${results.assets.total} | Success: ${results.assets.success} |  Fail: ${results.assets.fail}\n` +
                        `Category Total: ${results.categories.total} | Success: ${results.categories.success} |  Fail: ${results.categories.fail}\n` +
                        `CustomAttDef Total: ${results.customAttDefs.total} | Success: ${results.customAttDefs.success} |  Fail: ${results.customAttDefs.fail}\n` +
                        `Statuses Total: ${results.statuses.total} | Success: ${results.statuses.success} |  Fail: ${results.statuses.fail}`


                    $.notify(totalInfo, 'warn');
                }
                $('.importInProgress').hide();

            } else {
                const err = await response.text();
                $.notify('Exception to import records.', 'error');
                $('.importInProgress').hide(); 
            }
        } else {
            $.notify('Please select single xlxs file only!', 'warn')
            $('.importInProgress').hide();
        }

    });

});