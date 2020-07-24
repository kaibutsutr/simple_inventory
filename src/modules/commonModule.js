exports.loadSideMenu = function(currentPage, callback) {
    let resultHTML = `<ul class="list-unstyled components">
                        <li>
                            <a href="#inventoryMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                Inventory
                            </a>
                            <ul class="collapse list-unstyled" id="inventoryMenu">
                                <li>
                                    <a href="#">Current Inventory</a>
                                </li>
                                <li>
                                    <a href="#">Inventory Transactions</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#masterMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                Inventory Master
                            </a>
                            <ul class="collapse list-unstyled" id="masterMenu">
                                <li>
                                    <a href="#">Groups</a>
                                </li>
                                <li>
                                    <a href="#">Subgroups</a>
                                </li>
                                <li>
                                    <a href="#">Items</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#valuationsMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                Valuations
                            </a>
                            <ul class="collapse list-unstyled" id="valuationsMenu">
                                <li>
                                    <a href="#">Saved Valuations</a>
                                </li>
                                <li>
                                    <a href="#">New Valuation</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#usersMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                Users
                            </a>
                            <ul class="collapse list-unstyled" id="usersMenu">
                                <li>
                                    <a href="template.html">Users</a>
                                </li>
                                <li>
                                    <a href="#">Usergroups</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#accountMenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                                My Account
                            </a>
                            <ul class="collapse list-unstyled" id="accountMenu">
                                <li>
                                    <a href="#">My Account</a>
                                </li>
                                <li>
                                    <a href="#">Logout</a>
                                </li>
                            </ul>
                        </li>
                    </ul>`;
    if(currentPage=='index')
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