var express = require('express');
var router = express.Router();
var auth = require('../util/auth');
var UserModel = require('../models/UserModel');

router.use(auth.require_login);

router.get('/', function(req, res, next) {
  res.render('settings', { title: 'Minder Settings' });
});

router.post('/save', function(req, res, next){
  console.log(req.body);
  console.log(typeof(req.body.accepted_friend_requests));
  res.send(true);
});

module.exports = router;
