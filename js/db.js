
	/*
	*	JavaScript API for database functions
	*/


	/*
	*	Database handler constructor
	*
	*	var query = new Query("Users");
	*	query.equalTo("id", 531119259);
	*	query.find(function(result) {
	*		alert(result);
	*	});
	*	
	*/	
	
	var Query = function(object) {
		this.object = object;
		this.param = null;
		this.val = null;
	};
	
	
	Query.prototype.equalTo = function(param, val) {
		this.param = param;
		this.val = val;
	};

	Query.prototype.find = function(callback) {
	
		var data = {object: this.object, param: this.param, val: this.val};
		
		$.post( "php/db_functions.php", data).done(function(result) {
			callback(JSON.parse(result));
		});
	};
	
	
	
	Query.prototype.create = function(callback) {
		var data = {object: this.object};
		$.post("php/create.php", data).done(function(result) {
			callback(new Obj((JSON.parse(result).type), JSON.parse(result).id));
		});
	};

	
	
	
	/*
	*	Retrieve current user by session ID
	*/
	
	var User = function() {
		var that = this;
		this.email = null;
		this.name = null;
		this.id = null;
		
		//Fetch user values
		this.init(function(current, response) {
			current.email = response.email;
			current.name = response.name;
			current.id = response.id;
			User.current = function() {
				return that;
			};
		});
	};
	
	
	User.prototype.init = function(callback) {
		var that = this;
		$.post("php/db_functions.php", {object: "CurrentUser"}).done(function(result) {
			callback(that, JSON.parse(result)[0]);
		});
	};
	
	
	
	
	var Obj = function(type, id) {
		this.type = type;
		this.ready = false;
		this.promises = [];
		this.id = (id) ? id : null;
		this.init(function(current, attributes) {
		
			for(var i=0; i<attributes.length; i++)
				current[attributes[i]] = null;
			
			//Object isn't ready until the attributes have loaded.
			
			current.ready = true;
			
			for(var i=0; i<current.promises.length; i++)
				current.promises[i]();
			
			current.promises = [];
		});
	};
	
	
	Obj.prototype.init = function(callback) {
		var that = this;
		$.post("php/initialize_object.php", {type: this.type}).done(function(result) {
			callback(that, JSON.parse(result));
		});
	};
	
	Obj.prototype.set = function(a, b) {
		var that = this;
		if(!this.ready)
			this.promises.push(function() {that.set(a,b);});
		else if(this.hasOwnProperty(a))
			this[a] = b;
		else
			return "Attribute does not exist";
	};
	
	Obj.prototype.save = function(callback) {
		var that = this;
		if(!this.ready)
			this.promises.push(function() {that.save(callback);});
		else
			$.post("php/save_object.php", {type: this.type, object: JSON.stringify(this)}).done(function(result) {
				callback(JSON.parse(result));
			});
	};
	
	
	
	
	
	
	
	