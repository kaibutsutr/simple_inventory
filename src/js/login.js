const md5 = require('md5');
const fs = require('fs');

const {remote, ipcRenderer} = require('electron');
const dialog = remote.dialog;
const session = remote.session;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const commonModule = require(appPath+'/src/modules/commonModule.js');
const usersModule = require(appPath+'/src/modules/usersModule.js');

const SESSION_URL = remote.getGlobal('sharedObject').sessionURL;

commonModule.checkLoggedIn((err, user)=>{
    if(err) {
        console.log('Not logged in');
    } else {
        // Already logged in
        ipcRenderer.send('redirect-window', 'index.html', []);
    }
})

$(document).ready(()=>{

    $('#db').val(require('electron').remote.getGlobal('sharedObject').db);

    $('#loginButton').on('click', ()=>{

        let db = commonModule.getValidValue('db');
        let username = commonModule.getValidValue('username');
        let password = commonModule.getValidValue('password');
        if(!username || !password)
            return false;

        usersModule.getUserByUsername(username, db, (err, result)=>{
            if(err) {
                console.log(err);
                $('#resultDiv').html(err);
            } else {
                if(Object.keys(result).length===0) {
                    $('#resultDiv').html('No such user!');
                } else {
                    let tempResult = result[0];
                    if(commonModule.encryptPassword(password) == tempResult.password) {
                        $('#resultDiv').html('success!');
                        
                        // Set session cookies & redirect to index.html
                        session.defaultSession.cookies.set({url:SESSION_URL, name:'username', value:username});

                        // Set DB
                        remote.getGlobal('sharedObject').db = db;
                        let userSettings = remote.getGlobal('sharedObject');
                        fs.writeFileSync('./src/misc/userSettings', JSON.stringify(userSettings));
                        ipcRenderer.send('redirect-window', 'index.html', []);

                    } else {
                        $('#resultDiv').html('failed!');
                    }
                }
            }
        })
    })
})

function selectDB() {
    dialog.showOpenDialog({
        properties: ['openFile']
    }).then(result => {
        if(!result.canceled)
            $('#db').val(result.filePaths[0])
    }).catch(err => {
        console.log(err)
    })
}