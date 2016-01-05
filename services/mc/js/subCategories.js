$(document).ready(function(){
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
                get_plates();
            } else {
                window.location.href = "/";
            }

        },
        error : function ( data, res ) {
            console.log('Failed');
            window.location.href = "/";
        }
    });

    show_version('../../json/');
});

function get_plates () {
    var page_url = window.location.href;
    getParameterByName(page_url);
    modelID = getParameterByName('model');
    category_id = getParameterByName('category');
    category_name = getParameterByName ( 'category_name' );
    model_name = getParameterByName ( 'model_name' );
        
                
    $('footer').css('margin', '20px auto');
    $('footer').css('position', 'relative');

    var breadcrumb = '<ul class="crumbs">\
                            <li class="first"><a href="../index.html" style="z-index:9;"><span></span>Home</a></li>\
                            <li class="first"><a href="index.html" style="z-index:8;"><span></span>Model</a></li>\
                            <li class="first"><a href="categories.html?model='+modelID+'&model_name='+model_name+'" style="z-index:7;"><span></span>'+model_name+'</a></li>\
                            <li class="first"><a href="#" style="z-index:6;"><span></span>'+category_name+'</a></li>\
                        </ul>';
    $("#breadcrumb").append(breadcrumb);

    //load_sideMenus();
    //create_notice_board();

    create_circulars();
    profile_img = '../'+user_details.profile_image;
    url = '../../json/mc_subcategory_menu';
    get_sideMenu_data(url);
    $('body').css('display', 'block');

    if(modelID == 2) {
        create_avengerIndex();
    } else if ( ( modelID == 1 ) && ( category_id == 1 ) ) {
       get_approved_plates ();
    }  else {
        create_partIndex();    
    }
    
}

function get_approved_plates () {
    var data = {
        "sku_code":"00DH15ZZ",
        "bom_number":"00211760" 
    }

console.log('enter');
    $.ajax({
        type : 'GET',
        url : "//192.168.0.62:8000/v1/visualisation-upload-history/approved-history/?access_token="+user_details.at,
        dataType : 'json',
        data : data,
	beforeSend : function(){
            showLoading();
        },
        success : function(res, status) {
            ss = res;
	    console.log('finishe');
            hideLoading();
        },
        error : function(e) {
            console.log(e.status)
            hideLoading();
        }
    });
}

function create_notice_board() {
    $.ajax({ 
        type: 'GET', 
        url: '../../apis/index.php?action=mc_notice_board', 
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (notice_board, status) {
            nbData = notice_board.legend;
            for(index=0;index<nbData.length;index++) {
                createdDate = changeFormat(nbData[index].date_created);
                var notice_board_data = '<tr>\
                                            <td class="notice_board_tabData">'+createdDate+'</td>\
                                            <td class="notice_board_tabData"><img src="img/'+nbData[index].img_url+'" class="img-responsive"></td>\
                                            <td class="notice_board_tabData">'+nbData[index].description+'</td>\
                                        </tr>';

                $("#notice_board_body").append(notice_board_data)
            }
        },
        error: function error(e) {
            console.log(e)
        }
    });
}

create_avengerIndex = function() {
    showLoading();
    $.ajax({
        type : 'GET',
        url : '../../apis/index.php?action=getavengerplates&model='+modelID,
        dataType : 'json',
        success : function(category, status) {
            if (  category.msg == 'success' ) {
                create_category_blocks(category);
                hideLoading();
            } else {
                window.location = '../../services/index.html';
            }
        },
        error : function(e) {
            console.log(e.status)
            hideLoading();
        }
    });
}


function create_partIndex() {
    showLoading();
    $.ajax({
        type : 'GET',
        url : '../../apis/index.php?action=getmcsubcategories&model='+modelID+'&category='+category_id,
        dataType : 'json',
        success : function(category, status) {
            if ( category.msg == 'success' ) {
                create_category_blocks(category);
                hideLoading();
            } else {
                window.location = '../../services/index.html';
            }
        },
        error : function(e) {
            console.log(e.status)
            hideLoading();
        }
    });
}

function create_category_blocks(category) {
    showLoading();
        var cat = category.legend;
        var first_plate_id = category.first_plate_id;
        var last_plate_id = category.last_plate_id;
    for(var index=0; index < cat.length;index++) {

        if(cat[index].status > 0) {
            moreinfo = "sbom.html?model="+modelID+"&category="+category_id+"&plateID="+cat[index].subcategory_id+"&model_name="+model_name+"&category_name="+category_name+"&first_plate_id="+first_plate_id+"&last_plate_id="+last_plate_id;
                        
                        pictorial_index = '<div class="col-lg-3 plates_dashbox">\
            <div class="portlet portlet-default plate_block"><a class="plateSearch_key" href="'+moreinfo+'">\
                <div id="defaultPortlet" class="panel-collapse collapse in" data-toggle="tooltip" title="'+cat[index].subcategory_name+'" >\
                    <div class="portlet-body auto-img-block">\
                    <span class="coming-soon" style="display: none">Coming Soon</span>\
                        <img src="img/'+cat[index].img_url+'" class="img-responsive">\
                </div>\
                <div class="vin_no" style="display:none;">'+cat[index].VIN_no+'</div>\
                <div style="overflow:hidden;" class="portlet-footer mc-plates-footer '+index+'" data-toggle="tooltip" title="'+cat[index].subcategory_name+'">'+cat[index].subcategory_name+'</div>\
            </div>\
        </div>';
        } else {
                        pictorial_index = '<div class="col-lg-3 plates_dashbox">\
            <div class="portlet portlet-default plate_block">\
                <div id="defaultPortlet" class="panel-collapse collapse in" data-toggle="tooltip" title="'+cat[index].subcategory_name+'">\
                    <div class="portlet-body auto-img-block">\
                    <span class="coming-soon" style="display: block">Coming Soon</span>\
                        <img src="img/'+cat[index].img_url+'" class="img-responsive">\
                </div>\
                <div class="vin_no" style="display:none;">'+cat[index].VIN_no+'</div>\
                <div class="portlet-footer mc-plates-footer" data-toggle="tooltip" title="'+cat[index].subcategory_name+'">'+cat[index].subcategory_name+'</div>\
            </div>\
        </div>';
        }
                
        $("#pictorial_area").append(pictorial_index);  
        hideLoading();

        /*if ($('.plate_block').scrollWidth >  $('.'+index).innerWidth()) {
            //Text has over-flowed
            $('.'+index).css('color', '#CCC');
        }*/
    }
    

    $("#dashboard").css("display", "block");
    $("#dashboard").css("visibility", "visible"); 
    $("#dashboard_area").css("display", "block");


    $( '#pictorial_area' ).searchable({
        searchField: '#plate_search',
        selector: '.plates_dashbox',
        childSelector: '.plateSearch_key, .vin_no',

        
        show: function( elem ) {
            elem.slideDown(100);
        },
        hide: function( elem ) {
            elem.slideUp( 100 );
        }
    });

}

function create_circulars() {
    // alert("create_circulars");
    $.ajax({ 
        type: 'GET', 
        url: '../../apis/index.php?action=getMcCirculars', 
        dataType: 'json',
        success: function (circulars, status) {
            
            cir = circulars.legend;
            // console.log(cir)
            for(index=0;index<cir.length;index++) {
                date = moment(cir[index].date).format('LLL');
                circulars = '<tr><td>'+cir[index].circular_id+'</td><td>'+cir[index].product_type+'</td><td>'+cir[index].group_name+'</td><td>'+cir[index].bulletin_type+'</td><td>'+cir[index].bulletin_id+'</td><td>'+cir[index].bulletin_desc+'</td><td>'+date+'</td><td><a href="technicals/'+cir[index].pdf_doc+'" target="_blank">More Info</a></td></tr>';

                $("#circulars-tbody").append(circulars)
            }
        },
        error: function(e) {
            console.log(e)
        }

    });
}


var changeFormat = function(published_date) {

    var xDate = new Date(published_date);

    var dd = xDate.getDate();
    var mm = xDate.getMonth() + 1; 
    var yyyy = xDate.getFullYear(); 
    mm = months[mm-1]
    return (dd+ " " + mm + ", " +yyyy )

}


/*
function load_sideMenus() {

    $.ajax({
        type: 'GET',
        url: 'api/mc_subcategory_menu',
        dataType: 'json',
        success: function(sideMenus_data, status) {

            $("#bajaj-logo").attr("src", sideMenus_data.header_logo);

            var profile_img = '../'+user_details.profile_image;
            var user = user_details.name;

            var menus = '<li class="side-user hidden-xs"><img class="img-responsive" src=' + profile_img + ' alt=""><p class="welcome"><i class="fa fa-key"></i> Logged in as</p><div class="col-md-12 name tooltip-sidebar-logout text-center padding-zero user_name">' + user + '</div><div class="col-md-12 padding-zero user_logout text-left"><a class="bajaj-user-logout text-right" style="color: inherit" class="logout_open" href="#logout" data-toggle="tooltip" data-placement="top" title="Logout"><i class="fa fa-sign-out" data-toggle="modal" data-target="#logout-window">Logout</i></a></div><div class="clearfix"></div></li>';

            for (var m = 0; m < sideMenus_data.legend.length; m++) {
                var option_name = sideMenus_data.legend[m].option_name;
                var option_ID = sideMenus_data.legend[m].option_ID;

                if ( sideMenus_data.legend[m].option_name == 'Profile' ) {
                    menus += '<li><a style="color:' + sideMenus_data.font_color + ';background:' + sideMenus_data.bg_color + ';" class="side-menus" href="' + option_ID + '">' + sideMenus_data.legend[m].option_name + '</a></li>';
                } else 
                    menus += '<li><a style="color:' + sideMenus_data.font_color + ';background:' + sideMenus_data.bg_color + ';" class="side-menus" href="#' + option_ID + '">' + sideMenus_data.legend[m].option_name + '</a></li>';

            }



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
