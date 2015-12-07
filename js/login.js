host = "json/";
//host = "//dev.bajaj.gladminds.co/v1/gm-users/";

var set = false;
var domain;
$(document).ready(function() {
        
    $.ajax({
       type : 'GET',
       url  : 'apis/get_user_details.php?action=get_user_details',
       dataType : 'json',
       success : function ( res ) {
           if ( res.status == 'Success' ) {
                if ( res.role == 'staff' ) 
                    window.location = "staff/index.html";
                else 
                    window.location = "services/index.html";
                return;
           } 
           show_login_page();
       }, error : function ( res ) {
        
       }    
    });
});

function show_login_page() {
    $('#Passwd').bind("cut copy paste", function(e) {
        e.preventDefault();
    });

    $.ajax({
        type: 'GET',
        url: host + 'index.json',
        data: {
            get_param: 'value'
        },
        dataType: 'json',
        success: function(brandIndex, status) {
            domain = brandIndex.domain_name;
            var brand_img = '<img class="img-responsive logo" src=' + brandIndex.logo_url + '>';
            $("#brand_image").append(brand_img);
            $("#brand_name").text(brandIndex.product + "!");
            if (brandIndex.user_register == 1) {
                $(".oneApp-bajaj").css("display", "block");
                $.ajax({
                    type: 'GET',
                    url: host + 'register.json',
                    data: {
                        get_param: 'value'
                    },
                    dataType: 'json',
                    success: function(registration_form_data, status) {
                        for (var i = 0; i < registration_form_data.legend.length; i++) {
                            var reg_data = registration_form_data.legend;
                            var input_fields = '<h4 class="page-header reg-form-header col-md-12">' + registration_form_data.legend[i].type + '</h4>';
                            for (var j = 0; j < reg_data[i].fields.length; j++) {

                                if (reg_data[i].fields[j].mandatory == "0") {

                                    input_fields += '<div class="form-group col-md-' + reg_data[i].fields[j].span + ' "><label>' + reg_data[i].fields[j].label + '</label><input type=' + reg_data[i].fields[j].input_type + ' class="reg-input-blocks form-control" name=' + reg_data[i].fields[j].fld_name + '></div>';

                                } else {
                                    input_fields += '<div class="form-group col-md-' + reg_data[i].fields[j].span + ' "><label>' + reg_data[i].fields[j].label + '<span class="mandatory_field"><sup>*</sup></span></label><input type=' + reg_data[i].fields[j].input_type + ' class="form-control reg-input-blocks" name=' + reg_data[i].fields[j].fld_name + '></div>';
                                }
                            }

                            $("#user-reg-form").append(input_fields);
                        }

                    },
                    error: function(e) {
                        console.log(e);
                    }
                });

            } else {
                $(".new-user-reg").css("display", "none");
            }

            $(".index-page-wrapper").css("display", "block");
        },
        error: function(e) {
            console.log(e);
        }
    });

    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: host + 'version.json',
        dataType: 'json',
        success: function(version) {
            create_footer(version);
        },
        error: function(e) {
            console.log(e);
        }
    });

    $("#signIn").bind('click', function(e) {
        e.preventDefault();
        set_login();
    });

    $("#register-user").click(function() {
        var first_name = $("input[name=first_name]").val();
        var last_name = $("input[name=last_name]").val();
        var mobile = $("input[name=phone_no]").val();
        var email = $("input[name=email_address]").val().trim();

        // console.log(first_name);
        // console.log(last_name);
        // console.log(mobile);

        if (ValidateFirstName(first_name) && ValidateLastName(last_name) && Validatephonenumber(mobile) && ValidateEmail(email)) {
            console.log("Everything fine");
            $(".reg-input-blocks").val("");
            window.location = "index.html";
        } else {
            // console.log("Oops!! Something went wrong");
            $(".error-log-block").css("display", "block");
            $(".error-log-block").html("Something went wrong!! Please try again");
        }
    });
}

function set_login() {
    $("#error-msg-login-window").css("display", "none");

    var input_email = $("#Email").val();
    var email = input_email.trim();

    var input_password = $("#Passwd").val();
    var password = input_password.trim();


    if ( email == '' ) {
        $('#error-msg-login-window').text('Email cannot be left blank');
                $("#error-msg-login-window").css("display", "block");
        return;
    }

    if ( password ==  '' ) {
        $('#error-msg-login-window').text('Password cannot be left blank');
                $("#error-msg-login-window").css("display", "block");
        return;
    }

    var pwd_encrypted = password;

    if ( ('rkjena@bajajauto.co.in' == email) ||
         ('ticl_dealer@bajajauto.co.in' == email) 
     ) {
        pwd_encrypted = $.md5(password);
    } else pwd_encrypted = password;


    var formData = {
        "username": email,
        "password": pwd_encrypted
    };
/*****************for demo ******************/
    if ( ('democv@bajajauto.co.in' == email) ) {
            set = true;
    }
    serilizedData = JSON.stringify(formData);

    $.ajax({
        //url: "//192.168.0.189:8004/v1/gm-users/login/",
        //url: apiURL +"v1/gm-users/login/",
        url: "//qa.bajaj.gladminds.co/v1/gm-users/login/",
        type: "post",
        cache: false,
        data: serilizedData,
        dataType: 'json',
        success: function(data, resp) {
            console.log(data)

            if ( "dhananjay.k@gladminds.co" == email ) role = 'staff';
            else if ( "skmishra@bajajauto.co.in" == email ) role = 'admin';
            else if ( "ipattabhi@bajajauto.co.in" == email ) role = 'admin';
            else if ( "jskulkarni@bajajauto.co.in" == email ) role = 'admin';
            else if ( "pgpingle@bajajauto.co.in" == email ) role = 'admin';
            else if ( "SMUKHERJEE2@bajajauto.co.in" == email ) role = 'admin';
            else role = 'users';

            if (data.status == 1) {
                var user_details = {
                    "email": email,
                    "access_token": data.access_token,
                    "role": role
                };
                $.ajax({
                    url: "apis/get_user_details.php?action=save_user_details",
                    type: 'post',
                    data: user_details,

                    success: function(data, resp) {
                        hideLoading();
                        if ( role == 'staff' ) 
                            window.location = "staff/index.html";
                        else 
                            window.location = "services/index.html";
                    },
                    error: function(data, res) {
                        console.log('Failed');
                    }
                });
            } else {
                $("#error-msg-login-window").css("display", "block");
                hideLoading();
            }
        },
        error: function(error) {
            $("#error-msg-login-window").css("display", "block");
            hideLoading();
        }
    });
}



// function Login() {

//  var email = $("#user-email").val();
//  var password = $("#user-password").val();

//  var sessionTimeout = 1; //hours
//  var loginDuration = new Date();
//  loginDuration.setTime(loginDuration.getTime()+(sessionTimeout*60*60*1000));
//  document.cookie = "CrewCentreSession=Valid; "+loginDuration.toGMTString()+"; path=/";


//  // Put this at the top of index page
//  if (document.cookie.indexOf("CrewCentreSession=Valid") == -1) {
//    location.href = "index.html";
//  }

//  if ((email=="rkjena@bajajauto.co.in") && (password == "rkjena123")) {
//      self.location.href = "services/";
//  }
//  else {
//      alert("Either the username or password you entered is incorrect.\nPlease try again.");
//      $("#user-email").focus();
//  }
//  return true;
// }

function showLoading() {
    $("#loading").show();
}

function hideLoading() {
    $("#loading").hide();
}

function create_footer(version) {
    var footer = '<footer class="bajaj-footer"><span>All rights reserved by Bajaj Auto. Ltd.</span><br><span>Powered by <a href="//gladminds.co/#products" target="_blank">GladMinds Connect Platform</a></span><br><span>Version ' + version.version_no + '</span></footer>';

    $("footer").append(footer);
}
