var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var messageSchema = mongoose.Schema({
  fromId: ObjectId,
  toId: ObjectId,
  message: String,
  timestamp : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);