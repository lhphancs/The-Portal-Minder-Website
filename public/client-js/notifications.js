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
        var notifications_container = $("#notifications_container");
        var json_size = json.length;
        for(var i=0; i<json_size; ++i){
            notifications_container.append(
                `<button class="single_notification_container" data-user-id="${json[i].id}">
                    <h4 class="notification_header">${json[i].name}</h4>
                    <p class="nodification_message">${json[i].msg}</p>
                </button>`
            );
        }
    } ).fail( function(){
        alert("Failed to get data from database");
    });
};

var main = function(){
    load_notifications_with_database();
    set_btn_notification_response();
};

main();