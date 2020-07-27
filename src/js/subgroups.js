const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const app = remote.app;

const commonModule = require('../../src/modules/commonModule.js');
const inventoryModule = require('../../src/modules/inventoryModule.js');

$(document).ready(()=>{

    // Load side menu
    commonModule.loadSideMenu('subgroups', (err, html)=>{
        $('#menuHolder').html(html);
    });


    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    inventoryModule.getGroupsAndSubgroups((err, result) => {
        if(err) {
            $('#contentDiv').html('Error fetching data!');
            console.log(err);
        } else {
            let groups = result[0];
            let subgroups = result[1];
            let groupsArray = [];
            for(let i in groups) {
                if(groups[i].id)
                    groupsArray[groups[i].id] = groups[i].name;
            }

            let resultHTML = `<div class="container text-left">
                                <button class="btn btn-outline-secondary" onclick="newSubgroup()">
                                    <i class="fas fa-plus-circle"></i> New Subgroup
                                </button>
                            </div>
                            <br />
                            <table class="table table-sm table-light table-hover">
                                <thead>
                                    <tr>
                                        <th>S.No.</th>
                                        <th>Subgroup</th>
                                        <th>Group</th>
                                    </tr>
                                </thead>
                                <tbody>`;

            let count = 0;
            for(let key in subgroups) {
                if(subgroups[key].id) {
                    count++;
                    resultHTML += `<tr class="groupRow clickable" id="row_${subgroups[key].id}">
                                        <td>${count}</td>
                                        <td>${subgroups[key].name}</td>
                                        <td>${groupsArray[subgroups[key].groupID]}</td>
                                    </tr>`;
                }
            }
            resultHTML += `</tbody>
                    </table>`;
            $('#contentDiv').html(resultHTML);
        }
    })

});

$(document).on("click","tr.groupRow", function(e){
    let groupID = commonModule.getRowID(e);
    ipcRenderer.send('open-new-window', 'subgroupsDialog.html', [`id=${groupID}`], 800, 600);
});

window.onerror = function(error, url, line) {
    ipcRenderer.send('error-in-window', error);
};

function newSubgroup() {
    ipcRenderer.send('open-new-window', 'subgroupsDialogNew.html', [], 800, 600);
}