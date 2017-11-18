var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var auth = require('../util/auth');
var UserModel = require('../models/UserModel');
var NotificationModel = require('../models/NotificationModel');

var require_login = auth.require_login;

router.get('/', require_login, function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    user.notificationsUnviewedCount = 0;
    user.save();
    res.render("notifications");
    res.end;
  } );
});

router.get('/get-unread-count', require_login, function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    res.send( {count: user.notificationsUnviewedCount} );
  } );
});


router.post('/get-names', require_login, function(req, res, next) {
  var id_array = JSON.parse(req.body.id_set)
  UserModel.find( { _id: { $in: id_array} }, "_id firstName lastName", function(err, users){
    res.send(users);
  } );
});

router.get('/get-all-notifications', require_login, function(req, res, next) {
  NotificationModel.find( { user_id: req.user._id }, function(err, notifications){
    console.log(notifications);
    res.send(notifications);
  } );
});

module.exports = router;
