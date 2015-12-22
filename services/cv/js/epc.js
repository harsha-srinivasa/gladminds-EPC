$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

$(document).ready(function(){
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
                get_cv_models();
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

function get_cv_models() {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    today = new Date();
    var dd = today.getDate();

    var previous_date = dd-1;

    var mm = today.getMonth(); //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }  

    var current_month = months[mm];

    var previous_date = dd-1;

    today = current_month+' '+dd+', '+yyyy;

    var yesterday = current_month+' '+previous_date+', '+yyyy;

    $("#bajaj-todays-date").text(today);


    url = '../../json/cv_sm'; 
    get_sideMenu_data(url);


   // refresh_dashboard();

   create_spareParts();



 /****************** Logout User *******************************/

    // hideLoading();

    var breadcrumb = '<ul class="crumbs">\
                            <li class="first"><a href="../index.html" style="z-index:9;"><span></span>Home</a></li>\
                            <li class="first"><a href="#" style="z-index:8;"><span></span>Models</a></li>\
                        </ul>';

    $("#breadcrumb").append(breadcrumb);

    $('body').css('display', 'block');
}


function create_spareParts() {
    showLoading();
    $.ajax({ 
        type: 'GET', 
        dataType: 'jsonp',
        url: '../../apis/index.php?action=getModels',
        dataType: 'json',
        success: function (spareParts, status) { 
                if ( spareParts.msg == 'Failure' ) {
                    window.location = '../../services/index.html';
                }

                var parts = spareParts.legend;
                    for(var index=0; index < parts.length;index++) {

                        if(parts[index].status > 0) {
                            moreinfo = "categories.html?modelID="+parts[index].model_id+"&model_name="+parts[index].model_name;
							
							pictorial_index = '<div class="col-lg-3">\
                            <div class="portlet portlet-default plate_block"><a href="'+moreinfo+'">\
                                <div id="defaultPortlet" class="panel-collapse collapse in">\
                                    <div class="portlet-body auto-img-block">\
                                        <img class="dashboard-img" src="img/'+parts[index].img_url+'" class="img-responsive">\
                                </div>\
                                <div class="portlet-footer plates-footer cv-main-page">'+parts[index].model_name+'</div>\
                            </div>\
                        </div>';
                        } else {                         
							pictorial_index = '<div class="col-lg-3">\
                            <div class="portlet portlet-default plate_block">\
                                <div id="defaultPortlet" class="panel-collapse collapse in">\
                                    <div class="portlet-body auto-img-block">\
                                    <span class="coming-soon" style="display: block">Coming Soon</span>\
                                        <img class="dashboard-img" src="img/'+parts[index].img_url+'" class="img-responsive">\
                                </div>\
                                <div class="portlet-footer plates-footer cv-main-page">'+parts[index].model_name+'</div>\
                            </div>\
                        </div>';						 
                        }                     
                        
                        $("#pictorial_area").append(pictorial_index);  
                    }

                $("#dashboard").css("display", "block");
                $("#dashboard").css("visibility", "visible"); 
                $("#dashboard_area").css("display", "block");

                hideLoading();
            },
        error: function(e){
            hideLoading()
             if(e.status == 401) {
                    relogin();
                }
            console.log(e);
        }
    });
}

