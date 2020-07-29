const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const url = require('url');
const path = require('path');
const appPath = app.getAppPath();

const commonModule = require(__dirname+'/src/modules/commonModule.js');

var win;
var dialogWindow;

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

ipcMain.on('redirect-window', (event, fileName, params)=>{
    win.loadURL(`file://${__dirname}/src/html/${fileName}`);
});

ipcMain.on('open-new-window', (event, fileName, params, width, height) => {
    if(!dialogWindow) {
        dialogWindow = new BrowserWindow({
            width:800, 
            height:600, 
            webPreferences: {
                nodeIntegration:true,
                additionalArguments: params
            }
        });
    }
    try {
        dialogWindow.loadURL(`file://${__dirname}/src/html/${fileName}`);
    } catch(e) {
        dialogWindow = new BrowserWindow({
            width:800, 
            height:600, 
            webPreferences: {
                nodeIntegration:true,
                additionalArguments: params
            }
        });
        dialogWindow.loadURL(`file://${__dirname}/src/html/${fileName}`);
    }
    dialogWindow.setAlwaysOnTop(false);

    dialogWindow.on('close', ()=>{
        win.reload();
    })
});

ipcMain.on('error-in-window', function(event, data) {
    console.log(data);
});