var express = require('express');
var router = express.Router();
var auth = require('../util/auth');
var UserModel = require('../models/UserModel');
var NotificationModel = require('../models/NotificationModel');

router.use(auth.require_login);

router.get('/', function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    res.render("friends");
  });
});

router.patch('/add-pending-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;

  //For self, add pendingFriend
  UserModel.findOne( { _id: self_id }, function(err, user){
    user.pendingFriends.push(selected_user_id);
    user.save();
  });
  //For selected_user, add friendRequest
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    selected_user.friendRequests.push(self_id);
    if(selected_user.settings.notifications.friendRequest){
      var newNotification = new NotificationModel({
        fromId: self_id,
        message: "Friend request: Let's be friends!"
      });
      newNotification.save(function(err){
        if(err)
          console.log(err);
      });
      ++selected_user.notificationsUnviewedCount;
    }
    selected_user.save();
    res.send(true);
  });
});

router.patch('/remove-pending-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;

  //Update self
  UserModel.findOne( { _id: self_id }, function(err, user){
    user.friendRequests.pull(selected_user_id);
    user.pendingFriends.pull(selected_user_id);
    user.save();
  });

  //Update selected_user
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    selected_user.friendRequests.pull(self_id);
    selected_user.pendingFriends.pull(self_id);
    if(selected_user.settings.notifications.friendRequestCancelled){
      var newNotification = new NotificationModel({
        fromId: self_id,
        message: "Friend request cancelled!"
      });
      newNotification.save(function(err){
        if(err)
          console.log(err);
      });
      ++selected_user.notificationsUnviewedCount;
    }
    selected_user.save();
    res.send(true);
  });
});

router.patch('/add-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;
  //update self
  UserModel.findOne( { _id: self_id }, function(err, user){
    user.friends.push(selected_user_id);
    user.friendRequests.pull(selected_user_id);
    user.pendingFriends.pull(selected_user_id);
    user.save();
  });

  //update selected_user
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    selected_user.friends.push(self_id);
    selected_user.friendRequests.pull(self_id);
    selected_user.pendingFriends.pull(self_id);
    if(selected_user.settings.notifications.friendAccepted){
      var newNotification = new NotificationModel({
        fromId: self_id,
        message: "Friend added: Hi friend!"
      });
      newNotification.save(function(err){
        if(err)
          console.log(err);
      });
      ++selected_user.notificationsUnviewedCount;
    }
    selected_user.save();
    res.send(selected_user);
  });
});

router.patch('/reject-friend-request', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;
  //update self
  UserModel.findOne( { _id: self_id }, function(err, user){
    user.friendRequests.pull(selected_user_id);
    user.pendingFriends.pull(selected_user_id);
    user.save();
    console.log("Updated self: removed pendingFriend");
  });

  //update selected_user
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    selected_user.friendRequests.pull(self_id);
    selected_user.pendingFriends.pull(self_id);

    if(selected_user.settings.notifications.friendRejected){
      var newNotification = new NotificationModel({
        fromId: self_id,
        message: "Friend request rejected."
      });
      newNotification.save(function(err){
        if(err)
          console.log(err);
      });
      ++selected_user.notificationsUnviewedCount;
    }
    selected_user.save();
    console.log("Updated selectedUser: removed friendRequest");
    res.send(true);
  });
});

router.patch('/remove-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;
  //update self
  UserModel.findOne( { _id: self_id }, function(err, user){
    user.friends.pull(selected_user_id);
    user.save();
    console.log("Updated self: removed friend");
  });

  //update selected_user
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    selected_user.friends.pull(self_id);
    if(selected_user.settings.notifications.friendRemoved){
      
      var newNotification = new NotificationModel({
        fromId: self_id,
        message: "Friend removed."
      });
      newNotification.save(function(err){
        if(err)
          console.log(err);
      });
      ++selected_user.notificationsUnviewedCount;
    }
    selected_user.save();
    console.log("Updated self: removed friend");
    res.send(true);
  });
});

router.get('/get-friends-list', function(req, res, next){
  UserModel.find( { _id: {$in: req.user.friends} }, ["_id", "firstName", "lastName"], function(err, users){
    res.send(users);
  });
});

router.get('/get-friend-requests-list', function(req, res, next){
  UserModel.find( { _id: {$in: req.user.friendRequests} }, ["_id", "firstName", "lastName"], function(err, users){
    res.send(users);
  });
});

router.get('/get-pending-friends-list', function(req, res, next){
  UserModel.find( { _id: {$in: req.user.pendingFriends} }, ["_id", "firstName", "lastName"], function(err, users){
    res.send(users);
  });
});

module.exports = router;
