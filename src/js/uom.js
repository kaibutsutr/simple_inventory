const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;

const commonModule = require('../../src/modules/commonModule.js');
const inventoryModule = require('../../src/modules/inventoryModule.js');

$(document).ready(()=>{

    // Load side menu
    commonModule.loadSideMenu('groups', (err, html)=>{
        $('#menuHolder').html(html);
    });

    inventoryModule.getUOMs((err, result) => {
        if(err) {
            $('#contentDiv').html('Error fetching data!');
            console.log(err);
        } else {
            let resultHTML = `<div class="container text-left">
                                <button class="btn btn-outline-secondary" onclick="newUOM()">
                                    <i class="fas fa-plus-circle"></i> New UOM
                                </button>
                            </div>
                            <br />
                            <table class="table table-sm table-light table-hover">
                                <thead>
                                    <tr>
                                        <th>S.No.</th>
                                        <th>Name</th>
                                        <th>Prefix</th>
                                        <th>Roundoff</th>
                                        <th>Postfix</th>
                                    </tr>
                                </thead>
                                <tbody>`;

            let count = 0;
            for(let key in result) {
                if(result[key].id) {
                    count++;
                    resultHTML += `<tr class="uomRow clickable" id="row_${result[key].id}">
                                        <td>${count}</td>
                                        <td>${result[key].name}</td>
                                        <td>${result[key].prefix}</td>
                                        <td>${result[key].roundoff}</td>
                                        <td>${result[key].postfix}</td>
                                    </tr>`;
                }
            }
            resultHTML += `</tbody>
                    </table>`;
            $('#contentDiv').html(resultHTML);
        }
    })
});

$(document).on("click","tr.uomRow", function(e){
    let uomID = commonModule.getRowID(e);
    ipcRenderer.send('open-new-window', 'uomsDialog.html', [`id=${uomID}`], 800, 600);
});

window.onerror = function(error, url, line) {
    ipcRenderer.send('error-in-window', error);
};

function newUOM() {
    ipcRenderer.send('open-new-window', 'uomsDialogNew.html', [], 800, 600);
}