localhost = "../js/api/";
serverhost = "//bajaj.gladminds.co/";

// activeUrl = '//localhost/xampp/web/aftersell/';
activeUrl = '//www.gladminds.co/aftersell/bajaj/bajaj-dfsc/';


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

/*
function checkAuthetication() {
    access_token = localStorage.getItem("access_token");
    if (access_token == null) {
        relogin();
    }
}
*/


function getParameterByName(url) {
    url = url.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + url + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function showLoading(){
    $("#loading").show();
}

function hideLoading(){
    $("#loading").hide();
}

function formatDate(date) {
    var xDate = new Date(date);

    var dd = xDate.getDate();
    var mm = xDate.getMonth() + 1; 
    var yyyy = xDate.getFullYear(); 

    return (yyyy+ '-' +mm+ '-' +dd);
}

function relogin() {
	localStorage.clear();
    $.ajax({
		url : "//bajaj.gladminds.co/v1/gm-users/logout/",
		type: "get",
		cache: false,
        data:formData,
		success: function(data, resp) {
    		window.location.href = "/";
		}
    });
}


function logout_user(logout_url) {
     $.ajax({
        url : logout_url, 
        type: 'POST',
        dataType : 'json',
        success: function(data, resp) {
            var formData = {"access_token":data.access_token };
            serilizedData = JSON.stringify(formData);
        
            $.ajax({
                url : "//qa.bajaj.gladminds.co/v1/gm-users/logout/",
                type: "get",
                cache: false,
                data:data,
                success: function(data, resp) {
                    window.location.href = "/";
                }
            });
        }, error : function ( data, res ) {
               console.log('failed');
        }
    });
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// $(document).ready(function(){
//     var ch_pwd = "<a data-toggle='modal' data-target='#ch_pwd_modal_window'>Change Password</a>";
//     $("#side").append(ch_pwd)


// var ch_pwd_modal = '<div class="modal fade" id="ch_pwd_modal_window" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Change Your Password</h4></div><div class="modal-body" id="logout-modal-img"><input type="password" class="ch_pwd_input" placeholder="Enter your current password" id="cur_pwd"><input type="password" id="new_pwd" class="ch_pwd_input" placeholder="New Password"><input id="confirm_pwd" type="password" class="ch_pwd_input" placeholder="Confirm Password"></div><div class="modal-footer confirm-log-btns"><button type="button" id="submit_new_pwd" class="btn logout-window-btns">Submit</button><button type="button" class="btn logout-window-btns" data-dismiss="modal">Cancel</button></div></div></div></div>';
    
//     $("body").append(ch_pwd_modal)


// })

// $(document).on('click', '#submit_new_pwd', function(){
//     cur_pwd = $("#cur_pwd").val().trim();
//     new_pwd = $("#new_pwd").val().trim();
//     confirm_pwd = $("#confirm_pwd").val().trim();

//     new_pwd_data = {
//         "email":"",
//         "password1": cur_pwd,
//         "password2": new_pwd
//     }

//     if(new_pwd == confirm_pwd) {
//         $.ajax({
//             url : '//bajaj.gladminds.co/v1/gm-users/forgot-password/email/',
//             type : 'POST',
//             data : new_pwd_data,
//             success : function(status) {
//                 // console.log(status);
//                 $('#ch_pwd_modal_window').modal('toggle');

//             },
//             error : function(e) {
//                 console.log(e)
//             }
//         })
//     } else {
//         alert("Your Password does not match. Please enter again");
//     }

// })
