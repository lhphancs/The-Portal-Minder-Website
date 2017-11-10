//Global variable that keeps track of user currently chatting with
var current_user_chatting_with = {
    id: "",
    name: ""
};

var set_current_user_chatting_with = function(id, name){
    current_user_chatting_with.id = id;
    current_user_chatting_with.name = name;
};

var get_current_user_chatting_with = function(){
    return current_user_chatting_with;
};

var get_self = function(){
    var user_self;
    $.ajax({
        async: false,
        url:"http://localhost:3000/user/get-self",
        data:{},
        dataType:"json",
        type:"GET"
    }).done( function(json){
        user_self = json;
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });
    return user_self;
};

var load_friends_and_click_first = function(){
    $.ajax({
        url:"http://localhost:3000/user/get-friends-list",
        data:{},
        dataType:"json",
        type:"GET"
    }).done( function(json){
        var json_size = json.length;
        var contact_list = $("#contact_list");
        for(var i=0; i<json_size; ++i){
            var id = json[i]._id;
            var first_name = json[i].firstName;
            var last_name = json[i].lastName;

            var ele_new_btn = $("<button>").addClass(
                "btn_user_name").val(id).click(switch_user_chat_response).text(first_name + " " + last_name);
                contact_list.append(ele_new_btn);
            //User may have long list of friends, so after load one, click it
            if(i==0)
                $("#contact_list button:first-child").click();
        }
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });
};

var create_and_get_single_msg_container = function(from_name, msg){
    var span_msg = $("<span>").addClass("border border-primary rounded px-2").text(from_name + ": " + msg);
    var div_msg = $("<div>").addClass("mt-2").append(span_msg);
    return div_msg;
};

var add_sent_msg_to_container = function(ele){
    $("#msgs_container").append(ele);
};

var add_received_msg_to_container = function(ele){
    ele.addClass("d-flex align-items-end flex-column");
    $("#msgs_container").append(ele);
};

var send_msg_response = function(socket){
    //Add msg to the chatbox
    var user_self = get_self();
    var first_and_last_name = user_self.firstName + " " + user_self.lastName;
    var msg_from_chat_box = $("#textarea_msg").val();
    var single_msg_container = create_and_get_single_msg_container(first_and_last_name, msg_from_chat_box);
    add_sent_msg_to_container(single_msg_container);
    //Now store message in database
    $.ajax({
        url: "http://localhost:3000/user/save-message",
        data: {
            to_id: current_user_chatting_with.id,
            message: msg_from_chat_box
        },
        dataType: "json",
        type: "POST"
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });

    //Now use socket to send to all
    socket.emit('chat message', msg_line);

    //clear textarea
    $("#textarea_msg").val("");
};

var switch_user_chat_response = function(){
    var user_id = this.value;
    var user_name = this.innerHTML;
    set_current_user_chatting_with(user_id, user_name); //update global user's id we are chatting with
    //Clear all old stuff first
    $("#msgs_container").empty();
    $("#textarea_msg").val("");
    
    //Add header for chatting with
    var ele_header = $("<p>").addClass("msg_header").text("Chatting with: " + user_name);
    $("#msgs_container").append(ele_header);
    load_chat_history();
};

//This function uses global variable
var set_socket_settings = function(socket){
    socket.on('chat message', function(msg){
        //Update chatbox to contain incoming msg
        var single_msg_container = create_and_get_single_msg_container(msg);
        add_received_msg_to_container(single_msg_container);
    });
};

var fill_chat_container_with_history_json = function(json){
    var user_self = get_self();
    var self_name = user_self.firstName + " " + user_self.lastName;
    var current_user_chatting_with_name = get_current_user_chatting_with().name;
    var current_user_chatting_with_id = get_current_user_chatting_with().id;
    for(var i=0; i<json.length; ++i){
        if( json[i].to_id === current_user_chatting_with_id ){ //If sent msg
            var single_msg_container = create_and_get_single_msg_container(self_name, json[i].message);
            add_sent_msg_to_container(single_msg_container);
        } 
        else{ //else it is received msg
            var single_msg_container = create_and_get_single_msg_container(current_user_chatting_with_name, json[i].message);
            add_received_msg_to_container(single_msg_container);
        }    
    }
};

var load_chat_history = function(){
    $.ajax({
        url: "http://localhost:3000/user/chat-load-history",
        type: "GET",
        dataType: "json",
        data: { current_user_chatting_with: get_current_user_chatting_with().id }
    }).done(function(json){
        fill_chat_container_with_history_json(json);
    });
};

var main = function(){
    var socket = io();
    set_socket_settings(socket);
    load_friends_and_click_first();
    $("#btn_send_msg").click(function(){
        send_msg_response(socket);
    });
};

$(document).ready(function(){
    main();
});
