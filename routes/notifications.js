var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var auth = require('../util/auth');

var UserModel = require('../models/UserModel');
var NotificationModel = require('../models/NotificationModel');

var require_login = auth.require_login;

router.get('/get-unread-count', require_login, function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    if(err){ console.log(err); }
    res.send( {count: user.notificationsUnviewedCount} );
  } );
});

router.get('/message/delete/:id', require_login, function(req, res, next){
  NotificationModel.remove( {_id: req.param('id')}, function(err) {
    if(err){ console.log(err); }
    res.redirect("/notifications");
  });
});

router.get('/message/:id', require_login, function(req, res, next){
  var notification_id = req.param('id');
  NotificationModel.findOne( { _id: notification_id }, function(err, notification){
    if(err){ console.log(err); }
    res.render("notification_message", {notification: notification} );
  } );
});


router.get('/:offset?/:limit?', require_login, function(req, res, next) {
  const DEFAULT_OFFSET = 0;
  const DEFAULT_LIMIT = 50; 
  var offset = req.param('offset') === "undefined" ? req.param('offset') : DEFAULT_OFFSET;
  var limit= req.param('limit') === "undefined" ? req.param('limit') : DEFAULT_LIMIT;

  UserModel.findOne( { _id: req.user._id }, function(err, user){
    if(err){ console.log(err); }
    user.notificationsUnviewedCount = 0;
    user.save();

    NotificationModel.find( { userId: String(req.user._id) }, [],
      {
        skip: offset,
        limit: limit,
        sort:{
          "timestamp": -1
        }
      }, function(err, notifications){
        if(err){ console.log(err); }
        
        res.render("notifications", {notifications: notifications});
    });
  });
});

module.exports = router;
