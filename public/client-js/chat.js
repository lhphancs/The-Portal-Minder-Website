var socket = io();
socket.on('chat message', function(msg){
    //Update chatbox to contain incoming msg
    var single_msg_container = create_and_get_single_msg_container(msg);
    single_msg_container.addClass("d-flex align-items-end flex-column");;
    $("#msgs_container").append(single_msg_container);
  });

var user_chatting_with;
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
}

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
                "btn_user_name").val(id).click(
                switch_user_chat_response).text(first_name + " " + last_name);
                contact_list.append(ele_new_btn);
            //Click first after it loads first while it loads rest of users
            if(i === 0)
                $("#contact_list button:first-child").click();
        }
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });
};

var create_and_get_single_msg_container = function(msg){
    var span_msg = $("<span>").addClass("border border-primary rounded px-2").text(msg);
    var div_msg = $("<div>").addClass("mt-2").append(span_msg);
    return div_msg;
};

var send_msg_response = function(user_self){
    //Add msg to the chatbox
    var first_and_last_name = user_self.firstName + " " + user_self.lastName;
    var msg_from_chat_box = $("#textarea_msg").val();
    var msg_line = first_and_last_name + ": " + msg_from_chat_box
    var single_msg_container = create_and_get_single_msg_container(msg_line);
    $("#msgs_container").append(single_msg_container);
    //Now store message in database
    $.ajax({
        url: "http://localhost:3000/user/save-message",
        data: {
            to: user_chatting_with,
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
    user_chatting_with = this.value; //update global user's id we are chatting with
    //Clear all old stuff first
    var msg_container = document.getElementById("msgs_container");
    do
    {
        try{
            var child_node = msg_container.firstChild;
            msg_container.removeChild(child_node);
        }
        catch (e) {
        }
    } while(child_node);
    document.getElementById("textarea_msg").value = "";

    //Add chat bubble w/ msg
    var para = document.createElement("p");
    para.classList.add("msg_header");
    para.innerHTML = "You are chatting with " + this.innerHTML;
    msg_container.appendChild(para);
};

var set_event_chat_with_other_user = function(){
    var eles_btn_user_messaging = document.getElementsByClassName("btn_user_name");
    for(var i=0; i<eles_btn_user_messaging.length; ++i)
    {
        eles_btn_user_messaging[i].onclick = switch_user_chat_response;
    }
};

var set_btn_send_msg_response = function(){
    $("#btn_send_msg").click(function(){
        var user_self = get_self();
        send_msg_response(user_self);
    });
};

var main = function(){
    load_friends_and_click_first();
    set_btn_send_msg_response();
};


$(document).ready(function(){
    main();
});
