var set_btn_notification_response = function(){
    $("#notifications_container").on("click", ".single_notification_container", function(){
        message = $(this).children("p").text();
        alert("MESSAGE: " + message);
    });
};

var load_notifications_with_database = function(){
    $.ajax({
        url:"http://localhost:3000/notifications/get-all-notifications",
        data:{},
        dataType:"json",
        type:"GET"
    }).done( function(json){
        console.log(json);
        var notifications_container = $("#notifications_list");
        var json_size = json.length;
        for(var i=0; i<json_size; ++i){
            notifications_container.append(
                `<li class="single_notification_container data-user-id="${json[i].id}"">
                    <input type="checkbox" class="notification_checkbox">
                    <a href="#"><div class="anchor_div"><b>${json[i].name}:</b> ${json[i].msg}</div></a>
                </li>`
            );
        }
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