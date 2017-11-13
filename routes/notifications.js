var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var auth = require('../util/auth');

var require_login = auth.require_login;

router.get('/', require_login, function(req, res, next) {
  res.render("notifications");
});

router.get('/get-all-notifications', require_login, function(req, res, next) {
  res.send(
    [
      {
        id: -111111111111111,
        name: "ADMIN",
        msg: "Welcome to minder!"
      }
    ]
  );
});

module.exports = router;
