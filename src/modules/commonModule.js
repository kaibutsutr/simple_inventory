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