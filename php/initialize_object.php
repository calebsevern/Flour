<?php

	/*
	*	Pulls object attributes to pass back in order
	*	to instantiate an empty/new object.
	*/
	
	$configs = include('../conf.php');
	$db = $configs['db'];
	
	$type = $_POST['type'];
	
	//Initialize the DB

	$link = new mysqli($configs['host'], $configs['username'], $configs['password']);
	if ($link->connect_error)
		die("Connection failed: " . $link->connect_error);
		
		
	//Grab an object and send the column names back
	
	$sql = "SELECT * FROM $db.$type LIMIT 1";
	
	$a = mysqli_query($link, $sql);
	
	$attributes = array();
	
    foreach ($a as $val)
		foreach ($val as $key => $value)
			if($key != "id")
				array_push($attributes, $key);
	
	echo json_encode($attributes);
		
		
	
	
	