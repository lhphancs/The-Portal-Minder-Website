var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


router.get('/', function(req, res, next) {
  res.render('profile', { title: 'Minder Profile' });
});

router.post('/edit'
, function(req, res, next) {

  
  newUser.save(function (err) {
    if (err) return console.error(err);
    else res.send("SUCCESS");
  });
});

router.patch('/', function(err, res){
  
})

module.exports = router;
