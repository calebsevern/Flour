<?php

	$configs = include('../conf.php');
	$secret = $configs['secret'];
	
	$key = $_POST['key'];
	
	if($key == $secret)
		echo 1;
	else
		echo 0;

	