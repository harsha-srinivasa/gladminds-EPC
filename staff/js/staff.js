var apiURL = "//192.168.0.59:8000/";
var scrollTable = true;
var cvApiUrl = '//qa.bajajcv.gladminds.co/'; 
var pbApiUrl =  '//qa.probiking.gladminds.co/'; 

apiURL = "//qa.bajaj.gladminds.co/";
//apiURL = "//local.bajaj.gladminds.co:8000/";
//var apiURL = "//192.168.0.57:8000/";
apiURL = "//192.168.0.59:8000/";

var admin_details = function () {
    this.at;
    this.url;
    
    this.fetch_vehicle_model =  function () {
        var data = {
                'access_token' : this.at
        };

        var _this = this;
        $.ajax({
            url : apiURL + "v1/brand-verticals/",
            type : 'GET',
            data : data,
            dataType: 'json',

            success: function(data, resp) {
                for ( var i = 0; i < data.objects.length; i++ ) {
                    $('#vertical_name').append($('<option>', { 
                        value: data.objects[i].name,
                        text : data.objects[i].name 
                    }));
        
                    
                }
                //$('html, body').css('display', 'block');
                _this.onChangeVertical();
		hideLoading();
            },
            error : function ( data, res ) {
                console.log('Failed');
            }
        });
    };

    this.onChangeVertical = function () {
        var _this = this;
        $(document).on('change', '#vertical_name', function(){
            vertical = $("#vertical_name").val();
            switch ( vertical ) {
                case  'Motorcycle':
                    _this.url = apiURL;
                    break;
                case  'Commercial Vehicle' :
                   _this.url = cvApiUrl;
                    break;
                case  'Probiking':
                   _this.url = pbApiUrl;
                    break;
                default:
                    $('#add_model').empty();
                    $('#plateId').empty();
                    $('#add-plate-sku').val('');
                    $('#bomNum').val('');
                    $('#plate_name').val('');
                    $('#add_model').append($('<option>', { 
                        text : '-- Select Models -- '
                    }));
                    $('#plateId').append($('<option>', { 
                        text : '-- Select Plate ID-- '
                    }));
                    return;
            }
            _this.get_sku_code(vertical);
        });
    }

    this.get_sku_code = function (vertical) {
        var _this = this;
        var data = {
            'vertical' : vertical,
            'access_token' : this.at 
        };

        $('#add_model').empty();
        $('#add-plate-sku').val('');
        $('#bomNum').val('');
        $('#add_model').append($('<option>', { 
            text : '-- Select Models -- '
        }));

        $.ajax({
            url  : _this.url + "v1/brand-product-range/",
            type : 'GET',
            dataType: 'json',
            data : data,
            beforeSend : function ( ) {
                $('#add_model option:first-child').text('Loading....');
            },
            success: function(data, resp) {
                $('#add_model option:first-child').text('---Select Model---');
                for ( var i = 0; i < data.objects.length; i++ ) {
                    $('#add_model').append($('<option>', { 
                        rel: data.objects[i].sku_code,
                        text : data.objects[i].description,
                        value: data.objects[i].description
                    }));
                }
                _this.onChangeModel ();
            },
            error : function ( data, res ) {
                console.log('Failed');
            }
        });
    };
    
    this.onChangeModel = function () {
        var _this = this;
        $(document).on('change', '#add_model', function(){
            model_val = $(this).find('option:selected').attr("rel");
            if( $('#add_model').val()== '---Select Model---') {
                    $('#plateId').empty();
                    $('#bomNum').val('');
                    $('#plate_name').val('');
                    $('#add_model').append($('<option>', { 
                        text : '-- Select Models -- '
                    }));
                    $('#plateId').append($('<option>', { 
                        text : '-- Select Plate ID-- '
                    }));
                return;
            }
            $("#add-plate-sku").val(model_val);
            _this.get_bom_num(model_val);
        });
    };
    
    this.get_bom_num = function (model_val) {
        var _this = this;
        var data = {
                'sku_code' : model_val,
                'access_token' : _this.at
        };
        var cur_req = $.ajax({
            url  : _this.url + "v1/bom-headers/",
            type : 'GET',
            dataType: 'json',
            data : data,

            beforeSend :function () {
                $('#bomNum').val('Loading...');
                if ( cur_req != null ) {
                    cur_req.abort();
                }
            },
            success: function(data, resp) {
                $('#bomNum').val(data.objects[0].bom_number);
                window.setTimeout(function () {_this.get_plate_ids(model_val); }, 500 );
            },
            error : function ( data, res ) {
                console.log('Failed');
            }
        });
    };

    this.get_plate_ids = function (model_val) {
        _this = this;
        bom_number = $('#bomNum').val();
        var data = {
                'bom__sku_code' : model_val,
                'bom_number' : bom_number,
                'access_token' : _this.at

        };
        $.ajax({
            //url  : "//qa.bajaj.gladminds.co/v1/bom-plate-parts/",
            url  : "//192.168.0.59:8000/v1/bom-plate-parts/get-plates/",
            type : 'GET',
            dataType: 'json',
            data : data,
            beforeSend : function () {
                $('#plateId option:first-child').text('Loading....');
            },
            success: function(data, resp) {
                $('#plateId option:first-child').text('---Select Plate ID---');
                for ( var i = 0; i < data.length; i++ ) {
                    if ( data[i].plate_id ) {
                        var plate = data[i].plate_id + '-' + data[i].description;
                        $('#plateId').append($('<option>', {
                            rel: data[i].description,
                            text: plate,
                            value: data[i].plate_id,
                        }));
                    }
                }
                _this.onChangePlateIds();
            },
            error : function ( data, res ) {
                console.log('Failed');
            }
        });
    };

    this.onChangePlateIds = function () {
        var _this = this;
        $(document).on('change', '#plateId', function(){
            model_val = $(this).find('option:selected').attr("rel");
            $("#plate_name").val(model_val);
        });
    };
};

$(document).ready(function () {
   showLoading();
   var details = new admin_details();
    $.ajax({
        url  : "../apis/get_user_details.php?action=getfd",
        type : 'GET',
        dataType: 'json',

        success: function(data, resp) {
            if ( data.status == 'Success' ) {
                switch ( getURLParameter('vcl') ) {
                    case 'mc':  
                        bg = 'url(../img/bg01-motorcycle.jpg)repeat-x'; 
                        $('.header').css('background','url(../img/bg01-motorcycle.jpg)repeat-x');
                        $('.portlet-default>.portlet-heading, .portlet-dark-blue>.portlet-heading').css('background', 'url(../img/bg01-motorcycle.jpg)repeat');
                        window.setTimeout ( function () {$('.side_tabs a').css('background', 'url(../img/bg01-motorcycle.jpg)repeat');}, 500 );
                        break;
                    case 'cv':  
                        bg = 'url(../img/prr_headerbg.png) repeat';
                        $('.header').css('background','url(../img/prr_headerbg.png) repeat');
                        $('.portlet-default>.portlet-heading, .portlet-dark-blue>.portlet-heading').css('background', 'url(../img/prr_headerbg.png) repeat');
                        window.setTimeout ( function () {$('.side_tabs a').css('background', 'url(../img/prr_headerbg.png) repeat');}, 500 );
                        break;
                    case 'pb':  
                        bg = 'url(../img/ktm_headerbg.png) repeat';
                        $('.header').css('background','url(../img/ktm_headerbg.png) repeat');
                        $('.portlet-default>.portlet-heading, .portlet-dark-blue>.portlet-heading').css('background', 'url(../img/ktm_headerbg.png) repeat');
                        window.setTimeout ( function () {$('.side_tabs a').css('background', 'url(../img/ktm_headerbg.png) repeat');}, 500 );
                        break;
                }
    
 
                user_details = data;
                get_sideMenu_data ('api/epc_staff_side_menu');
                details.at = data.access_token;

                details.fetch_vehicle_model();
                show_version('api/');
                $('#acc_tok').val(user_details.access_token);
            } else {
                //Redirect to login-page
                logout_user("../apis/get_user_details.php?action=logout_user");

            }
        },
        error : function ( data, res ) {
            console.log('Failed');
        }
    });

    function onsuccess(response,status){
        if ( response.message == 'EXISTING' ) {
            $('#plate_status').modal('show');
            hideLoading();
            $('#yes').bind('click', function(e) {
		$('#yes').unbind('click');
                $('#upload_ok').val('update');
                $('#plate_status').modal('hide');
	            var options={
            //          url: "//qa.bajaj.gladminds.co/v1/bom-plate-parts/save-part/?access_token="+details.at,
      	                url: "//192.168.0.59:8000/v1/bom-plate-parts/save-part/?access_token="+details.at,
            //          url: apiURL + "v1/bom-plate-parts/save-part/?access_token="+details.at,
                        beforeSend : function ( ) {
                            showLoading();
		        },
		        success : onsuccess
	                };
                        $('#data').ajaxSubmit(options);
            });
        } else {
            $("#error_msg").html("Status :<b>"+status+'</b><br><br>Response Data :<div id="msg" style="border:5px solid #CCC;padding:15px;">'+response+'</div>');
            $('#area').hide();
            show_resp(response);
            hideLoading();
        }
    }

   $("#data").on('submit',function(){
       var options={
//          url: "//qa.bajaj.gladminds.co/v1/bom-plate-parts/save-part/?access_token="+details.at,
           url: "//192.168.0.59:8000/v1/bom-plate-parts/save-part/?access_token="+details.at,
//          url: apiURL + "v1/bom-plate-parts/save-part/?access_token="+details.at,
           beforeSend : function ( ) {
		showLoading();
           },
           success : onsuccess

       };
       $(this).ajaxSubmit(options);
       return false;
   });

    function show_resp( res ) {
        console.log(res);
        var table = "<table class='table table-bordered' id='status_table'>\
                     <thead class='tabDate_head'>\
                        <th>Sl. No</th>\
                        <th>Part No.</th>\
                        <th>href</th>\
                        <th>Description</th>\
                        <th>X-Axis</th>\
                        <th>Y-Axis</th>\
                        <th>Z-Axis</th>\
                        <th>Status</th>\
                     </thead>\
                     <tbody class='status_table'></tbody>\
                     </table>";
        $('#part_status').html(table);



        for ( var i = 0, str; i < res.part.length; i++ ) {
            str = "<tr><td>"+res.part[i].serial_number+"</td>";
            str += "<td>"+res.part[i].part_number+"</td>";
            str += "<td>"+res.part[i].href+"</td>";
            str += "<td>"+res.part[i].desc+"</td>";
            str += "<td>"+res.part[i]['x-axis']+"</td>";
            str += "<td>"+res.part[i]['y-axis']+"</td>";
            str += "<td>"+res.part[i]['z-axis']+"</td>";
            str += "<td>"+res.part[i].status+"</td></tr>";
            $('.status_table').append(str);
        }
        $('#upload_status_window').modal('show');
        $('#status_table').dataTable({"bAutoWidth": false});
    }

    $('#model_img-btn').bind('click', function () {
        $('#plate_image').click();
    });

    $('#dashboard_img_btn').bind('click', function () {
        $('#dashboard_image').click();
    });

    var breadcrumb = '<li class="first"><a href="#" style="z-index:9;"><span></span>Home</a></li>';
    $("#breadcrumb").append(breadcrumb);
});


function showMyImage(fileInput) {
    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;
        if (!file.type.match(imageType)) {
                continue;
        }
        var img=document.getElementById("model_img");
        img.file = file;
        var reader = new FileReader();
        reader.onload = (function(aImg) {
            return function(e) {
                aImg.src = e.target.result;
                //$('#img_area').css('background', "url('"+e.target.result+"')");
                $('#demo-model-img')[0].src = e.target.result;
            };
        })(img);
        reader.readAsDataURL(file);
    }
}

function showMyDashboardImage(fileInput) {
    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;
        if (!file.type.match(imageType)) {
                continue;
        }
        var img=document.getElementById("model_img");
        img.file = file;
        var reader = new FileReader();
        reader.onload = (function(aImg) {
            return function(e) {
                aImg.src = e.target.result;
                //$('#img_area').css('background', "url('"+e.target.result+"')");
                $('#dashboard_img')[0].src = e.target.result;
            };
        })(img);
        reader.readAsDataURL(file);
    }
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}


var sortSelect = function (select, attr, order) {
    if(attr === 'value'){
        if(order === 'asc'){
            $(select).html($(select).children('option').sort(function (x, y) {
                return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
                console.log ( $(x) );
            }));
            $(select).get(0).selectedIndex = 0;
        }// end asc
        if(order === 'desc'){
            $(select).html($(select).children('option').sort(function (y, x) {
                return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
            }));
            $(select).get(0).selectedIndex = 0;
        }// end desc
    }

};


function get_review_status () {
 var data = {
        'status' : 'Pending',
    };

    $.ajax({
        type : 'GET',
//        url : '//qa.bajaj.gladminds.co/v1/visualisation-upload-history/?access_token='+user_details.access_token+'&limit=100',
        //url : apiURL +'v1/visualisation-upload-history/?access_token='+user_details.access_token,
        url : '//192.168.0.59:8000/v1/visualisation-upload-history/?access_token='+user_details.access_token+'&limit=100',
        dataType : 'json',
        beforeSend : function () {
            $('body').css('display', 'block');
        },
        success : function(data, status) {
            console.log(data);
            hideLoading();
            show_data(data);
        },
        error : function(e) {
            console.log(e);
        }
    });
}

function show_data ( data ) {
    $('#sbom_data').text('');
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

    $('#table').DataTable();

//    $('#table').dataTable({"bAutoWidth": false});

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
            url : "//192.168.0.59:8000/v1/bom-visualizations/preview-sbom/"+id+"/?access_token="+user_details.access_token,
            dataType : 'json',
	    beforeSend: function () {
		showLoading();
            },
            success : function(data, status) {
                console.log(data)
                $('#sbom_details').text('');
                $('.sbom-img-block' ).html('');
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


function show_sbom ( data ) {
    $('.tab-body').text('');
    $('.tab-body').html('');
//   $(['//'+data.plate_image]).preload();
    var str = '<img border="0" usemap="#FPMap0" src="'+data.plate_image+'" usemap="#FPMap0">';

    $('.sbom-img-block' ).html(str);
    $('#FPMap0').append('');

    for ( var i = 0; i < data.plate_part_details.length; i++ ) {
	s = data.plate_part_details[i].x_coordinate+', '+data.plate_part_details[i].y_coordinate;
	s += ', ' +data.plate_part_details[i].z_coordinate;

        var map = '<area href="#'+data.plate_part_details[i].part_href+'" shape="circle" coords="'+s+'">';
        $("#FPMap0").append(map);

        var remarks = data.plate_part_details[i].remarks || "--";

        str = '<tr class="table-squidheadlink '+data.plate_part_details[i].part_href+'">';
        str += '<td class="slNo">'+data.plate_part_details[i].serial_number+'</td>';
        str += '<td class="part_no">'+data.plate_part_details[i].part_number+'</td>';
        str += '<td class="description">'+data.plate_part_details[i].description+'</td>';
        str += '<td class="qty1">'+data.plate_part_details[i].quantity+'</td>';
        str += '<td class="remks">'+remarks +'</td>';
        str += '</tr>';

        $(".tabData_body").append(str)
    }
    start_mapping();

/*
    for ( var i = 0; i < data.plate_part_details.length; i++ ) {
        var remarks = data.plate_part_details[i].remarks || '--';
        var co_ordinates = "'"+data.plate_part_details[i].x_coordinate + ',';
        co_ordinates += data.plate_part_details[i].y_coordinate + ',' + data.plate_part_details[i].z_coordinate + "'";

            var s;
            for ( var j = 0; j < data.plate_part_details[i].x_coordinates.length; j++ ) {
                s  data.plate_part_details[i].x_coordinates[j]+', '+data.plate_part_details[i].y_coordinates[j];
                s += ', ' +data.plate_part_details[i].z_coordinates[j];
                $('#FPMap0').append('<area href="#'+data.plate_part_details[i].part_href+'" shape="circle" coords="'+s+'">');
            }


        str = '<tr class="grid squidheadlink '+data.plate_part_details[i].part_href+'">';
        str += '<td class="slNo">'+i+1 +'</td>';
        str += '<td class="part_no">'+data.plate_part_details[i].part_number+'</td>';
        str += '<td class="description">'+data.plate_part_details[i].description+'</td>';
        str += '<td class="qty1">'+data.plate_part_details[i].quantity+'</td>';
        str += '<td class="remks">'+remarks +'</td>';
        str += '</tr>';

        $('#sbom_details').append(str);
    }

*/

    $('.scrollTable').scrolltable({
        stripe: true,
        oddClass: 'odd',
        setWidths: true,
        maxHeight: 300
    });
    hideLoading();
}

var start_mapping = function() {
    areaTags = $("map area");
    // Assign Class to image
    $('[usemap="#FPMap0"]').addClass('map');

    $.each(areaTags, function( index, value ) {
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



