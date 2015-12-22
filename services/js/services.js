$(document).ready(function(){
    $.ajax({
        url  : "../apis/get_user_details.php?action=get_user_details",
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
        url: '../apis/get_user_details.php?action=get_permission',
        dataType: 'json',
        success: function(mainMenu_data, status){
            show_breadcrumb();
            get_icons_data(mainMenu_data);
            $('body').css('display', 'block');
            show_version('../json/');
        },
        error : function ( data, res ) {
            console.log(data);
        }
    });
}

function get_icons_data ( show_icons ) {
    $.ajax({
        type: 'GET',
        url: '../json/services.json',
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function(mainMenu_data, status){

            var box_id = [{"id" : "1"},{"id" : "2"},{"id" : "3"},{"id" : "4"}]

            var header_logo = '<img id="bajaj-logo" class="img-responsive" src='+mainMenu_data.brand_logo+' alt="Bajaj">';
            $(".header_logo_menu").append(header_logo)

            var imgPath = user_details.profile_image;
            var user = user_details.name;

            $('.page-title h1').html( 'Welcome, '+'<span id="user-login-name">'+user_details.name+'</span>'); 

            get_sideMenu_data ('../json/mc_sm');

            for (var i=0;i<mainMenu_data.legends.length;i++) {
                var option_code= mainMenu_data.legends[i].option_code;

		if ( 
			( ( option_code == 'mc' ) && parseInt(show_icons.mc) ) ||
			( ( option_code == 'cv' ) && parseInt(show_icons.cv) ) ||
			( ( option_code == 'pb' ) && parseInt(show_icons.pb) ) ||
			( ( option_code == 'ib' ) && parseInt(show_icons.ib) ) 
		) {

			var option_name = mainMenu_data.legends[i].option_name;
			var className = mainMenu_data.legends[i].className;
			var url = mainMenu_data.legends[i].img_path;

			var main_html = '<div class="col-lg-3 col-xs-8 col-sm-5 options-block links_blk_'+box_id[i].id+'"><div class="clearfix menuTable-wrapper"><div class="portlet '+className+' "><div class="portlet-heading"><div class="portlet-title"><h4>'+option_name+'</h4></div><div class="clearfix"></div></div><div id="orangePortlet" class="panel-collapse collapse in"><div class="portlet-body body'+i+'"><ul class="menu-options-list">';

			for(var j=0;j<mainMenu_data.legends[i].url.length;j++) {

			    var service_name = mainMenu_data.legends[i].url[j].name;
			    var service_url = mainMenu_data.legends[i].url[j].href;

			    if(service_url != "#") {
				main_html +='<li style="display:inline-flex"><i class="fa fa-arrow-right mainMenu-arrow"></i><a href="'+service_url+'">'+service_name+'</a><img class="new_link_symbol img-responsive" src="../img/new.png"/></li>';    
			    } else {
				main_html +='<li><i class="fa fa-arrow-right mainMenu-arrow"></i><a href="'+service_url+'">'+service_name+'</a></li>';
			    }
			}

			main_html+='</ul></div><img class="category-image" src="'+url+'"></div></div></div></div>';

			$("#mainMenu-area").append(main_html);  

		    }
              }

           
        },
        error : function(e) {
            console.log(e)
        }
    });
}


function show_breadcrumb ( ) {
    $("#breadcrumb").text('');
    if ( user_details.role == 'staff') {
        var bc = '<li class="first"><a href="../staff/index.html" style="z-index:9;"><span></span>Home</a></li>\
                  <li class="first"><a href="#" style="z-index:8;"><span></span>Services</a></li>';
        $("#breadcrumb").append(bc);
    }
}
