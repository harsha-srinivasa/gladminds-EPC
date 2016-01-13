$(document).ready(function(){
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
                show_cv_sbom();
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


function show_cv_sbom () {
	var page_url = window.location.href;
    getParameterByName(page_url);
    plateID = getParameterByName('plateID');
    modelID = getParameterByName('model');
    catID = getParameterByName('category');
    model_name = getParameterByName('model_name');
    category_name = getParameterByName('category_name');
    first_plate_id = getParameterByName('first_plate_id');
    last_plate_id = getParameterByName('last_plate_id');
	scrollTable = true;

    $('footer').css('margin', '20px auto');
    $('footer').css('position', 'relative');

	loadBOMData(0);
	
	$("#side").remove();	

    $('body').css('display', 'block');
}

function loadBOMData(x) {
	$(".gotopreviousV_blk").html("")
	if(x == 0) {
		apiURL = '../../apis/index.php?action=getPartDetails&model='+modelID+'&category='+catID+'&plateID='+plateID;
	} else {
		apiURL = '../../apis/index.php?action=geteco_PartDetails&plateID='+plateID;
	}
	$.ajax({
		type: 'GET', 
        url: apiURL,
        dataType: 'json',
		success : function(sbomData, status) {
	       if ( sbomData.msg == 'Failure' ) {
               window.location = '../../services/index.html';
               return;
           }		
			create_sbom(sbomData);
			hideLoading();
			start_mapping();
		},
		error: function(e) {
			hideLoading();
			console.log(e)
		}
	});

}

var part_name;

function create_sbom(sbomData) {

	part_name = sbomData.part_details_name;
	//$(".partsIndexTitle").text(sbomData.part_details_name)

	formated_date = changeFormat(sbomData.published_date)

	$(".published_date").text(formated_date)

	sbom = sbomData.maps;

	for(index=0;index<sbom.length;index++) {
		var map = '<area href="#'+sbom[index].href+'" shape="circle" coords="'+sbom[index].coords+'">';
		$("#FPMap0").append(map);
	}

	var sbom_img = '<img class="prssssint" border="0" src="img/'+sbomData.img_url+'" usemap="#FPMap0" style="dispplay:none">';
	$(".sbom-img-block").append(sbom_img);

	sbom_thead = '<tr class="table-title-header">\
                    <th class="slNo" bgcolor="#03A367"><b>No</b></th>\
                    <th class="part_no" bgcolor="#03A367"><b>Part No</b></th>\
                    <th class="description" bgcolor="#03A367"><b>Description</b></th>\
                    <th class="qty1" bgcolor="#03A367"><b>Qty</b></th>\
                    <th class="remarks" bgcolor="#03A367"><b>Remarks</b></th>\
                    <th class="eco_status" bgcolor="#03A367">ECO Status</th>\
                </tr>';

    $(".tabDate_head").append(sbom_thead);
    $(".change_page_btns_mc").css('display', 'inline-block');


    rows = sbomData.sboms;
    
    for(row=0;row<rows.length;row++) {
    	eco_status = rows[row].eco_status
    
        rows[row].map_id = rows[row].map_id.toUpperCase();	

    	sbom_tbody = '<tr class="table-squidheadlink '+rows[row].map_id+'">\
		                <td class="slNo">'+rows[row].map_id+'</td>\
		                <td class="part_no">'+rows[row].part_no+'</td>\
		                <td class="description">'+rows[row].description+'</td>\
		                <td class="qty1">'+rows[row].quantity+'</td>\
		                <td class="remarks">'+rows[row].remarks+'</td>';

		                if(eco_status == "-") {
		                	sbom_tbody += '<td class="eco_status">'+eco_status+'</td>';
		                } else {
		                	sbom_tbody += '<td class="eco_status"><a class="ecoActionLink" onclick="setEcoAction();">'+eco_status+'</a></td>';
		                }

                		$(".tabData_body").append(sbom_tbody);
    }
    search_filter();
    breadcrumb();
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
			highlight_data(this, e, '#848484');
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

function breadcrumb() {
	if($("#breadcrumb ul").length != 1) {
		$("#page-wrapper").css("margin",  "50px 0 0 0");
		$("#table_image_area").css({"margin-top" : "-25px"})
		var breadcrum = '<ul class="crumbs">\
	                        <li class="first"><a href="../index.html" style="z-index:11;"><span></span>Home</a></li>\
	                        <li class="first"><a href="index.html" style="z-index:10;"><span></span>Models</a></li>\
	                        <li class="first"><a href="categories.html?modelID='+modelID+'&model_name='+model_name+'" style="z-index:9;"><span></span>'+model_name+'</a></li>\
	                        <li class="first"><a href="subcategories.html?modelID='+modelID+'&catID='+catID+'&model_name='+model_name+'&category_name='+category_name+'" style="z-index:8;"><span></span>'+category_name+'</a></li>\
	                        <li class="first"><a href="#" style="z-index:7;"><span></span>'+part_name+'</a></li>\
	                    </ul>';

	    $("#breadcrumb").append(breadcrum);
	} else {
		// alert("breadcrumb there")
	}
}

function setEcoAction() {
	var eco = 1;
	$(".sbom-img-block").html("");
	$(".tabDate_head").html("");
	$(".tabData_body").html("");

	loadBOMData(eco);
	go_backBtn = '<div class="text-center gotopreviousV_blk"><button class="gotopreviousVersion">Previous Plate</button></div>';
	$("#table_image_area").append(go_backBtn)
}

$(document).on('click', '.gotopreviousVersion', function(){
	$(".sbom-img-block").html("");
	$(".tabDate_head").html("");
	$(".tabData_body").html(""); 
	loadBOMData(0);
})


$("#go_next").click(function(){
	next_catID = (parseInt(plateID)+1);
	if(next_catID > last_plate_id)return;
	window.location = "sbom.html?plateID="+(parseInt(plateID)+1)+"&model="+modelID+"&category="+catID+"&model_name="+model_name+"&category_name="+category_name+"&last_plate_id="+last_plate_id+"&first_plate_id="+first_plate_id;;
});

$("#go_previous").click(function(){
	previous_catID = (parseInt(plateID)-1); 
	if ( previous_catID < first_plate_id )return;
	window.location = "sbom.html?plateID="+previous_catID+"&model="+modelID+"&category="+catID+"&model_name="+model_name+"&category_name="+category_name+"&last_plate_id="+last_plate_id+"&first_plate_id="+first_plate_id;;	
});

