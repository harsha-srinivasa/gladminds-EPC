
scrollTable = true;
var history_id;
$(document).ready(function(){


       $.fn.preload = function() {
        this.each(function(){
            $('<img/>')[0].src = this;
        });
    }

    $.ajax({
        url  : "../apis/get_user_details.php?action=getfd",
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

    show_version('api/');

   var breadcrumb = '<li class="first"><a href="../services/index.html" style="z-index:9;"><span></span>Home</a></li>';
   breadcrumb += '<li class="first"><a href="#" style="z-index:8;"><span></span>ADMIN PANEL</a></li>';
    $("#breadcrumb").append(breadcrumb);
});


function get_bike_models() {
    var data = {
        'status' : 'Pending' 
    };

    $.ajax({
        type : 'GET',
        url : '//qa.bajaj.gladminds.co/v1/visualisation-upload-history/?access_token='+user_details.access_token,
        //url : apiURL +'v1/visualisation-upload-history/?access_token='+user_details.access_token,
//        url : '//192.168.0.57:8000/v1/visualisation-upload-history/?access_token='+user_details.access_token,
        dataType : 'json',
        beforeSend : function () {
            $('body').css('display', 'block');
            showLoading();
        },
        success : function(data, status) {
            console.log(data);
            profile_img = '../services/'+user_details.profile_image;

            $("#logout-modal-img").append(logout_user);
            url = 'api/admin_sidemenu';
            get_sideMenu_data(url);
             
            hideLoading();
            show_data(data);
        },
        error : function(e) {
            console.log(e);
        }
    });
}


function show_data ( data ) {
    var s;
    for ( var i = 0; i < data.objects.length; i++ ) {
        var eco_num = data.objects[i].eco_number || '-';
        s = '<tr class="review-sbom">';
        s += "<td>"+data.objects[i].id+"</td>";
        s += "<td>"+data.objects[i].sku_code+"</td>";
        s += "<td>"+data.objects[i].bom_number+"</td>";
        s += "<td>"+data.objects[i].plate_id+"</td>";
        s += "<td>"+data.objects[i].created_date+"</td>";
        s += "<td>"+data.objects[i].modified_date+"</td>";
        s += "<td>"+eco_num+"</td>";
        s += "<td>"+data.objects[i].status+"</td>";
        s += "</tr>";
        $('#sbom_data').append(s);
    } 

    $('#table').dataTable({"bAutoWidth": false});
    
    review_sbom();
}


function review_sbom ( ) {
    $('.review-sbom').click(function (e) {
        $('#review-window').modal('show');
        var id = history_id = $(this).closest('tr').find('td:first').text();
console.log(history_id);

        $.ajax({
            type : 'GET',
           // url : "//qa.bajaj.gladminds.co/v1/bom-visualizations/preview-sbom/"+id+"/?access_token="+user_details.access_token,
            url : "//192.168.0.62:8000/v1/bom-visualizations/preview-sbom/"+id+"/?access_token="+user_details.access_token,
            dataType : 'json',
            success : function(data, status) {
                console.log(data)
                $('#sbom_details').text('');
                $('.sbom-img' ).html('');
                ss = data ;
                show_sbom ( data );
                //preload_assets (data);
            },
            error : function(e) {
                console.log(e);
            }
        });
    }); 
}

function preload_assets ( data ) {
    var queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.on("complete", handleComplete, this);
    queue.loadFile({id:"sound", src:"http://path/to/sound.mp3"});
    queue.loadManifest([
     {id: "myImage", src:"path/to/myImage.jpg"}
    ]);
    function handleComplete() {
     var image = queue.getResult("myImage");
     document.body.appendChild(image);
    }
}

function show_sbom ( data ) {
   $('.tab-body').text('');
   $('.tab-body').html('');
   $([data.plate_image]).preload(); 
    var str = '<img border="0" usemap="#FPMap0" src="'+data.plate_image+'" usemap="#FPMap0">';

    $('.sbom-img' ).html(str);
    $('#FPMap0').append('');

    for ( var i = 0; i < data.plate_part_details.length; i++ ) {
        var remarks = data.plate_part_details[i].remarks || '--';
        var co_ordinates = "'"+data.plate_part_details[i].x_coordinate + ',';
        co_ordinates += data.plate_part_details[i].y_coordinate + ',' + data.plate_part_details[i].z_coordinate + "'";

            var s;
            for ( var j = 0; j < data.plate_part_details[i].x_coordinate.length; j++ ) {
                s = data.plate_part_details[i].x_coordinate[j]+', '+data.plate_part_details[i].y_coordinate[j];
                s += ', ' +data.plate_part_details[i].z_coordinate[j];
                $('#FPMap0').append('<area href="#'+data.plate_part_details[i].part_href+'" shape="circle" coords="'+s+'">');
            }

        
        str = '<tr class="grid table-squidheadlink '+data.plate_part_details[i].part_href+'">';
        str += '<td class="slNo">'+data.plate_part_details[i].serial_number +'</td>';
        str += '<td class="part_no">'+data.plate_part_details[i].part_number+'</td>';
        str += '<td class="description">'+data.plate_part_details[i].description+'</td>';
        str += '<td class="qty1">'+data.plate_part_details[i].quantity+'</td>';
        str += '<td class="remks">'+remarks +'</td>';
        str += '</tr>';
                
        $('#sbom_details').append(str);
    }

    start_mapping();

    $('#Approved').bind('click', function(e) {
       change_plate_status(e); 
    });
    
    $('#Rejected').bind('click', function (e) {
       change_plate_status(e); 
    });


    $('.scrollTable').scrolltable({
        stripe: true,
        oddClass: 'odd',
        setWidths: true,
        maxHeight: 100
    });


	 $('#Approved').bind('click', function(e) {
       change_plate_status(e);
    });

    $('#Rejected').bind('click', function (e) {
       change_plate_status(e);
    });

}

function getPermission () {
	$.ajax({
		type : 'GET',
		url : apiLocalUrl+ 'login.php?action=check_session',
		dataType : 'json',
		success : function(models, status) {
            console.log(models)
		},
		error : function(e) {
			console.log(e);
		}
	});
}


var start_mapping = function() {
    areaTags = $("map area");
    // Assign Class to image
    $('[usemap="#FPMap0"]').addClass('map');

    $.each(areaTags, function( index, value ) { //console.log(index) $(areaTags[index]).attr("data-maphilight",'{"strokeColor":"6633FF", "strokeWidth":2, "fillColor":"99CCFF", "fillOpacity":0.2}').attr("class","squidheadlink");
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
        highlight_data(this, e, '#FFF' );
    }).mouseout(function(e) {
        scrollTable=true;
        remove_highlight_data ( this, e);
    }).click(function(e) { e.preventDefault(); });

    $('.squidheadlink').mouseover(function(e) {
        highlight_data(this, e, '#FFF');
        if ( scrollTable ) {
            scroll_if_not_visible(sClass);
        }
    }).mouseout(function(e) {
        remove_highlight_data ( this, e);
    }).click(function(e) { e.preventDefault(); });

}


function change_plate_status (e) {
console.log(e.target.id);
    var data = {
        "status" : e.target.id 
    };
alert ( e.target.id);

    data = JSON.stringify(data);

    $.ajax({
        type : 'POST',
        contentType: 'application/json',
       // url : "//qa.bajaj.gladminds.co/v1/bom-visualizations/change-status/"+history_id+"/?access_token="+user_details.access_token,
        url : "//192.168.0.62:8000/v1/bom-visualizations/change-status/"+history_id+"/?access_token="+user_details.access_token,
        dataType : 'json',
        data : data,
        beforeSend : function () {
            showLoading();
        },
        success : function(data, status) {
            console.log(data);
            hideLoading();
        },
        error : function(e) {
            console.log(e);
        }
    });
}
