var mongoose = require('mongoose');

var notificationsSchema = mongoose.Schema({
  userId: {type: String},
    fromId: {type: String},
    message: String,
    timestamp : {type: Date, default: Date.now},
    isUnread: {type: Boolean, default: true} }
);

module.exports = mongoose.model('Notifications', notificationsSchema);