$(document).ready(function(){
    $.ajax({
        url  : "apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
           if ( data.status == 'Success' ) {
               user_details = data;
	           get_permissions();
           } else {
               window.location.href = "/";
           }
        },
        error : function ( data, res ) {
            console.log('Failed');
        }
    });
});

function get_permissions () {
    $.ajax({
        type: 'GET',
        url: 'apis/get_user_details.php?action=get_permission',
        dataType: 'json',
        success: function(mainMenu_data, status){
            show_breadcrumb();
            get_sideMenu_data ('json/mc_sm');
            $('body').css('display', 'block');
            show_version('json/');
        },
        error : function ( data, res ) {
            console.log(data);
        }
    });
}

function show_breadcrumb ( ) {
    $("#breadcrumb").text('');
    var bc = '<li class="first"><a href="services/index.html" style="z-index:9;"><span></span>Home</a></li>\
              <li class="first"><a href="#" style="z-index:8;"><span></span>Profile</a></li>';
    $("#breadcrumb").append(bc);
}
