var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email:String,
  password:String,
  city:String,
  description:String,
  tags:[String],
  education:String,
  friends:[String],
  pendingFriends:[String]
});

module.exports = mongoose.model('User', userSchema);