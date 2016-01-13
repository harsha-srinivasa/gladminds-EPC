function get_side_menu_data ( ) {
	$.ajax({
		type: 'GET',
		url : 'api/ktm_sideMenu',
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

    var profile_img = '../'+user_details.profile_image;
    var user = user_details.name;

    var menus = '<li class="side-user hidden-xs"><img class="img-responsive" src='+profile_img+' alt=""><p class="welcome"><i class="fa fa-key"></i> Logged in as</p><div class="col-md-12 name tooltip-sidebar-logout text-center padding-zero user_name">'+user+'</div><div class="col-md-12 padding-zero user_logout text-left"><a class="bajaj-user-logout text-right" style="color: inherit" class="logout_open" href="#logout" data-toggle="tooltip" data-placement="top" title="Logout"><i class="fa fa-sign-out" data-toggle="modal" data-target="#logout-window">Logout</i></a></div><div class="clearfix"></div></li>';

    for(var m=0; m<sideMenus_data.legend.length;m++) {
        var option_name = sideMenus_data.legend[m].option_name;
        var option_ID = sideMenus_data.legend[m].option_ID;

        menus+='<li><a style="color:'+sideMenus_data.font_color+';background:'+sideMenus_data.bg_color+';" class="side-menus" href="#'+option_ID+'">'+sideMenus_data.legend[m].option_name+'</a></li>';

    }
    menus += '<li><a style="color:#FFF;background:'+sideMenus_data.bg_color+';" class="side-menus side-menu-tabs" href="../../epc_admin/profile/">Profile<a></li>';


    $("#side").append(menus);
    $("#side").css("display", "block");
    $("#dfsc-userImg").css("display", "block");

    var hashed_value = window.location.hash.substr(1);
}
