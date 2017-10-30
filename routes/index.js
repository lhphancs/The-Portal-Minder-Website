var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Minder Homepage' });
});

/* GET home page. */
router.get('/friends', function(req, res, next) {
  res.render('friends_list', { title: 'Friends' });
});

/* GET home page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Minder About' });
});


module.exports = router;
