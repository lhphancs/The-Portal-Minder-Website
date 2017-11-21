var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var auth = require('../util/auth');

var UserModel = require('../models/UserModel');
var NotificationModel = require('../models/NotificationModel');

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;
const MAX_JUMP_PAGE = 3;
var require_login = auth.require_login;

// ########## Start selection Actions ##########
router.delete('/message/group-delete', require_login, function(req, res, next){
  var msg_ids = JSON.parse(req.body.msg_ids);
  NotificationModel.remove( {_id: { $in: msg_ids} }, function(err, notifications){
    if(err){ console.log(err); }
    res.send(true);
  });
});

router.patch('/message/group-mark-read', require_login, function(req, res, next){
  var msg_ids = JSON.parse(req.body.msg_ids);
  NotificationModel.update( {_id: { $in: msg_ids} }, {isRead: true}, {multi: true}, function(err, notifications){
    if(err){ console.log(err); }
    res.send(true);
  });
});

router.patch('/message/group-mark-unread', require_login, function(req, res, next){
  var msg_ids = JSON.parse(req.body.msg_ids);
  NotificationModel.update( {_id: { $in: msg_ids} }, {isRead: false}, {multi: true}, function(err, notifications){
    if(err){ console.log(err); }
    res.send(true);
  });
});
// ########## End selection Actions ##########

//Globally used for logged users to display unread notification
router.get('/get-unread-count', require_login, function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    if(err){ console.log(err); }
    res.send( {count: user.notificationsUnviewedCount} );
  } );
});

//Delete single message
router.get('/message/delete/:id', require_login, function(req, res, next){
  NotificationModel.remove( {_id: req.param('id')}, function(err) {
    if(err){ console.log(err); }
    res.redirect("/notifications");
  });
});

//View message
router.get('/message/:id', require_login, function(req, res, next){
  var notification_id = req.param('id');
  NotificationModel.findOne( { _id: notification_id }, function(err, notification){
    if(err){ console.log(err); }
    res.render("notification_message", {notification: notification} );
  } );
});

//View last page of notifications
router.get('/last/:limit?', require_login, function(req, res, next) {
  var limit_param = req.param('limit');
  var limit = typeof(limit_param) === "undefined" ? DEFAULT_LIMIT : Number(limit_param);

  NotificationModel.count( { userId: req.user._id }, function(err, count){
    return count;
  }).then(function(count){
    var page = Math.ceil(count/limit);
    var offset = (page - 1) * limit;
    NotificationModel.find( { userId: req.user._id }, [],
    {
      skip: offset,
      sort:{
        "timestamp": -1
      }
    }, function(err, notifications){
      if(err){ console.log(err); }
      res.render("notifications", {notifications: notifications,
        page: page,
        limit: limit,
        has_next: false});
    });
  });
});

//View page of notification using page param
router.get('/:page?/:limit?', require_login, function(req, res, next) {
  var page_param = req.param('page');
  var page = typeof(page_param) === "undefined" ? 1 : Number(page_param);
  var limit_param = req.param('limit');
  var limit = typeof(limit_param) === "undefined" ? DEFAULT_LIMIT : Number(limit_param);
  var offset = (page - 1) * limit;

  var self_id = req.user._id;
  UserModel.findOne( { _id: self_id }, function(err, user){
    if(err){ console.log(err); }
    user.notificationsUnviewedCount = 0;
    user.save();
  }).then(function(){
    NotificationModel.find( { userId: self_id }, [],
    {
      skip: offset,
      limit: limit * (MAX_JUMP_PAGE + 1),
      sort: {
        "timestamp": -1
      }
    }, function(err, notifications){
      if(err){ console.log(err); }
      var next_jumps_available = Math.ceil(notifications.length/limit) - 1;
      
      //Only send the limit
      var notifications_to_display = notifications.slice(0, limit);
      res.render("notifications", {notifications: notifications_to_display,
        page: page,
        limit: limit,
        next_jumps_available: next_jumps_available});
    });
  });
});

module.exports = router;
