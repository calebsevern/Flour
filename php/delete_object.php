<?php

	$configs = include('../conf.php');
	$db = $configs['db'];
	
	$object = $_POST['object'];
	$id = $_POST['id'];
	
	//Initialize the DB

	$link = new mysqli($configs['host'], $configs['username'], $configs['password']);
	if ($link->connect_error)
		die("Connection failed: " . $link->connect_error);

	$sth = $link->prepare("DELETE FROM $db.$object WHERE id=?");
	$sth -> bind_param("s", $id);
	$sth->execute();
	
	echo "Success";
	
	