var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  city: String,
  description: String, default: "",
  tags: [String], default: [],
  education: String, default: "",
  friends: [String], default: [],
  friendRequests: [String], default: [],
  pendingFriends: [String], default: [],
  blockedUsers: [String], default: [],
  notification: [{id: String, message: String}], default: [],
  photoURL: String, default: ""
});

module.exports = mongoose.model('User', userSchema);