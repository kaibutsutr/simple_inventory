const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const commonModule = require(appPath+'/src/modules/commonModule.js');
const inventoryModule = require(appPath+'/src/modules/inventoryModule.js');

var itemID, receipt, itemName, month;

$(document).ready(()=>{

    let additionalArgs = window.process.argv;
    for(let needle of additionalArgs) {
        if(needle.search('id=')===0) {
            let temp = needle.split('=');
            itemID = temp[1];
        }

        if(needle.search('receipt=')===0) {
            let temp = needle.split('=');
            receipt = temp[1];
        }

        if(needle.search('itemName=')===0) {
            let temp = needle.split('=');
            itemName = temp[1];
        }

        if(needle.search('month=')===0) {
            let temp = needle.split('=');
            month = temp[1];
        }
    }

    console.log(`itemID: ${itemID} & receipt: ${receipt} & itemName: ${itemName} & month: ${month}`);

    let resultHTML = `<div class="form-group row text-center" style="width:100%;">
                            <div class="text-center col-md-12 col-lg-12"><b>New Inventory Receipt</b></div>
                        </div>
                        <div class="row form-group" style="width:100%;">
                            <div class="col-md-3 col-lg-3 text-right">
                                Item
                            </div>
                            <div class="col-md-9 col-lg-9">
                                ${itemName}
                            </div>
                        </div>
                        <div class="form-group row" style="width:100%;">
                            <div class="col-md-3 col-lg-3 text-right">
                                <label class="col-form-label">Date</label>
                            </div>
                            <div class="col-md-9 col-lg-9">
                                <input type="text" id="date" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group row" style="width:100%;">
                            <div class="col-md-3 col-lg-3 text-right">
                                <label class="col-form-label">Receipt Qty</label>
                            </div>
                            <div class="col-md-9 col-lg-9">
                                <input type="text" id="receipt" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group row" style="width:100%;">
                            <div class="col-md-3 col-lg-3 text-right">
                                <label class="col-form-label">Unit Price</label>
                            </div>
                            <div class="col-md-9 col-lg-9">
                                <input type="text" id="unitValue" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group row" style="width:100%;">
                            <div class="col-md-3 col-lg-3 text-right">
                                <label class="col-form-label">Comments</label>
                            </div>
                            <div class="col-md-9 col-lg-9">
                                <input type="text" id="comments" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group row" style="width:100%;">
                            <div class="col-md-3 col-lg-3 text-right">
                                <label class="col-form-label">Username</label>
                            </div>
                            <div class="col-md-9 col-lg-9">
                                <input type="text" id="receipt" class="form-control" readonly value="jacob" />
                            </div>
                        </div>
                        <div class="container text-center" style="width:100%">
                            <button class="btn btn-secondary" id="editGroup" onclick="createGroup()">Save</button>
                            <button class="btn btn-secondary" id="cancel" onclick="cancelDialog()">Cancel</button>
                        </div>`;
    $('#contentDiv').html(resultHTML);
    $('#date').datetimepicker({
        timepicker: false,
        format: 'd-m-Y'
    });
});

function cancelDialog() {
    remote.getCurrentWindow()
        .close();
}