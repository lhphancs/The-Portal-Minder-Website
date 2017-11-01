var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User');
var Message = require('../models/Message');

// User password check & cookie assignment if match
router.post('/validation', function(req, res, next) {
  User.findOne( { email: req.body.email }, function(err, user){
    //Check if user exists
    if(user){
      //Check if password matches
      if(req.body.password === user.password){
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
router.post('/add', function(req, res, next) {
  User.count({ email: req.body.email }, function(err, count){
    console.log(err);
    if(count > 0)
      res.send(false);
    else{
      var newUser = new User({
        email:req.body.email,
        password:req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city:req.body.city,
        description:"",
        tags:[],
        education:"",
        friends:[],
        pendingFriends:[]
      });
      req.session.user = newUser;
      newUser.save(function (err) {
        res.send(true);
      });
    }
  }); 
});

function require_login(req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

router.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next(); //This must be here as well. This is asynchronous.
    });
  } else {
    next();
  }
});

// User viewing own
router.get('/profile', require_login, function(req, res, next) {
  var user_email = req.user.email;
  User.findOne( { email: user_email }, function(err, user){
    res.render("profile", user);
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/tags', require_login, function(req, res, next) {
  res.send(req.user.tags);
});



router.patch('/profile', require_login, function(req, res, next){
  User.findOneAndUpdate({email:req.user.email},
    { 
    $set: {firstName: req.body.firstName,
      lastName: req.body.lastName,
      city: req.body.city,
      description: req.body.description,
      tags:req.body.tags,
      education: req.body.education}
    }, function(err, doc){
      ;
    }
  );
  console.log(req.body);
  res.send(true);
});

router.delete('/profile', require_login, function(req, res, next){
  User.remove( { email: req.body.email }, function(err, user){
    if (err) return handleError(err);
    res.send(user);
  });
});

router.get('/logout', function(req, res, next){
  req.session.reset();
  res.redirect('/');
});

router.get('/search', require_login, function(req, res, next){
  res.render("user_search");
});

//Below is all other user search
router.get('/match-local', require_login, function(req, res, next){
  User.find({
    email: {'$ne': req.user.email},
    city: req.user.city
  }, function(err, users){
    console.log(users);
    res.render("search_results", {users:users});
  });
});

router.get('/add-friend/:id', require_login, function(req, res, next){
  User.findOne( { _id: req.user._id }, function(err, user){
    user.friends.push(req.param('id'));
    user.save();
    res.send(true);
  });
});

router.get('/remove-friend/:id', require_login, function(req, res, next){
  User.update( { _id: req.user._id }, { $pull: {friends: req.param('id')} }, function(){
    ;
  });
  res.send(true)
});

router.get('/get-self', require_login, function(req, res, next){
  res.send(req.user);
});

router.get('/friends', require_login, function(req, res, next){
  User.findOne( { _id: req.user._id }, function(err, user){
    res.render("friends");
  });
});

router.get('/get-friends-list', require_login, function(req, res, next){
  User.findOne( { _id: req.user._id }, function(err, user){
    var friends_dictionary = {};
    var friends_id_list = user.friends;
    /*
    for(var i=0; i<friends_id_list.length; ++i){
      User.findOne( { _id: friends_id_list[i] }, function(err, friend_user){
        friends_dictionary[friend_user._id] = friend_user.firstName + " " + friend_user.lastName;
      });
    }
    console.log(friends_dictionary);
    */

    res.send(friends_id_list);
  });
});

router.post('/save-message', require_login, function(req, res, next){
  console.log( req.body.message);
  var MessageModel = mongoose.model('Message', Message.schema);
  var new_message = new MessageModel({
    from:req.user.firstName,
    to:"TEMPT TO",
    message: req.body.message
  });
  new_message.save(function (err) {
    if (err) return handleError(err);
  });
  res.send(true);
});

router.get('/:id', function(req, res, next){
  User.findOne( { _id: req.param('id') }, function(err, user){
    res.render("other_profile", {user: user});
  });
});

module.exports = router;
