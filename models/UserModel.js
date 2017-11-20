var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var userSchema = mongoose.Schema({
  firstName: {type: String, require: true},
  lastName: {type: String, require: true},
  email: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  city: {type: String, require: true},
  description: String, default: "",
  tags: [String], default: [],
  education: String, default: "",
  friends: [ObjectId], default: [],
  friendRequests: [ObjectId], default: [],
  pendingFriends: [ObjectId], default: [],
  blockedUsers: [ObjectId], default: [],
  photoURL: String, default: "",
  notificationsUnviewedCount: {type: Number, default: 0},
  settings: { notifications: {
    friendRequest: {type: Boolean, default: true},
    friendRequestCancelled: {type: Boolean, default: true},
    friendAccepted: {type: Boolean, default: true},
    friendRejected: {type: Boolean, default: true},
    friendRemoved: {type: Boolean, default: true}
  } }
});

module.exports = mongoose.model('User', userSchema);