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
    selected_user.save();
  });

  res.send(true);
});

router.patch('/remove-pending-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;

  //Remove pending friend
  UserModel.update( 
    { _id: self_id },
    { $pull: { pendingFriends : selected_user_id } },
    function(err, data) {
        ;
  });

  UserModel.update( 
    { _id: selected_user_id },
    { $pull: { friendRequests: self_id } },
    function(err, data) {
        res.send(true);
  });
});

router.patch('/add-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;
  //update self
  UserModel.update( 
    { _id: self_id },
    { $push: {friends: selected_user_id}
      , $pull: { pendingFriends : selected_user_id } //Why does order matter?
      , $pull: { friendRequests : selected_user_id } } //Why does order matter?
      , function(err, data) {
        console.log("Updated self: added friend/remove pendingFriends + friendRequests");
  });

  //update selected_user
  UserModel.update( 
    { _id: selected_user_id },
    { $push: {friends: self_id}
      , $pull: { friendRequests : self_id } //Why does order matter?
      , $pull: { pendingFriends : self_id }} //Why does order matter?
      , function(err, data) {
        console.log("Updated selected_user: added friend/remove pendingFriends + friendRequests");
  });
  res.send(true);
});

router.patch('/reject-friend-request', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;
  //update self
  UserModel.update( 
    { _id: self_id }, { $pull: { friendRequests : selected_user_id } }
      , function(err, data) {
        console.log("Updated self: removed pendingFriend");
  });

  //update selected_user
  UserModel.update( 
    { _id: selected_user_id }, { $pull: { pendingFriends : self_id } }
      , function(err, data) {
        console.log("Updated selectedUser: removed friendRequest");
  });
  res.send(true);
});

router.patch('/remove-friend', function(req, res, next){
  UserModel.update( { _id: req.user._id }, { $pull: {friends: req.body.id} }, function(){
    ;
  });
  res.send(true)
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
