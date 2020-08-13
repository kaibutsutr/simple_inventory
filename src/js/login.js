const md5 = require('md5');
const fs = require('fs');

const {remote, ipcRenderer} = require('electron');
const dialog = remote.dialog;
const session = remote.session;
const app = remote.app;
const path = require('path');
const appPath = app.getAppPath();
const userPath = app.getPath('userData');
const util = require('util');
const { selectQuery } = require('../modules/dbModule');
const { usertypePermissions } = require('../modules/usersModule');

const commonModule = require(path.join(appPath,'src','modules','commonModule.js'));
const usersModule = require(path.join(appPath,'src','modules','usersModule.js'));
const dbModule = require(path.join(appPath,'src','modules','dbModule.js'));

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

    let db = require('electron').remote.getGlobal('sharedObject').db;
    console.log(db);
    let firstTimeUse = false;
    if(db=='') {
        // Move skeleton.db from /src/db/skeleton.db to userData folder
        let dbPath = commonModule.getDefaultDBPath();
        dbPath = path.join(dbPath, 'firstDB.db');
        if(!fs.existsSync(dbPath)) {
            fs.copyFileSync(path.join(appPath, 'src', 'db', 'skeleton.db'), dbPath);
        }
        console.log('New DB file copied to: '+dbPath);
        $('#db').val(dbPath);

        // First time instructions
        $('#firstTimeInstructions').html(`<b>Welcome to Simple Inventory!</b><br />We realize that you are using 
            this installation of Simple Inventory for the first time. 
            <br /><br />Please login using <b>admin / pass@1234</b><br />
            <br />Default database: <b>${dbPath}</b>`);

    } else {
        $('#db').val(db);
    }

    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            login();
        }
    });

    $('#loginButton').on('click', ()=>{
        login();
    })
})

function login() {
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

                    // Fetch usertype permissions
                    let userPermissions = {};
                    let getPermissions = util.promisify(usersModule.getPermissions);
                    getPermissions(tempResult.usertypeID)
                        .then((data)=>{
                            for(let i in data) {
                                userPermissions[data[i].usertypePermission] = data[i].usertypePermission;
                            }
                            remote.getGlobal('sharedObject').usertypeID = tempResult.usertypeID;
                            remote.getGlobal('sharedObject').userPermissions = userPermissions;

                            // Set DB
                            remote.getGlobal('sharedObject').db = db;
                            usersModule.getDBSettings((err, result)=>{
                                if(!err) {
                                    for(let i in result) {
                                        if(result[i].property=='name')
                                            remote.getGlobal('sharedObject').dbName = result[i].value;
                                        if(result[i].property=='description')
                                            remote.getGlobal('sharedObject').dbDescription = result[i].value;
                                    }
                                }
                                let userSettings = remote.getGlobal('sharedObject');
                                console.log(userSettings);
                                fs.writeFileSync(path.join(userPath, 'misc', 'userSettings'), JSON.stringify(userSettings));
                                ipcRenderer.send('redirect-window', 'index.html', []);
                            });
                            
                    });

                } else {
                    $('#resultDiv').html('failed!');
                }
            }
        }
    })    
}

function selectDB() {
    let defaultPath = commonModule.getDefaultDBPath();
    let db = $('#db').val();
    if(db) {
        defaultPath = path.dirname(db);
    }
    dialog.showOpenDialog({
        properties: ['openFile'],
        defaultPath: defaultPath
    }).then(result => {
        if(!result.canceled) {
            let db = result.filePaths[0];
            dbModule.setDB(db);
            dbModule.selectQuery('SELECT * FROM dbSettings WHERE property = \'version\'', (err, result)=>{
                if(err) {
                    $('#db').val('error!');
                    console.log(error);
                } else {
                    let dbVersion = result[0].value;
                    let version = require('electron').remote.getGlobal('sharedObject').version;
                    if(commonModule.checkDBCompatibility(version, dbVersion)) {
                        $('#db').val(db);
                        return true;
                    } else {
                        alert(`dbVersion v${dbVersion} is incompatible with software v${version}`);
                        return true;
                    }
                }
            })
        }
    }).catch(err => {
        console.log(err)
    })
}