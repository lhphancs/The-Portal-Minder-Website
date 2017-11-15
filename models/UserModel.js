var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstName: {type: String, require:true},
  lastName: {type: String, require: true},
  email: {type: String, require: true, unique: true},
  password: String,
  city: {type: String, require: true},
  description: String, default: "",
  tags: [String], default: [],
  education: String, default: "",
  friends: [String], default: [],
  friendRequests: [String], default: [],
  pendingFriends: [String], default: [],
  blockedUsers: [String], default: [],
  notifications: [ {from_id: String, message: String, unread: Boolean} ], default: [],
  photoURL: String, default: ""
});

module.exports = mongoose.model('User', userSchema);