var local_stream;
var set_insert_tag_response =  function(){
    $("#btn_add_tag").click(function(){
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
            ele_div.innerText = input_txt;
            ele_div.classList.add("tag_txt");

            //Create a button that user can click to remove tag
            var ele_remove_btn = document.createElement("button");
            ele_remove_btn.classList.add("btn_tag_remove");
            ele_remove_btn.innerHTML = "x";

            //Append these the paragraph and the remove btn to new div
            var div_to_insert = document.createElement("div");
            div_to_insert.classList.add("div_tag_container");
            div_to_insert.appendChild(ele_div);
            div_to_insert.appendChild(ele_remove_btn);
            tag_list_container.appendChild(div_to_insert);

            //Now set it so that when they click ele_remove_btn, it will remove parent
            ele_remove_btn.onclick = remove_parent_response;
        }
    });
};

var remove_parent_response = function(){
    var ele_parent = this.parentNode;
    ele_parent.parentNode.removeChild(ele_parent);
};

var activate_video = function(){
    var video = document.querySelector("#video_webcam");
    
   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    
   if (navigator.getUserMedia) {       
       navigator.getUserMedia({video: true}, handleVideo, videoError);
   }
    
   function handleVideo(stream) {
       video.src = window.URL.createObjectURL(stream);
       local_stream = stream;
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

var set_webcam_toggle_response = function(){
    $("#btn_webcam_toggle").click(function(e){
        e.preventDefault();

        //This will turn on webcam
        if( $("#video_webcam").hasClass("display_none") ){
            activate_video();
        }
            
        //This will turn off webcam and display picture taken
        else{
            btn_webcam_toggle.innerHTML = "Activate webcam";
            setTimeout(function() {
                ;
            }, 0); //Why do I need a set timeout of 0? breaks if I remove setTimeout 
        }
        $("#canvas_user").toggleClass("display_none");
        $("#video_webcam").toggleClass("display_none");
    });
};


var update_map = function(){
    var img_map = document.querySelector("#map");
    var str_city = $("#textarea_city").val();
    var query = "center=" + str_city;
    img_map.src = "https://maps.googleapis.com/maps/api/staticmap?" + query
                    + "&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794"
                    + "&key=AIzaSyB4DZ4LgiGs_wHsmkGzgUCB4TJHSomYVFU";
};

var set_save_profile_response = function(){
    $("#btn_save_profile").click(function(){
        var all_tags = [];
        $("div.tag_txt").each(function(){
            all_tags.push(this.innerText);
        });

        $.ajax({
            url:"http://localhost:3000/user/profile",
            data:{
                firstName: $("#input_first_name").val(),
                lastName: $("#input_last_name").val(),
                city: $("#input_city").val(),
                description: $("#textarea_description").val(),
                tags: all_tags,
                education: $("#input_education").val(),
            },
            dataType:"json",
            type:"PATCH",
        }).done(function(json){
            alert(json);
            window.location.replace("http://localhost:3000/user/profile");
        
        }).fail(function(){
            alert("Failed to grab data from database!!");
            return false;
        });
    });
};

var main = function(){
    //Set tag insert listener for keyboard
    document.querySelector("#input_tag").addEventListener("keydown", function(){
        if(event.key === "Enter")
            insert_tag_response(event);
    })
    //Set tag insert listener for buton
    set_insert_tag_response();
    set_save_profile_response();
    update_map();
    set_webcam_toggle_response();
    set_capture_listener();
};

$(document).ready(function(){
    main();
});
