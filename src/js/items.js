const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;

const commonModule = require('../../src/modules/commonModule.js');
const inventoryModule = require('../../src/modules/inventoryModule.js');

$(document).ready(()=>{

    // Load side menu
    commonModule.loadSideMenu('items', (err, html)=>{
        $('#menuHolder').html(html);
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    inventoryModule.getItems((err, result) => {
        if(err) {
            $('#contentDiv').html('Error fetching data!');
            console.log(err);
        } else {
            let resultHTML = `<div class="container text-left">
                                <button class="btn btn-outline-secondary" onclick="newItem()">
                                    <i class="fas fa-plus-circle"></i> New Item
                                </button>
                            </div>
                            <br />
                            <table class="table table-sm table-light table-hover">
                                <thead>
                                    <tr>
                                        <th>Group</th>
                                        <th>Subgroup</th>
                                        <th>Item</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            let groups, subgroups, items;
            [groups, subgroups, items] = result;
            for(let groupKey in groups) {
                for(let subgroupKey in subgroups) {
                    if(subgroups[subgroupKey].groupID == groups[groupKey].id) {
                        for(let itemKey in items) {
                            if(items[itemKey].subgroupID == subgroups[subgroupKey].id) {
                                resultHTML += `<tr class="clickable groupRow" id="row_${items[itemKey].id}"> 
                                                    <td>${groups[groupKey].name}</td>
                                                    <td>${subgroups[subgroupKey].name}</td>
                                                    <td><b>${items[itemKey].name}</b></td>
                                                </tr>`;
                            }
                        }
                    }
                }
            }
            resultHTML += `</tbody></table>`;
            $('#contentDiv').html(resultHTML);

        }
    })
});

$(document).on("click","tr.groupRow", function(e){
    let itemID = commonModule.getRowID(e);
    ipcRenderer.send('open-new-window', 'itemsDialog.html', [`id=${itemID}`], 800, 600);
});

window.onerror = function(error, url, line) {
    ipcRenderer.send('error-in-window', error);
};

function newItem() {
    ipcRenderer.send('open-new-window', 'itemsDialogNew.html', [], 800, 600);
}