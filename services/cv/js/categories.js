
$(document).ready(function(){
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
                cv_category_models();
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


function cv_category_models () {
    var page_url = window.location.href;
    getParameterByName(page_url);
    modelID = getParameterByName('modelID');
    model_name = getParameterByName('model_name');


    url = '../../json/cv_sm';

    get_sideMenu_data(url);

    refresh_dashboard();

    var breadcrum = '<ul class="crumbs">\
                        <li class="first"><a href="../index.html" style="z-index:10;"><span></span>Home</a></li>\
                        <li class="first"><a href="index.html" style="z-index:9;"><span></span>Model</a></li>\
                        <li class="first"><a href="#" style="z-index:8;"><span></span>'+model_name+'</a></li>\
                    </ul>';
    $("#breadcrumb").append(breadcrum);

    $("#modal-close-btn").click(function(){
        $(".diesel-compact .features ul li.one").css("display", "none");
        $(".diesel-compact .features ul li.two").css("display", "none");
        $(".diesel-compact .features ul li.three").css("display", "none");
        $(".diesel-compact .features ul li.four").css("display", "none");
        $(".diesel-compact .features ul li.five").css("display", "none");
        $(".diesel-compact .features ul li.six").css("display", "none");
        $(".diesel-compact .features ul li.seven").css("display", "none");
        $(".diesel-compact .features ul li.eight").css("display", "none");
        $(".diesel-compact .features ul li.nine").css("display", "none");
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27)
            $('#modal-close-btn').click();   // esc
    });


 /****************** Logout User *******************************/

    // hideLoading();

    $('body').css('display', 'block');
}


function refresh_dashboard() {
    showLoading();
    $.ajax({ 
        type: 'GET', 
        dataType: 'jsonp',
        url: '../../apis/index.php?action=getCategories&model='+modelID,
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (dashboard_data, status) { 
                if ( dashboard_data.msg == 'Failure') {
                    window.location = '../../services/index.html';
                    return;
                }
                var dashboard_color = [{"color":"#03A367"},{"color":"#03A367"},{"color":"#023924"},{"color":"#054D3F"},{"color":"#F37135"},{"color":"#F37135"},{"color":"#2980B9"},{"color":"#2980B9"},{"color":"#2980B9"},{"color":"#2980B9"},{"color":"#2980B9"},{"color":"#2980B9"},{"color":"#2980B9"}];

                var category = [{"id" : "12"},{"id" : ""},{"id" : ""},{"id" : ""},{"id" : ""},{"id" : ""} ]

                
                var brandVarient = dashboard_data.legend;
				var maxGroupBy = [];
				var groupByCount = 0;
				
                for (var i=0;i<brandVarient.length;i++) {
					maxGroupBy.push(brandVarient[i].groupBy);					
                    if(brandVarient[i].status == "coming soon") {
                            status = "block"
                        } else {
                            status = "none"
                        }
                    
                    var dashboard_name = brandVarient[i].category_name;
                    var dashboard_type = brandVarient[i].short_name;

                    // var id = brandVarient[i].service_id;

                    var double_line = brandVarient[i].styleClass;

                    var red_moreinfo = "";
                    var tooltip = brandVarient[i].tooltip;
                    var title = brandVarient[i].title;

                    if(brandVarient[i].status != 0) {
                        moreinfo = "subcategories.html?modelID="+modelID+"&catID="+brandVarient[i].category_id+"&model_name="+model_name+"&category_name="+brandVarient[i].category_name+" - "+dashboard_type;
						
                        pictorial_index = '<div class="col-lg-3 plates_dashbox"><a class="plateSearch_key" href="'+moreinfo+'">\
                            <div class="portlet portlet-default plate_block">\
                                <div id="defaultPortlet" class="panel-collapse collapse in">\
                                    <div class="portlet-body highlight-icons">\
                                    <span class="coming-soon" style="display: none">Coming Soon</span>\
                                        <img src="img/'+brandVarient[i].img_url+'" class="img-responsive">\
                                </div>\
                                <div class="portlet-footer plates-footer">'+dashboard_type+'</div>\
                            </div>\
                        </div>';
                        } else {
                            pictorial_index = '<div class="col-lg-3 plates_dashbox">\
                                <div class="portlet portlet-default plate_block">\
                                    <div id="defaultPortlet" class="panel-collapse collapse in">\
                                        <div class="portlet-body">\
                                        <span class="coming-soon" style="display:block">Coming Soon</span>\
                                            <img src="img/'+brandVarient[i].img_url+'" class="img-responsive">\
                                    </div>\
                                    <div class="portlet-footer plates-footer">'+dashboard_type+'</div>\
                                </div>\
                            </div>';
                        }

					if ( groupByCount != brandVarient[i].groupBy ) {
							groupByCount = brandVarient[i].groupBy;
							$('#pictorial_area').append("<div class='RE-diesel "+i+ "'><div class='panel panel-default'><div class='panel-heading'>"+brandVarient[i].category_name+"</div><div id="+groupByCount+" class='panel-body'><br></div></div></div>");
						}							
						
						$("#"+groupByCount).append(pictorial_index);  
                        
                        // $('[data-toggle="tooltip"]').tooltip()


                }
				$('#0').css("display", "none");
                $("#dashboard").css("display", "block");
                $("#dashboard").css("visibility", "visible"); 
                $(".dashboard_area").css("display", "block");
                $("#dashboard .4").css("display", "none");

                hideLoading();
                createModal();
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


function createModal() {

    var overlay = document.querySelector( '.md-overlay' );

    [].slice.call( document.querySelectorAll( '.md-trigger' ) ).forEach( function( el, i ) {

        var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
            close = modal.querySelector( '.md-close' );

        function removeModal( hasPerspective ) {
            classie.remove( modal, 'md-show' );

            if( hasPerspective ) {
                classie.remove( document.documentElement, 'md-perspective' );
            }
        }

        function removeModalHandler() {
            removeModal( classie.has( el, 'md-setperspective' ) ); 
        }

        el.addEventListener( 'click', function( ev ) {
            classie.add( modal, 'md-show' );
            overlay.removeEventListener( 'click', removeModalHandler );
            overlay.addEventListener( 'click', removeModalHandler );

            if( classie.has( el, 'md-setperspective' ) ) {
                setTimeout( function() {
                    classie.add( document.documentElement, 'md-perspective' );
                }, 25 );
            }
        });

        close.addEventListener( 'click', function( ev ) {
            ev.stopPropagation();
            removeModalHandler();
        });

    } );

}

$(document).on('click', '.animation-toggle', function(){

    var width1 = $(document).width();
    $('#compact-landing').css('right','-'+width1+'px');

    setTimeout(function(){
        $(".diesel-compact .features ul li.one").css("display", "block")    
    }, 300)
     setTimeout(function(){
        $(".diesel-compact .features ul li.two").css("display", "block")    
    }, 600)
     setTimeout(function(){
        $(".diesel-compact .features ul li.three").css("display", "block")    
    }, 800)
     setTimeout(function(){
        $(".diesel-compact .features ul li.four").css("display", "block")    
    }, 900)
     setTimeout(function(){
        $(".diesel-compact .features ul li.five").css("display", "block")    
    }, 950)
     setTimeout(function(){
        $(".diesel-compact .features ul li.six").css("display", "block")    
    }, 1000)
     setTimeout(function(){
        $(".diesel-compact .features ul li.seven").css("display", "block")    
    }, 1050)
     setTimeout(function(){
        $(".diesel-compact .features ul li.eight").css("display", "block")    
    }, 1100)
     setTimeout(function(){
        $(".diesel-compact .features ul li.nine").css("display", "block")    
    }, 1120)
    
});



