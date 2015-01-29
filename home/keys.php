<?php

	$configs = include('../conf.php');
	
	$db = $configs['db'];
	$username = $configs['username'];
	$password = $configs['password'];
	
?>

	<div class="section">
		<div class="row">
			Database Name <input type="text" id="database_name" value="<?php echo $db;?>">
		</div>
		<div class="row">
			MySQL Username <input type="text" id="mysql_username" value="<?php echo $username;?>">
		</div>
		<!--<div class="row">
			MySQL Password <input type="password" id="mysql_password" value="">
		</div>-->
		<div class="row">
			<button class="ui-button">
				Save
			</button>
		</div>
	</div>