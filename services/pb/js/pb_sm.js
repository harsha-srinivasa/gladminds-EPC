function get_sideMenu_data (URL) {
    $.ajax({
            type: 'GET',
            url : URL,
            dataType : 'json',
            success : function(sideMenus_data, status) {
                    create_sideMenu(sideMenus_data);
            },
            error : function(e) {
                    if(e.status == 401) {
            relogin();
        }
        console.log(e);
            }
    });
}


var create_sideMenu = function(sideMenus_data) {
    $("#bajaj-logo").attr("src", sideMenus_data.header_logo);
    
    profile_img = "../../"+user_details.profile_image;

    var menus = '<li class="side-user">\
                    <img id="profile_img"  class="img-responsive" src='+profile_img+' alt="">\
                    <p class="welcome"><i class="fa fa-key">\
                        </i> Logged in as\
                    </p>\
                    <div class="col-md-12 name tooltip-sidebar-logout text-center padding-zero user_name">'+user_details.name+'\
                        <a class="bajaj-user-logout text-right" class="logout_open" href="#logout" data-toggle="tooltip" data-placement="top" title="Logout"><i class="fa fa-sign-out" data-toggle="modal" data-target="#logout-window"></i></a></div>\
                    <div class="clearfix"></div>\
                </li>';

    for(var m=0; m<sideMenus_data.legend.length;m++) {
        var option_name = sideMenus_data.legend[m].option_name;
        var option_ID = sideMenus_data.legend[m].option_ID;

        menus+='<li><a style="color:'+sideMenus_data.font_color+';background:'+sideMenus_data.bg_color+';" class="side-menus" href="#'+option_ID+'">'+sideMenus_data.legend[m].option_name+'</a></li>';

    }

    if ( user_details.role == 'admin') {
        menus+='<li><a style="color:'+sideMenus_data.font_color+';background:'+sideMenus_data.bg_color+';" class="side-menus" href="../../admin?vcl=mc">Admin</a></li>';
    }

    $("#side").append(menus);

    $("#side").css("display", "block");
    $('#logout-modal-img').append('<img id="logout_window_img" class="img-responsive" src='+profile_img+' alt="">');

}
