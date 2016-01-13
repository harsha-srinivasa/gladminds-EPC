<?php

$timezone = "Asia/Calcutta";
if(function_exists('date_default_timezone_set')) date_default_timezone_set($timezone); 


// These functions are defined by Karthik
//******************************************************************************
// Function to select record from the table
//******************************************************************************
function singlefield($fields,$table,$cond="")
{
  $query = "select ".$fields." from ". $table;
    if(!($cond==""))
      $query = $query." where ".$cond;
      //echo $query;

    $result    = mysql_query($query);
    $z="";
    if(mysql_num_rows($result)>0)
    { 
      $row=mysql_fetch_object($result);
      $z = $row->$fields;
    }
    mysql_free_result($result);
    return $z;
}


function singlerec($fields,$table,$cond="")
{
  $query = "select ".$fields." from ". $table;
  if(!($cond==""))
  $query = $query." where ".$cond." LIMIT 1";
  //echo $query;

  $result = mysql_query($query);

  return $result;
}


function selectrec($fields,$table,$cond=""){
  $a = array();
  $query = "select ".$fields." from ". $table;
  if(!($cond==""))
    $query = $query." where ".$cond;
  // echo "<br>".$query;
  $result    = mysql_query($query);

  //echo mysql_error();
  //if (mysql_error()!="")
  //echo "<br>".$query;

  $numrows   = mysql_num_rows($result);
  $numfields = mysql_num_fields($result);

  $i=$j=0;

  while ($i < $numrows)
  {
    while($j < $numfields)
    {
        $a[$i][$j] = mysql_result($result,$i,mysql_field_name($result, $j));
        $j++;
    }
    $i++;
    $j=0;
  }

  mysql_free_result($result);
  return $a;
}

function insertrec($table,$fields,$value){
    $query = "insert into `".$table ."` (". $fields .") VALUES (". $value .")";
    $z = mysql_query($query);
    //echo $query;

    //echo mysql_error();
    $lastUpdatedId = mysql_insert_id();
    return $lastUpdatedId;
}

function insertBlankrec($table)
{
    $query = "insert into `".$table ."` DEFAULT VALUES";
    $z = mysql_query($query);
    //echo $query;
    //echo mysql_error();
    $lastUpdatedId = mysql_insert_id();
    return $lastUpdatedId;
  
}

function duplicateRow($table,$fields,$value)
{
    $query = "insert into `".$table ."` (". $fields .") ". $value;
    $z = mysql_query($query);
    //echo $query;
	//echo mysql_error();
	$lastUpdatedId = mysql_insert_id();
    return $lastUpdatedId;
	
}

function updaterec($tabname,$fieldname,$newval,$cond)
{
	//if(singlefield($fieldname,$tabname))
	//{
		$query = "UPDATE ".$tabname." SET ". $fieldname." = ". $newval;
		if(!($cond==""))
			$query = $query." where ".$cond;
			//echo $query;
		$z = mysql_query($query);
		if($z)
			return $z;
	//}
	//else
	//{
		//$z = insertrec($tabname,$fieldname,$value)
	//}
}

function updaterecs($table,$col_val, $cond){
    $sql = "UPDATE ".$table." SET ".$col_val." WHERE ".$cond;

    //echo $sql;
    $result=mysql_query($sql);
    //echo mysql_error();
    return $result;
}

function moveData($table1,$table2,$clearAll=1){



	$sql = "INSERT INTO ".$table2." SELECT * FROM ".$table1;
	
	//echo $sql;
	$result=mysql_query($sql);

  if($clearAll==1){
    $sql = "DELETE FROM ".$table1;
    $result=mysql_query($sql);

	//echo mysql_error();
  }
	return $result;

}

function deleterec($table,$field,$value,$type="pending")
{
	
    //$query = "delete from `".$table."` WHERE `".$field."` = '".$value."'";
    //   echo $query;
	if($type=="delete")
	{
		//$query="update `".$table."` set deleted='a' where `".$field."` = '".$value."'";  //a - approved by admin
		$query = "delete from `".$table."` WHERE `".$field."` = ".$value."";
	}
	else if($type=="pending")
	{
		$query="update `".$table."` set deleted='y' where `".$field."` = '".$value."'";
	}
	else if($type=="restore")
	{
		$query="update `".$table."` set deleted='n' where `".$field."` = '".$value."'";
	}
	//echo $query;
    $z    = mysql_query($query);

    return $z;
}

    function selcolumn($tabname)
    {
        $result = mysql_query("SHOW COLUMNS FROM ".$tabname);
        $count = 0;
        while ($row=mysql_fetch_row($result))
        {
           $cnt = 0;
           foreach ($row as $item)
           {
               if ($cnt == 0)
               {
                   $cnames[$count] = $item;
                   $cnt++;
                   $count++;
               }
           }
        }
        return $cnames;
    }


    function printtable($fields, $tablename,$file=NULL)
    {
		$filename=isset($file) ? $file : "adminadd";
        $cc = selcolumn($tablename);
        $multable = selectrec($fields,$tablename,"deleted='n'");

        echo "<table width='80%' align='center' border=2><tr bgcolor='#666666' style='color: white'>";
          foreach($cc as $c)
          {
            echo "<td align='center'><b>".strtoupper($c)."</b></td>";
          }
         // echo "<td align='center'>&nbsp;</td>";
          echo "</tr>";


        for ($k=0;$k<=count($multable)-1;$k++)
        {
            echo "<tr>";
            for ($j=0;$j<=count($multable[0])-2;$j++)
            {
                echo "<td align='center'>".$multable[$k][$j]."</td>";
            }
            echo "<td align='center' width='80'>".showbuttons($_SESSION['AUSER'],$multable[$k][0],$filename,0)."</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
	function formatdate($datestg,$format="dmY",$sep="/")
	{
		$retdate=$datestg;
		if(strpos($datestg,"-")!==false)
		{
			if(strlen($datestg)>=10)
			{
				$a=split("-",$datestg);
				$year=$a[0];
				$month=$a[1];
				if(strlen($month)<2)
				{
					$month="0".$month;
				}
				$day=substr($a[2],0,2);
				if(strlen($day)<2)
				{
					$day="0".$day;
				}
				if($format=="dmY")
				{
					$retdate=$day.$sep.$month.$sep.$year;
				}
			}
		}
		return $retdate;
	}
	
	
	
	function DateAdd($interval, $number, $date) {

    $date_time_array = getdate($date);
    $hours = $date_time_array['hours'];
    $minutes = $date_time_array['minutes'];
    $seconds = $date_time_array['seconds'];
    $month = $date_time_array['mon'];
    $day = $date_time_array['mday'];
    $year = $date_time_array['year'];

    switch ($interval) {
    
        case 'yyyy':
            $year+=$number;
            break;
        case 'q':
            $year+=($number*3);
            break;
        case 'm':
            $month+=$number;
            break;
        case 'y':
        case 'd':
        case 'w':
            $day+=$number;
            break;
        case 'ww':
            $day+=($number*7);
            break;
        case 'h':
            $hours+=$number;
            break;
        case 'n':
            $minutes+=$number;
            break;
        case 's':
            $seconds+=$number; 
            break;            
    }
       $timestamp= mktime($hours,$minutes,$seconds,$month,$day,$year);
    return $timestamp;
}


// Functions for older versions of PHP



if ( !function_exists('htmlspecialchars_decode') )
{
    function htmlspecialchars_decode($text)
    {
        return strtr($text, array_flip(get_html_translation_table(HTML_SPECIALCHARS)));
    }
}


function splchars($col)
{
    //$col = str_replace("&amp;lt;", "<", $col); 
   // $col = str_replace("&amp;gt;", ">", $col); 
    $col = str_replace("&quot;", '"', $col); 
	$col = str_replace("'", "&#039;", $col); 
	//$col = str_replace("&squot;", "'", $col); 
	return $col;
}

function unsplchars( $string )
{
  $string = str_replace ( '&amp;', '&', $string );
  $string = str_replace ( '&#039;', '\'', $string );
  $string = str_replace ( '&quot;', '"', $string );
  $string = str_replace ( '&lt;', '<', $string );
  $string = str_replace ( '&gt;', '>', $string );
  return $string;
}


// function dateDiff($start, $end) {
//   $start_ts = strtotime($start);
//   $end_ts = strtotime($end);
//   $diff = $end_ts - $start_ts;
//   return round($diff / 86400);
// }


function pagination($per_page = 10, $page = 1, $url = '', $total){

  $adjacents = "2";

  $page = ($page == 0 ? 1 : $page);
  $start = ($page - 1) * $per_page;

  $prev = $page - 1;
  $next = $page + 1;
  $lastpage = ceil($total/$per_page);
  $lpm1 = $lastpage - 1;

  $pagination = "";
  if($lastpage > 1)
  {
    $pagination .= "<div class='pagination pagination-mini'><ul>";

 if ($page > 1){
      $pagination.= "<li><a href='{$url}$prev'>&laquo;</a></li>";
// $pagination.= "<li><a href='{$url}$lastpage'>Last</a></li>";
    }

     
    $pagination .= "<li class='details'><span>Page $page of $lastpage</span></li>";
    if ($lastpage < 7 + ($adjacents * 2))
    {
      for ($counter = 1; $counter <= $lastpage; $counter++)
      {


        if ($counter == $page)
          $pagination.= "<li class='current active'><span>$counter</span></li>";
        else
          $pagination.= "<li><a href='{$url}$counter'>$counter</a></li>";
      }
    }
    elseif($lastpage > 5 + ($adjacents * 2))
    {
      if($page < 1 + ($adjacents * 2))
      {
        for ($counter = 1; $counter < 4 + ($adjacents * 2); $counter++)
        {
          if ($counter == $page)
            $pagination.= "<li class='current active'><span>$counter</span></li>";
          else
            $pagination.= "<li><a href='{$url}$counter'>$counter</a></li>";
        }
        $pagination.= "<li class='dot'>...</li>";
        $pagination.= "<li><a href='{$url}$lpm1'>$lpm1</a></li>";
        $pagination.= "<li><a href='{$url}$lastpage'>$lastpage</a></li>";
      }
      elseif($lastpage - ($adjacents * 2) > $page && $page > ($adjacents * 2))
      {
        $pagination.= "<li><a href='{$url}1'>1</a></li>";
        $pagination.= "<li><a href='{$url}2'>2</a></li>";
        $pagination.= "<li class='dot'>...</li>";
        for ($counter = $page - $adjacents; $counter <= $page + $adjacents; $counter++)
        {
          if ($counter == $page)
            $pagination.= "<li class='current active'><span>$counter</span></li>";
          else
            $pagination.= "<li><a href='{$url}$counter'>$counter</a></li>";
        }
        $pagination.= "<li class='dot'>..</li>";
        $pagination.= "<li><a href='{$url}$lpm1'>$lpm1</a></li>";
        $pagination.= "<li><a href='{$url}$lastpage'>$lastpage</a></li>";
      }
      else
      {
        $pagination.= "<li><a href='{$url}1'>1</a></li>";
        $pagination.= "<li><a href='{$url}2'>2</a></li>";
        $pagination.= "<li class='dot'>..</li>";
        for ($counter = $lastpage - (2 + ($adjacents * 2)); $counter <= $lastpage; $counter++)
        {
          if ($counter == $page)
            $pagination.= "<li class='current active'><span>$counter</span></li>";
          else
            $pagination.= "<li><a href='{$url}$counter'>$counter</a></li>";
        }
      }
    }

    if ($page < $counter - 1){
      $pagination.= "<li><a href='{$url}$next'>&raquo;</a></li>";
// $pagination.= "<li><a href='{$url}$lastpage'>Last</a></li>";
    }else{
//$pagination.= "<li><a class='current active'>Next</a></li>";
// $pagination.= "<li><a class='current active'>Last</a></li>";
    }
    $pagination.= "</ul>\n";
  }
  return $pagination;
}

function datediff( $date1, $date2 )
{
    $diff = abs( strtotime( $date1 ) - strtotime( $date2 ) );

    return sprintf
    (
        "%d Days, %d Hours and %d Mins",
        intval( $diff / 86400 ),
        intval( ( $diff % 86400 ) / 3600),
        intval( ( $diff / 60 ) % 60 )
    );

    // return sprintf
    // (
    //     "%d Days, %d Hours, %d Mins, %d Seconds",
    //     intval( $diff / 86400 ),
    //     intval( ( $diff % 86400 ) / 3600),
    //     intval( ( $diff / 60 ) % 60 ),
    //     intval( $diff % 60 )
    // );
}

?>
