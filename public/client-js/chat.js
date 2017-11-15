//Global variables
var self_user;

var selected_user = { //Keeps track of user currently chatting with
    id: "",
    name: ""
};

var set_selected_user = function(id, name){
    selected_user.id = id;
    selected_user.name = name;
};

var get_selected_user = function(){
    return selected_user;
};

var set_self = function(){
    $.ajax({
        async: false,
        url: "http://localhost:3000/user/get-self",
        data: {},
        dataType: "json",
        type: "GET"
    }).done(function(json){
        self_user = json;
    }).fail(function(json){
        alert("Fetching user_matches from database failed.")
    });
};

var get_self = function(){
    return self_user;
};

var get_room_id_with_selected_user = function(){
    var self_id = get_self()._id;
    var selected_user_id = selected_user.id;
    // return ids alphabetically concatenated to create unique name
    return self_id < selected_user_id ? self_id + selected_user_id : selected_user_id + self_id;
}

var set_socket_settings = function(socket){
    socket.on('received_chat_msg', function(msg){
        console.log(msg);
        //Update chatbox to contain incoming msg
        add_msg_to_container(selected_user.name, msg, false);
    });
};

var load_friends_and_click_first = function(){
    $.ajax({
        url: "http://localhost:3000/friends/get-friends-list",
        data: {},
        dataType: "json",
        type: "GET"
    }).done( function(json){
        var json_size = json.length;
        var contact_list = $("#contact_list");
        for(var i=0; i<json_size; ++i){
            var id = json[i]._id;
            var name = json[i].firstName + " " + json[i].lastName;

            contact_list.append(
                `<button class="btn btn-secondary btn-sm btn-block btn_user_name"
                data-user-id="${id}">${name}</button>`);

            //User may have long list of friends, so after load one, click it
            if(i==0)
                $("#contact_list > button")[0].click();
        }
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });
};

var add_msg_to_container = function(from_name, msg, is_sender){
    send_class = "msg_sent";
    receive_class = "msg_receive";
    var class_to_add = is_sender?send_class:receive_class;
    $("#msgs_list").append(
        $(`<li class="py-1 ${class_to_add}">
                <div class="border border-primary rounded px-2 mx-2 msg_container">${from_name + ": " + msg}</div>
            </li>`
        ));
};

var scroll_to_bottom_of_msgs = function(){
    var objDiv = document.getElementById("msgs_container");
    objDiv.scrollTop = objDiv.scrollHeight;
};

var send_msg_response = function(socket){
    //Add msg to the chatbox
    var user_self = get_self();
    var first_and_last_name = user_self.firstName + " " + user_self.lastName;
    var msg_from_chat_box = $("#textarea_msg").val();
    add_msg_to_container(first_and_last_name, msg_from_chat_box, true);

    //Scroll to bottom of msg  
    scroll_to_bottom_of_msgs();
    //clear textarea
    $("#textarea_msg").val("");

    //If no user_selected, allow only to test chat w/o storing in database.
    if(selected_user.id === "")
        return;

    //Now store message in database
    $.ajax({
        url: "http://localhost:3000/chat/save-message",
        data: {
            to_id: selected_user.id,
            message: msg_from_chat_box
        },
        dataType: "json",
        type: "POST"
    }).done(function(json){
        //Now use socket to send to to user
        socket.emit('sent_chat_msg', {
            room_id: get_room_id_with_selected_user(),
            msg: msg_from_chat_box
        });
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });
};

//Uses event delegation
var set_switch_user_chat_response = function(socket){
    $("#contact_list").on("click", ".btn_user_name", function(){
        var user_id = $(this).attr('data-user-id');
        var user_name = this.innerHTML;
        set_selected_user(user_id, user_name); //update global user's id we are chatting with

        //Clear all old stuff first
        $("#msgs_list").empty();
        $("#textarea_msg").val("");
        
        //Display who chatting with and load history msgs
        $("#msgs_container_header").text("Chatting with: " + user_name);
        load_chat_history();

        //Set socket to join unique room
        socket.emit("subscribe", get_room_id_with_selected_user() );
    });
};

var fill_chat_container_with_history_json = function(json){
    var user_self = get_self();
    var self_name = user_self.firstName + " " + user_self.lastName;
    var selected_user_name = get_selected_user().name;
    var selected_user_id = get_selected_user().id;
    for(var i=0; i<json.length; ++i){
        if( json[i].to_id === selected_user_id ){ //If sent msg
            add_msg_to_container(self_name, json[i].message, true);
        } 
        else{ //else it is received msg
            add_msg_to_container(selected_user_name, json[i].message, false);
        }
    }
};

var load_chat_history = function(){
    var selected_user_id = get_selected_user().id;
    $.ajax({
        url: "http://localhost:3000/chat/get-chat-history",
        type: "GET",
        dataType: "json",
        data: { selected_user_id: selected_user_id }
    }).done(function(json){
        fill_chat_container_with_history_json(json);
        scroll_to_bottom_of_msgs();
    });
};

var set_send_msg_resonse = function(socket){
    $("#btn_send_msg").click(function(){
        send_msg_response(socket);
    });

    $("#textarea_msg").on("keypress", function(e){
        if(e.which === 13 && !e.shiftKey){
            e.preventDefault(); //Stops it from doing /n before sending msg
            send_msg_response(socket);
        }
    });
};
var main = function(){
    var socket = io();
    set_socket_settings(socket);

    set_self();
    load_friends_and_click_first();
    set_send_msg_resonse(socket);
    set_switch_user_chat_response(socket);
};

$(document).ready(function(){
    main();
});
