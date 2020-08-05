const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();
const moment = require('moment');

const commonModule = require(appPath+'/src/modules/commonModule.js');
const inventoryModule = require(appPath+'/src/modules/inventoryModule.js');

let dbName = require('electron').remote.getGlobal('sharedObject').db;
let username;
commonModule.checkLoggedIn((err, user)=>{
    if(err) {
        ipcRenderer.send('redirect-window', 'login.html', []);
    } else {
        username = user;
    }
})

$(document).ready(()=>{

    // Load side menu
    commonModule.loadSideMenu('valuations.html', (err, html)=>{
        $('#menuHolder').html(html);
    });

    inventoryModule.getSavedValuations(function(err, result) {
        if(err) {
            console.log(err);
            $('#contentDiv').html('Error occured!');
        } else {
            let resultHTML = `<h4><i class="fa fa-usd"></i> Saved Valuations</h4>
                                <table class="table table-sm table-light table-hover">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Comments</th>
                                        <th class="text-right">Total Value</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            for(let key in result) {
                let tempDate = moment.unix(result[key].date).format('DD MMM, YYYY');
                // let tempDate = '';
                resultHTML += `<tr class="clickable valuationRow" id="row_${result[key].id}">
                                    <td>${tempDate}</td>
                                    <td>${result[key].comments}</td>
                                    <td class="text-right">${commonModule.currency(result[key].totalValue)}</td>
                                </tr>`;
            }
            resultHTML += `</tbody></table>`;
            $('#contentDiv').html(resultHTML);

            $(document).on("click","tr.valuationRow", function(e){
                let valuationID = commonModule.getRowID(e);
                ipcRenderer.send('redirect-window', 'valuationsView.html', [`${valuationID}`]);
            });
        }
    });
});

window.onerror = function(error, url, line) {
    console.log(error);
};