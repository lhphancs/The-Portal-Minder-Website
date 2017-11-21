var NotificationModel = require('../models/NotificationModel');

module.exports = {
  store_to_db: function(user, selected_user_id, msg){
    var newNotification = new NotificationModel({
      userId: selected_user_id,
      fromId: user._id,
      fromName: user.firstName + " " + user.lastName,
      message: msg
    });
    newNotification.save(function(err){
      if(err)
        console.log(err);
    })
  }
};