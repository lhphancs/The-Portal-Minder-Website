var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var auth = require('../util/auth');
var UserModel = require('../models/UserModel');

var require_login = auth.require_login;

router.get('/', require_login, function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    user.notifications.unviewedCount = 0;
    user.save();
    res.render("notifications");
    res.end;
  } );
});

router.get('/get-unread-count', require_login, function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    res.send( {count: user.notifications.unviewedCount} );
  } );
});


router.post('/get-names', require_login, function(req, res, next) {
  var id_array = JSON.parse(req.body.id_set)
  UserModel.find( { _id: { $in: id_array} }, "_id firstName lastName", function(err, users){
    res.send(users);
  } );
});

router.delete('/', require_login, function(req, res, next) {
  res.render("notifications");
});

router.get('/get-all-notifications', require_login, function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    res.send(user.notifications.messages);
  } );
});

module.exports = router;
