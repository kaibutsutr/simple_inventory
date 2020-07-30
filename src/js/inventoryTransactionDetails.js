const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const commonModule = require(appPath+'/src/modules/commonModule.js');
const inventoryModule = require(appPath+'/src/modules/inventoryModule.js');

var itemID;
var date = new Date();

$(document).ready(()=>{

    ipcRenderer.send('variable-request');

    ipcRenderer.on('variable-reply', function (event, args) {
        itemID = args[0];
        let temp = args[0].split('=');
        itemID = temp[1];

        let fromDate = commonModule.getDateTimestamp('firstDayOfThisMonth');
        let toDate = commonModule.getDateTimestamp('endOfToday');
        inventoryModule.getItemTransactionDetails(itemID, fromDate.getTime(), toDate.getTime(), (err, result)=>{
            if(err) {
                console.error(err);
                $('#contentDiv').html('Error loading data!');
            } else {
                let openingStock = result[0][0].openingStock;
                if(!openingStock)
                    openingStock = 0;
                let transactions = result[1];
                let uom = result[2][0];
                let resultHTML = `<h4>${uom.itemName}</h4>
                                    Subgroup: 
                                    <br />
                                    Group: 
                                    <br />

                                <table class="table table-sm table-light table-bordered table-hover">
                                    <thead>
                                        <tr class="text-center">
                                            <th>Date</th>
                                            <th>Opening Stock</th>
                                            <th>Receipts</th>
                                            <th>Issues</th>
                                            <th>Closing Stock</th>
                                            <th>Comments</th>
                                            <th>Username</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td class="text-right"><b>${commonModule.uomFormat(openingStock, uom)}</b></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>`;
                let receipts, issues, closingStock = [0,0,openingStock];
                for(let key in transactions) {
                    if(transactions[key].receipts > 0) {
                        receipts = transactions[key].receipts;
                        issues = 0;
                    } else {
                        receipts = 0;
                        issues = transactions[key].receipts * -1;
                    }
                    closingStock = openingStock+receipts-issues;
                    resultHTML += `<tr class="clickable transactionRow" id="row_${transactions[key].id}">
                                        <td class="text-center">${commonModule.normalDateFormat(transactions[key].datetime)}</td>
                                        <td></td>
                                        <td class="text-right">${(receipts ? commonModule.uomFormat(receipts, uom) : '')}</td>
                                        <td class="text-right">${(issues ? commonModule.uomFormat(issues, uom) : '')}</td>
                                        <td class="text-right">${commonModule.uomFormat(closingStock, uom)}</td>
                                        <td class="text-center smallFont">${commonModule.fold(transactions[key].comments, 30).join('<br />')}</td>
                                        <td class="text-center smallFont">${transactions[key].username}</td>
                                    </tr>`;
                }
                resultHTML += `<tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="text-right"><b>${commonModule.uomFormat(closingStock, uom)}</b></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                </tbody>
                            </table>`;
                $('#contentDiv').html(resultHTML);
            }
        });
    });

    // Load side menu
    commonModule.loadSideMenu('inventoryTransactions.html', (err, html)=>{
        $('#menuHolder').html(html);
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

window.onerror = function(error, url, line) {
    console.log(error);
};

$(document).on("click","tr.itemRow", function(e){
    let itemID = commonModule.getRowID(e);
    ipcRenderer.send('redirect-window', 'inventoryTransactionDetails.html', [`id=${itemID}`]);
});