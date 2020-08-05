let getQuickMenu = require('../../src/modules/commonModule.js').getQuickMenu;

$(document).ready(()=>{
    
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    
    let currentSize = require('electron').remote.getGlobal('sharedObject').fontSize;
    console.log('Setting font size to '+currentSize+'px');
    $(document.body).css('fontSize', currentSize+'px');

    getQuickMenu((err, data)=>{
        if(err) {
            console.log(err);
            $('#quickMenuHolder').html('Error fetching data');
        } else {
            $('#quickMenuHolder').html(data);
        }
    })

    let version = require('electron').remote.getGlobal('sharedObject').version;
    $('#versionHolder').html('ver '+version)
})