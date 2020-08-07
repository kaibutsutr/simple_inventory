const moment = require('moment');
const md5 = require('md5');

exports.loadSideMenu = function(currentPage, callback) {
    
    let mainPage = '';
    switch(currentPage) {
        case 'index.html':
        case 'inventoryTransactions.html':
            mainPage = 'inventory';
            break;
        case 'groups.html':
        case 'subgroups.html':
        case 'items.html':
        case 'uom.html':
            mainPage = 'inventoryMaster';
            break;
        case 'valuations.html':
        case 'valuationsNew.html':
            mainPage = 'valuations';
            break;
        case 'users.html':
        case 'usertypes.html':
            mainPage = 'users';
            break;
        case 'dbSettings.html':
        case 'userSettings.html':
        case 'createDB.html':
        case 'logout.html':
            mainPage = 'myAccount';
            break;  
    }
    
    let resultHTML = `<ul class="list-unstyled components">
                        <li>
                            <a href="#inventoryMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                <i class="fa fa-university"></i> Inventory
                            </a>
                            <ul class="collapse `+((mainPage=='inventory') ? `show` : ``)+` list-unstyled" id="inventoryMenu">
                                <li `+((currentPage=='index.html') ? `class="active"` : ``)+`>
                                    <a href="index.html">
                                        <i class="fa fa-university"></i>
                                        Current Inventory
                                    </a>
                                </li>
                                <li `+((currentPage=='inventoryTransactions.html') ? `class="active"` : ``)+`>
                                    <a href="inventoryTransactions.html"><i class="fa fa-arrows-h"></i> Inventory Transactions</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#masterMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                <i class="fa fa-cogs"></i> Inventory Master
                            </a>
                            <ul class="collapse `+((mainPage=='inventoryMaster') ? `show` : ``)+` list-unstyled" id="masterMenu">
                                <li `+((currentPage=='groups.html') ? `class="active"` : ``)+`>
                                    <a href="groups.html"><i class="fa fa-folder-open"></i> Groups</a>
                                </li>
                                <li `+((currentPage=='subgroups.html') ? `class="active"` : ``)+`>
                                    <a href="subgroups.html"><i class="fa fa-dot-circle-o"></i> Subgroups</a>
                                </li>
                                <li `+((currentPage=='items.html') ? `class="active"` : ``)+`>
                                    <a href="items.html"><i class="fa fa-file"></i> Items</a>
                                </li>
                                <li `+((currentPage=='uom.html') ? `class="active"` : ``)+`>
                                    <a href="uom.html"><i class="fa fa-balance-scale"></i> UOM</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#valuationsMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                <i class="fa fa-usd"></i> Valuations
                            </a>
                            <ul class="collapse `+((mainPage=='valuations') ? `show` : ``)+` list-unstyled" id="valuationsMenu">
                                <li `+((currentPage=='valuations.html') ? `class="active"` : ``)+`>
                                    <a href="valuations.html"><i class="fa fa-usd"></i> Saved Valuations</a>
                                </li>
                                <li `+((currentPage=='valuationsNew.html') ? `class="active"` : ``)+`>
                                    <a href="valuationsNew.html"><i class="fa fa-viacoin"></i> New Valuation</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#usersMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                <i class="fa fa-user"></i> Users
                            </a>
                            <ul class="collapse `+((mainPage=='users') ? `show` : ``)+` list-unstyled" id="usersMenu">
                                <li `+((currentPage=='users.html') ? `class="active"` : ``)+`>
                                    <a href="users.html"><i class="fa fa-user"></i> Users</a>
                                </li>
                                <li `+((currentPage=='usertypes.html') ? `class="active"` : ``)+`>
                                    <a href="usertypes.html"><i class="fa fa-users"></i> Usertypes</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#accountMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                <i class="fa fa-universal-access"></i> My Settings
                            </a>
                            <ul class="collapse `+((mainPage=='myAccount') ? `show` : ``)+` list-unstyled" id="accountMenu">
                                <li `+((currentPage=='dbSettings.html') ? `class="active"` : ``)+`>
                                    <a href="dbSettings.html"><i class="fa fa-cog"></i> DB Settings</a>
                                </li>
                                <li `+((currentPage=='userSettings.html') ? `class="active"` : ``)+`>
                                    <a href="userSettings.html"><i class="fa fa-user"></i> User Settings</a>
                                </li>
                                <li `+((currentPage=='createDB.html') ? `class="active"` : ``)+`>
                                    <a href="createDB.html"><i class="fa fa-database"></i> Create DB</a>
                                </li>
                                <li `+((currentPage=='logout.html') ? `class="active"` : ``)+`>
                                    <a href="logout.html"><i class="fa fa-power-off"></i> Logout</a>
                                </li>
                            </ul>
                        </li>
                    </ul>`;

    callback(null, resultHTML);
}

exports.encryptPassword = function(password) {
    require('md5');
    return md5(password+'simple_inventory');
}

exports.saveToFile = function(data, filePath) {
    console.log('Saving file...\n'+filePath);
    fs.writeFileSync(filePath, data, (err) => {
        if(err)
            console.log(err);
    });
}

exports.getSavedData = function(savedDataPath) {
    console.log('Fetching file...\n'+savedDataPath);
    let returnData = "{}";
    try {
        returnData = fs.readFileSync(savedDataPath, 'utf8');
    } catch(err) {
        return '';
    }

    return returnData;
}

exports.getValidValue = function(fieldID) {
    var field = $('#'+fieldID);
    if(field.val()=='') {
        field.addClass('is-invalid');
        return '';
    } else {
        field.removeClass('is-invalid');
        return field.val();
    }
}

exports.navigate = function(origin, sens) {
    var inputs = $(document).find('.inputField');
    var index = inputs.index(origin);
    index += sens;
    if (index < 0) {
        index = inputs.length - 1;
    }
    if (index > inputs.length - 1) {
        index = 0;
    }
    
    inputs.eq(index).focus();
}

exports.getRowID = function(e) {
    let tr = $(e.target);
    // Iterate through parents until you get TR
    while(tr.prop('tagName')!='TR') {
        tr = tr.parent();
    }
    let rowID = tr.prop('id');
    let temp = rowID.split('_');
    return(temp[1]);    
}

exports.toggleRowSelection = function(rowID) {
    if($('#row_'+rowID).hasClass('selectedRow'))
        $('#row_'+rowID).removeClass('selectedRow');
    else
        $('#row_'+rowID).addClass('selectedRow');    
}

exports.showAlert = function(msg) {
    console.log(msg);
    $('#alertMessage').html(msg);
    $("#alertContainer").fadeTo(2000, 500).slideUp(500, function(){
        $("#alertContainer").slideUp(500);
    });
}

exports.uomFormat = function(qty, uom) {
    if(uom) {
        return `${(uom.prefix ? uom.prefix : '')} ${(commonModule.indianNumberFormat(qty, uom.roundoff))} ${(uom.postfix ? uom.postfix : '')}`;
    } else {
        return qty;
    }
}

exports.indianNumberFormat = function(num, roundoff) {
    let test = num.toLocaleString('en-IN', {maximumFractionDigits: roundoff, minimumFractionDigits: roundoff});
    return(test);
}

exports.checkLoggedIn = (callback) => {
    let sessionURL = require('electron').remote.getGlobal('sharedObject').sessionURL;
    require('electron').remote.session.defaultSession.cookies.get({url:sessionURL})
    .then((cookies)=>{
        if(Object.keys(cookies).length > 0) {
            // Iterate through cookies to search for username
            for(let i in cookies) {
                if(cookies[i].name=='username') {
                    callback('', cookies[i].value);
                }
            }
        }
    }).catch((err)=>{
        console.error(err);
    })
}

exports.increaseFontSize = ()=>{
    let currentSize = require('electron').remote.getGlobal('sharedObject').fontSize;
    currentSize += 2;
    require('electron').remote.getGlobal('sharedObject').fontSize = currentSize;
    $(document.body).css('fontSize', currentSize+'px');
    let userSettings = require('electron').remote.getGlobal('sharedObject');
    require('fs').writeFileSync(path.join(appPath, 'src', 'misc', 'userSettings'), JSON.stringify(userSettings));
    $('#fontSize').val(currentSize);
}

exports.decreaseFontSize = ()=>{
    let currentSize = require('electron').remote.getGlobal('sharedObject').fontSize;
    currentSize -= 2;
    require('electron').remote.getGlobal('sharedObject').fontSize = currentSize;
    $(document.body).css('fontSize', currentSize+'px');
    let userSettings = require('electron').remote.getGlobal('sharedObject');
    require('fs').writeFileSync(path.join(appPath, 'src', 'misc', 'userSettings'), JSON.stringify(userSettings));
    $('#fontSize').val(currentSize);
}

exports.fold = (input, lineSize, lineArray) => {
    if(!input)
        return '';

    lineArray = lineArray || [];
    if (input.length <= lineSize) {
        lineArray.push(input);
        return lineArray;
    }
    lineArray.push(input.substring(0, lineSize));
    var tail = input.substring(lineSize);
    return commonModule.fold(tail, lineSize, lineArray);
}

exports.currencyFormat = (value)=>{
    return `Rs. ${value}`;
}

exports.getMonthsDropdownOptions = (currentMonth)=>{
    // backwards: Currentmonth - 2 years 
    // forwards: currentMonth to present month
    let backYears = 2;
    let current = currentMonth.clone();
    current.subtract(backYears, 'years');
    let end = moment().startOf('month');
    let result = '';

    let selected;
    while(current.add(1, 'month').diff(end) <= 0) {
        selected = '';
        if(currentMonth.diff(current)==0)
            selected = ' selected="selected"';
        result += `<option value="${current.format('YYYY-MM-DD')}" ${selected}>${current.format('MMM YYYY')}</option>`;
    }
    return result;
}

exports.currency = (num, noOfDecimals=2)=>{
    noOfDecimals = noOfDecimals * 10;
    amount = Math.round(num * noOfDecimals) / noOfDecimals;
    amount = amount.toLocaleString('en-IN');
    return ('Rs. '+amount);
}

exports.round = (num, noOfDecimals=2)=>{
    noOfDecimals = noOfDecimals * 10;
    return (Math.round(num * noOfDecimals) / noOfDecimals);
}

exports.getQuickMenu = (callback)=>{
    let username = '';
    commonModule.checkLoggedIn((err, result)=>{
        if(!err)
            username = result;

        let resultHTML = '';
        let db = require('electron').remote.getGlobal('sharedObject').db;
        db = '...'+db.substr(db.length - 20);
        resultHTML += `<div class="d-flex p-2">
                            <div class="p-2 border">Logged in: <b>${username}</b></div>
                            <div class="p-2 border">DB: <b>${db}</b></div>
                            <div class="p-2 border"><i class="fa fa-power-off"></i> <a href="logout.html">Logout</a></div>
                        </div>`;
        callback('', resultHTML);
    })
}

exports.validatePassword = (password)=>{
    let minNumberofChars = 6;
    let maxNumberofChars = 16;
    if(password.length < minNumberofChars || password.length > maxNumberofChars) {
        return false;
    }

    let regEx = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/;
    if(!regEx.test(password)) {
        return false;
    }

    return true;
}

exports.checkDBCompatibility = (version, dbVersion)=>{
    version = (version+'').split('.');
    dbVersion = (dbVersion+'').split('.');
    if(version[0]==dbVersion[0] && version[1]==dbVersion[1])
        return true;
    else
        return false;
}