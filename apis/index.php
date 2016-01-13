<?php
session_start();
//mail Settings

include "inc/dbconn.php";
include "inc/function.php";
include "apis/get_user_details.php";

if (isset($_POST['action']) && ! empty($_POST['action'])) {
    $action = $_POST['action'];
} elseif (isset($_GET['action']) && ! empty($_GET['action'])) {
    $action = $_GET['action'];
}

switch ($action){
    case 'fcr_dashboard':
        fcr_dashboard();
        break;
    case 'getCountryList':
        getCountryList();
        break;
    case 'getCountryDetails':
        getCountryDetails();
        break;
    case 'getCustomerVoice':
        getCustomerVoice();
        break;
    case 'getLocations':
        getLocations();
        break;
    case 'getModels':
        getModels();
        break;
    case 'getCategories':
        getCategories();
        break;
    case 'getSubCategories':
        getSubCategories();
        break;
    case 'getPartDetails':
        getPartDetails();
        break;
    case 'notice_board':
        notice_board();
        break;
    case 'getCVCirculars':
        getCvCirculars();
        break;
    case 'getMcCirculars':
        getMcCirculars();
        break;
    case 'getKtmModels':
        getKtmModels();
        break;
    case 'getKtmCategories':
        getKtmCategories();
        break;
    case 'getKtmPartDetails':
        getKtmPartDetails();
        break;
    case 'getmcmodels':
        getMcModels();
        break;
    case 'getmcsubcategories':
        getMcSubCategories();
        break;
    case 'getavengerplates':
        getAvengerPlates();
        break;
    case 'getmcpartDetails':
        getMcPartDetails();
        break;
    case 'getavengerpartDetails':
        getAvengerPartDetails();
        break;
    case 'mc_notice_board':
        mc_notice_board();
        break;
    case 'getbikemcmodels':
        getbikemcmodels();
        break;
    case 'getmcbikecategories':
        getmcbikecategories();
        break;
    case 'geteco_PartDetails':
        geteco_PartDetails();
        break;
    case 'getktmrc200partdetails':
        getKtmRC200PartDetails();
        break;
    case 'getKtmrc200390partdetails':
        getKtmRC_200_390PartDetails();
        break;

}

function fcr_dashboard(){

    $failure_count = singlefield("count(id)","failure", "active=1");
    $success_count = singlefield("count(id)", "complaint","active=1");
    // $customer_voice = singlefield("count(id)", "complaint","active=1");
    
    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "FCR",
                "legend" : [
                    {
                        "title" : "Complaints/Failures",
                        "data" : [
                            {
                                "count" : "'.$success_count.'",
                                "name" : "Complaints"
                            },
                            {
                                "count" : "'.$failure_count.'",
                                "name" : "Failure"
                            }
                        ]
                    },
                    {
                        "title" : "Customer Voice",
                        "data" : [
                            {
                                "count" : "0",
                                "name" : ""
                            }
                        ]
                    }
                ]
            }';
    echo $str;

}

function getCountryList() {
    $rows = selectrec("country_id, country_name", "country", "active=1");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "FCR",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"country_id" : "'.$row[0].'", "country_name" : "'.$row[1].'", "complaint" : "0", "failure" : "0"},';
                }

                if(count($rows)>0)
                $str = substr($str,0,-1);

                $str .= "]
            }";

    echo $str;
}


function getCountryID($userID) {
    $countryID = singlefield("country_id", "users", "ID = '".$userID."' ");
}


function getCountryDetails() {

    // $userCountryID = getCountryID(singlefield("id", "complaint", "active=1"));

    if(isset($_GET['countryId'])){ $countryID=urldecode($_GET['countryId']); }

    $group_count = singlefield("count(id)","complaint", "active=1");

    $rows = selectrec("emp_code","users", "desig_id != 1 and country_id=".$countryID );

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "FCR",
                "complaint_captured" : "'.$group_count.'",
                "legend" : [';
                    foreach ($rows as $row) {
                        $str .= '{"emp_code" : "'.$row[0].'",
                                  "failure_count":"'.singlefield("count(id)","failure","active=1 and updated_by='".$row[0]."'").'",
                                  "complaint_count" : "'.singlefield("count(id)","complaint","active=1 and updated_by='".$row[0]."'").'",
                                  "complaint_24" : "'.singlefield("count(id)", "complaint", "job_completed_date > DATE_SUB(NOW(), INTERVAL 24 HOUR) AND job_completed_date <= NOW() and updated_by='".$row[0]."'").'",
                                  "complaint_48" : "'.singlefield("count(id)", "complaint", "job_completed_date > DATE_SUB(NOW(), INTERVAL 48 HOUR) AND job_completed_date <= DATE_SUB(NOW(), INTERVAL 24 HOUR) and updated_by='".$row[0]."'").'",
                                  "complaint_72" : "'.singlefield("count(id)", "complaint", "job_completed_date > DATE_SUB(NOW(), INTERVAL 72 HOUR) AND job_completed_date <= DATE_SUB(NOW(), INTERVAL 48 HOUR) and updated_by='".$row[0]."'").'",
                                  "complaint_g_72" : "'.singlefield("count(id)", "complaint", "job_completed_date < DATE_SUB(NOW(), INTERVAL 72 HOUR) and updated_by='".$row[0]."'").'"
                                },';
                    }
                    

                    if(count($rows)>0) {
                        $str = substr($str,0,-1);       
                    }
                
                $str .= "]
            }";
    echo $str;
}

function getCustomerVoice() {
    if(isset($_GET['countryId'])){ $countryID=urldecode($_GET['countryId']); }

    if(isset($_GET['typeID'])){ $typeID=urldecode($_GET['typeID']); }

    if($typeID == "1") {
        $cond = "";
        $rows = [];
    } elseif ($typeID == "2" || $typeID == "3") {

        if($typeID=="2")
            $rows = selectrec("customer_voice_id","complaint_details");
        else
            $rows = selectrec("customer_voice_id","failure_details");

        $voiceIds = array();
        foreach ($rows as $row) {
            $voiceIds[] = $row[0];
        }

        if(count($voiceIds)==0)
            $cond = "";
        else
            $cond = " and customer_voice_id in(".implode($voiceIds).")";

    } 

    $rows = selectrec("customer_voice_id, customer_voice", "customer_voice", "active=1 ".$cond);

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "FCR",
                "legend" : [';
                    foreach ($rows as $row) {
                        $str .= '{"id" : "'.$row[0].'",
                                  "description" : "'.$row[1].'"
                                },';
                    }
                    

                    if(count($rows)>0) {
                        $str = substr($str,0,-1);       
                    }
                
                $str .= "]
            }";

    echo $str;

}

function getLocations() {

    if(isset($_GET['countryId'])){ $countryID=urldecode($_GET['countryId']); }

    $rows = selectrec("location_id, location_name", "locations", "active=1 and country_id = '".$countryID."' ");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "FCR",
                "legend" : [';
                    foreach ($rows as $row) {
                        $str .= '{"id" : "'.$row[0].'",
                                  "location" : "'.$row[1].'"
                                },';
                    }
                    

                    if(count($rows)>0) {
                        $str = substr($str,0,-1);       
                    }
                
                $str .= "]
            }";

    echo $str;

}

function getModels(){
    if ( !$_SESSION['permission_list']['cv'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $rows = selectrec("model_id, model_name, img_url", "epc_models", "active=1");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Commercial Vehicle",
                "msg" : "success",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"status":"'.singlefield("count(category_id)","epc_categories","model_id=".$row[0]).'","model_id" : "'.$row[0].'", "model_name" : "'.$row[1].'", "img_url" : "'.$row[2].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]
            }";

    echo $str;

}

function getCategories() {
    if ( !$_SESSION['permission_list']['cv'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $model_id = $_GET['model'];

    $rows = selectrec("category_id, category_name, short_name, styleClass, img_url, groupBy", "epc_categories", "active=1 and model_id=".$model_id);

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Commercial Vehicle",
                "msg" : "success",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"status":"'.singlefield("count(subcategory_id)","epc_cv_subcategories","category_id=".$row[0]).'", "category_id" : "'.$row[0].'", "category_name" : "'.$row[1].'", "short_name" : "'.$row[2].'", "styleClass" : "'.$row[3].'", "img_url" : "'.$row[4].'", "groupBy" : "'.$row[5].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]
            }";

    echo $str;
}

function getSubCategories() {
    if ( !$_SESSION['permission_list']['cv'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $category_id = $_GET['category'];
    $model_id = $_GET['model'];

    $rows = selectrec("subcategory_id, subcategory_name, img_url", "epc_cv_subcategories", "active=1 and category_id=".$category_id. " and model_id=".$model_id);

    $plate_ids = array();
    foreach($rows as $row ){
        array_push( $plate_ids, $row[0]);
    }
    
    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Commercial Vehicle",
                "msg" : "success",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"status":"'.singlefield("count(part_details_id)","epc_part_details","subcategory_id=".$row[0]).'","subcategory_id" : "'.$row[0].'", "subcategory_name" : "'.$row[1].'", "img_url" : "'.$row[2].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= '], "first_plate_id" : "'.min($plate_ids).'","last_plate_id" : "'.max($plate_ids).'"
            }';

    echo $str;
}

function geteco_PartDetails() {
    if ( !$_SESSION['permission_list']['cv'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $plateID = $_GET['plateID'];
    $rows = selectrec("part_details_id, part_details_name, img_url, published_date", "epc_cv_eco_part_details", "active=1 and subcategory_id=".$plateID);

    $maps = selectrec("href, coords", "epc_cv_eco_details_map", "active=1 and subcategory_id=".$plateID);

    $sboms = selectrec("map_id, part_no, description, quantity, remarks, eco_status", "epc_cv_eco_sbom", "active=1 and subcategory_id=".$plateID);

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "msg" : "success",
                "category" : "Commercial Vehicle",
                "sub_category" : "Electronic Parts Catelogue",';
                foreach($rows as $row) {
                    $str .= '"part_details_id" : "'.$row[0].'", "part_details_name" : "'.$row[1].'", "img_url" : "'.$row[2].'", "published_date" : "'.$row[3].'",';
                }

                
                $str .= '"maps" : [';

                foreach($maps as $map) {
                    $str .= '{"href" : "'.$map[0].'", "coords" : "'.$map[1].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]";

                $str .= ",";
                $str .= '"sboms" : [';


                foreach($sboms as $sbom) {
                    $str .= '{"map_id" : "'.$sbom[0].'", "part_no" : "'.$sbom[1].'", "description" : "'.$sbom[2].'", "quantity" : "'.$sbom[3].'", "remarks" : "'.$sbom[4].'", "eco_status" : "'.$sbom[5].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]}";

    echo $str;
}

function getPartDetails() {
    if ( !$_SESSION['permission_list']['cv'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $plateID = $_GET['plateID'];
    $model_id = $_GET['model'];
    $category_id = $_GET['category'];

    $rows = selectrec("part_details_id, part_details_name, img_url, published_date", "epc_part_details", "active=1 and subcategory_id=".$plateID. " and model_id=".$model_id. " and category_id=".$category_id);

    $maps = selectrec("href, coord", "epc_part_details_map", "active=1 and subcategory_id=".$plateID. " and model_id=".$model_id. " and category_id=".$category_id);

    $sboms = selectrec("map_id, part_no, description, quantity, remarks, eco_status", "epc_part_details_sbom", "active=1 and subcategory_id=".$plateID. " and model_id=".$model_id. " and category_id=".$category_id);

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Commercial Vehicle",
                "msg" : "success",
                "sub_category" : "Electronic Parts Catelogue",';
                foreach($rows as $row) {
                    $str .= '"part_details_id" : "'.$row[0].'", "part_details_name" : "'.$row[1].'", "img_url" : "'.$row[2].'", "published_date" : "'.$row[3].'",';
                }

                
                $str .= '"maps" : [';

                foreach($maps as $map) {
                    $str .= '{"href" : "'.$map[0].'", "coords" : "'.$map[1].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]";

                $str .= ",";
                $str .= '"sboms" : [';


                foreach($sboms as $sbom) {
                    $str .= '{"map_id" : "'.$sbom[0].'", "part_no" : "'.$sbom[1].'", "description" : "'.$sbom[2].'", "quantity" : "'.$sbom[3].'", "remarks" : "'.$sbom[4].'", "eco_status" : "'.$sbom[5].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]}";


    echo $str;
}

function mc_notice_board() {
    if ( !$_SESSION['permission_list']['motorcycle'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $rows = selectrec("notice_board_id, date_created, img_src, description", "epc_mc_notice_board", "active=1 and category_id=5");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Motorcycle",
                "msg" : "success",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"notice_board_id" : "'.$row[0].'", "date_created" : "'.$row[1].'", "img_url" : "'.$row[2].'", "description" : "'.$row[3].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]
            }";

    echo $str;
}

 
function notice_board() {
    if ( !$_SESSION['permission_list']['cv'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $rows = selectrec("notice_board_id, date_created, img_src, description", "epc_notice_board", "active=1 and category_id=1");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "msg" : "success",
                "product" : "Aftersell",
                "category" : "Commercial Vehicle",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"notice_board_id" : "'.$row[0].'", "date_created" : "'.$row[1].'", "img_url" : "'.$row[2].'", "description" : "'.$row[3].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]
            }";

    echo $str;
}

function getCvCirculars() {
    if ( !$_SESSION['permission_list']['cv'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $rows = selectrec("circular_id, product_type, group_name, bulletin_type, bulletin_id, bulletin_desc, plates, date, pdf_link", "epc_cv_circulars",  "active=1 and category_id=5");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "msg" : "success",
                "category" : "Commercial Vehicle",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"circular_id" : "'.$row[0].'", "product_type" : "'.$row[1].'", "group_name" : "'.$row[2].'", "bulletin_type" : "'.$row[3].'", "bulletin_id" : "'.$row[4].'", "bulletin_desc" : "'.$row[5].'", "plates" : "'.$row[6].'", "date" : "'.$row[7].'", "pdf_doc" : "'.$row[8].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]
            }";

    echo $str;

}

function getKtmModels() {
    if ( !$_SESSION['permission_list']['pb'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $rows = selectrec("model_id, model_name, img_url", "epc_ktm_models", "active=1");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Probiking",
                "msg" : "success",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"status":"'.singlefield("count(category_id)","epc_ktm_categories","model_id=".$row[0]).'", "model_id" : "'.$row[0].'", "model_name" : "'.$row[1].'", "img_url" : "'.$row[2].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]
            }";

    echo $str;
}

function getKtmCategories() {
    if ( !$_SESSION['permission_list']['pb'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $modelID = $_GET['modelID'];
    $rows = selectrec("category_id, plate_name, img_url", "epc_ktm_categories", "active=1 and model_id=".$modelID);

    $plate_ids = array();
    foreach($rows as $row ){
        array_push( $plate_ids, $row[0]);
    }
    
    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Probiking",
                "sub_category" : "Electronic Parts Catelogue",
                "msg" : "success",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"status":"'.singlefield("count(part_details_id)","epc_ktm_part_details","part_details_id=".$row[0]).'", "category_id" : "'.$row[0].'", "plate_name" : "'.$row[1].'", "img_url" : "'.$row[2].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= '], "first_plate_id" : "'.min($plate_ids).'","last_plate_id" : "'.max($plate_ids).'"
            }';

    echo $str;
}

function getKtmRC_200_390PartDetails() {
    if ( !$_SESSION['permission_list']['pb'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $categoryID = $_GET['categoryID'];

    $rows = selectrec("part_details_id, part_details_name, img_url, published_date", "epc_ktm_part_details", "active=1 and category_id=".$categoryID." and model_id=3");

    $maps = selectrec("href, coord", "epc_ktm_part_details_map", "active=1 and category_id=".$categoryID." and model_id=3");

    $sboms = selectrec("map_id, map_image, part_no, description, qty_RC_200, qty_RC_390, change_reason", "ktm_rc_200_390_sbom", "active=1 and category_id=".$categoryID." and model_id=3");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Probiking",
                "msg" : "success",
                "sub_category" : "Electronic Parts Catelogue",';
                foreach($rows as $row) {
                    $str .= '"part_details_id" : "'.$row[0].'", "part_details_name" : "'.$row[1].'", "img_url" : "'.$row[2].'", "published_date" : "'.$row[3].'",';
                }

                
                $str .= '"maps" : [';

                foreach($maps as $map) {
                    $str .= '{"href" : "'.$map[0].'", "coords" : "'.$map[1].'"},';
                }

                if(count($maps)>0)
                    $str = substr($str,0,-1);

                $str .= "]";

                $str .= ",";
                $str .= '"sboms" : [';


                foreach($sboms as $sbom) {
                    $str .= '{"map_id" : "'.$sbom[0].'", "map_image" : "'.$sbom[1].'", "part_no" : "'.$sbom[2].'", "description" : "'.$sbom[3].'", "qty_RC_200" : "'.$sbom[4].'", "qty_RC_390" : "'.$sbom[5].'", "change_reason" : "'.$sbom[6].'"},';
                }

                if(count($sboms)>0)
                    $str = substr($str,0,-1);

                $str .= "]}";


    echo $str;
}

function getKtmRC200PartDetails() {
    if ( !$_SESSION['permission_list']['pb'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $categoryID = $_GET['categoryID'];
    // $modelID = $_GET['modelID'];

    $rows = selectrec("part_details_id, part_details_name, img_url, published_date", "epc_ktm_part_details", "active=1 and category_id=".$categoryID." and model_id=2");

    $maps = selectrec("href, coord", "epc_ktm_part_details_map", "active=1 and category_id=".$categoryID." and model_id=2");

    $sboms = selectrec("map_id, map_image, part_no, description, qty_MY13, qty_MY14, qty_MY15", "ktm_duke_200_sbom", "active=1 and category_id=".$categoryID." and model_id=2");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Probiking",
                "msg" : "success",
                "sub_category" : "Electronic Parts Catelogue",';
                foreach($rows as $row) {
                    $str .= '"part_details_id" : "'.$row[0].'", "part_details_name" : "'.$row[1].'", "img_url" : "'.$row[2].'", "published_date" : "'.$row[3].'",';
                }

                
                $str .= '"maps" : [';

                foreach($maps as $map) {
                    $str .= '{"href" : "'.$map[0].'", "coords" : "'.$map[1].'"},';
                }

                if(count($maps)>0)
                    $str = substr($str,0,-1);

                $str .= "]";

                $str .= ",";
                $str .= '"sboms" : [';


                foreach($sboms as $sbom) {
                    $str .= '{"map_id" : "'.$sbom[0].'", "map_image" : "'.$sbom[1].'", "part_no" : "'.$sbom[2].'", "description" : "'.$sbom[3].'", "my_13" : "'.$sbom[4].'", "my_14" : "'.$sbom[5].'", "my_15" : "'.$sbom[6].'"},';
                }

                if(count($sboms)>0)
                    $str = substr($str,0,-1);

                $str .= "]}";


    echo $str;
}

function getKtmPartDetails() {
    if ( !$_SESSION['permission_list']['pb'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $categoryID = $_GET['categoryID'];
    $modelID = $_GET['modelID'];

    $rows = selectrec("part_details_id, part_details_name, img_url, published_date", "epc_ktm_part_details", "active=1 and category_id=".$categoryID." and model_id=".$modelID);

    $maps = selectrec("href, coord", "epc_ktm_part_details_map", "active=1 and category_id=".$categoryID." and model_id=".$modelID);

    $sboms = selectrec("map_id, part_no, description, qty_my_13, qty_my_14, qty_my_15, map_image", "epc_ktm_part_details_sbom", "active=1 and category_id=".$categoryID." and model_id=".$modelID);

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Probiking",
                "msg" : "success",
                "sub_category" : "Electronic Parts Catelogue",';
                foreach($rows as $row) {
                    $str .= '"part_details_id" : "'.$row[0].'", "part_details_name" : "'.$row[1].'", "img_url" : "'.$row[2].'", "published_date" : "'.$row[3].'",';
                }

                
                $str .= '"maps" : [';

                foreach($maps as $map) {
                    $str .= '{"href" : "'.$map[0].'", "coords" : "'.$map[1].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]";

                $str .= ",";
                $str .= '"sboms" : [';


                foreach($sboms as $sbom) {
                    $str .= '{"map_id" : "'.$sbom[0].'", "map_image" : "'.$sbom[6].'", "part_no" : "'.$sbom[1].'", "description" : "'.$sbom[2].'", "qty_my_13" : "'.$sbom[3].'", "qty_my_14" : "'.$sbom[4].'", "qty_my_15" : "'.$sbom[5].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]}";


    echo $str;
}

function getbikemcmodels() {
    if ( !$_SESSION['permission_list']['motorcycle'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $rows = selectrec("model_id, model_name, img_src", "epc_mc_bikemodels", "active=1");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "msg" : "success",
                "product" : "Aftersell",
                "category" : "Motorcycle",
                "sub_category" : "Electronic Parts Catalogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"status":"'.singlefield("count(category_id)","epc_mc_bikecategories","model_id=".$row[0]).'","model_id" : "'.$row[0].'", "model_name" : "'.$row[1].'", "img_url" : "'.$row[2].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]
            }";

    echo $str;  
}

function getmcbikecategories() {
    if ( !$_SESSION['permission_list']['motorcycle'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $model_id = $_GET['model'];

    $rows = selectrec("category_id, category_name, img_url", "epc_mc_bikecategories", "active=1 and model_id=".$model_id);

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "msg" : "success",
                "product" : "Aftersell",
                "category" : "Motorcycle",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"status":"'.singlefield("count(subcategory_id)","epc_mc_subcategory","category_id=".$row[0]).'", "category_id" : "'.$row[0].'", "category_name" : "'.$row[1].'", "img_url" : "'.$row[2].'"},';                    
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]
            }";

    echo $str;

}

function getAvengerPlates() {
    if ( !$_SESSION['permission_list']['motorcycle'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }
    $model_id = $_GET['model'];

    $rows = selectrec("subcategory_id, subcategory_name, img_url", "epc_mc_subcategory", "active=1 and category_id=10 and model_id=".$model_id);

        $plate_ids = array();
    foreach($rows as $row ){
        array_push( $plate_ids, $row[0]);
    }
    
    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "msg" : "success",
                "product" : "Aftersell",
                "category" : "Motorcycle",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"status":"'.singlefield("count(part_details_id)","epc_mc_part_details","part_details_id=".$row[0]).'","subcategory_id" : "'.$row[0].'", "subcategory_name" : "'.$row[1].'", "img_url" : "'.$row[2].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= '], "first_plate_id" : "'.min($plate_ids).'","last_plate_id" : "'.max($plate_ids).'"
            }';

    echo $str;  
}

function getMcSubCategories() {
    if ( !$_SESSION['permission_list']['motorcycle'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }

    $category_id = $_GET['category'];
    $model_id = $_GET['model'];

    $rows = selectrec("subcategory_id, subcategory_name, img_url", "epc_mc_subcategory", "active=1 and category_id=".$category_id. " and model_id=".$model_id);
    
    $plate_ids = array();
    foreach($rows as $row ){
        array_push( $plate_ids, $row[0]);
    }

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "msg" : "success",
                "category" : "Motorcycle",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"status":"'.singlefield("count(part_details_id)","epc_mc_part_details","part_details_id=".$row[0]).'","subcategory_id" : "'.$row[0].'", "subcategory_name" : "'.$row[1].'", "img_url" : "'.$row[2].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= '], "first_plate_id" : "'.min($plate_ids).'","last_plate_id" : "'.max($plate_ids).'"
            }';
            
    echo $str;
}

function getAvengerPartDetails() {
    if ( !$_SESSION['permission_list']['motorcycle'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }

    $plateID = $_GET['plateID'];
    $category_id = 10;
    $model_id = $_GET['model'];

    $rows = selectrec("part_details_id, part_details_name, img_url, published_date", "epc_mc_part_details", "active=1 and subcategory_id=".$plateID. " and category_id=".$category_id. " and model_id=".$model_id);

    $maps = selectrec("href, coord", "epc_mc_part_details_map", "active=1 and subcategory_id=".$plateID. " and category_id=".$category_id. " and model_id=".$model_id);

    $sboms = selectrec("map_id, part_no, description, quantity, remarks", "epc_mc_part_details_sbom", "active=1 and subcategory_id=".$plateID. " and category_id=".$category_id. " and model_id=".$model_id);

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "msg" : "success",
                "category" : "Motorcycle",
                "sub_category" : "Electronic Parts Catelogue",';
                foreach($rows as $row) {
                    $str .= '"part_details_id" : "'.$row[0].'", "part_details_name" : "'.$row[1].'", "img_url" : "'.$row[2].'", "published_date" : "'.$row[3].'",';
                }

                
                $str .= '"maps" : [';

                foreach($maps as $map) {
                    $str .= '{"href" : "'.$map[0].'", "coords" : "'.$map[1].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]";

                $str .= ",";
                $str .= '"sboms" : [';


                foreach($sboms as $sbom) {
                    $str .= '{"map_id" : "'.$sbom[0].'", "part_no" : "'.$sbom[1].'", "description" : "'.$sbom[2].'", "quantity" : "'.$sbom[3].'", "remarks" : "'.$sbom[4].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]}";


    echo $str;
}

function getMcPartDetails() {
    if ( !$_SESSION['permission_list']['motorcycle'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }

    $plateID = $_GET['plateID'];
    $category_id = $_GET['category'];
    $model_id = $_GET['model'];

    $rows = selectrec("part_details_id, part_details_name, img_url, published_date", "epc_mc_part_details", "active=1 and subcategory_id=".$plateID. " and category_id=".$category_id. " and model_id=".$model_id);

    $maps = selectrec("href, coord", "epc_mc_part_details_map", "active=1 and subcategory_id=".$plateID. " and category_id=".$category_id. " and model_id=".$model_id);

    if ( 
        (($model_id == 4) && ($category_id==11))|| 
        (($model_id == 3) && ($category_id==9)) || 
        (($model_id == 3) && ($category_id==15))||
        (($model_id == 1) && ($category_id==2)) ||
        (($model_id == 1) && ($category_id==3)) ||
        (($model_id == 1) && ($category_id==7))
    ) {
        $sboms = selectrec("map_id, part_no, description, quantity, remarks, qty_ES, qty_KS", "epc_mc_part_details_sbom", "active=1 and subcategory_id=".$plateID. " and category_id=".$category_id. " and model_id=".$model_id);
    }else {
        $sboms = selectrec("map_id, part_no, description, quantity, remarks", "epc_mc_part_details_sbom", "active=1 and subcategory_id=".$plateID. " and category_id=".$category_id. " and model_id=".$model_id);
    }
    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "category" : "Motorcycle",
                "msg" : "success",
                "sub_category" : "Electronic Parts Catelogue",';
                foreach($rows as $row) {
                    $str .= '"part_details_id" : "'.$row[0].'", "part_details_name" : "'.$row[1].'", "img_url" : "'.$row[2].'", "published_date" : "'.$row[3].'",';
                }

                
                $str .= '"maps" : [';

                foreach($maps as $map) {
                    $str .= '{"href" : "'.$map[0].'", "coords" : "'.$map[1].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]";

                $str .= ",";
                $str .= '"sboms" : [';

                if ( 
                    (($model_id==4) && ($category_id==11 ))|| 
                    (($model_id==3) && ($category_id==9))  ||
                    (($model_id==3) && ($category_id==15)) ||
                    (($model_id==1) && ($category_id==2))  ||
                    (($model_id==1) && ($category_id==7))  ||
                    (($model_id==1) && ($category_id==3)) 
                ) {
                    foreach($sboms as $sbom) {
                        $str .= '{"map_id" : "'.$sbom[0].'", "part_no" : "'.$sbom[1].'", "description" : "'.$sbom[2].'", "remarks" : "'.$sbom[4].'", "qty_ES" : "'.$sbom[5].'", "qty_KS" : "'.$sbom[6].'"},';
                    }
                }else {
                    foreach($sboms as $sbom) {
                        $str .= '{"map_id" : "'.$sbom[0].'", "part_no" : "'.$sbom[1].'", "description" : "'.$sbom[2].'", "quantity" : "'.$sbom[3].'", "remarks" : "'.$sbom[4].'"},';
                    }
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]}";


    echo $str;
}

function getMcCirculars() {
    if ( !$_SESSION['permission_list']['motorcycle'] ) {
        $str = '{';
        $str .= '"msg" : "Failure"';
        $str.= '}';
        echo $str;
        return;
    }

    $rows = selectrec("circular_id, product_type, group_name, bulletin_type, bulletin_id, bulletin_desc, plates, date, pdf_link", "epc_mc_circulars",  "active=1 and category_id=1");

    $str = '{
                "Brand" : "Bajaj Auto Ltd",
                "product" : "Aftersell",
                "msg" : "success",
                "category" : "Commercial Vehicle",
                "sub_category" : "Electronic Parts Catelogue",
                "legend" : [';
                foreach($rows as $row) {
                    $str .= '{"circular_id" : "'.$row[0].'", "product_type" : "'.$row[1].'", "group_name" : "'.$row[2].'", "bulletin_type" : "'.$row[3].'", "bulletin_id" : "'.$row[4].'", "bulletin_desc" : "'.$row[5].'", "plates" : "'.$row[6].'", "date" : "'.$row[7].'", "pdf_doc" : "'.$row[8].'"},';
                }

                if(count($rows)>0)
                    $str = substr($str,0,-1);

                $str .= "]
            }";

    echo $str;

}
?>
