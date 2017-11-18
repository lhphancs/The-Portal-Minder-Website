var mongoose = require('mongoose');

var notificationsSchema = mongoose.Schema({
  userId: {type: Object, require: true, unique: true},
    fromId: String,
    message: String,
    time : {type: Date, default: Date.now},
    isUnread: {type: Boolean, default: true} }
);

module.exports = mongoose.model('Notifications', notificationsSchema);