<?php

	/*
	*	Handles saving objects.
	*
	*	TODO: Needs to handle generic object types rather than hardcorded.
	*	Main issue is having a dynamic number of attributes to save
	*/
	
	
	$configs = include('../conf.php');
	$db = $configs['db'];
	
	$type = $_POST['type'];
	
	//Initialize the DB

	$link = new mysqli($configs['host'], $configs['username'], $configs['password']);
	if ($link->connect_error)
		die("Connection failed: " . $link->connect_error);
		
	$b = json_decode((string) $_POST['object']);
	
	
	
	//EXPERIMENT
	
	if($type == "Experiments") {
		$sth = $link->prepare("UPDATE $db.Experiments SET name=?, description=?, class_name=?, proctor=? WHERE id=?");
		$sth -> bind_param("sssss", $b->name, $b->description, $b->class_name, $b->proctor, $b->id);
		$sth->execute();
		
		echo $_POST['object'];
	}
	
	//echo $_POST['object'];