var express = require('express');
var router = express.Router();
var auth = require('../util/auth');
var UserModel = require('../models/UserModel');

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
      selected_user.notifications.messages.push({
        from_id: self_id,
        message: "Friend request: I would like to become friends!",
        isUnread: true
      });
      ++selected_user.notifications.unviewedCount;
    }
    
    selected_user.save();
  });

  res.send(true);
});

router.patch('/remove-pending-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;

  //Remove pending friend
  UserModel.findOne( { _id: self_id }, function(err, user){
    user.pendingFriends.pull(selected_user_id);
    user.save();
  });

  //Remove request for selected_user
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    selected_user.friendRequests.pull(self_id);
    if(selected_user.settings.notifications.friendRequestCancel){
      selected_user.notifications.messages.push({
        from_id: self_id,
        message: "Friend request cancel: Nevermind!",
        isUnread: true
      });
      ++selected_user.notifications.unviewedCount;
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
    user.pendingFriends.pull(selected_user_id);
    user.friendRequests.pull(selected_user_id);
    user.save();
  });

  //update selected_user
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    selected_user.friends.push(self_id);
    selected_user.pendingFriends.pull(self_id);
    selected_user.friendRequests.pull(self_id);
    if(selected_user.settings.notifications.friendAccepted){
      selected_user.notifications.messages.push({
        from_id: self_id,
        message: "Friend added: Hi friend!",
        isUnread: true
      });
      ++selected_user.notifications.unviewedCount;
    }
    selected_user.save();
    res.send(selected_user);
  });
});

router.patch('/reject-friend-request', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;
  //update self
  UserModel.update( 
    { _id: self_id }, { $pull: { friendRequests : selected_user_id, pendingFriends: selected_user_id} }
      , function(err, data) {
        console.log("Updated self: removed pendingFriend");
  });

  //update selected_user
  UserModel.update( 
    { _id: selected_user_id }, { $pull: { friendRequests: self_id, pendingFriends: self_id} }
      , function(err, data) {
        console.log("Updated selectedUser: removed friendRequest");
  });
  res.send(true);
});

router.patch('/remove-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;
  //update self
  UserModel.update( 
    { _id: self_id }, { $pull: { friends : selected_user_id } }
      , function(err, data) {
        console.log("Updated self: removed friend");
  });

  //update selected_user
  UserModel.update( 
    { _id: selected_user_id }, { $pull: { friends : self_id } }
      , function(err, data) {
        console.log("Updated selectedUser: removed friend");
  });
  res.send(true);
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
