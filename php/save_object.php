<?php

  /*
  * Handles saving objects.
  *
  * TODO: 
  *   [x] Needs to handle generic object types rather than hardcorded.
  *   [ ] Error handling - also needs to be caught by the JS handler
  *   [ ] "Forbidden" solution works but seems ugly - try private variables or something?
  */
  
  
  $configs = include('../conf.php');
  $db_name = $configs['db'];
  $host = $configs['host'];
  
  
  $object = json_decode((string) $_POST['object']); 
  
  $forbidden = array("type", "ready", "promises", "id");
  $key_string = "";
  $val_array = array();
  
  
  /*
  * Construct a string to pass to the statement,
  * omitting any non-essential object properties (forbidden)
  */
  
  foreach ($object as $key => $value)
    if(!in_array($key, $forbidden)) {
      $key_string .= $key .= "=?, ";
      array_push($val_array, $value);
    }

  $key_string = rtrim(trim($key_string), ",");
  array_push($val_array, $object->id);
  
  
  $pdo = new PDO("mysql:host=$configs->host; dbname=$db_name; charset=utf8", $configs['username'], $configs['password']); 
  $stmt = $pdo->prepare("UPDATE $db_name.$object->type SET $key_string WHERE id=?");
  $stmt->execute($val_array);
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  
  
  //Return the object to the JS handler
  
  echo $_POST['object'];
