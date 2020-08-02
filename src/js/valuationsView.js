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

    ipcRenderer.send('variable-request');

    ipcRenderer.on('variable-reply', function (event, args) {
        valuationID = args[0];
        inventoryModule.getValuation(valuationID, (err, result)=>{
            let valuationDetails, valuationItems, items, uoms;
            [valuationDetails, valuationItems, items, uoms] = result;

            // uomArray
            let uomArray = [];
            for(let i in uoms) {
                uomArray[uoms[i].id] = uoms[i];
            }

            // itemsArray
            let itemsArray = [];
            for(let i in items) {
                itemsArray[items[i].id] = items[i];
            }

            let resultHTML = `<h4><i class="fa fa-usd"></i> View Valuation</h4>
                            <div class="form-group row" style="width:100%;">
                                <div class="col-md-4 col-lg-4 text-right">
                                    <label class="col-form-label">Date</label>
                                </div>
                                <div class="col-md-8 col-lg-8">
                                    <label class="col-form-label">Closing on<br /><b>${moment.unix(valuationDetails[0].date).format('DD MMM, YYYY')}</b></label>
                                </div>
                            </div>
                            <div class="form-group row" style="width:100%;">
                                <div class="col-md-4 col-lg-4 text-right">
                                    <label class="col-form-label">Comment/Description</label>
                                </div>
                                <div class="col-md-8 col-lg-8">
                                    <label class="col-form-label">${valuationDetails[0].comments}</label>
                                </div>
                            </div>
                            <div class="text-center" style="width:100%;">
                                <button class="btn btn-outline-secondary" onclick="editValuation(${valuationID})">
                                    <i class="fa fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-outline-secondary" onclick="deleteValuation(${valuationID})">
                                    <i class="fa fa-trash"></i> Delete
                                </button>
                            </div>
                            <div class="row" id="itemWiseValuation" style="padding:10px">
                                <table class="table table-sm table-bordered">
                                <thead>
                                    <tr class="text-center">
                                        <th>Item</th>
                                        <th>Group</th>
                                        <th>Qty</th>
                                        <th>Unit Value</th>
                                        <th>Total Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                            </div>`;

            // Iterate through valuationItems
            console.log(valuationItems);
            let grandTotalValue = 0;
            for(let i in valuationItems) {
                let totalValue = valuationItems[i].closingStock * valuationItems[i].unitValue;
                let itemDetails = itemsArray[valuationItems[i].itemID];
                grandTotalValue += totalValue;
                resultHTML += `<tr>
                                    <td><b>${itemDetails.name}</b></td>
                                    <td>${itemDetails.subgroupName}<br />${itemDetails.groupName}</td>
                                    <td class="text-right">${commonModule.uomFormat(valuationItems[i].closingStock, uomArray[itemDetails.uomID])}</td>
                                    <td class="text-right">${commonModule.currency(valuationItems[i].unitValue)}</td>
                                    <td class="text-right">${commonModule.currency(totalValue)}</td>
                                </tr>`;
            }
            resultHTML += `<tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td class="text-right"><b>${commonModule.currency(grandTotalValue)}</b></td>
                            </tr>
                        </tbody>
                    </table>`;

            $('#contentDiv').html(resultHTML);
            
        })
    })


    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

window.onerror = function(error, url, line) {
    console.log(error);
};

function saveValuation(valuationID) {
    // calculate total value
    let inputs = document.querySelectorAll('.saveValue');
    let closingStock={}, unitValue={};
    for(let i in inputs) {
        let tempID = inputs[i].id;
        if(tempID) {
            let arr = tempID.split('_');
            console.log(arr);
            if(arr[0]=='closingStock')
                closingStock[arr[1]] = inputs[i].value;
            if(arr[0]=='unitValue')
                unitValue[arr[1]] = inputs[i].value;
        }
    }

    for(let itemID in closingStock) {
        console.log(`Item ${itemID} - ${closingStock[itemID]} @ ${unitValue[itemID]}`);
        let data = {
            itemID,
            closingStock: closingStock[itemID],
            unitValue: unitValue[itemID]
        }
        inventoryModule.saveValuationItem(valuationID, data, (err, result)=>{
            if(err) {
                console.log(err);
            } else {
                ipcRenderer.send('redirect-window', 'valuations.html');
            }
        })
    }
}

function editValuation(valuationID) {
    ipcRenderer.send('redirect-window', 'valuationsEdit.html', [valuationID]);
}

function deleteValuation(valuationID) {
    if(confirm('Delete this valuation?')) {
        inventoryModule.deleteValuation(valuationID, (err, result)=>{
            if(err) {
                alert('Could not delete!');
            } else {
                ipcRenderer.send('redirect-window', 'valuations.html');
            }
        })
    }
}