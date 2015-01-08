<?php

	$configs = include('../conf.php');
	$db = $configs['db'];
	
	$object = $_POST['object'];
	
	//Initialize the DB

	$link = new mysqli($configs['host'], $configs['username'], $configs['password']);
	if ($link->connect_error)
		die("Connection failed: " . $link->connect_error);
		
		
	$t = mt_rand();
	$sql = "INSERT INTO $db.$object (id) ";
	$sql .= "VALUES ('" . $t . "');";
	
	$c = mysqli_query($link, $sql);
	if($c)
		echo "{\"type\":\"$object\", \"id\":\"$t\"}";

	