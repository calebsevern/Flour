
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
	
	var path = (function(scripts) {
		var scripts = document.getElementsByTagName('script'),
			script = scripts[scripts.length - 1];

		if (script.getAttribute.length !== undefined)
			return script.src.toString().split("js/db.js")[0];

		return script.getAttribute('src', -1).split("js/db.js")[0];
	}());
	
	var Query = function(object) {
		this.object = object;
		this.param = null;
		this.val = null;
		
		this.keys = [];
		this.values = [];
	};
	
	
	Query.prototype.equalTo = function(param, val) {
		this.param = param;
		this.val = val;
		
		this.keys.push(param);
		this.values.push(val);
	};

	Query.prototype.find = function(callback) {
	
		var data = {object: this.object, param: this.param, val: this.val, keys: this.keys, values: this.values};
		
		$.post(path + "php/find_object.php", data).done(function(result) {
			callback(JSON.parse(result));
		});
	};
	
	Query.prototype.get = function(id, callback) {
		var data = {object: this.object, id: id};
		var type = this.object;
		$.post(path + "php/get_by_id.php", data).done(function(result) {
			var a = new Obj(type, id, callback, JSON.parse(result)[0]);
		});
	};
	
	
	
	Query.prototype.create = function(callback) {
		var data = {object: this.object};
		$.post(path + "php/create.php", data).done(function(result) {
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
		$.post(path + "php/db_functions.php", {object: "CurrentUser"}).done(function(result) {
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
	
	
	
	/*
	*	For existing objects (get)
	*/
	
	var Obj = function(type, id, callback, existing) {
		this.type = type;
		this.ready = false;
		this.promises = [];
		this.id = (id) ? id : null;
		this.init(function(current, attributes) {
		
			for(var i=0; i<attributes.length; i++)
				current[attributes[i]] = null;
			
			
			//Populate existing fields
			
			if(existing)
				for (var property in existing)
					if(current.hasOwnProperty(property))
						current[property] = existing[property];
			
			
			//Object isn't ready until the attributes have loaded.
			
			current.ready = true;
			
			for(var i=0; i<current.promises.length; i++)
				current.promises[i]();
			
			current.promises = [];
			
			if(callback)
				callback(current);
		});
	};	
	
	Obj.prototype.init = function(callback) {
		var that = this;
		$.post(path + "php/initialize_object.php", {type: this.type}).done(function(result) {
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
			$.post(path + "php/save_object.php", {object: JSON.stringify(this)}).done(function(result) {
				callback(JSON.parse(result));
			});
	};
	
	
	Obj.prototype.destroy = function(callback) {
		var that = this;
		
		if(!this.ready)
			this.promises.push(function() {that.destroy(callback);});
		else
			$.post(path + "php/delete_object.php", {object: that.type, id: that.id}).done(function(result) {
				callback(result);
			});
	};
	
	
	
	
	
	
	