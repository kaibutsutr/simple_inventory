const remote = require('electron').remote;
const commonModule = require('../../src/modules/commonModule.js');
const inventoryModule = require('../../src/modules/inventoryModule.js');

var groupID;

$(document).ready(()=>{

    let additionalArgs = window.process.argv;
    for(let needle of additionalArgs) {
        if(needle.search('id=')===0) {
            let temp = needle.split('=');
            groupID = temp[1];
        }
    }

    inventoryModule.getGroup(groupID, (err, result)=>{
        if(err) {
            console.log(err);
            $('#contentDiv').html('Error has occured!');    
        } else {
            let resultHTML = `<div class="form-group row text-center" style="width:100%;">
                                    <div class="text-center col-md-12 col-lg-12"><b>Edit Group</b></div>
                                </div>
                                <div class="form-group row" style="width:100%;">
                                    <div class="col-md-3 col-lg-3 text-right">
                                        <label class="col-form-label">Group Name</label>
                                    </div>
                                    <div class="col-md-9 col-lg-9">
                                        <input type="text" id="groupName" value="${result[0].name}" class="form-control" />
                                    </div>
                                </div>
                                <div class="container text-center" style="width:100%">
                                    <button class="btn btn-secondary" id="editGroup" onclick="editGroupSaved(${groupID})">Save</button>
                                    <button class="btn btn-secondary" id="cancel" onclick="cancelEditGroup()">Cancel</button>
                                </div>`;
            $('#contentDiv').html(resultHTML);
        }
    });
})

function editGroupSaved(groupID) {
    let groupName = commonModule.getValidValue('groupName');
    let data = {name: groupName};
    inventoryModule.editGroup(groupID, data, (err, result=0)=>{
        if(err) {
            $('#contentDiv').html(err);
        } else {
            if(result=='success')
                cancelEditGroup();
        }
    });
}

function cancelEditGroup() {
    remote.getCurrentWindow()
        .close();
}

window.onerror = function(error, url, line) {
    console.log(error);
};