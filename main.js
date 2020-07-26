const {app, BrowserWindow, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
const appPath = app.getAppPath();

const commonModule = require(__dirname+'/src/modules/commonModule.js');

var win;

app.on('ready', ()=>{
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile(appPath+'/src/html/index.html');

    win.webContents.on('crashed', (e) => {
        console.log(e);
    });

    // win.webContents.openDevTools();

});

// MacOS - app will stay open unless Cmd+Q
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

// MacOS - Dock icon clicked and no windows opened
app.on('activate', ()=>{
    if(BrowserWindow.getAllWinows().length === 0) {
        createWindow();
    }
});

ipcMain.on('open-new-window', (event, fileName, params, width, height)=>{
    let tempWindow = new BrowserWindow({
        width, 
        height, 
        webPreferences: {
            nodeIntegration:true,
            additionalArguments: params
        }
    });
    tempWindow.loadURL(`file://${__dirname}/src/html/${fileName}`);
    // tempWindow.webContents.openDevTools();
    tempWindow.once('ready-to-show', ()=>{
        tempWindow.webContents.send('params', params);
    })
    tempWindow.setAlwaysOnTop(false);
});

ipcMain.on('error-in-window', function(event, data) {
    console.log(data);
});