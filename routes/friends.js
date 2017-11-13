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
    function removeConnectionsCB(err, obj) {
        ;
  });

  UserModel.update( 
    { _id: selected_user_id },
    { $pull: { friendRequests: self_id } },
    function removeConnectionsCB(err, obj) {
        res.send(true);
  });
});

router.patch('/add-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;

  //update self
  UserModel.findOne( { _id: self_id }, function(err, user){
    user.friends.push(selected_user_id); //add new frined
    //Remove id from friend request and pending friends
    user.update({ $pull: {friendRequests: selected_user_id}
                          , $pull: {pendingFriends: selected_user_id}});
    user.save();
  });

  //update selected_user
  UserModel.findOne( { selected_user_id }, function(err, selected_user){
    selected_user.friends.push(self_id); //add new friend
    //Remove id from friend request and pending friends
    selected_user.update({ $pull: {friendRequests: self_id}
                              ,$pull: {pendingFriends: self_id}});
    selected_user.save();
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
