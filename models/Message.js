var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  from: String,
  to: String,
  message: String,
  time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);