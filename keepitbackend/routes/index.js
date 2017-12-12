var express = require('express');
var router = express.Router();
var mkdir = require('mkdirp');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
