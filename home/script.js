

/*
*	Returns all class names in an array
*
*	@params:
*		callback: function to execute on successful post
*/

	function getAllClasses(callback) {
		$.post("php/get_classes.php", function(data) {
			callback(JSON.parse(data));
		});
	}



/*
*	Populates the nav bar with all classes
*/

function buildNavigationBar() {
	getAllClasses(function(classes) {
		if(classes.length > 0) {
			getObjectsByClass(classes[0]);
			for(var i=0; i<classes.length; i++)
				$(".nav > .classes").append("<div class='class-title'>" + classes[i] + "</div>");
		} else {
			//No classes exist yet.
		}
	});
}


function buildObjectProperties(obj) {
	$(".class-attributes").append("<th><input type='checkbox'></th>");
	for(prop in obj)
		$(".class-attributes").append("<th>" + prop + "</th>");

}

function addObjectToTable(obj) {
	var row = "<tr>";
	row += "<td><input type='checkbox'></td>";
	for(prop in obj)
		row += "<td>" + obj[prop] + "</td>";
	row += "</tr>";
	$(".data-table > tbody").append(row);
}


function getObjectsByClass(class_name) {
	var query = new Query(class_name);
	query.find(function(objects) {
		
		$(".data-table > tbody").html("");
		
		if(objects.length > 0) {
			buildObjectProperties(objects[0]);
			for(var i=0; i<objects.length; i++)
				addObjectToTable(objects[i]);
		} else {
			//No objects exist yet.
		}
	});
}









/*
*	Listeners
*/

	$(document).on('click', '.class-title', function() {
		getObjectsByClass($(this).text());
	});


/*
*	Site initialization
*/

	buildNavigationBar();








