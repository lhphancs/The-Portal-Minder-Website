var express = require('express');
var router = express.Router();
var auth = require('../util/auth');
var UserModel = require('../models/UserModel');
var MessageModel = require('../models/MessageModel');

router.use(auth.require_login);

router.get('/', function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    res.render("chat");
  });
});

router.get('/get-chat-history', function(req, res, next){
  var other_user_id = req.query.other_user_id;
  Message.find( { 
    $or: [ {from_id: other_user_id, to_id: req.user._id}
          ,{from_id: req.user._id, to_id: other_user_id}] }
    , function(err, messages){
    res.send(messages);
  });
});

router.post('/save-message', function(req, res, next){
  var MessageModel = mongoose.model('Message', Message.schema);
  var new_message = new MessageModel({
    from_id: req.user._id,
    to_id: req.body.to_id,
    message: req.body.message
  });
  new_message.save(function (err) {
    if (err) return handleError(err);
  });
  res.send(true);
});
module.exports = router;
