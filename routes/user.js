var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

function requireLogin (req, res, next) {
  if (!req.user) {
    console.log("REDIRECTING NO COOKIE");
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
      next();
    });
  } else {
    next();
  }
});

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
    if(req.body.password === user.password){
      req.session.user = user;
      res.send(true);
    }
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
        password:req.body.password,
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
router.get('/profile', function(req, res, next) {
  var user_email = req.user.email;
  User.findOne( { email: user_email }, function(err, user){
    res.render("profile", user);
  });
});

router.patch('/profile', function(req, res, next){
  MyModel.findOneAndUpdate({email:req.body.email}, req.newData, {upsert:true}, function(err, doc){
    if (err) return res.send(500, { error: err });
    return res.send("succesfully saved");
});
});

router.delete('/profile', function(req, res, next){
  User.remove( { email: req.body.email }, function(err, user){
    if (err) return handleError(err);
    res.send(user);
  });
});

module.exports = router;
