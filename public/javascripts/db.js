
  /**
  * JavaScript wrapper for Flour database functions
  */

  var Flour = {
    path: '/',
    project: '',
    findEP: 'api/find',
    getEP: 'api/get',
    createEP: 'api/create',
    attributesEP: 'api/attributes',
    objectsEP: 'api/objects',
    saveEP: 'api/save',
    deleteEP: 'api/delete',
    objects: function(callback) {
      var data = {
        project: Flour.project
      };
      $.get(Flour.path + Flour.objectsEP, data).done(function(result) {
        callback(result);
      });
    }
  };
  
  Flour.initialize = function(project) {
    Flour.project = project;
  };
  
  /**
  *  Return all object types associated with project
  *
  *  @param {Function} callback: contains array of object names
  */
  
  /**
  *  Database handler constructor
  *
  *  @param {String} object: name of object/table
  */  
  var Query = function(object) {
    this.object = object;
    
    // For equalTo() key/val restrictions
    this.keys = [];
    this.values = [];
  };
  
  
  /**
  *  Returns an object's attributes
  *
  *  @param {Function} callback: contains array of attributes
  */
  Query.prototype.attributes = function(callback) {
    var data = {
      project: Flour.project,
      object: this.object
    }
    $.post(Flour.path + Flour.attributesEP, data).done(function(result) {
      callback(result);
    });
  };
  
  
  /**
  *  Creates a new, empty object with a unique id
  *
  *  @param {Function} callback: contains resultant object
  */
  Query.prototype.create = function(callback) {
    var data = {
      project: Flour.project,
      object: this.object
    };
    $.post(Flour.path + Flour.createEP, data).done(function(id) {
      callback(new Obj(data.object, id));
    });
  };
  
  
  /**
  *  Queries for a single object by object's unique id
  * 
  *  @param {String} id
  *  @param {Function} callback: contains resultant object
  */
  
  Query.prototype.get = function(id, callback) {
    var data = {
      project: Flour.project,
      object: this.object,
      id: id
    };
    $.post(Flour.path + Flour.getEP, data).done(function(result) {
      new Obj(data.object, id, callback, result[0]);
    });
  };
  
  
  /**
  *  Restrict query, as in
  *  myQuery.equalTo('color', 'blue');
  *
  *  @param {String} param: key to restrict
  *  @param {String|Number|Boolean} val: corresponding value
  */
  Query.prototype.equalTo = function(param, val) {
    this.keys.push(param);
    this.values.push(val);
  };

  
  /**
  *  Executes query, considers equalTo() restrictions
  * 
  *  @param {Function} callback: contains results array
  */
  Query.prototype.find = function(callback) {
    var data = {
      project: Flour.project,
      object: this.object, 
      keys: this.keys, 
      values: this.values
    };
    $.post(Flour.path + Flour.findEP, data).done(function(result) {
      callback(result);
    });
  };
  
  
  /**
  *  Flour Object constructor
  *  Not publicly called
  *  
  *  @param {String} type: object's type/class, e.g. 'User'
  *  @param {String} id
  *  @param {Function} callback (for existing objects)
  *  @param {Object} existing: existing object with keys/vals as JSON
  */
  var Obj = function(type, id, callback, existing) {
    this.type = type;
    this.ready = false;
    this.promises = [];
    this.id = (id) ? id : null;
    this.init(function(current, attributes) {
    
      for(var i=0; i<attributes.length; i++)
        current[attributes[i]] = null;
      
      // Populate existing fields
      if(existing)
        for (var property in existing)
          if(current.hasOwnProperty(property))
            current[property] = existing[property];
          
      // Object isn't ready until the attributes have loaded.
      current.ready = true;
      
      // Resolve any promises
      for(var i=0; i<current.promises.length; i++)
        current.promises[i]();
      current.promises = [];
      
      if(callback) callback(current);
    });
  };  
  
  
  /**
  *  Initializes Flour Object by fetching & assigning keys
  *  Not publicly called
  *
  *  @param {Function} callback
  */
  Obj.prototype.init = function(callback) {
    var _this = this;
    $.post(Flour.path + Flour.attributesEP, {object: _this.type}).done(function(result) {
      callback(_this, result);
    });
  };
  
  
  /**
  *  Assigns value to object key, as in
  *  shirtObject.set('name', 'Slim Fit Oxford')
  *
  *  @param {String} k: key
  *  @param {String|Number|Boolean} v: value
  */
  Obj.prototype.set = function(k, v) {
    var _this = this;
    if(!this.ready)
      this.promises.push(function() {_this.set(k, v);});
    else if(this.hasOwnProperty(k))
      this[k] = v;
    else
      return "Attribute does not exist";
  };
  
  
  /**
  *  Saves set() changes to an object
  *
  *  @param {Function} callback: contains updated object
  */
  Obj.prototype.save = function(callback) {
    var _this = this;
    if(!this.ready)
      this.promises.push(function() {_this.save(callback);});
    else
      $.post(Flour.path + Flour.saveEP, {object: JSON.stringify(_this)}).done(function(result) {
        callback(result);
      });
  };
  
  
  /**
  *  Deletes an object
  *
  *  @param {Function} callback
  */
  Obj.prototype.destroy = function(callback) {
    var _this = this;
    if(!this.ready)
      this.promises.push(function() {_this.destroy(callback);});
    else
      $.post(Flour.path + Flour.deleteEP, {object: _this.type, id: _this.id}).done(function(result) {
        callback(result);
      });
  };
  