$(document).ready(function(){
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
                probiking_sbom_details ();
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

function probiking_sbom_details () {
    var profile_img = '../../'+user_details.profile_image;
    var user = user_details.name;

    var page_url = window.location.href;
    getParameterByName(page_url);
    modelID = getParameterByName('modelID');
    model_name = getParameterByName('model_name');
	first_plate_id = getParameterByName('first_plate_id');
    last_plate_id = getParameterByName('last_plate_id');

    var logout_user = '<img class="img-circle img-logout" src='+profile_img+' alt=""><p><strong>'+user+'</strong></p>';
    scrollTable = true;

    $("#logout-modal-img").append(logout_user);

    var page_url = window.location.href;
    getParameterByName(page_url);
    pageID = getParameterByName('categoryID');
    if(modelID == 1) {
		load_general_bomData();
    }

    if(modelID == 2) {
		load_duke_200_bomData();
    }
    if(modelID == 3) {
		load_RC200_390_bomData();	
    }

    $("#side").remove();
    $('body').css('display', 'block');

}

load_general_bomData = function() {
	$.ajax({
		type : 'GET',
		url : '../../apis/index.php?action=getKtmPartDetails&categoryID='+pageID+'&modelID='+modelID,
		dataType : 'json',
		success : function(sbomData, status) {
            if ( sbomData.msg == 'Failure' ) {
                window.location = '../../services/index.html';
                return;
            }
			create_sbom(sbomData);
			start_mapping();
		},
		error : function(e) {
			console.log(e)
		}
     });
}

load_duke_200_bomData = function() {
	$.ajax({
		type : 'GET',
		url : '../../apis/index.php?action=getktmrc200partdetails&categoryID='+pageID+'&modelID='+modelID,
		dataType : 'json',
		success : function(sbomData_Duke200, status) {
            if ( sbomData_Duke200 == 'Failure' ) {
                window.location = '../../services/index.html';
                return;
            }
			create_sbom_duke200(sbomData_Duke200);
			start_mapping();
		},
		error : function(e) {
			console.log(e)
		}
     });
}

load_RC200_390_bomData = function() {
	$.ajax({
		type : 'GET',
		url : '../../apis/index.php?action=getKtmrc200390partdetails&categoryID='+pageID+'&modelID='+modelID,
		dataType : 'json',
		success : function(sbomData_RC200_390, status) {
            if ( sbomData_RC200_390 == 'Failure' ) {
                window.location = '../services/index.html';
                return;
            }
			create_sbom_RC200_390(sbomData_RC200_390);
			start_mapping();
		},
		error : function(e) {
			console.log(e)
		}
     });
}

var part_name;

function create_sbom(sbomData) {
	part_name = sbomData.part_details_name;
	$(".sbom-title-head").text(part_name)

	//$(".partsIndexTitle").text(sbomData.part_details_name)

	formated_date = changeFormat(sbomData.published_date)

	$(".published_date").text(formated_date)

	sbom = sbomData.maps;

	for(index=0;index<sbom.length;index++) {
		var map = '<area href="#'+sbom[index].href+'" shape="circle" coords="'+sbom[index].coords+'">';
		$("#FPMap0").append(map);
	}

	var sbom_img = '<img border="0" src="img/'+sbomData.img_url+'" usemap="#FPMap0">';
	$(".sbom-img-block").append(sbom_img);

	sbom_thead = '<tr class="table-title-header" bgcolor="#cdcdcd">\
                    <th class="slNo" bgcolor="#DA5800"><b>No</b></th>\
                    <th class="part_no" bgcolor="#DA5800"><b>Part No</b></th>\
                    <th class="description" bgcolor="#DA5800"><b>Description</b></th>\
                    <th class="qty1" bgcolor="#DA5800"><b>MY<br/> 13</b></th>\
                    <th class="qty2" bgcolor="#DA5800"><b>MY<br/> 14</b></th>\
                    <th class="qty3" bgcolor="#DA5800"><b>MY<br/> 15</b></th>\
                </tr>';
    $(".tabDate_head").append(sbom_thead);
    $(".change_page_btns").css('display', 'inline-block');

    rows = sbomData.sboms;
    for(row=0;row<rows.length;row++) {
		sbom_tbody = '<tr class="table-squidheadlink '+rows[row].map_image+'">\
						<td class="slNo">'+rows[row].map_image+'</td>\
						<td class="part_no">'+rows[row].part_no+'</td>\
						<td class="description">'+rows[row].description+'</td>\
						<td class="qty1">'+rows[row].qty_my_13+'</td>\
						<td class="qty2">'+rows[row].qty_my_14+'</td>\
						<td class="qty3">'+rows[row].qty_my_15+'</td>\
					</tr>';
		$(".tabData_body").append(sbom_tbody)
    }

    search_filter();

    breadcrums();

    $('.scrollTable').scrolltable({
        stripe: true,
        oddClass: 'odd',
        setWidths: true,
        maxHeight: 300
    });
    $('.st-body-table').addClass('table-bordered');
}


create_sbom_duke200 = function(sbomData_Duke200) {
	// console.log(sbomData_Duke200);

	part_name = sbomData_Duke200.part_details_name;
	$(".sbom-title-head").text(part_name)

	//$(".partsIndexTitle").text(sbomData_Duke200.part_details_name)

	formated_date = changeFormat(sbomData_Duke200.published_date)

	$(".published_date").text(formated_date)

	sbom = sbomData_Duke200.maps;

	for(index=0;index<sbom.length;index++) {
		var map = '<area href="#'+sbom[index].href+'" shape="circle" coords="'+sbom[index].coords+'">';
		$("#FPMap0").append(map);
	}

	var sbom_img = '<img border="0" src="img/'+sbomData_Duke200.img_url+'" usemap="#FPMap0">';
	$(".sbom-img-block").append(sbom_img);

	sbom_thead = '<tr class="table-title-header" bgcolor="#cdcdcd">\
                    <th class="slNo" bgcolor="#DA5800"><b>No</b></th>\
                    <th class="part_no" bgcolor="#DA5800"><b>Part No</b></th>\
                    <th class="description" bgcolor="#DA5800"><b>Description</b></th>\
							<th class="qty1" bgcolor="#DA5800"><b>MY<br/>13</b></th>\
							<th class="qty2" bgcolor="#DA5800"><b>MY<br/> 14</b></th>\
							<th class="qty3" bgcolor="#DA5800"><b>MY<br/> 15</b></th>\
                </tr>';

    $(".tabDate_head").append(sbom_thead);
	$('.change_page_btns').css('display', 'inline-block');
    rows = sbomData_Duke200.sboms;
    for(row=0;row<rows.length;row++) {
		sbom_tbody = '<tr class="table-squidheadlink '+rows[row].map_image+'">\
						<td class="slNo">'+rows[row].map_image+'</td>\
						<td class="part_no">'+rows[row].part_no+'</td>\
						<td class="description">'+rows[row].description+'</td>\
						<td class="qty1">'+rows[row].my_13+'</td>\
						<td class="qty2">'+rows[row].my_14+'</td>\
						<td class="qty3">'+rows[row].my_15+'</td>\
					</tr>';

		$(".tabData_body").append(sbom_tbody)
    }

    breadcrums();

    $('.scrollTable').scrolltable({
        stripe: true,
        oddClass: 'odd',
        setWidths: true,
        maxHeight: 300
    });

    $('.st-body-table').addClass('table-bordered');
}


create_sbom_RC200_390 = function(sbomData_RC200_390) {
	//console.log(sbomData_RC200_390);

	part_name = sbomData_RC200_390.part_details_name;
	$(".sbom-title-head").text(part_name)

	//$(".partsIndexTitle").text(sbomData_RC200_390.part_details_name)

	formated_date = changeFormat(sbomData_RC200_390.published_date)

	$(".published_date").text(formated_date)

	sbom = sbomData_RC200_390.maps;

	for(index=0;index<sbom.length;index++) {
		var map = '<area href="#'+sbom[index].href+'" shape="circle" coords="'+sbom[index].coords+'">';
		$("#FPMap0").append(map);
	}

	var sbom_img = '<img border="0" src="img/'+sbomData_RC200_390.img_url+'" usemap="#FPMap0">';
	$(".sbom-img-block").append(sbom_img);

	sbom_thead = '<tr class="table-title-header" bgcolor="#cdcdcd">\
                    <th class="rc-slNo" bgcolor="#DA5800"><b>No</b></th>\
                    <th class="rc-part_no" bgcolor="#DA5800"><b>Part No</b></th>\
                    <th class="rc-description" bgcolor="#DA5800"><b>Description</b></th>\
					<th class="rc-qty1" bgcolor="#DA5800"><b>RC 200</b></th>\
					<th class="rc-qty2" bgcolor="#DA5800"><b>RC 390</b></th>\
					<th class="rc-last" bgcolor="#DA5800"><b>Change Reason</b></th>\
                </tr>';

    $(".tabDate_head").append(sbom_thead);
	$('.change_page_btns').css('display', 'inline-block');

    rows = sbomData_RC200_390.sboms;
    for(row=0;row<rows.length;row++) {
		sbom_tbody = '<tr class="table-squidheadlink '+parseInt(rows[row].map_image)+'">\
						<td class="rc-slNo">'+rows[row].map_image+'</td>\
						<td class="rc-part_no">'+rows[row].part_no+'</td>\
						<td class="rc-description">'+rows[row].description+'</td>\
						<td class="rc-qty1">'+rows[row].qty_RC_200+'</td>\
						<td class="rc-qty2">'+rows[row].qty_RC_390+'</td>\
						<td class="rc-last">'+rows[row].change_reason+'</td>\
					</tr>';

		$(".tabData_body").append(sbom_tbody);
    }

    search_filter();
    breadcrums();

    $('.scrollTable').scrolltable({
        stripe: true,
        oddClass: 'odd',
        setWidths: true,
        maxHeight: 300
    });

    $('.st-body-table').addClass('table-bordered');

}

var changeFormat = function(published_date) {

	var xDate = new Date(published_date);

    var dd = xDate.getDate();
    var mm = xDate.getMonth() + 1; 
    var yyyy = xDate.getFullYear(); 
    mm = months[mm-1]
    return (dd+ " " + mm + ", " +yyyy )

}

var start_mapping = function() {
	areaTags = $("map area");
	
	   // Assign Class to image
	   $('[usemap="#FPMap0"]').addClass('map');
		
		$.each(areaTags, function( index, value ) {
			//console.log(index)
			$(areaTags[index]).attr("data-maphilight",'{"strokeColor":"6633FF", "strokeWidth":2, "fillColor":"99CCFF", "fillOpacity":0.2}').attr("class","squidheadlink");
			id = $(areaTags[index]).attr("href");
			id = id.substr(1);
            id = id.replace(/\s/g, '');
            id = id.toUpperCase(id);
			$(areaTags[index]).attr("id","squidhead-"+id).attr("rel",id);

		});

		tabData = $("#sbom_tabData tr:not(:first)");
		
		$.each(tabData, function( index, value ) {
			
			$(this).attr("class","squidheadlink");
			recID = $(this).find("td:first").text();
			
			$(this).addClass(recID);

		});

		$('.map').maphilight();

        $('.table-squidheadlink').mouseover(function (e) {
                        scrollTable = false;
                        highlight_data(this, e, '#848484' );
                }).mouseout(function(e) {
                        scrollTable=true;
                remove_highlight_data ( this, e);
            }).click(function(e) { e.preventDefault(); });

            $('.squidheadlink').mouseover(function(e) {
                highlight_data(this, e, '#848484');
                        if ( scrollTable ) {
                                scroll_if_not_visible(sClass);
                        }
            }).mouseout(function(e) {
                remove_highlight_data ( this, e);
            }).click(function(e) { e.preventDefault(); });
}


function breadcrums() {
	$("#page-wrapper").css("margin",  "50px 0 0 0");
	$("#table_image_area").css({"margin-top":"-25px"})
	var breadcrum = '<ul class="crumbs">\
                        <li class="first"><a href="../index.html" style="z-index:10;"><span></span>Home</a></li>\
                        <li class="first"><a href="index.html" style="z-index:9;"><span></span>Models</a></li>\
                        <li class="first"><a href="subcategories.html?model='+modelID+"&model_name="+model_name+'" style="z-index:8;"><span></span>'+model_name+'</a></li>\
                        <li class="first"><a href="#" style="z-index:7;"><span></span>'+part_name+'</a></li>\
                    </ul>';

    $("#breadcrumb").append(breadcrum);

}

$("#go_next").click(function(){
	next_catID = (parseInt(pageID)+1);
			if(next_catID > last_plate_id)return;
			window.location = "sbom.html?categoryID="+(parseInt(pageID)+1)+"&modelID="+modelID+"&last_plate_id="+last_plate_id+"&first_plate_id="+first_plate_id+"&model_name="+model_name;	
});

$("#go_previous").click(function(){
	previous_catID = (parseInt(pageID)-1);
	if ( previous_catID < first_plate_id )return;
		window.location = "sbom.html?categoryID="+previous_catID+"&modelID="+modelID+"&model_name="+model_name+"&last_plate_id="+last_plate_id+"&first_plate_id="+first_plate_id;	
});


$(document).on('keyup', '.dataTables_filter input', function(){
    $('#bajaj-recentAudit-trails_wrapper').removeHighlight();
    $('#bajaj-recentAudit-trails_wrapper').highlight($(this).val().trim());
});
