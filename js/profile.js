/*This function disables all textarea fields at start*/
var textarea_disable = function(){
    var eles_textarea = document.getElementsByTagName("textarea");
    for(var i = 0; i<eles_textarea.length; ++i)
    {
        eles_textarea[i].disabled = true;
    }
};

var insert_tag_response =  function(){
        const TAG_MAX_AMOUNT = 10;

        var input_txt = document.getElementById("input_tag").value;
        if(input_txt === ""){
            alert("Must enter text before adding tag. Try again.")
            return;
        }
        var tag_list_container = document.getElementById("tag_list_container");

        //Check if past tag limit
        if(document.getElementsByClassName("div_tag_container").length >= TAG_MAX_AMOUNT)
            alert("Max amount of tag is " + TAG_MAX_AMOUNT);

        //Add new removable tag based on input
        else{
            //Create a new paragraph with input as text
            var ele_div = document.createElement("div");
            ele_div.classList.add("tag_txt");
            var para_node = document.createTextNode(input_txt);
            ele_div.appendChild(para_node);

            //Create a button that user can click to remove tag
            var ele_remove_btn = document.createElement("button");
            ele_remove_btn.classList.add("btn_tag_remove");
            var btn_node = document.createTextNode("x");
            ele_remove_btn.appendChild(btn_node);

            //Append these the paragraph and the remove btn to new div
            var div_to_insert = document.createElement("div");
            div_to_insert.classList.add("div_tag_container");
            div_to_insert.appendChild(ele_div);
            div_to_insert.appendChild(ele_remove_btn);
            tag_list_container.appendChild(div_to_insert);

            //Now set it so that when they click ele_remove_btn, it will remove parent
            ele_remove_btn.onclick = remove_parent_response;
        }

};

var remove_parent_response = function(){
    var ele_parent = this.parentNode;
    ele_parent.parentNode.removeChild(ele_parent);
};

var set_event_edit_and_save_textarea_response = function()
{
    var editable_containers_eles = document.getElementsByClassName("editable_container");
    for(var i=0; i<editable_containers_eles.length; ++i)
    {
        var ele_btn_edit = editable_containers_eles[i].getElementsByTagName("button")[0];
        ele_btn_edit.onclick = function(){
            var ele_textarea = this.parentNode.getElementsByTagName('textarea')[0];

            ele_textarea.disabled = !ele_textarea.disabled;
            if(ele_textarea.disabled)
                this.innerHTML = "Edit";
            else
                this.innerHTML = "Save";
        };
    }
};

var save_profile_response = function(){
    alert("This needs to be filled out later.");
};

var activate_video = function(){
    var video = document.querySelector("#video_webcam");

    //This checks for which one will browser match first
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }

    function handleVideo(stream) {
        local_stream = stream;
        video.src = window.URL.createObjectURL(stream);
    }

    function videoError(e) {
        // do something
    }
};

var set_capture_listener = function(){
    // Elements for taking the snapshot
    var canvas = document.getElementById('canvas_user');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video_webcam');

    // Trigger photo take
    document.getElementById("btn_webcam_toggle").addEventListener("click", function() {
        context.drawImage(video, 0, 0, 100, 100);
    });
};

var set_webcam_toggle = function(){
    var ele_video = document.querySelector("#video_webcam");
    var ele_canvas = document.querySelector("#canvas_user");
    var btn_webcam_toggle = document.querySelector("#btn_webcam_toggle");
    //This will turn on webcam
    if(ele_video.classList.contains("display_none") ){
        btn_webcam_toggle.innerHTML = "Take picture";
        ele_video.classList.remove("display_none");
        ele_canvas.classList.add("display_none");
        activate_video();
    }

    //This will turn off webcam and display picture taken
    else{
        btn_webcam_toggle.innerHTML = "Activate webcam";
        setTimeout(function() {
            local_stream.stop();
            ele_video.classList.add("display_none");
            ele_canvas.classList.remove("display_none");
        }, 0); //Why do I need a set timeout of 0? breaks if I remove setTimeout
        
        
    }
};

var local_stream;
var main = function(){
    textarea_disable();
    set_event_edit_and_save_textarea_response();
    document.getElementById("btn_add_tag").onclick = insert_tag_response;
    document.getElementById("btn_save_profile").onclick = save_profile_response;
    document.getElementById("btn_webcam_toggle").onclick = set_webcam_toggle;
    set_capture_listener();
};

main();
