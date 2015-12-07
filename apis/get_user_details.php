<?php
    session_start();

    include "inc/dbconn.php";
    include "inc/function.php";

if (isset($_POST['action']) && ! empty($_POST['action'])) {
    $action = $_POST['action'];
} elseif (isset($_GET['action']) && ! empty($_GET['action'])) {
    $action = $_GET['action'];
}


echo $_POST['action'];

switch ( $action ) {
    case 'get_user_details' : 
            get_user_details();
            break;
    case 'get_permission' : 
            get_permission();
            break;
    case 'save_user_details' : 
            save_user_details();
            break;
    case 'logout_user' : 
            logout_user();
            break;
    case 'get_user_email' : 
            get_user_email();
            break;
    case 'getfd' : 
            get_full_details();
            break;
    case 'reset' : 
            clear_session();
            break;
    case 'chgpfl' : 
            update_profile_details();
            break;
    case 'get_files' : 
            get_files();
            break;
}


    function save_user_details( ) {
        $_SESSION['access_token'] = $_POST['access_token'];
        $_SESSION['role'] = $_POST['role'];
        $email  = $_POST['email'];
        $email = '"'.$email.'"';
        $rows = selectrec("name, permission, profile_image", "users", "Email=$email");

        foreach ( $rows as $row ) {
            $_SESSION['name'] = $row[0];
            $_SESSION['email'] = $email;
            $_SESSION['permission'] = $row[1];
            $_SESSION['profile_image'] = $row[2];
            $permission_query = selectrec("motorcycle, commercial_vehicle, probiking, international_business", "vertical_services", "permission=$row[1]");
            $_SESSION['permission_list'] = array('motorcycle'=>$permission_query[0][0],'cv'=>$permission_query[0][1],
                  'pb'=>$permission_query[0][2],'ib'=>$permission_query[0][3]);
        }
        echo 'success';
    }

    function get_permission ( ) {
        $perm = $_SESSION['permission'];
        $rows = selectrec("motorcycle, commercial_vehicle, probiking, international_business", "vertical_services", "permission=$perm");

        $str = "{";
	
        foreach($rows as $row) {
               $str .= '"mc" : "'.$row[0].'", "cv" : "'.$row[1].'",';
               $str .= '"pb" : "'.$row[2].'", "ib" : "'.$row[3].'"';

        }

        $str .= "}";
        echo $str;
    }

    function get_user_details ( ) {
        $name = $_SESSION['name'];
        $permission = $_SESSION['permission'];
        $profile_image = $_SESSION['profile_image'];
        $access_token = $_SESSION['access_token'];
        $role = $_SESSION['role'];
        if ( (empty ( $name )) || 
	         (empty ( $permission )) || 
             (empty ( $profile_image )) ||
             (empty ( $access_token )) 
	   ) {
	       $_SESSION = array();
           session_destroy();
           $str = '{';
           $str .= '"status" : "Failed"';
	       $str .= '}';
	       echo $str;
	   } else {
           $str = '{';
           $str .= '"name" : "'.$name.'", "profile_image" : "'.$profile_image.'",'.'"status" : "Success",';
           $str .= '"role" : "'.$role.'"';
	       $str .= '}';
	       echo $str; 
	   }
    }

    function logout_user ( ) {
        $access_token = $_SESSION['access_token'];
        $_SESSION = array();
    	session_destroy();
        $str = '{';
        $str .= '"access_token" : "'.$access_token.'"'; 
        $str .= '}';
        echo $str;
    }

    function get_user_email ( ) {
        $email = $_SESSION['email'];
        $access_token= $_SESSION['access_token'];
        $str = '{';
        $str .= '"email" : '.$email.', "at" : "'.$access_token.'"';
        $str .= '}';
        echo $str;
    }

    function getat( ) {
        $access_token = $_SESSION['access_token'];
        $str = '{';
        $str .= '"access_token" : "'.$access_token.'"';
        $str .= '}';
        echo $str;
    }

    function get_full_details( ) {
        $name = $_SESSION['name'];
        $permission = $_SESSION['permission'];
        $profile_image = $_SESSION['profile_image'];
        $access_token = $_SESSION['access_token'];
        $role = $_SESSION['role'];
        $email = $_SESSION['email'];
        if ( (empty ( $name )) || 
	         (empty ( $permission )) || 
             (empty ( $profile_image )) ||
             (empty ( $email)) ||
             (empty ( $access_token )) 
	   ) {
	       $_SESSION = array();
           session_destroy();
           $str = '{';
           $str .= '"status" : "Failed"';
	       $str .= '}';
	       echo $str;
	   } else {
           $str = '{';
           $str .= '"name" : "'.$name.'", "profile_image" : "'.$profile_image.'",'.'"status" : "Success",';
           $str .= '"role" : "'.$role.'", "permission" : "'.$permission.'", "access_token" : "'.$access_token.'"';
	       $str .= '}';
	       echo $str; 
	   }
    }

    function clear_session () {
        $_SESSION = array();
        session_destroy();
    }

    function update_profile_details () {
        $name = $_POST['name']; 
        $update_name = 0;
        $uploadOk = 1;

        if ( ( $name ) && 
             ( strlen($name) < 8 ) && 
             ( strcmp($name, $_SESSION['name'])  ) &&
             ( ctype_alnum( $name ) ) 
         ) $update_name = 1;
        else 
            $update_name = 0;


        //Update profile name 
        if ( $update_name ) {
            $row = "name = ".'"'.$name.'"';
            $cond = "Email=".$_SESSION['email'];
            updaterecs ( 'users', $row, $cond);
            $_SESSION['name'] = $name;
            $pname_errmsg = "Profile Name Changed Successfully";
        } else {
            $pname_errmsg = 'Failure';
        }

        if(is_uploaded_file($_FILES['imgfile']['tmp_name']))  {
            $target_dir = "../services/";
            $target_file = $target_dir . basename($_FILES["imgfile"]["name"]);
            $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

            $check = getimagesize($_FILES["imgfile"]["tmp_name"]);
            if($check !== false) {
                $msg = "File is an image - " . $check["mime"] . ".";
                $uploadOk = 1;
            } else { $msg = "Please upload valid image file";
                $uploadOk = 0;
            }

            // Check file size
            if ($_FILES["imgfile"]["size"] > 500000) {
                $msg = "Sorry, your file is too large.";
                $uploadOk = 0;
            }

            // Allow certain file formats
            if( $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && 
                $imageFileType != "JPG" && $imageFileType != "PNG" && $imageFileType != "JPEG"
            ) {
                $msg = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
                $uploadOk = 0;
            }


           $sourcePath = $_FILES['imgfile']['tmp_name'];
           $targetPath = $target_file;

           // Check if $uploadOk is set to 0 by an error
           if ( $uploadOk == 0 ) {
               if (!$msg ) $msg = "Sorry, your file was not uploaded.";
               // if everything is ok, try to upload file
            } else {
                $temp = explode(".", $_FILES["imgfile"]["name"]);
                
//                $newfilename = '../services/'.substr($_SESSION['profile_image'], 0, -4 ) . '.' . end($temp);
                $newfilename = '../services/'.$_SESSION['profile_image'];
                $img = substr($_SESSION['profile_image'], 0, -4 ) . '.' . end($temp);

                if (move_uploaded_file($sourcePath, $newfilename)) {
                    $_SESSION['profile_image'] =  $img;
                    $msg = "Profile image changed successfully";

                } else {
                    $msg = "Sorry, there was an error uploading your file.";
                }
            }
        } else {
            if ( !$msg ) $msg = "Failure";
        }

        $str = '{';
        $str .= '"pname_errmsg" : "'.$pname_errmsg.'",';
        $str .= '"msg" : "'.$msg.'"';
        $str .= '}';
        echo $str;
    }

function get_files () {
    var_dump ( $_FILES['file']);
}

?>



