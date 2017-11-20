var NotificationModel = require('../models/NotificationModel');

module.exports = {
  store_to_db: function(self_id, selected_user_id, msg){
    var newNotification = new NotificationModel({
      userId: selected_user_id,
      fromId: self_id,
      message: msg
    });
    newNotification.save(function(err){
      if(err)
        console.log(err);
    })
  }
};