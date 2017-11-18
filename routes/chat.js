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
  var self_id = String(req.user._id); //Need to convert object to string for some reason
  var selected_user_id = req.query.selected_user_id;
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
          time: 1
        }
      },
    ],
    function(err, chat_history) {
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
    if (err) return handleError(err);
  });
  res.send(true);
});
module.exports = router;
