var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstName: {type: String, require: true},
  lastName: {type: String, require: true},
  email: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  city: {type: String, require: true},
  description: String, default: "",
  tags: [String], default: [],
  education: String, default: "",
  friends: [String], default: [],
  friendRequests: [String], default: [],
  pendingFriends: [String], default: [],
  blockedUsers: [String], default: [],
  photoURL: String, default: "",
  notificationsUnviewedCount: {type: Number, default: 0},
  settings: { notifications: {
    friendRequest: {type: Boolean, default: true},
    friendRequestCancelled: {type: Boolean, default: true},
    friendAccepted: {type: Boolean, default: true},
    friendRejected: {type: Boolean, default: true},
    friendRemoved: {type: Boolean, default: true},
    chatInitiated: {type: Boolean, default: true}, 
  } }
});

module.exports = mongoose.model('User', userSchema);