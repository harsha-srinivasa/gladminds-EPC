$(document).ready(function(){
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
                get_probiking_categories();
                //load_sideMenus();
                get_sideMenu_data('api/pb_subcategory_menu');
            } else {
                window.location.href = "/";
            }
        },
        error : function ( data, res ) {
            console.log('Failed');
        }
    });
    show_version('../../json/');
});

function get_probiking_categories () {
    var page_url = window.location.href;
    getParameterByName(page_url);
    pageID = getParameterByName('model');
    model_name = getParameterByName('model_name');
	
	$.ajax({
		type : 'GET',
		url : '../../apis/index.php?action=getKtmCategories&modelID='+pageID,
		dataType : 'json',
		success : function(category, status) {
            if ( category.msg == 'Failure' ) {
                window.location = '../../services/index.html';
                return;
            }
			create_category_blocks(category);
            $('body').css('display', 'block');
		},
		error : function(e) {
			console.log(e)
		}
	});
	
		
	$('footer').css('margin', '20px auto');
	$('footer').css('position', 'relative');
	
	var breadcrumb = '<ul class="crumbs">\
                            <li class="first"><a href="../index.html" style="z-index:10;"><span></span>Home</a></li>\
                            <li class="first"><a href="index.html" style="z-index:9;"><span></span>Models</a></li>\
                            <li class="first"><a href="#" style="z-index:8;"><span></span>'+model_name+'</a></li>\
                        </ul>';
                        
    $("#breadcrumb").append(breadcrumb);

}


function create_category_blocks(category) {
	console.log(category);
	var cat = category.legend;
	var first_plate_id = category.first_plate_id;
	var last_plate_id = category.last_plate_id;
    for(var index=0; index < cat.length;index++) {

        if(cat[index].status > 0) {
            moreinfo = "sbom.html?categoryID="+cat[index].category_id+"&modelID="+pageID+"&model_name="+model_name+"&category_name="+cat[index].plate_name+"&first_plate_id="+first_plate_id+"&last_plate_id="+last_plate_id;
			
			pictorial_index = '<div class="col-lg-3 plates_dashbox">\
            <div class="portlet portlet-default plate_block"><a class="plateSearch_key" href="'+moreinfo+'">\
                <div id="defaultPortlet" class="panel-collapse collapse in" data-toggle="tooltip" title="'+cat[index].plate_name+'" >\
                    <div class="portlet-body auto-img-block highlight-icons">\
                    <span class="coming-soon" style="display: none">Coming Soon</span>\
                        <img src="img/'+cat[index].img_url+'" class="img-responsive">\
                </div>\
                <div class="portlet-footer ktm-plates-footer">'+cat[index].plate_name+'</div>\
            </div>\
        </div>';
        } else {
			pictorial_index = '<div class="col-lg-3 plates_dashbox">\
            <div class="portlet portlet-default plate_block">\
                <div id="defaultPortlet" class="panel-collapse collapse in" data-toggle="tooltip" title="'+cat[index].plate_name+'" >\
                    <div class="portlet-body auto-img-block">\
                    <span class="coming-soon" style="display: block">Coming Soon</span>\
                        <img src="img/'+cat[index].img_url+'" class="img-responsive">\
                </div>\
                <div class="portlet-footer ktm-plates-footer">'+cat[index].plate_name+'</div>\
            </div>\
        </div>';
        }
        
        $("#pictorial_area").append(pictorial_index);  
    }
    

    $("#dashboard").css("display", "block");
    $("#dashboard").css("visibility", "visible"); 
    $("#dashboard_area").css("display", "block");


    $( '#pictorial_area' ).searchable({
        searchField: '#plate_search',
        selector: '.plates_dashbox',
        childSelector: '.plateSearch_key',

        
        show: function( elem ) {
            elem.slideDown(100);
        },
        hide: function( elem ) {
            elem.slideUp( 100 );
        }
    });

}

/*
function load_sideMenus() {
    $.ajax({
        type: 'GET',
        url: 'api/ktm_subcategory_menu',
        dataType: 'json',
        success: function(sideMenus_data, status) {

            $("#bajaj-logo").attr("src", sideMenus_data.header_logo);

            var profile_img = '../'+user_details.profile_image;
            var user = user_details.name;

            var menus = '<li class="side-user hidden-xs"><img class="img-responsive" src=' + profile_img + ' alt=""><p class="welcome"><i class="fa fa-key"></i> Logged in as</p><div class="col-md-12 name tooltip-sidebar-logout text-center padding-zero user_name">' + user + '</div><div class="col-md-12 padding-zero user_logout text-left"><a class="bajaj-user-logout text-right" style="color: inherit" class="logout_open" href="#logout" data-toggle="tooltip" data-placement="top" title="Logout"><i class="fa fa-sign-out" data-toggle="modal" data-target="#logout-window">Logout</i></a></div><div class="clearfix"></div></li>';

            for (var m = 0; m < sideMenus_data.legend.length; m++) {
                var option_name = sideMenus_data.legend[m].option_name;
                var option_ID = sideMenus_data.legend[m].option_ID;

                menus += '<li><a style="color:' + sideMenus_data.font_color + ';background:' + sideMenus_data.bg_color + ';" class="side-menus" href="#' + option_ID + '">' + sideMenus_data.legend[m].option_name + '</a></li>';

            }

            menus += '<li><a style="color:#FFF;background:'+sideMenus_data.bg_color+';" class="profile side-menus side-menu-tabs" href="../../epc_admin/profile/">Profile<a></li>';



            $("#side").append(menus);
            $("#side").css("display", "block");
            $("#dfsc-userImg").css("display", "block");

            var hashed_value = window.location.hash.substr(1);
        },
        error: function(e) {
            if (e.status == 401) {
                relogin();
            }
            console.log(e);
        }
    });
}
*/


