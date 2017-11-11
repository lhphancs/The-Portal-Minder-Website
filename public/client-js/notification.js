var set_btn_notification_response = function(){
    $("#notifications_container").on("click", ".single_notification_container", function(){
        message = $(this).children("p").text();
        alert("MESSAGE: " + message);
    });
};

var load_notifications_with_database = function(){
    $.ajax({
        url:"http://localhost:3000/discover/get-all-users",
        data:{},
        dataType:"json",
        type:"GET"
    }).done( function(json){
        var ele_notifications_container = document.getElementById("notifications_container");

        var json_size = json.length;
        for(var i=0; i<json_size; ++i){
            var ele_btn = document.createElement("button");
            ele_btn.id = json[i].id; //Need to insert id from database later
            ele_btn.classList.add("single_notification_container");
            var ele_header = document.createElement("h4");
            ele_header.classList.add("notification_header");
            ele_header.innerText = json[i].firstName + " " + json[i].lastName;
            ele_btn.appendChild(ele_header);

            var ele_paragraph = document.createElement("p");
            ele_paragraph.classList.add("nodification_message");
            ele_paragraph.innerText = json[i].password;
            ele_btn.appendChild(ele_paragraph);
            ele_notifications_container.appendChild(ele_btn);
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