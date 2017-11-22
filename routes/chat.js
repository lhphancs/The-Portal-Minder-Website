var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var MessageModel = require('../models/MessageModel');
var auth = require('../util/auth');
var notification = require('../util/notification');
var mongoose = require('mongoose');

router.use(auth.require_login);

router.get('/', function(req, res, next) {
  UserModel.findOne( { _id: req.user._id }, function(err, user){
    if( err){console.log(err); }
    res.render("chat");
  });
});

router.get('/get-chat-history', function(req, res, next){
  var self_id = req.user._id;
  var selected_user_id = mongoose.Types.ObjectId(req.query.selected_user_id);
  MessageModel.collection.aggregate(// Pipeline
    [
      // Stage 1
      {
        $match: {
          $or: [{ "fromId": selected_user_id, "toId": self_id }
          , { "fromId": self_id, "toId": selected_user_id }]
        }
      },
      // Stage 2
      {
        $sort: {
          timestamp: 1
        }
      },
    ],
    function(err, chat_history) {
      if( err){console.log(err); }
      res.send(chat_history);
  });
});

router.post('/save-message', function(req, res, next){
  var new_message = new MessageModel({
    fromId: req.user._id,
    toId: req.body.toId,
    message: req.body.message
  });
  new_message.save(function (err) {
    if( err){console.log(err); }
  });
  res.send(true);
});

module.exports = router;
