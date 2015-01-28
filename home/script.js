var active_class = null;
var protected_fields = ["id", "password"];

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


/*
*	Adds an object as a row to the data table
*
*	@params
*		obj: object in JSON format
*/

function addObjectToTable(obj) {
	var row = "<tr data-object-id='" + obj.id + "'>";
	row += "<td><input type='checkbox'></td>";
	for(prop in obj) {
		
		if($.inArray(prop, protected_fields) > -1)
			row += "<td class='protected-field'>" + obj[prop] + "</td>";
		else
			row += "<td data-property='" + prop + "'>" + obj[prop] + "</td>";
	}
	row += "</tr>";
	$(".data-table > tbody").append(row);
}


/*
*	Removes an object row from the data table
*
*	@params
*		obj: object in JSON format
*/

function removeObjectFromTable(object_id) {
	$("tr[data-object-id='" + object_id + "']").hide();
	var query = new Query(active_class);
	query.get(object_id, function(obj) {
		
		obj.destroy(function(a) {
			$(".server-response").html("Object destroyed.");
		});
	});
}


/*
*	Populates the data view with all objects of class class_name
*
*	@params
*		class_name: class of objects to retrieve
*/

function getObjectsByClass(class_name) {
	var query = new Query(class_name);
	query.find(function(objects) {
		
		$(".class-attributes").html("");
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
		active_class = $(this).text();
	});
	
	$(document).on('click', '.data-table > tbody > tr > td', function() {
		$(".data-table > tbody > tr > td").removeClass("active");
		$(".data-table > tbody > tr > td").removeClass("editable");
		
		if(!$(this).hasClass("protected-field"))
			$(this).addClass("active");
	});
	
	$(document).on('click', '.active', function() {
		$(".data-table > tbody > tr > td").prop("contenteditable", false);
		$(this).prop("contenteditable", true);
		$(this).addClass("editable");
	});
	
	$(document).on('blur', '.editable', function() {
		$(this).removeClass("active").removeClass("editable");
		var row = $(this).closest("tr");
		var query = new Query(active_class);
		query.get($(this).closest("tr").data("object-id").toString(), function(obj) {
			
			$(row).find("td").each(function() {
				if($.inArray($(this).data("property"), protected_fields) == -1 && $(this).data("property"))
					obj.set($(this).data("property"), $(this).text());
			});
			
			obj.save(function(result) {
				$(".server-response").html("Successfully updated " + result.type + " object with id " + result.id);
			});
		});
	});
	
	
	
/*
*	Add a new, empty object
*/

	$(document).on('click', '.create-object', function() {
		var query = new Query(active_class);
		query.create(function(a) {
			var query = new Query(active_class);
			query.equalTo("id", a.id);
			query.find(function(b) {
				addObjectToTable(b[0]);
			});
		});
	});
	

/*
*	Delete an object
*/

	$(document).on('click', '.destroy-object', function() {
		$(".data-table > tbody > tr").find("td").each(function() {
			if($(this).find("input[type='checkbox']").length)
				if($(this).find("input[type='checkbox']").is(":checked"))
					removeObjectFromTable($(this).closest("tr").data("object-id"));
		});
	});
	
	
	

/*
*	Site initialization
*/

	buildNavigationBar();








