var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var auth = require('../util/auth');

router.get('/', function(req, res, next) {
  res.render("notification");
});

module.exports = router;
