<?php

	/*
	*	Adds a new class as a SQL table
	*/
	
	$configs = include('../conf.php');
	$db = $configs['db'];
	
	$type = $_POST['type'];
  $class_name = $_POST['name'];
	
	//Initialize the DB

	$link = new mysqli($configs['host'], $configs['username'], $configs['password']);
	if ($link->connect_error)
		die("Connection failed: " . $link->connect_error);
		
		
	//Create the table
  
	$sql = "DROP TABLE $db.$class_name;";
	
	$a = mysqli_query($link, $sql);
	echo "Removed $class_name.";
		
		
	
	
	