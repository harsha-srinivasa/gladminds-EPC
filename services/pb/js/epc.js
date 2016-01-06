$(document).ready(function(){
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
                get_probiking_models();
                get_sideMenu_data('api/pb_sideMenu');
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


function get_probiking_models () {
    $("#logout-modal-img").append(logout_user);

	$.ajax({
		type : 'GET',
		url : '../../apis/index.php?action=getKtmModels',
		dataType : 'json',
		success : function(models, status) {
            if ( models.msg == 'Failure' ) {
                window.location = '../../services/index.html';
                return;
            }
			create_models(models);
           $('body').css('display', 'block');
    var breadcrumb = '<ul class="crumbs">\
                            <li class="first"><a href="../index.html" style="z-index:9;"><span></span>Home</a></li>\
                            <li class="first"><a href="#" style="z-index:8;"><span></span>Models</a></li>\
                        </ul>';

    $("#breadcrumb").append(breadcrumb);

		},
		error : function(e) {
			console.log(e)
		}
	})

}

function create_models(models) {
	var model = models.legend;
    for(var index=0; index < model.length;index++) {

        if(model[index].status > 0) {
            moreinfo = 'subcategories.html?model='+model[index].model_id+'&model_name='+model[index].model_name;

			var pictorial_index = '<div class="col-lg-3">\
				<div class="portlet portlet-default plate_block"><a href="'+moreinfo+'">\
					<div id="defaultPortlet" class="panel-collapse collapse in">\
						<div class="portlet-body auto-img-block highlight-icons">\
						<span class="coming-soon" style="display: none">Coming Soon</span>\
							<img src="img/'+model[index].img_url+'" class="img-responsive model-height">\
					</div>\
					<div class="portlet-footer ktm-plates-footer">'+model[index].model_name+'</div>\
				</div>\
			</div>';        
		} else {            
			var pictorial_index = '<div class="col-lg-3">\
            <div class="portlet portlet-default plate_block">\
                <div id="defaultPortlet" class="panel-collapse collapse in">\
                    <div class="portlet-body auto-img-block">\
                    <span class="coming-soon" style="display: block">Coming Soon</span>\
                        <img src="img/'+model[index].img_url+'" class="img-responsive model-height">\
                </div>\
                <div class="portlet-footer ktm-plates-footer">'+model[index].model_name+'</div>\
            </div>\
        </div>';
        }
        
        $("#pictorial_area").append(pictorial_index);  

    }
    

$("#dashboard").css("display", "block");
$("#dashboard").css("visibility", "visible"); 
$("#dashboard_area").css("display", "block");
}
