var send_msg = function(){
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

    //Add person chatting with
    var para = document.createElement("p");
    para.classList.add("msg_header");
    var node = document.createTextNode("You are chatting with " + this.innerHTML);
    msg_container.appendChild(node);
};

var ele_send_btn = document.getElementById("btn_send_msg");
ele_send_btn.onclick = send_msg;

var eles_btn_user_messaging = document.getElementsByClassName("btn_user_name");
for(var i=0; i<eles_btn_user_messaging.length; ++i)
{
    eles_btn_user_messaging[i].onclick = btn_user_messaging_response;
}

