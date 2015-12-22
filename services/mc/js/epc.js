$(document).ready(function(){
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
                get_bike_models();
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


function get_bike_models() {
    $.ajax({
        type : 'GET',
        url : '../../apis/index.php?action=getbikemcmodels',
        dataType : 'json',
        success : function(models, status) {
           if ( models.msg == 'success' ) {
               create_models(models);
               $("#logout-modal-img").append(logout_user);
               url = '../../json/mc_sideMenu';
               get_sideMenu_data(url);
            } else {
              window.location = "../../services/index.html";
            }
                
        },
        error : function(e) {
            console.log(e);
        }
    });
}

function create_models(models) {
	var model = models.legend;
    for(var index=0; index < model.length;index++) {

        if(model[index].status > 0) {
            status = 'none';
            moreinfo = "categories.html?model="+model[index].model_id+"&model_name="+model[index].model_name;
        } else {
            status = "block";
            moreinfo = "#"
            
        } 
		var pictorial_index;
		
		if(model[index].status > 0) {
            moreinfo = "categories.html?model="+model[index].model_id+"&model_name="+model[index].model_name;
			pictorial_index = '<div class="col-lg-3"><a href="'+moreinfo+'">\
				<div class="portlet portlet-default plate_block">\
					<div id="defaultPortlet" class="panel-collapse collapse in">\
						<div class="portlet-body auto-img-block highlight-icons">\
						<span class="coming-soon" style="display:none">Coming Soon</span>\
							<img src="img/'+model[index].img_url+'" class="img-responsive dashboard-img">\
					</div>\
					<div class="portlet-footer mc-plates-footer">'+model[index].model_name+'</div>\
				</div>\
			</div>';   

        } else {
			 pictorial_index = '<div class="col-lg-3">\
				<div class="portlet portlet-default plate_block">\
					<div id="defaultPortlet" class="panel-collapse collapse in">\
						<div class="portlet-body auto-img-block">\
						<span class="coming-soon" style="display: block">Coming Soon</span>\
							<img src="img/'+model[index].img_url+'" class="img-responsive dashboard-img">\
					</div>\
					<div class="portlet-footer mc-plates-footer">'+model[index].model_name+'</div>\
				</div>\
			</div>';   
        }
        
        $("#pictorial_area").append(pictorial_index);  
    }
    

    $("#dashboard").css("display", "block");
    $("#dashboard").css("visibility", "visible"); 
    $("#dashboard_area").css("display", "block");

    var breadcrumb = '<ul class="crumbs">\
                            <li class="first"><a href="../index.html" style="z-index:9;"><span></span>Home</a></li>\
                            <li class="first"><a href="#" style="z-index:8;"><span></span>Models</a></li>\
                        </ul>';

    $("#breadcrumb").append(breadcrumb);


}



function getPermission () {
	$.ajax({
		type : 'GET',
		url : '../../apis/login.php?action=check_session',
		dataType : 'json',
		success : function(models, status) {
            console.log(models)
			create_models(models);
		},
		error : function(e) {
			console.log(e);
		}
	});
}

