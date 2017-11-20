var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var auth = require('../util/auth');
var notification = require('../util/notification');

router.use(auth.require_login);

router.get('/', function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    if(err){ console.log(err); }
    res.render("friends");
  });
});

router.patch('/add-pending-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;

  //For self, add pendingFriend
  UserModel.findOne( { _id: self_id }, function(err, user){
    if(err){ console.log(err); }
    user.pendingFriends.push(selected_user_id);
    user.save();
  });
  //For selected_user, add friendRequest
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    if(err){ console.log(err); }
    selected_user.friendRequests.push(self_id);
    
    var notify_is_on = selected_user.settings.notifications.friendRequest;
    if(notify_is_on){
      notification.store_to_db(self_id, selected_user_id, "Friend request: Let's be friends!");
      ++selected_user.notificationsUnviewedCount;
    }
    selected_user.save();
    res.send( {notify_is_on: notify_is_on} );
  });
});

router.patch('/remove-pending-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;

  //Update self
  UserModel.findOne( { _id: self_id }, function(err, user){
    if(err){ console.log(err); }
    user.friendRequests.pull(selected_user_id);
    user.pendingFriends.pull(selected_user_id);
    user.save();
  });

  //Update selected_user
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    if(err){ console.log(err); }
    selected_user.friendRequests.pull(self_id);
    selected_user.pendingFriends.pull(self_id);

    var notify_is_on = selected_user.settings.notifications.friendRequestCancelled;
    if(notify_is_on){
      notification.store_to_db(self_id, selected_user_id, "Friend request cancelled!");
      ++selected_user.notificationsUnviewedCount;
    }
    selected_user.save();
    res.send( {notify_is_on: notify_is_on} );
  });
});

router.patch('/add-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;
  //update self
  UserModel.findOne( { _id: self_id }, function(err, user){
    if(err){ console.log(err); }
    user.friends.push(selected_user_id);
    user.friendRequests.pull(selected_user_id);
    user.pendingFriends.pull(selected_user_id);
    user.save();
  });

  //update selected_user
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    if(err){ console.log(err); }
    selected_user.friends.push(self_id);
    selected_user.friendRequests.pull(self_id);
    selected_user.pendingFriends.pull(self_id);

    var notify_is_on = selected_user.settings.notifications.friendAccepted;
    if(notify_is_on){
      notification.store_to_db(self_id, selected_user_id, "Friend added: Hi friend!");
      ++selected_user.notificationsUnviewedCount;
    }
    selected_user.save();
    res.send( {user: selected_user,
      notify_is_on: notify_is_on} );
  });
});

router.patch('/reject-friend-request', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;
  //update self
  UserModel.findOne( { _id: self_id }, function(err, user){
    if(err){ console.log(err); }
    user.friendRequests.pull(selected_user_id);
    user.pendingFriends.pull(selected_user_id);
    user.save();
    console.log("Updated self: removed pendingFriend");
  });

  //update selected_user
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    if(err){ console.log(err); }
    selected_user.friendRequests.pull(self_id);
    selected_user.pendingFriends.pull(self_id);

    var notify_is_on = selected_user.settings.notifications.friendRejected;
    if(notify_is_on){
      notification.store_to_db(self_id, selected_user_id, "Friend request rejected.");
      ++selected_user.notificationsUnviewedCount;
    }
    selected_user.save();
    console.log("Updated selectedUser: removed friendRequest");
    res.send( {notify_is_on: notify_is_on} );
  });
});

router.patch('/remove-friend', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = req.body.select_user_id;
  console.log(self_id);
  console.log(selected_user_id);
  //update self
  UserModel.findOne( { _id: self_id }, function(err, user){
    if(err){ console.log(err); }
    user.friends.pull(selected_user_id);
    user.save();
    console.log("Updated self: removed friend");
  });

  //update selected_user
  UserModel.findOne( { _id: selected_user_id }, function(err, selected_user){
    if(err){ console.log(err); }
    selected_user.friends.pull(self_id);

    var notify_is_on = selected_user.settings.notifications.friendRemoved;
    if(notify_is_on){
      notification.store_to_db(self_id, selected_user_id, "Friend removed.");
      ++selected_user.notificationsUnviewedCount;
    }
    selected_user.save();
    console.log("Updated self: removed friend");
    res.send( {notify_is_on: notify_is_on} );
  });
});

router.get('/get-friends-list', function(req, res, next){
  UserModel.find( { _id: {$in: req.user.friends} }, ["_id", "firstName", "lastName"], function(err, users){
      if(err){ console.log(err); }
      res.send(users);
  });
});

router.get('/get-friend-requests-list', function(req, res, next){
  UserModel.find( { _id: {$in: req.user.friendRequests} }, ["_id", "firstName", "lastName"], function(err, users){
    if(err){ console.log(err); }
    res.send(users);
  });
});

router.get('/get-pending-friends-list', function(req, res, next){
  UserModel.find( { _id: {$in: req.user.pendingFriends} }, ["_id", "firstName", "lastName"], function(err, users){
    if(err){ console.log(err); }
    res.send(users);
  });
});

module.exports = router;
