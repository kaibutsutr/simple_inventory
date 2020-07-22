const {app, BrowserWindow, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
const appPath = app.getAppPath();

const commonModule = require(__dirname+'/src/modules/commonModule.js');

let win;

app.on('ready', ()=>{
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile(appPath+'/src/html/template.html');

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

ipcMain.on('open-new-window', (event, fileName)=>{
    let win = new BrowserWindow();
    win.loadURL(`file://${__dirname}/src/components/${fileName}`);
});