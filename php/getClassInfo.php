<?php
	
	$configs = include('../conf.php');
	$db_name = $configs['db'];
	$host = $configs['host'];
	
  $class_name = $_POST["name"];
  
	$pdo = new PDO("mysql:host=$configs->host; dbname=$db_name; charset=utf8", $configs['username'], $configs['password']);	
	$stmt = $pdo->query("SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_NAME = N'$class_name'");
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$classes = array();
	
	foreach ($rows as $row)
		array_push($classes, $row["COLUMN_NAME"]);
		
	echo json_encode($classes);
	
	exit();

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	