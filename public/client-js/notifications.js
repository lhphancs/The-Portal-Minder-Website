var set_btn_notification_response = function(){
    $("#notifications_container").on("click", ".single_notification_container", function(){
        message = $(this).children("p").text();
        alert("MESSAGE: " + message);
    });
};

var load_name = function(){
    var id_set = new Set();
    $("li.single_notification_container").each(function(){
        var id = $(this).attr("data-user-id");
        id_set.add(id);
    });
    var id_array = [];
    for(item of id_set)
        id_array.push(item);

    $.ajax({
        url: "/notifications/get-names",
        data: {id_set: JSON.stringify(id_array)},
        type: "POST",
        dataType: "json"
    }).done(function(json){
        //First create a dict of {_id: first+lastName} using json
        var id_to_name_dict = {};
        var json_size = json.length;
        for(var i=0; i<json_size; ++i){
            var user = json[i];
            id_to_name_dict[ user._id ] = user.firstName + " " + user.lastName;
        }
        
        //Now load up the names using the dict
        $("li.single_notification_container").each(function(){
            var id = $(this).attr("data-user-id");
            $(this).find(".name_div").text( id_to_name_dict[id] );
        });
    });
}

var load_notifications_with_database = function(){
    $.ajax({
        url:"/notifications/get-all-notifications",
        data:{},
        dataType:"json",
        type:"GET"
    }).done( function(json){
        var notifications_container = $("#notifications_list");
        var json_size = json.length;
        if(json_size === 0)
            notifications_container.append(`<div class="no_notifications">No notifications</div>`);
        for(var i=0; i<json_size; ++i){
            var attached_class = json[i].isUnread?"unread":"";
            notifications_container.append(
                `<li class="row single_notification_container ${attached_class}" data-user-id="${json[i].from_id}">
                    <input type="checkbox" class="notification_checkbox">
                    <div class="col-sm-3 name_div"></div>
                    <div class="col-sm-8"> ${json[i].message}</div>
                </li>`
            );
        }
        load_name();
    } ).fail( function(){
        alert("Failed to get data from database");
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

var main = function(){
    load_notifications_with_database();
    set_btn_notification_response();
    set_select_all_notification_toggle();
};

main();