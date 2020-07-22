const fs = require('fs');

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const usersModule = require(appPath+'/src/modules/usersModule.js');

$(document).ready(()=>{
    // Load users
    usersModule.loadUsers((err, result)=>{
        console.log(result);
        $('#usersDiv').html(result);
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
});
});