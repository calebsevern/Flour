
var test_user = false;
var test_object = true;


/*
*	User object testing
*/

	if(test_user) {
		var query = new Query("Users");
		query.equalTo("id", 531119259);
		query.find(function(results) {
			//console.log(results[0]);
		});
		
		var a = new User();
	}



	
/*
*	Generic Object testing
*/

	if(test_object) {
	
		var query = new Query("Experiments");
		query.create(function(a) {
			console.log("Created Experiment with id: " + a.id);
			
			a.set("name", "Test Name");
			a.set("description", "Test Description");
			a.set("class_name", "Test Class");
			a.set("proctor", "Mr. Doe");
			a.save(function(result) {
				console.log("Experiment #" + result.id + " updated.");
			});
		});
	
		
		
	}






