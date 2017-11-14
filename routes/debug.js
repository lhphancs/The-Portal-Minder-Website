var express = require('express');
var router = express.Router();
var auth = require('../util/auth');
var https = require("https");
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var UserModel = require('../models/UserModel');
var Message = require('../models/MessageModel');

var require_login = auth.require_login;
var saltRounds = 10;
// Add two users, A and B
router.get('/add-two', function(req, res, next){
  users = [
    {
      firstName: "A", lastName: "A", email: "a@gmail.com", password: hash_password = bcrypt.hashSync("a", saltRounds)
    }
    ,{
      firstName: "B", lastName: "B", email: "b@gmail.com", password: hash_password = bcrypt.hashSync("b", saltRounds)
    }
  ];
  UserModel.insertMany(users, function(error, docs) {});
  res.send(true);
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
          friendRequests: [],
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
