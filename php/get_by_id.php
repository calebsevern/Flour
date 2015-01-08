<?php

	$configs = include('../conf.php');
	$db = $configs['db'];
	
	$object = $_POST['object'];
	$id = $_POST['id'];
	
	//Initialize the DB

	$link = new mysqli($configs['host'], $configs['username'], $configs['password']);
	if ($link->connect_error)
		die("Connection failed: " . $link->connect_error);

	$sth = $link->prepare("SELECT * FROM $db.$object WHERE id=?");
	$sth -> bind_param("s", $id);
	$sth->execute();
	
	$meta = $sth->result_metadata();

	while ($field = $meta->fetch_field()) {
	  $parameters[] = &$row[$field->name];
	}

	call_user_func_array(array($sth, 'bind_result'), $parameters);

	while ($sth->fetch()) {
		foreach($row as $key => $val) {
			$x[$key] = $val;
		}
		$results[] = $x;
		echo json_encode($results);
		exit();
	}
	
	
	
		
	
	/*while($sth->fetch()) {
	*	echo $username;
	}*/
	
	//echo "done";
	
	