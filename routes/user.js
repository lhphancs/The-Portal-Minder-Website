var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel = require('../models/UserModel');
var Message = require('../models/MessageModel');
var bcrypt = require('bcrypt');
var auth = require('../util/auth');
var require_login = auth.require_login;

var saltRounds = 10;
// User password check & cookie assignment if match
router.post('/validation', function(req, res, next) {
  UserModel.findOne( { email: req.body.email }, function(err, user){
    //Check if user exists
    if(user){
      //Check if password matches
      var is_matching_password = bcrypt.compareSync(req.body.password, user.password);
      delete user.password;
      if(is_matching_password){
        req.session.user = user;
        res.send(true);
      }
      else{
        res.send(false);
      }
    }
    else{
      res.send(false);
    }
  } );
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Minder Registration' });
});

// User registers
router.post('/register-add', function(req, res, next) {
  UserModel.count({ email: req.body.email }, function(err, count){
    if(count > 0)
      res.send(false);
    else{
      var hash_password = bcrypt.hashSync(req.body.password, saltRounds);
      var newUser = new UserModel({
        email: req.body.email,
        password: hash_password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        description: "",
        tags: [],
        education: "",
        friends: [],
        friendRequests: [],
        pendingFriends: [],
        blockedUsers: [],
        notification: [],
        photoURL: req.body.photoURL
      });
      req.session.user = newUser;
      newUser.save(function (err) {
        res.send(true);
      });
    }
  }); 
});

// User viewing own
router.get('/profile', require_login, function(req, res, next) {
  var user_email = req.user.email;
  UserModel.findOne( { email: user_email }, function(err, user){
    res.render("profile", user);
  });
});

router.get('/tags', require_login, function(req, res, next) {
  res.send(req.user.tags);
});

router.patch('/profile', require_login, function(req, res, next){
  //If tags empty, is undefined. Must set it as empty array to prevent crash
  var tags = req.body.tags;
  tags = tags?tags:[];
  UserModel.findOneAndUpdate({email: req.user.email},
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      city: req.body.city,
      description: req.body.description,
      tags: tags,
      education: req.body.education
    }, function(err, doc){;
    }
  );
  res.send(true);
});

router.delete('/profile', require_login, function(req, res, next){
  UserModel.remove( { email: req.body.email }, function(err, user){
    if (err) return handleError(err);
    res.send(user);
  });
});

router.get('/logout', require_login, function(req, res, next){
  req.session.reset();
  res.redirect('/');
});


router.get('/get-blocked-users-list', require_login, function(req, res, next){
  UserModel.find( { _id: {$in: req.user.blockedUsers} }, ["_id", "firstName", "lastName"], function(err, users){
    res.send(users);
  });
});

router.get('/get-self', require_login, function(req, res, next){
  res.send(req.user);
});



module.exports = router;
