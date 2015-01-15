<?php
	
	$configs = include('../conf.php');
	$db_name = $configs['db'];
	$host = $configs['host'];
	
	$object = $_POST['object'];
	$keys = $_POST['keys'];
	$values = $_POST['values'];
	
	
	$query_string = "";
	$values_array = array();
	
	for($i=0; $i<count($keys); $i++) {
		$query_string .= $keys[$i] . "=? AND ";
		array_push($values_array, $values[$i]);
	}
	
	$query_string = rtrim(trim($query_string), "AND");
	
	$pdo = new PDO("mysql:host=$configs->host; dbname=$db_name; charset=utf8", $configs['username'], $configs['password']);	
	$stmt = $pdo->prepare("SELECT * FROM $db_name.$object WHERE $query_string");
	$stmt->execute($values_array);
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
	
	$matches = array();
	
	for($i=0; $i<count($rows); $i++)
		array_push($matches, $rows[$i]);
		
	echo json_encode($matches);
	
	exit();
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	