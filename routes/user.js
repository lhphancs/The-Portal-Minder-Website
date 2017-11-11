var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel = require('../models/UserModel');
var Message = require('../models/MessageModel');
var bcrypt = require('bcrypt');
var auth = require('../util/auth');

var saltRounds = 10;
// User password check & cookie assignment if match
router.post('/validation', function(req, res, next) {
  UserModel.findOne( { email: req.body.email }, function(err, user){
    //Check if user exists
    if(user){
      //Check if password matches
      is_matching_password = bcrypt.compareSync(req.body.password, user.password);
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
        pendingFriends: [],
        photoURL: req.body.photoURL
      });
      req.session.user = newUser;
      newUser.save(function (err) {
        res.send(true);
      });
    }
  }); 
});

/* Everything below this requires login*/
router.use(auth.require_login);

// User viewing own
router.get('/profile', function(req, res, next) {
  var user_email = req.user.email;
  UserModel.findOne( { email: user_email }, function(err, user){
    res.render("profile", user);
  });
});

router.get('/tags', function(req, res, next) {
  res.send(req.user.tags);
});

router.patch('/profile', function(req, res, next){
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

router.delete('/profile', function(req, res, next){
  UserModel.remove( { email: req.body.email }, function(err, user){
    if (err) return handleError(err);
    res.send(user);
  });
});

router.get('/logout', function(req, res, next){
  req.session.reset();
  res.redirect('/');
});

router.post('/add-friend', function(req, res, next){
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    user.friends.push(req.body.id);
    user.save();
    res.send(true);
  });
});

router.post('/remove-friend', function(req, res, next){
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

router.get('/get-self', function(req, res, next){
  res.send(req.user);
});

module.exports = router;
