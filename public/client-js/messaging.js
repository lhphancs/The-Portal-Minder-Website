var send_msg_response = function(){
    var messages_container = document.getElementById("msgs_container")
    var ele_textarea_msg = document.getElementById("textarea_msg");

    var new_div = document.createElement("div");
    new_div.classList.add("row");

    var para = document.createElement("p");
    para.classList.add("chat_bubble");
    var node = document.createTextNode("[UserName]: " + ele_textarea_msg.value);
    para.appendChild(node);

    new_div.appendChild(para);
    messages_container.appendChild(new_div);
    ele_textarea_msg.value = "";

    messages_container.scrollTop = messages_container.scrollHeight; //Scrolls to bottom
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


var load_all_users = function(){
    //First get json of all users
    $.ajax({
        url:"http://thiman.me:1337/lee/users",
        data:{},
        dataType:"json",
        type:"GET",
    }).done(function(json){
        var json_size = json.length;
        var contact_list_container = document.getElementById("contact_list");
        for(var i=0; i<json_size; ++i){
            var ele_new_btn = document.createElement("button");
            ele_new_btn.classList.add("btn_user_name");
            ele_new_btn.innerHTML = json[i].first_name + " " + json[i].last_name;
            contact_list_container.appendChild(ele_new_btn);
            ele_new_btn.onclick = btn_user_messaging_response;
        }
    }).fail(function(){
        alert("Failed to grab data from database");
    });
};

var main = function(){
    document.querySelector("#btn_send_msg").onclick = send_msg_response;
    set_event_chat_with_other_user();
    load_all_users();
};

main();