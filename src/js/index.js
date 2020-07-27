const fs = require('fs');

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const commonModule = require(appPath+'/src/modules/commonModule.js');
const inventoryModule = require(appPath+'/src/modules/inventoryModule.js');

$(document).ready(()=>{

    // Load side menu
    commonModule.loadSideMenu('index', (err, html)=>{
        $('#menuHolder').html(html);
    });

    inventoryModule.getCurrentInventory(function(err, result) {
        if(err) {
            console.log(err);
            $('#contentDiv').html('Error occured!');
        } else {
            let resultHTML = `<table class="table table-sm table-light table-hover">
                                <thead>
                                    <tr>
                                        <th>Group</th>
                                        <th>Subgroup</th>
                                        <th>Item</th>
                                        <th>Closing Stock</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            let groups, subgroups, items, inventory;
            [groups, subgroups, items, inventory] = result;
            for(let groupKey in groups) {
                resultHTML += `<tr>
                                    <td>${groups[groupKey].name}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>`;
                for(let subgroupKey in subgroups) {
                    if(subgroups[subgroupKey].groupID == groups[groupKey].id) {
                        resultHTML += `<tr>
                                            <td></td>
                                            <td>${subgroups[subgroupKey].name}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>`;
                        for(let itemKey in items) {
                            if(items[itemKey].subgroupID == subgroups[subgroupKey].id) {
                                let currentInventory = 0;
                                if(inventory[items[itemKey].id])
                                    currentInventory = inventory[items[itemKey].id];
                                resultHTML += `<tr> 
                                                    <td></td>
                                                    <td></td>
                                                    <td>${items[itemKey].name}</td>
                                                    <td>${currentInventory}</td>
                                                </tr>`;
                            }
                        }
                    }
                }
            }
            resultHTML += `</tbody></table>`;
            $('#contentDiv').html(resultHTML);
        }
    });


    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

window.onerror = function(error, url, line) {
    console.log(error);
};