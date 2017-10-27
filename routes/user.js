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

/* Return all data for specific user */
router.get('/user/:email', function(req, res, next){
  //ME TO DO HERE!
  User.findOne( { email: req.body.email }, function(err, user){
    console.log(req.body.email)
  } );
});

// User password check
router.post('/validation', function(req, res, next) {
  User.findOne( { email: req.body.email }, function(err, user){
    if(req.body.password === user.password)
      res.send(true);
    else
      res.send(false);
  } );
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
        password:req.body.password1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city:req.body.city,
        description:"",
        tags:[],
        education:""
      });
      newUser.save(function (err) {
        res.send(true);
      });
    }
  }); 
});

// User viewing own
router.post('/profile', function(req, res, next) {
  User.findOne( { email: req.body.email }, function(err, user){
    res.render('profile', user);
  });
});

router.patch('/profile', function(req, res, next){
  ;
});

router.delete('/profile', function(req, res, next){
  User.remove( { email: req.body.email }, function(err, user){
    if (err) return handleError(err);
    res.send(user);
  });
  
});

module.exports = router;
