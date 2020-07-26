const { getValidValue } = require('../modules/commonModule');

const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const commonModule = require(appPath+'/src/modules/commonModule.js');
const inventoryModule = require(appPath+'/src/modules/inventoryModule.js');

var groupID;

$(document).ready(()=>{

    let resultHTML = `<div class="form-group row text-center" style="width:100%;">
                            <div class="text-center col-md-12 col-lg-12"><b>New Subgroup</b></div>
                        </div>
                        <div class="form-group row" style="width:100%;">
                            <div class="col-md-3 col-lg-3 text-right">
                                <label class="col-form-label">Subgroup Name</label>
                            </div>
                            <div class="col-md-9 col-lg-9">
                                <input type="text" id="subgroupName" value="" class="form-control" />
                            </div>
                        </div>
                        <div class="container text-center" style="width:100%">
                            <button class="btn btn-secondary" id="editGroup" onclick="createSubgroup()">Save</button>
                            <button class="btn btn-secondary" id="cancel" onclick="cancelNewSubgroup()">Cancel</button>
                        </div>`;
    $('#contentDiv').html(resultHTML);
})

function createSubgroup() {
    let subgroupName = commonModule.getValidValue('subgroupName');
    if(subgroupName=='')
        return false;
    let data = {name: subgroupName};
    inventoryModule.createSubgroup(data, (err, result=0)=>{
        if(err) {
            $('#contentDiv').html(err);
        } else {
            if(result=='success')
                cancelNewSubgroup();
        }
    });
}

function cancelNewSubgroup() {
    remote.getCurrentWindow()
        .close();
}

window.onerror = function(error, url, line) {
    console.log(error);
};