$(function(){
});

$(document).ready(function(){
    $.ajax({
        url  : "../../apis/get_user_details.php?action=get_user_details",
        type : 'get',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                user_details = data;
                get_mc_part_details();
            } else {
                window.location.href = "/";
            }

        },
        error : function ( data, res ) {
            console.log('Failed');
        }
    });

    show_version('../../json/');

    /*$('.scrollTable').scrolltable({
        stripe: true,
        oddClass: 'odd',
        setWidths: true,
        maxHeight: 300
    });*/
});

function get_mc_part_details () {
    showLoading();
    var page_url = window.location.href;
    getParameterByName(page_url);
    pageID = getParameterByName('plateID');
    model_id = getParameterByName('model');
    model_name = getParameterByName('model_name');
    category_name = getParameterByName('category_name');
    first_plate_id = getParameterByName('first_plate_id');
    last_plate_id = getParameterByName('last_plate_id');
    scrollTable = true;
    
    $('footer').css('margin', '20px auto');
    $('footer').css('position', 'relative');

    if(model_id == 2) {
        category_id = 0;
    } else {
        category_id = getParameterByName('category');
    }

    model_id = getParameterByName('model');

    if(model_id == 2) {
        apiURL = '../../apis/index.php?action=getavengerpartDetails&plateID='+pageID+"&model="+model_id;
    } else {
        apiURL = '../../apis/index.php?action=getmcpartDetails&plateID='+pageID+"&category="+category_id+'&model='+model_id;
    }
    
    $.ajax({
        type: 'GET', 
        url: apiURL, 
        dataType: 'json',
        success : function(sbomData, status) {
            if ( sbomData.msg == 'success' ) {
                create_sbom(sbomData);
                breadcrumb();
                hideLoading();
                start_mapping();
                $('body').css('display', 'block');
            } else {
                window.location = '../../services/index.html';
            }
        },
        error: function(e) {
            hideLoading();
            console.log(e)
        }
    });
    $("#side").remove();    
} 

var part_name;

function create_sbom(sbomData) {
    part_name = sbomData.part_details_name;

    $(".partsIndexTitle").text(sbomData.part_details_name)

    sbom = sbomData.maps;

    for(index=0;index<sbom.length;index++) {
        var map = '<area href="#'+sbom[index].href+'" shape="circle" coords="'+sbom[index].coords+'">';
        $("#FPMap0").append(map);
    }

    var sbom_img = '<img id="sbom_img" border="0" src="img/'+sbomData.img_url+'" usemap="#FPMap0" style="dispplay:none">';
    $(".sbom-img-block").append(sbom_img);

    if ( (model_id == 4) && ( category_id == 11 ) ) {
        sbom_thead = '<tr class="table-title-header" bgcolor="#cdcdcd">\
                    <th bgcolor="#646464" class="slNo"><b>No</b></th>\
                    <th bgcolor="#646464" class="part_no"><b>Part No</b></th>\
                    <th bgcolor="#646464" class="description"><b>Description</b></th>\
                    <th bgcolor="#646464" class="qty1"><b>ES</b></th>\
                    <th bgcolor="#646464" class="qty2"><b>KS</b></th>\
                    <th bgcolor="#646464" class="remarks"><b>Remarks</b></th>\
                </tr>';
    } else if ( ( model_id==3) && (category_id== 9)) {
        sbom_thead = '<tr class="table-title-header" bgcolor="#cdcdcd">\
                    <th bgcolor="#646464" class="slNo"><b>No</b></th>\
                    <th bgcolor="#646464" class="part_no"><b>Part No</b></th>\
                    <th bgcolor="#646464" class="description"><b>Description</b></th>\
                    <th bgcolor="#646464" class="qty1"><b>150S</b></th>\
                    <th bgcolor="#646464" class="qty2"><b>150F</b></th>\
                    <th bgcolor="#646464" class="remarks"><b>Remarks</b></th>\
                </tr>';
    } else if ( ( model_id==3) && (category_id== 15)) {
        sbom_thead = '<tr class="table-title-header" bgcolor="#cdcdcd">\
                    <th bgcolor="#646464" class="slNo"><b>Sl.No</b></th>\
                    <th bgcolor="#646464" class="part_no"><b>Part No</b></th>\
                    <th bgcolor="#646464" class="description"><b>Description</b></th>\
                    <th bgcolor="#646464" class="qty1"><b>KS</b></th>\
                    <th bgcolor="#646464" class="qty2"><b>ES</b></th>\
                    <th bgcolor="#646464" class="remarks"><b>Remarks</b></th>\
                </tr>';
    } else if ( ( model_id==1) && (category_id== 3)) {
        sbom_thead = '<tr class="table-title-header" bgcolor="#cdcdcd">\
                    <th class="slNo" bgcolor="#646464"><b>Sl.No</b></th>\
                    <th class="part_no" width="15%" bgcolor="#646464"><b>Part No</b></th>\
                    <th class="description" bgcolor="#646464"><b>Description</b></th>\
                    <th class="qty1" bgcolor="#646464"><b>NS</b></th>\
                    <th class="qty2" bgcolor="#646464"><b>AS</b></th>\
                    <th class="remarks" bgcolor="#646464"><b>Remarks</b></th>\
                </tr>';
    } else if ( ( model_id==1) && (category_id== 7)) {
        sbom_thead = '<tr class="table-title-header" bgcolor="#cdcdcd">\
                    <th class="slNo" bgcolor="#646464"><b>Sl.No</b></th>\
                    <th class="part_no" bgcolor="#646464"><b>Part No</b></th>\
                    <th class="description" bgcolor="#646464"><b>Description</b></th>\
                    <th class="qty1" bgcolor="#646464"><b>AS</b></th>\
                    <th class="qty2" bgcolor="#646464"><b>NS</b></th>\
                    <th class="remarks" bgcolor="#646464"><b>Remarks</b></th>\
                </tr>';
    } else if ( ( model_id==1) && (category_id== 2)) {
        sbom_thead = '<tr class="table-title-header" bgcolor="#cdcdcd">\
                    <th bgcolor="#646464" class="slNo"><b>No</b></th>\
                    <th bgcolor="#646464" class="part_no"><b>Part No</b></th>\
                    <th bgcolor="#646464" class="description"><b>Description</b></th>\
                    <th bgcolor="#646464" class="qty2"><b>ABS</b></th>\
                    <th bgcolor="#646464" class="qty1"><b>NON <br/>ABS</b></th>\
                    <th bgcolor="#646464" class="remarks"><b>Remarks</b></th>\
                </tr>';
    }else {
        sbom_thead = '<tr class="table-title-header" bgcolor="#cdcdcd">\
                <th bgcolor="#424242" class="slNo"><b>No</b></th>\
                <th bgcolor="#424242" class="part_no"><b>Part No</b></th>\
                <th bgcolor="#424242" class="description"><b>Description</b></th>\
                <th bgcolor="#424242" class="qty1"><b>Qty</b></th>\
                <th bgcolor="#424242" class="remks"><b>Remarks</b></th>\
            </tr>';
    }


    $(".tabDate_head").append(sbom_thead);
    $(".change_page_btns_mc").css('display', 'inline-block');
    rows = sbomData.sboms;
    if ( 
	  (( model_id == 4 ) && ( category_id == 11 )) || 
	  ((model_id==3) && (category_id==9)) || 
          ((model_id==3) && (category_id==15)) ||
          ((model_id==1) && (category_id==3)) ||
          ((model_id==1) && (category_id==7)) || 
          ((model_id==1) && (category_id==2))  
       ) { 
        for(row=0;row<rows.length;row++) {
            sbom_tbody = '<tr class="table-squidheadlink '+rows[row].map_id+'">\
                        <td class="slNo" align="center">'+rows[row].map_id+'</td>\
                        <td class="part_no" >'+rows[row].part_no+'</td>\
                        <td class="description">'+rows[row].description+'</td>\
                        <td class="qty1" align="center">'+rows[row].qty_ES+'</td>\
                        <td class="qty2" align="center">'+rows[row].qty_KS+'</td>\
                        <td class="remarks">'+rows[row].remarks+'</td>\
                    </tr>';

            $(".tabData_body").append(sbom_tbody);
            $(".change_page_btns_mc").css('display', 'inline-block');
        }
    }else {
        for(row=0;row<rows.length;row++) {
            sbom_tbody = '<tr class="table-squidheadlink '+rows[row].map_id+'">\
                        <td class="slNo">'+rows[row].map_id+'</td>\
                        <td class="part_no">'+rows[row].part_no+'</td>\
                        <td class="description">'+rows[row].description+'</td>\
                        <td class="qty1">'+rows[row].quantity+'</td>\
                        <td class="remks">'+rows[row].remarks+'</td>\
                    </tr>';

            $(".tabData_body").append(sbom_tbody)
        }
    }

    search_filter();

    $('.scrollTable').scrolltable({
        stripe: true,
        oddClass: 'odd',
        setWidths: true,
        maxHeight: 300
    });


    $('.st-body-table').addClass('table-bordered');

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

function breadcrumb() {
    $("#page-wrapper").css("margin",  "50px 0 0 0");
    $("#table_image_area").css({"margin-top":"-25px"});
    
    if(model_id == 2) {
        var breadcrum = '<ul class="crumbs">\
                    <li class="first"><a href="../index.html" style="z-index:10;"><span></span>Home</a></li>\
                    <li class="first"><a href="index.html" style="z-index:9;"><span></span>Models</a></li>\
                    <li class="first"><a href="categories.html?model='+model_id+'&model_name='+model_name+'" style="z-index:8;"><span></span>'+model_name+'</a></li>\
                    <li class="first"><a href="subcategories.html?model='+model_id+'&category='+category_id+'&model_name='+model_name+'&category_name='+category_name+'" style="z-index:7;"><span></span>'+category_name+'</a></li>\
                    <li class="first"><a href="#" style="z-index:6;"><span></span>'+part_name+'</a></li>\
                </ul>';

        $("#breadcrumb").append(breadcrum);     
    } else {
        var breadcrum = '<ul class="crumbs">\
                    <li class="first"><a href="../index.html" style="z-index:10;"><span></span>Home</a></li>\
                    <li class="first"><a href="index.html" style="z-index:9;"><span></span>Models</a></li>\
                    <li class="first"><a href="categories.html?model='+model_id+'&model_name='+model_name+'" style="z-index:8;"><span></span>'+model_name+'</a></li>\
                    <li class="first"><a href="subcategories.html?model='+model_id+'&category='+category_id+'&model_name='+model_name+'&category_name='+category_name+'" style="z-index:7;"><span></span>'+category_name+'</a></li>\
                    <li class="first"><a href="#" style="z-index:6;"><span></span>'+part_name+'</a></li>\
                </ul>';

    $("#breadcrumb").append(breadcrum);     
    }
}

$("#go_next").click(function(){
    next_catID = (parseInt(pageID)+1);
    if(next_catID > last_plate_id)return;
    window.location = "sbom.html?model="+model_id+"&category="+category_id+"&plateID="+(parseInt(pageID)+1)+"&model_name="+model_name+"&category_name="+category_name+"&last_plate_id="+last_plate_id+"&first_plate_id="+first_plate_id;   

   //pageID = (parseInt(pageID)+1);
   //get_next_sbom (pageID);
});

$("#go_previous").click(function(){
    previous_catID = (parseInt(pageID) - 1); 
    if ( previous_catID < first_plate_id )return;
    window.location = "sbom.html?model="+model_id+"&category="+category_id+"&plateID="+previous_catID+"&model_name="+model_name+"&category_name="+category_name+"&last_plate_id="+last_plate_id+"&first_plate_id="+first_plate_id;
    //pageID = (parseInt(pageID)+1);
    //get_next_sbom(pageID);
});



function get_next_sbom () {
    if(model_id == 2) {
        category_id = 0;
    } else {
        category_id = getParameterByName('category');
    }

    model_id = getParameterByName('model');

    if(model_id == 2) {
        apiURL = '../../apis/index.php?action=getavengerpartDetails&plateID='+pageID+"&model="+model_id;
    } else {
        apiURL = '../../apis/index.php?action=getmcpartDetails&plateID='+pageID+"&category="+category_id+'&model='+model_id;
    }
    
    $.ajax({
        type: 'GET', 
        url: apiURL, 
        dataType: 'json',
        beforeSend:function() {
            showLoading();
        },
        success : function(sbomData, status) {
            if ( sbomData.msg == 'success' ) {
                next_plate(sbomData);
                hideLoading();
                start_mapping();
                $('body').css('display', 'block');
            } else {
                window.location = '../../services/index.html';
            }
        },
        error: function(e) {
            hideLoading();
            console.log(e)
        }
    });
}

function next_plate (data) {
    $('.tabData_body').text('');
    $('.tabDate_head').text('');
    $("#FPMap0").text('');
    $(".sbom-img-block").text('');

    create_sbom(data);
    $('#breadcrumb ul li:last-child() a' ).text(part_name);
}
