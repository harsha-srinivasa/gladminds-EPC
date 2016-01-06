<?php
 	$hostname = "localhost";
	$username = "root";
	$password = "root";
	$databaseName = "epc"; 
	
/*
	$databaseName = "epcdb";

	$hostname = getenv('DB_HOST');
	$username = getenv("DB_USER");
	$password = getenv("DB_PASSWORD");
*/

//EPC - 
/* 	$hostname = "aftersell-api.chnnvvffqwop.us-east-1.rds.amazonaws.com";
    $username = "aftersell";
    $password = "aftersell321";
    $databaseName = "afterselldb";  */  

	//Connecting to database
	$link = mysql_connect($hostname, $username, $password); 
	if (!$link) {
		// die('Could not connect: ' . mysql_error());
	}
	
	mysql_select_db($databaseName); 
	
?>

