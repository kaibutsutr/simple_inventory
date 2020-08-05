const fs = require('fs');
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const usersModule = require(appPath+'/src/modules/usersModule.js');
const commonModule = require(appPath+'/src/modules/commonModule.js');

$(document).ready(()=>{
    // Load side menu
    commonModule.loadSideMenu('userSettings.html', (err, html)=>{
        $('#menuHolder').html(html);
    });

    // Load font size
    let currentSize = require('electron').remote.getGlobal('sharedObject').fontSize;
    $('#fontSize').val(currentSize);
});

window.onerror = function(error, url, line) {
    console.log(error);
};

function changePassword() {
    ipcRenderer.send('open-new-window', 'userSettingsDialogChangePassword.html', [], 600, 600);
}