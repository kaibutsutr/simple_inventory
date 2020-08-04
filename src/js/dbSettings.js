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
    commonModule.loadSideMenu('dbSettings.html', (err, html)=>{
        $('#menuHolder').html(html);
    });

    usersModule.getDBSettings((err, result)=>{
        if(err) {
            $('contentDiv').html('Could not load data!');
            console.log(err);
        } else {
            let name, description, version;
            for(let i in result) {
                if(result[i].property=='name')
                    name = result[i].value;
                if(result[i].property=='description')
                    description = result[i].value;
                if(result[i].property=='version')
                    version = result[i].value;
            }
            let resultHTML = `<div class="form-group row" style="width:100%;">
                                    <div class="col-md-3 col-lg-3 text-right">
                                        <label class="col-form-label">Name</label>
                                    </div>
                                    <div class="col-md-9 col-lg-9">
                                        <input type="text" id="name" value="${name}" class="form-control" />
                                    </div>
                                </div>
                                <div class="form-group row" style="width:100%;">
                                    <div class="col-md-3 col-lg-3 text-right">
                                        <label class="col-form-label">Description</label>
                                    </div>
                                    <div class="col-md-9 col-lg-9">
                                        <textarea id="description" class="form-control">${description}</textarea>
                                    </div>
                                </div>
                                <div class="form-group row" style="width:100%;">
                                    <div class="col-md-3 col-lg-3 text-right">
                                        <label class="col-form-label">Version</label>
                                    </div>
                                    <div class="col-md-9 col-lg-9">
                                        <input type="text" id="dbVersion" disabled="disabled" value="${version}" class="form-control" />
                                    </div>
                                </div>
                                <div class="container text-center" style="width:100%">
                                    <button class="btn btn-outline-secondary" id="editGroup" onclick="saveDBSettings()">
                                        <i class="fa fa-save"></i> Save Changes
                                    </button>
                                </div>`;
            $('#contentDiv').html(resultHTML);
        }
    })
});

window.onerror = function(error, url, line) {
    console.log(error);
};

function saveDBSettings() {
    let name = commonModule.getValidValue('name');
    let description = commonModule.getValidValue('description');
    if(!name || !description)
        return false;

    usersModule.saveDBSettings(name, description, (err, result)=>{
        if(err) {
            console.log(err);
            $('#contentDiv').html('Error saving data!');
        } else {
            // Equivalent to reload
            ipcRenderer.send('redirect-window', 'dbSettings.html');
        }
    })
}