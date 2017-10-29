var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Minder Homepage' });
});

/* GET home page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Minder About' });
});

router.get('/logout', function(req, res, next){
  req.session.reset();
  res.redirect('/');
});

module.exports = router;
