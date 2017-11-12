var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel = require('../models/UserModel');
var Message = require('../models/MessageModel');
var bcrypt = require('bcrypt');
var auth = require('../util/auth');
var https = require("https");

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


router.get('/add-randoms', function(req, res, next){
  https.get("https://randomuser.me/api/?results=50&inc=name,email,password,location,picture", function(response){
    var body = '';

    response.on('data', function(data) {
      body += data;
    });
    response.on('end', function() {
      var json = JSON.parse(body).results;
      var users = [];
      for(var i=0; i<json.length; ++i){
        var t_json = json[i];
        var user = {
          email: t_json.email,
          password: t_json.email,
          firstName: t_json.name.first,
          lastName: t_json.name.last,
          city: t_json.location.city,
          description: "",
          tags: get_random_tags(),
          education: "",
          friends: [],
          pendingFriends: [],
          blockedUsers: [],
          notification: [],
          photoURL: t_json.picture.thumbnail
        };
        users.push(user);
      }
      UserModel.insertMany(users, function(error, docs) {});
      res.send("Added 50 users to database");
    });
  }).on('error', function(error) {
    res.send(error);
  });;
});

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var get_random_tags = function(){
  const AMOUNT_OF_TAGS = 10;
  const hobbies =[
    "American Football","Baseball","Cricket","Gaelic Football","Hurling"
    ,"Rugby Union","Soccer","Speedball","Australian Rules Football"
    ,"Canadian Football","Field Hockey","Highland Games","Lacrosse"
    ,"Rugby League","Shinty","Softball","Stadium Architecture ","Badminton"
    ,"Court Handball","Jai alai","Netball","Rackets","Squash","Table Tennis"
    ,"Tennis","Basketball","Fives","Korfball","Paddleball","Real Tennis"
    ,"Sticks and Balls","Team Handball","Volleyball ","Billiards","Bowling"
    ,"Croquet","Snooker","Boules","Bowls","Golf","Skittles","Sports Footwear"
    ,"Aikido","Fencing","Judo","Karate","Sports Injuries","Tae Kwon Do"
    ,"Wrestling","Jiu Jitsu","Kabaddi","Kendo","Sumo Wrestling","Aikido"
    ,"Fencing","Judo","Karate","Sports Injuries","Tae Kwon Do","Wrestling"
    ,"Boxing","Jiu Jitsu","Kabaddi","Kendo","Sumo Wrestling","Aerobatics"
    ,"Engines and Technology","IndyCars","Motocross","Motorcycling - Trials"
    ,"Powerboat Racing","Rallycross","Stock Car Racing","Drag Racing"
    ,"Formula One","Karting","Motorcycling","NASCAR","Rally Driving","Speedway"
    ,"Betting","Dressage","Fishing","Harness Racing","Pigeon Racing","Show Jumping"
    ,"Carriage Driving","Eventing","Greyhound Racing","Horse Racing","Polo"
    ,"Sled Dog Racing"
  ];
  var random_hobbies = [];
  var hobbies_len = hobbies.length;

  for(var i=0;i<AMOUNT_OF_TAGS;++i){
    var random_index = getRandomInt(0, hobbies_len-1);
    var random_hobby = hobbies[random_index];
    random_hobbies.push(random_hobby);
  }
  var unique_items = Array.from(new Set(random_hobbies))
  return unique_items;
};

module.exports = router;
