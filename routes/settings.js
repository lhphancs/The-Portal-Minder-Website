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

router.post('/save', function(req, res, next){
  var self_id = req.user._id;
  var input_current_password = req.body.input_current_password;
  var input_new_password1 = req.body.input_new_password1;

  UserModel.findOne( { _id: self_id }, function(err, user){
    //User wants to change password
    if(req.body.input_new_password1 === ""){
      var is_matching_password = bcrypt.compareSync(req.body.password, user.password);
      if(is_matching_password){
        ;
      }
      else{
        res.redirect("/settings", {is_wrong_password: true});
      }
    }
    else{
      var is_setting_friend_accept = req.body.accepted_friend_requests === 'on';
      var is_setting_chat_initiated = req.body.chat_initiated === 'on';
      UserModel.update( {_id: self_id}, {
        settings: {notification: {friendAccepted: is_setting_friend_accept,
                    chatInitiated: is_setting_chat_initiated} }
      }, function(err, data){
        res.redirect("/settings");
      });
    }
  });
});

module.exports = router;
