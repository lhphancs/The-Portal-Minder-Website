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

var load_friends = function(){
    $.ajax({
        url:"http://localhost:3000/user/get-friends-list",
        data:{},
        dataType:"json",
        type:"GET"
    }).done( function(json){
        var json_size = json.length;
        var contact_list_container = document.getElementById("contact_list");
        for(var i=0; i<json_size; ++i){
            var ele_new_btn = document.createElement("button");
            ele_new_btn.classList.add("btn_user_name");
            ele_new_btn.innerHTML = json[i];
            contact_list_container.appendChild(ele_new_btn);
            ele_new_btn.onclick = btn_user_messaging_response;
        }
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });
};

var send_msg_response = function(user_self){
    var messages_container = document.getElementById("msgs_container")
    var ele_textarea_msg = document.getElementById("textarea_msg");

    var new_div = document.createElement("div");
    new_div.classList.add("row");

    var para = document.createElement("p");
    para.classList.add("chat_bubble");
    para.innerText = user_self.firstName + " "
        + user_self.lastName + ": " + ele_textarea_msg.value;

    new_div.appendChild(para);
    messages_container.appendChild(new_div);
    messages_container.scrollTop = messages_container.scrollHeight; //Scrolls to bottom

    //Now store message in database
    $.ajax({
        url:"http://localhost:3000/user/save-message",
        data:{
            to:user_self._id,
            message:ele_textarea_msg.value
        },
        dataType:"json",
        type:"POST"
    }).done( function(json){
        ;
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });

    //clear textarea
    ele_textarea_msg.value = "";
};

var btn_user_messaging_response = function(){
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
        eles_btn_user_messaging[i].onclick = btn_user_messaging_response;
    }
};

var main = function(){
    load_friends();
};

$(document).ready(function(){
    main();
    $("#btn_send_msg").click(function(){
        var user_self = get_self();
        send_msg_response(user_self);
    });
});
