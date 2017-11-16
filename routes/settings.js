var express = require('express');
var router = express.Router();
var auth = require('../util/auth');
var UserModel = require('../models/UserModel');

router.use(auth.require_login);

router.get('/', function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    res.render('settings', { settings: user.settings, title: 'Minder Settings' });
  } );
});



router.post('/save', function(req, res, next){
  var self_id = req.user._id;
  is_setting_friend_accept = req.body.accepted_friend_requests === 'on';
  is_setting_chat_initiated = req.body.chat_initiated === 'on';
  UserModel.update( {_id: self_id}, {
    settings: {notification: {friendAccepted: is_setting_friend_accept,
                chatInitiated: is_setting_chat_initiated} }
  }, function(err, data){
    ;
  } );
  res.redirect("/settings");
});

module.exports = router;
