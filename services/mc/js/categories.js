$(document).ready(function(){
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
	            get_bike_categories();
            } else {
                window.location.href = "/";
            }
        },
        error : function ( data, res ) {
            console.log('Failed');
        }
    });
    show_version('../../json/')
});

function get_bike_categories () {
    var page_url = window.location.href;
    getParameterByName(page_url);
    modelID = getParameterByName('model');
    model_name = getParameterByName('model_name');

    var breadcrumb = '<ul class="crumbs">\
                            <li class="first"><a href="../index.html" style="z-index:9;"><span></span>Home</a></li>\
                            <li class="first"><a href="index.html" style="z-index:8;"><span></span>Models</a></li>\
                            <li class="first"><a href="#" style="z-index:7;"><span></span>'+model_name+'</a></li>\
                        </ul>';

    $("#breadcrumb").append(breadcrumb);

    $.ajax({
        type : 'GET',
        url : '../../apis/index.php?action=getmcbikecategories&model='+modelID,
        dataType : 'json',
        success : function(category, status) {
            if ( category.msg == 'success' ) {
                  create_category_blocks(category);
                  profile_img = '../'+user_details.profile_image;
                  url = '../../json/mc_sideMenu';
                  get_sideMenu_data(url);
                  $('body').css('display', 'block');
            } else {
                window.location = '../../services/index.html';
            }
        },
        error : function(e) {
               console.log(e)
        }
    });
}

function create_category_blocks(category) {
	var cat = category.legend;
    for(var index=0; index < cat.length;index++) {
        if(cat[index].status > 0) {
            moreinfo = "subcategories.html?model="+modelID+"&category="+cat[index].category_id+"&category_name="+cat[index].category_name+"&model_name="+model_name;
			pictorial_index = '<div class="col-lg-3 plates_dashbox"><a class="plateSearch_key" href="'+moreinfo+'">\
            <div class="portlet portlet-default plate_block">\
                <div id="defaultPortlet" class="panel-collapse collapse in">\
                    <div class="portlet-body auto-img-block highlight-icons">\
                    <span class="coming-soon" style="display: none">Coming Soon</span>\
                        <img src="img/'+cat[index].img_url+'" class="img-responsive dashboard-img">\
                </div>\
                <div class="portlet-footer mc-plates-footer">'+cat[index].category_name+'</div>\
            </div>\
        </div>';
        } else {
			pictorial_index = '<div class="col-lg-3 plates_dashbox">\
            <div class="portlet portlet-default plate_block">\
                <div id="defaultPortlet" class="panel-collapse collapse in">\
                    <div class="portlet-body auto-img-block">\
                    <span class="coming-soon" style="display:block">Coming Soon</span>\
                        <img src="img/'+cat[index].img_url+'" class="img-responsive dashboard-img">\
                </div>\
                <div class="portlet-footer mc-plates-footer">'+cat[index].category_name+'</div>\
            </div>\
        </div>';
        }       
        $("#pictorial_area").append(pictorial_index);  
    }
    

    $("#dashboard").css("display", "block");
    $("#dashboard").css("visibility", "visible"); 
    $("#dashboard_area").css("display", "block");
}
