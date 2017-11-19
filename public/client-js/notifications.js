var set_btn_notification_response = function(){
    $("#notifications_container").on("click", ".single_notification_container", function(){
        message = $(this).children("p").text();
        alert("MESSAGE: " + message);
    });
};

var set_select_all_notification_toggle = function(){
    $("#selection_box").change(function(){
        if(this.checked){
            $(".notification_checkbox").each(function(){
                $(this).prop("checked", true);
            });
        }
            
        else{
            $(".notification_checkbox").each(function(){
                $(this).prop("checked", false);
            });
        }
    });
}

var set_click_msg_response = function(){
    $("#notifications_list").on("click", ".single_notification_container", function(e){
        if ($(e.target).hasClass("notification_checkbox"))
            return;
        var notification_id = $(this).attr("data-notification-id");
        window.location.replace(`/notifications/message/${notification_id}`);
    });
};

var main = function(){
    set_btn_notification_response();
    set_select_all_notification_toggle();
    set_click_msg_response();
};

$(document).ready(function(){
    main();
});