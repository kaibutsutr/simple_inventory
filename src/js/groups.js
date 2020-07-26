const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const app = remote.app;

const commonModule = require('../../src/modules/commonModule.js');
const inventoryModule = require('../../src/modules/inventoryModule.js');

$(document).ready(()=>{

    // Load side menu
    commonModule.loadSideMenu('groups', (err, html)=>{
        $('#menuHolder').html(html);
    });

    inventoryModule.getGroups((err, result) => {
        if(err) {
            $('#contentDiv').html('Error fetching data!');
            console.log(err);
        } else {
            let resultHTML = `<table class="table table-sm table-light table-hover">
                                <thead>
                                    <tr>
                                        <th>S.No.</th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>`;

            let count = 0;
            for(let key in result) {
                if(result[key].id) {
                    count++;
                    resultHTML += `<tr class="groupRow clickable" id="row_${result[key].id}">
                                        <td>${count}</td>
                                        <td>${result[key].name}</td>
                                    </tr>`;
                }
            }
            resultHTML += `</tbody>
                    </table>`;
            resultHTML += `<br />
                            <div class="container text-center">
                                <button class="btn btn-secondary" onclick="newGroup()">New Group</button>
                            </div>`;
            $('#contentDiv').html(resultHTML);
        }
    })
});

$(document).on("click","tr.groupRow", function(e){
    let groupID = commonModule.getRowID(e);
    ipcRenderer.send('open-new-window', 'groupsDialog.html', [`id=${groupID}`], 800, 600);
});

window.onerror = function(error, url, line) {
    ipcRenderer.send('error-in-window', error);
};

function newGroup() {
    ipcRenderer.send('open-new-window', 'groupsDialogNew.html', [], 800, 600);
}