var mongoose = require('mongoose');

var notificationsSchema = mongoose.Schema({
  userId: {type: String},
    fromId: {type: String},
    message: String,
    timestamp : {type: Date, default: Date.now},
    isRead: {type: Boolean, default: false} }
);

module.exports = mongoose.model('Notifications', notificationsSchema);