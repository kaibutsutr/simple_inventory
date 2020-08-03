const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const commonModule = require(appPath+'/src/modules/commonModule.js');
const usersModule = require(appPath+'/src/modules/usersModule.js');

var groupID;

$(document).ready(()=>{

    usersModule.getUsertypes((err, rows)=>{
        if(err) {
            $('contentDiv').html('Error fetching data!');
            console.log(err);
        } else {
            // Create dropdown
            let usertypesDropdown = ``;
            for(let i in rows) {
                if(rows[i].name == 'super')
                    continue;

                usertypesDropdown += `<option value="${rows[i].id}">${rows[i].name}</option>`;
            }

            let resultHTML = `<div class="form-group row text-center" style="width:100%;">
                                    <div class="text-center col-md-12 col-lg-12"><b>New Usertype</b></div>
                                </div>
                                <div class="form-group row" style="width:100%;">
                                    <div class="col-md-4 col-lg-4 text-right">
                                        <label class="col-form-label">Usertype</label>
                                    </div>
                                    <div class="col-md-6 col-lg-6">
                                        <input type="text" id="usertype" value="" class="form-control" />
                                    </div>
                                </div>
                                <div class="text-center" style="width:100%;">
                                    <button class="btn btn-secondary" onclick="createUsertype()">Create Usertype</button>
                                    <button class="btn btn-secondary" onclick="cancelDialog()">Cancel</button>
                                </div>`;
            $('#contentDiv').html(resultHTML);
        }
    })

})

function createUsertype() {
    let name = commonModule.getValidValue('usertype');
    if(!name)
        return false;

    let data = {name};

    usersModule.createUsertype(data, (err, result)=>{
        if(err) {
            $('#contentDiv').html('Error saving details!');
        } else {
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