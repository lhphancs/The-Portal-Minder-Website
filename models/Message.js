var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  from: String,
  to: String,
  message: String,
  time: Date
});

module.exports = mongoose.model('Message', messageSchema);