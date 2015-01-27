<?php
	
	$configs = include('../conf.php');
	$db_name = $configs['db'];
	$host = $configs['host'];
	
	$pdo = new PDO("mysql:host=$configs->host; dbname=$db_name; charset=utf8", $configs['username'], $configs['password']);	
	$stmt = $pdo->query("show tables");
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
	
	$classes = array();
	
	foreach ($rows as $row)
		array_push($classes, $row["Tables_in_$db_name"]);
		
	echo json_encode($classes);
	
	exit();

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	