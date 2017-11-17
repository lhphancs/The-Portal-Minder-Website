var express = require('express');
var router = express.Router();
var auth = require('../util/auth');
var UserModel = require('../models/UserModel');
var bcrypt = require('bcrypt');


var require_login = auth.require_login;
router.use(auth.require_login);

var saltRounds = 10;

router.get('/', function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    res.render('settings', { settings: user.settings, title: 'Minder Settings' });
  } );
});

var saltRounds = 10;
router.patch('/save', function(req, res, next){
  var self_id = req.user._id;
  var current_password = req.body.current_password;
  var new_password1 = req.body.new_password1;

  UserModel.findOne( { _id: self_id }, function(err, user){
    //User wants to change password
    if(req.body.current_password !== ""){
      var is_matching_password = bcrypt.compareSync(current_password, user.password);
      if(is_matching_password){
        var hash_password = bcrypt.hashSync(new_password1, saltRounds);
        user.password = hash_password;
      }
      else{
        res.send(false);
        return;
      }
    }
    //User successfully matched password or just wants to change non-security settings
    var is_accept_friend_requests = req.body.is_accept_friend_requests;
    var is_accept_chat_initiated = req.body.is_accept_chat_initiated;

    user.settings = {notifications: {friendAccepted: is_accept_friend_requests,
                      chatInitiated: is_accept_chat_initiated} };
    user.save();
    res.send(true);
  });
});

module.exports = router;
