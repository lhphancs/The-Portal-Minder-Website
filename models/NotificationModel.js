var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var notificationsSchema = mongoose.Schema({
  userId: {type: ObjectId},
    fromId: {type: ObjectId},
    message: String,
    timestamp : {type: Date, default: Date.now},
    isRead: {type: Boolean, default: false} }
);

module.exports = mongoose.model('Notifications', notificationsSchema);