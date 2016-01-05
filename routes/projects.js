var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  // Fetch all databases, ignoring any directories
  fs.readdir('./data/', function(err, stats) {
    res.render('projects-list', {projects: stats});
  });
});

/* GET specific project page. */
router.get('/:project', function(req, res, next) {
  var projectName = req.params.project;
  fs.lstat('./data/' + projectName, function(err, stats) {
    if(!err) {
      res.render('project', {project: projectName});
    } else {
      res.redirect('/projects?np=' + projectName);
    }
  });
  
});

module.exports = router;
