$(document).ready(function() {
    apiLocalUrl = 
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
                get_cv_categories();
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


function get_cv_categories () {
    var page_url = window.location.href;
    getParameterByName(page_url);
    model_id = getParameterByName('modelID');
    category_id = getParameterByName('catID');
    model_name = getParameterByName('model_name');
    category_name = getParameterByName('category_name');

    url = '../../json/cv_sc_sm';
    get_sideMenu_data(url);


    create_pictorial_index();
    craete_notice_board();
    create_circulars();
	
	$('footer').css('margin', '20px auto');
	$('footer').css('position', 'relative');

    var breadcrumb = '<ul class="crumbs">\
                        <li class="first"><a href="../index.html" style="z-index:10;"><span></span>Home</a></li>\
                        <li class="first"><a href="index.html" style="z-index:9;"><span></span>MODEL</a></li>\
                        <li class="first"><a href="categories.html?modelID='+model_id+'&model_name='+model_name+'" style="z-index:8;"><span></span>'+model_name+'</a></li>\
                        <li class="first"><a href="#" style="z-index:7;"><span></span>'+category_name+'</a></li>\
                    </ul>';
    $("#breadcrumb").append(breadcrumb)

    /****************** Logout User *******************************/

    // hideLoading();


    $('body').css('display', 'block');
}

function create_pictorial_index() {
    showLoading();
    $.ajax({
        type: 'GET',
        url: '../../apis/index.php?action=getSubCategories&model='+model_id+'&category='+category_id,
        data: {
            get_param: 'value'
        },
        dataType: 'json',
        success: function(pictorial_index_data, status) {
            if ( pictorial_index_data.msg == 'Failure' ) {
                window.location = '../../services/index.html';
                return;
            }
            var plates = pictorial_index_data.legend;
		    var first_plate_id = pictorial_index_data.first_plate_id;
		    var last_plate_id = pictorial_index_data.last_plate_id;
            for (var index = 0; index < plates.length; index++) {
                moreinfo = plates[index].subcategory_id;
                // console.log(moreinfo)
                if (plates[index].status != 0) {
                    moreinfo = "sbom.html?plateID=" + plates[index].subcategory_id+"&model="+model_id+"&category="+category_id+"&model_name="+model_name+"&category_name="+category_name+"&first_plate_id="+first_plate_id+"&last_plate_id="+last_plate_id;
					
					pictorial_index = '<div class="col-lg-3 plates_dashbox">\
						<div class="portlet portlet-default plate_block"><a class="plateSearch_key" href="' + moreinfo + '">\
							<div id="defaultPortlet" class="panel-collapse collapse in" data-toggle="tooltip" title="'+plates[index].subcategory_name+'">\
								<div class="portlet-body pictorial_index_body">\
									<span class="coming-soon" style="display: none">Coming Soon</span>\
									<img src="img/' + plates[index].img_url + '" class="img-responsive">\
							</div>\
							<div class="portlet-footer plates-footer">' + plates[index].subcategory_name + '</div>\
						</div>\
					</div>';
                } else {
                    status = "block";
                    moreinfo = "#"
					
					pictorial_index = '<div class="col-lg-3 plates_dashbox">\
						<div class="portlet portlet-default plate_block">\
							<div id="defaultPortlet" class="panel-collapse collapse in" data-toggle="tooltip" title="'+plates[index].subcategory_name+'">\
								<div class="portlet-body pictorial_index_body">\
									<span class="coming-soon" style="display: ' + status + ' ">Coming Soon</span>\
									<img src="img/' + plates[index].img_url + '" class="img-responsive">\
							</div>\
							<div class="portlet-footer plates-footer">' + plates[index].subcategory_name + '</div>\
						</div>\
					</div>';
                }

                $("#pictorial_area").append(pictorial_index);
                hideLoading();
            }

            $('#pictorial_area').searchable({
                searchField: '#plate_search',
                selector: '.plates_dashbox',
                childSelector: '.plateSearch_key',


                show: function(elem) {
                    elem.slideDown(100);
                },
                hide: function(elem) {
                    elem.slideUp(100);
                }
            });

        },
        error: function(e) {
            hideLoading();
            if (e.status == 401) {
                relogin();
            }
            console.log(e);
        }
    });
}

function craete_notice_board() {
    $.ajax({
        type: 'GET',
        url: '../../apis/index.php?action=notice_board',
        data: {
            get_param: 'value'
        },
        dataType: 'json',
        success: function(notice_board, status) {
            nbData = notice_board.legend;
            for (index = 0; index < nbData.length; index++) {
                createdDate = changeFormat(nbData[index].date_created);
                var notice_board_data = '<tr>\
                                            <td class="notice_board_tabData">' + createdDate + '</td>\
                                            <td class="notice_board_tabData"><img src="img/' + nbData[index].img_url + '" class="img-responsive"></td>\
                                            <td class="notice_board_tabData">' + nbData[index].description + '</td>\
                                        </tr>';

                $("#notice_board_body").append(notice_board_data)
            }
        },
        error: function error(e) {
            console.log(e)
        }
    });
}


function create_circulars() {
    // alert("create_circulars");
    $.ajax({
        type: 'GET',
        url: '../../apis/index.php?action=getCVCirculars',
        dataType: 'json',
        success: function(circulars, status) {

            cir = circulars.legend;
            for (index = 0; index < cir.length; index++) {

                date = moment(cir[index].date).format('LLL');
                circulars = '<tr><td>' + cir[index].circular_id + '</td><td>' + cir[index].product_type + '</td><td>' + cir[index].group_name + '</td><td>' + cir[index].bulletin_type + '</td><td>' + cir[index].bulletin_id + '</td><td>' + cir[index].bulletin_desc + '</td><td>' + date + '</td><td><a href="technicals/' + cir[index].pdf_doc + '" target="_blank">More Info</a></td></tr>';

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
    mm = months[mm - 1]
    return (dd + " " + mm + ", " + yyyy)
}
