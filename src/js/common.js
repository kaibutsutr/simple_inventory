$(document).ready(()=>{
    
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    commonModule.getQuickMenu((err, data)=>{
        if(err) {
            console.log(err);
            $('#quickMenuHolder').html('Error fetching data');
        } else {
            $('#quickMenuHolder').html(data);
        }
    })
})