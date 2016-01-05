# Flour
Flour is a database and backend visualization tool.

![Flour project data view](https://severn.me/res/flour.png)

---

####Plans

**[✓] ~~Port: Frontend to AngularJS < 2~~**

**[✓] ~~Port: DB to SQLite~~**

**[✓] Port: Backend to Node.js**

[ ] Move this section to issues or JIRA

[ ] User object + permissions

[ ] Better error handling

[ ] Project (database) creation

[ ] Object (table) creation

---

[The provided JS wrapper](https://github.com/calebsevern/Flour/blob/master/public/javascripts/db.js) lets you use client-side JS to manage a Flour backend:

### Queries
```javascript
var query = new Query("Shirt");
query.equalTo("size", "L");
query.equalTo("color", "red");
query.find(function(shirts) {
  //You've got an array of some large red shirts.
});
```

Lookups by ID are simpler, if you have one handy.
```javascript
var query = new Query("User");
query.get("154359187256", function(user) {
	//Single object returned.
});
```

-
### Creating objects
```javascript
var query = new Query("Recipe");
query.create(function(recipe) {
  //New object available - all it's got is a unique ID.
});
```
-

### Deleting objects
```javascript
object.destroy(function(message) {
  //All done.
});
```

-
### Updating objects
Updates are simple on new or queried objects. Let's take a new object for example:
```javascript
var query = new Query("Cat");
query.create(function(cat) {
	cat.set("name", "Sprinkles");
	cat.set("breed", "Domestic Shorthair");
	cat.save(function(cat) {
	  //New object ready
	});
});
```

