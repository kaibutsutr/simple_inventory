const md5 = require('md5');

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
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
    $('#loginButton').on('click', ()=>{
        let username = commonModule.getValidValue('username');
        let password = commonModule.getValidValue('password');
        if(!username || !password)
            return false;

        usersModule.getUserByUsername(username, (err, result)=>{
            if(err) {
                console.log(err);
                $('#resultDiv').html(err);
            } else {
                if(Object.keys(result).length===0) {
                    $('#resultDiv').html('No such user!');
                } else {
                    let tempResult = result[0];
                    console.log(md5(password+'simple_inventory'));
                    if(md5(password+'simple_inventory') == tempResult.password) {
                        $('#resultDiv').html('success!');
                        
                        // Set session cookies & redirect to index.html
                        session.defaultSession.cookies.set({url:SESSION_URL, name:'username', value:username});
                        ipcRenderer.send('redirect-window', 'index.html', []);

                    } else {
                        $('#resultDiv').html('failed!');
                    }
                }
            }
        })
    })
})