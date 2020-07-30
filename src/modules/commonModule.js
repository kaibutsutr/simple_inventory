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
        case 'savedValuations.html':
        case 'newValuation.html':
            mainPage = 'valuations';
            break;
        case 'users.html':
        case 'usergroups.html':
            mainPage = 'users';
            break;
        case 'myAccount.html':
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
                            <ul class="collapse list-unstyled" id="valuationsMenu">
                                <li>
                                    <a href="valuations.html"><i class="fa fa-usd"></i> Saved Valuations</a>
                                </li>
                                <li>
                                    <a href="newValuations.html"><i class="fa fa-viacoin"></i> New Valuation</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#usersMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                <i class="fa fa-user"></i> Users
                            </a>
                            <ul class="collapse list-unstyled" id="usersMenu">
                                <li>
                                    <a href="users.html"><i class="fa fa-user"></i> Users</a>
                                </li>
                                <li>
                                    <a href="userGroups.html"><i class="fa fa-users"></i> Usergroups</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#accountMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                <i class="fa fa-universal-access"></i> My Account
                            </a>
                            <ul class="collapse list-unstyled" id="accountMenu">
                                <li>
                                    <a href="myAccount.html"><i class="fa fa-universal-access"></i> My Account</a>
                                </li>
                                <li>
                                    <a href="logout.html"><i class="fa fa-power-off"></i> Logout</a>
                                </li>
                            </ul>
                        </li>
                    </ul>`;

    callback(null, resultHTML);
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
    let test = num.toLocaleString('en-IN', {maximumFractionDigits: roundoff, minimumFractionDigits:roundoff});
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
}

exports.decreaseFontSize = ()=>{
    let currentSize = require('electron').remote.getGlobal('sharedObject').fontSize;
    currentSize -= 2;
    require('electron').remote.getGlobal('sharedObject').fontSize = currentSize;
    $(document.body).css('fontSize', currentSize+'px');
}

exports.setFontSize = ()=>{
    let currentSize = require('electron').remote.getGlobal('sharedObject').fontSize;
    $(document.body).css('fontSize', currentSize+'px');
}

exports.getDateTimestamp = (description)=>{
    let date,d,m,y;
    switch(description) {
        case 'firstDayOfThisMonth':
            date = new Date();
            d = 01;
            m = date.getMonth()+1;
            y = date.getFullYear();
            let newDate = new Date(`${m}-${d}-${y}`);
            return newDate;
            break;

        case 'endOfToday':
            date = new Date();
            d = date.getDate()+1;
            m = date.getMonth()+1;
            y = date.getFullYear();
            let tomorrow = new Date(`${m}-${d}-${y}`);
            return new Date(tomorrow.getTime()-1);
    }
}

exports.normalDateFormat = (timestamp) => {
    let date = new Date(timestamp);
    let d,m,y;
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    d = date.getDate();
    m = months[date.getMonth()];
    y = date.getFullYear();
    return `${d} ${m}, ${y}`;
}

exports.fold = (input, lineSize, lineArray) => {
    lineArray = lineArray || [];
    if (input.length <= lineSize) {
        lineArray.push(input);
        return lineArray;
    }
    lineArray.push(input.substring(0, lineSize));
    var tail = input.substring(lineSize);
    return commonModule.fold(tail, lineSize, lineArray);
}