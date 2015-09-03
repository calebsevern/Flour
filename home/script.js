var active_class = null;
var protected_fields = ["id", "password"];

/*
* Returns all class names in an array
*
* @params:
*   callback: function to execute on successful post
*/

  function getAllClasses(callback) {
    $.post("php/get_classes.php", function(data) {
      callback(JSON.parse(data));
    });
  }

  
  
/*
* (Hopefully) makes content safe to display
*/

  function sanitizeString(html) {
    return html.replace(/<script(?=(\s|>))/i, '<script type="text/xml" ');
  }

/*
* Populates the nav bar with all classes
*/

function buildNavigationBar() {
  getAllClasses(function(classes) {
    if(classes.length > 0) {
      
      getObjectsByClass(classes[0]);
      active_class = classes[0];
      
      for(var i=0; i<classes.length; i++) {
        $(".classes-list > .classes").append("<div class='class-title'>" + classes[i] + "</div>");
      }
    } else {
      //No classes exist yet.
    }
  });
}


function buildObjectProperties(obj) {
  
  if(!obj) {
    
    // No objects exist to pull field names from, fetch separately
    Flour.getClassInfo(active_class, function(a) {
      console.log(a);
    });
    
  } else {
    $(".class-attributes").append("<th><input type='checkbox'></th>");
    for(prop in obj)
      $(".class-attributes").append("<th>" + prop + "</th>");
  }
}


/*
* Adds an object as a row to the data table
*
* @params
*   obj: object in JSON format
*/

function addObjectToTable(obj) {
  var row = "<tr data-object-id='" + obj.id + "'>";
  row += "<td><input type='checkbox'></td>";
  for(prop in obj) {
    
    var safe_value = obj[prop];
    if($.inArray(prop, protected_fields) > -1)
      row += "<td class='protected-field'>" + safe_value + "</td>";
    else
      row += "<td data-property='" + prop + "'>" + safe_value + "</td>";
  }
  row += "</tr>";
  $(".data-table > tbody").append(row);
}


/*
* Removes an object row from the data table
*
* @params
*   obj: object in JSON format
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
* Populates the data view with all objects of class class_name
*
* @params
*   class_name: class of objects to retrieve
*/

function getObjectsByClass(class_name) {
  
  active_class = class_name;
  $('.class-title').removeClass('active-title');
  $('.class-title:contains("' + class_name + '")').addClass('active-title');
  
  // Show loading screen while objects are fetched
  $('.loading-overlay').show();
      
  var query = new Query(class_name);
  query.find(function(objects) {
    
    $(".class-attributes").html("");
    $(".data-table > tbody").html("");
    
    console.log(objects[0]);
    buildObjectProperties(objects[0]);
    for(var i=0; i<objects.length; i++) {
      addObjectToTable(objects[i]);
    }
    
    // Dismiss the loading screen afterwards
    $('.loading-overlay').hide();
  });
}









/*
* Listeners
*/

  $(document).on('click', '.class-title', function() {
    getObjectsByClass($(this).text());
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
*  Create a new Class
*/

$(document).on('click', '.add-class', function() {
  var class_name = prompt("Enter a name for the class:");
  Flour.addClass(class_name, function(result) {
    
    //Add the class name to the list and switch views
    $('.classes').append($('<div>').addClass('class-title').text(class_name));
    getObjectsByClass(class_name);
      
  });
});


/*
*  Drop a Class
*/

$(document).on('click', '.destroy-class', function() {
  var class_name = prompt("Type the class name to continue:");
  if(class_name == active_class) {
    Flour.destroyClass(class_name, function(result) {
      window.location.reload();
    });
  } else {
    alert("Please try again.");
  }
});
  
  
  
/*
* Add a new, empty object
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
* Delete an object
*/

  $(document).on('click', '.destroy-object', function() {
    $(".data-table > tbody > tr").find("td").each(function() {
      if($(this).find("input[type='checkbox']").length)
        if($(this).find("input[type='checkbox']").is(":checked"))
          removeObjectFromTable($(this).closest("tr").data("object-id"));
    });
  });
  
  
  

/*
* Site initialization
*/

  buildNavigationBar();








