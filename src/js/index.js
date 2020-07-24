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
    commonModule.loadSideMenu('index', (err, html)=>{
        $('#menuHolder').html(html);
    });

    // Load users
    usersModule.loadUsers((err, rows)=>{
        if(err) {
            $('#usersDiv').html(err);
        } else {
            // Table
            let resultHTML = `<table class="table table-sm table-light table-hover">
                                <thead>
                                    <tr>
                                        <th>S.No.</th>
                                        <th>Username</th>
                                        <th>Usertype</th>
                                    </tr>
                                </thead>`;

            for(let i=0 ; i<rows.length ; i++) {
                resultHTML += `<tr>
                                    <td>${i+1}</td>
                                    <td>${rows[i].username}</td>
                                    <td>${rows[i].usertypeID}</td>
                                </tr>`;
            }
            resultHTML += '</table>';
            $('#usersDiv').html(resultHTML);
            
        }
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

