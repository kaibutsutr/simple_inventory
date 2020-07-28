const ipcRenderer = require('electron').ipcRenderer;

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
            let resultHTML = `<div class="container text-left">
                                <button class="btn btn-outline-secondary" onclick="newGroup()">
                                    <i class="fas fa-plus-circle"></i> New Group
                                </button>
                            </div>
                            <br />
                            <table class="table table-sm table-light table-hover">
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
            $('#contentDiv').html(resultHTML);
        }
    })

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
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