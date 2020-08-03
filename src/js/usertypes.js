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
    commonModule.loadSideMenu('usertypes.html', (err, html)=>{
        $('#menuHolder').html(html);
    });

    usersModule.getUsertypes((err, result)=>{
        if(err) {
            $('#usersDiv').html('Could not load data!');
            console.log(err);
        } else {
            let resultHTML = `<h4><i class="fa fa-users"></i> Usertypes</h4>
                                <button class="btn btn-outline-secondary" onclick="createUsertype()">
                                    <i class="fa fa-plus"></i> New Usertype
                                </button> 
                                <br />
                                <br />
                                <table class="table table-sm table-light table-hover">
                                <thead>
                                    <tr>
                                        <th>S.No.</th>
                                        <th>Usertype</th>
                                    </tr>
                                </thead>
                                <tbody>`;

            let count=0;
            for(let i in result) {
                count++;
                resultHTML += `<tr class="clickable usertypeRow" id="row_${result[i].id}">
                                <td>${count}</td>
                                <td>${result[i].name}</td>
                            </tr>`;
            }
            resultHTML += `</tbody>
                        </table>`;

            $('#usersDiv').html(resultHTML);

            $(document).on("click","tr.usertypeRow", function(e){
                let usertypeID = commonModule.getRowID(e);
                ipcRenderer.send('redirect-window', 'usertypesView.html', [`${usertypeID}`]);
            });
        }
    })
});

window.onerror = function(error, url, line) {
    console.log(error);
};

function createUsertype() {
    ipcRenderer.send('open-new-window', 'usertypesDialogNew.html', [], 800, 600);
}