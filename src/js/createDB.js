const fs = require('fs');

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const dialog = remote.dialog;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const usersModule = require(appPath+'/src/modules/usersModule.js');
const commonModule = require(appPath+'/src/modules/commonModule.js');

$(document).ready(()=>{

    // Load side menu
    commonModule.loadSideMenu('createDB.html', (err, html)=>{
        $('#menuHolder').html(html);
    });
});

window.onerror = function(error, url, line) {
    console.log(error);
};

function selectDBFolder() {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {
        if(!result.canceled)
            $('#dbFolder').val(result.filePaths[0]);
    }).catch(err => {
        console.log(err)
    })
}

function createDB() {
    let dbFolder = commonModule.getValidValue('dbFolder');
    let dbName = commonModule.getValidValue('dbName');

    // dbFolder/dbName will be created or overwritten by default.
    fs.copyFile('./src/db/skeleton.db', dbFolder+'/'+dbName, (err) => {
        if (err) {
            console.log(err);
        } else {
            ipcRenderer.send('redirect-window', 'logout.html', []);
        }
    });
}