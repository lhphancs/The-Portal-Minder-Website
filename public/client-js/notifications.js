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
        if ($(e.target).hasClass("notification_msg")){
            var notification_id = $(this).attr("data-notification-id");
            window.location.replace(`/notifications/message/${notification_id}`);
        }
    });
};

var get_selected_msg_ids = function(){
    var msg_ids = [];
    $(".notification_checkbox:checked").each(function(){
        msg_ids.push( $(this).parent().attr("data-notification-id") );
    });
    return msg_ids;
};

var set_group_delete_reponse = function(){
    $("#btn_group_delete").click(function(){
        msg_ids_json = JSON.stringify( get_selected_msg_ids() );
        
        $.ajax({
            url: "/notifications/message/group-delete",
            type: "DELETE",
            dataType: "json",
            data: {
                msg_ids: msg_ids_json
            }
        }).done(function(){
            $(".notification_checkbox:checked").parent().remove();
        });
    });
};

var set_group_mark_read_response = function(){
    
};
var set_group_mark_unread_response = function(){
    
};

var main = function(){
    set_btn_notification_response();
    set_select_all_notification_toggle();
    set_click_msg_response();
    set_group_delete_reponse();
    set_group_mark_read_response();
    set_group_mark_unread_response();
};

$(document).ready(function(){
    main();
});