var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  fromId: String,
  toId: String,
  message: String,
  timestamp : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);