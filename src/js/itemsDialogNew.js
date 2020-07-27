const { getValidValue } = require('../modules/commonModule');

const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const commonModule = require(appPath+'/src/modules/commonModule.js');
const inventoryModule = require(appPath+'/src/modules/inventoryModule.js');


$(document).ready(()=>{

    inventoryModule.getGroupsAndSubgroups((err, result)=>{
        if(err) {
            $('#contentDiv').html('Error accessing database!');
        } else {
            console.log(result);
            let groups, subgroups;
            [groups, subgroups] = result;
            let groupsArray = [];
            for(let key in groups) {
                groupsArray[groups[key].id] = groups[key].name;
            }

            let subgroupsDropdown = '<option value="">Please select</option>';
            for(let key in subgroups) {
                subgroupsDropdown += `<option value="${subgroups[key].id}">${subgroups[key].name} [${groupsArray[subgroups[key].groupID]}]</option>`;
            }
            let resultHTML = `<div class="form-group row text-center" style="width:100%;">
                                <div class="text-center col-md-12 col-lg-12"><b>New Item</b></div>
                            </div>
                            <div class="form-group row" style="width:100%;">
                                <div class="col-md-3 col-lg-3 text-right">
                                    <label class="col-form-label">Item Name</label>
                                </div>
                                <div class="col-md-9 col-lg-9">
                                    <input type="text" id="itemName" value="" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row" style="width:100%;">
                                <div class="col-md-3 col-lg-3 text-right">
                                    <label class="col-form-label">Subgroup</label>
                                </div>
                                <div class="col-md-9 col-lg-9">
                                    <select id="subgroupID" class="form-control">
                                        ${subgroupsDropdown}
                                    </select>
                                </div>
                            </div>
                            <div class="container text-center" style="width:100%">
                                <button class="btn btn-secondary" id="editGroup" onclick="createItem()">Save</button>
                                <button class="btn btn-secondary" id="cancel" onclick="cancelDialog()">Cancel</button>
                            </div>`;
                    $('#contentDiv').html(resultHTML);
        }
    });


})

function createItem() {
    let name = commonModule.getValidValue('itemName');
    let subgroupID = commonModule.getValidValue('subgroupID');
    if(!name || !subgroupID)
        return false;

    let data = {name, subgroupID};
    inventoryModule.createItem(data, (err, result=0)=>{
        if(err) {
            $('#contentDiv').html(err);
        } else {
            if(result=='success')
                cancelDialog();
        }
    });
}

function cancelDialog() {
    remote.getCurrentWindow()
        .close();
}

window.onerror = function(error, url, line) {
    console.log(error);
};