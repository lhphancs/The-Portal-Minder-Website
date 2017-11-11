var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  from_id: String,
  to_id: String,
  message: String,
  time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);