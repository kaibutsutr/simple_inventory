const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const app = remote.app;
const myPath = app.getPath('userData');
const appPath = app.getAppPath();

const commonModule = require(appPath+'/src/modules/commonModule.js');
const inventoryModule = require(appPath+'/src/modules/inventoryModule.js');

$(document).ready(()=>{

    let additionalArgs = window.process.argv;
    for(let needle of additionalArgs) {
        if(needle.search('id=')===0) {
            let temp = needle.split('=');
            itemID = temp[1];
        }
    }
    alert(itemID);

    // Load side menu
    commonModule.loadSideMenu('index', (err, html)=>{
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