var express = require('express');
var shortid = require('shortid');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
*  Creates a new DB for a project
*  @params:
*    name: project name
*/
router.post('/new/project', function(req, res, next) {
  var db = new sqlite3.Database('data/' + req.body.name);
  db.serialize(function() {
    res.redirect('/projects/' + req.body.name);
  });  
});


/**
*  Creates a new object table
*  @params:
*    project: project name
*    name: table name
*/
router.post('/new/object', function(req, res, next) {
  var db = new sqlite3.Database('data/' + req.body.project);
  db.run("CREATE TABLE IF NOT EXISTS counts (objectId TEXT, key TEXT, value INTEGER)");
  db.run("INSERT INTO counts (key, value) VALUES (?, ?, ?)", "1", "counter", 0);
});

router.get('/get/object', function(req, res, next) {
  var db = new sqlite3.Database('data/turtle');
  db.run("CREATE TABLE IF NOT EXISTS counts2 (objectId TEXT, key TEXT, value INTEGER)");
  db.run("INSERT INTO counts (objectId, key, value) VALUES (?, ?, ?)", "1", "counter", 0);
});


router.post('/find', function(req, res, next) {
  var db = new sqlite3.Database('data/turtle');
  
  var queryString = '';
  if(req.body['keys[]']) {
    queryString += ' where ';
    var keys = (req.body['keys[]'].constructor === String) ? [req.body['keys[]']] : req.body['keys[]'];
    var values = (req.body['values[]'].constructor === String) ? [req.body['values[]']] : req.body['values[]'];
    for(var i = 0; i < keys.length; i++) {
      queryString += keys[i] + '=' + values[i];
      if(i < keys.length - 1) queryString += ' and ';
    }
  }
  
  db.all('SELECT * FROM ' + req.body.object + queryString, function(err, rows) {
    res.json(rows);
  });
});


router.post('/get', function(req, res, next) {
  var db = new sqlite3.Database('data/turtle');
  
  var queryString = " where objectId='" + req.body.id + "'";
  db.all('SELECT * FROM ' + req.body.object + queryString , function(err, rows) {
    res.json(rows);
  });
});

router.post('/delete', function(req, res, next) {
  var db = new sqlite3.Database('data/turtle');
  var queryString = " where objectId='" + req.body.id + "'";
  db.all('DELETE FROM ' + req.body.object + queryString , function(err, rows) {
    res.json(rows);
  });
});


router.post('/create', function(req, res, next) {
  var db = new sqlite3.Database('data/turtle');
  var id = shortid.generate();
  db.all('INSERT INTO ' + req.body.object + '(objectId) VALUES (?)', id, function(err, rows) {
    res.send(id);
  });
});


router.post('/attributes', function(req, res, next) {
  var db = new sqlite3.Database('data/turtle');
  db.all('pragma table_info(' + req.body.object + ')', function(err, rows) {
    var attrs = [];
    for(var i = 0; i < rows.length; i++) attrs.push(rows[i].name);
    res.json(attrs);
  });
});

router.get('/objects', function(req, res, next) {
  var db = new sqlite3.Database('data/turtle');
  db.all("SELECT name FROM sqlite_master WHERE type=\"table\"", function(err, rows) {
    var tables = [];
    for(var i = 0; i < rows.length; i++)
      Object.keys(rows[i]).forEach(function(k, v) {
        tables.push(rows[i][k]);
      });
    res.json(tables);
  });
});

module.exports = router;
