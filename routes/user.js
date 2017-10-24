var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email:String,
  password:String,
  city:String,
  description:String,
  tags:[String],
  education:String,
});

var User = mongoose.model('User', userSchema);

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Minder Registration' });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add'
, function(req, res, next) {

  var newUser = new User({
    email:req.body.email,
    password:req.body.password1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    city:req.body.city
  });
  newUser.save(function (err) {
    if (err) return console.error(err);
    else{
      res.redirect("/profile");
    }
  });
});

module.exports = router;
