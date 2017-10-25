var load_matched_users_with_database = function(){
    $.ajax({
        url:"http://thiman.me:1337/lee/users",
        data:{},
        dataType:"json",
        type:"GET"
    }).done( function(json){
        //Why doesn't $("#users_matched_container") work?
        var users_matched_container = document.getElementById("users_matched_container");
        var json_size = json.length;
        for(var i=0; i<json_size; ++i)
        {
            var ele_div = document.createElement("div");
            ele_div.classList.add("other_user_container");

            var ele_anchor = document.createElement("a");
            ele_anchor.href = "other_profile.html";
            ele_anchor.innerText = json[i].first_name + " " + json[i].last_name;
            ele_anchor.classList.add("other_user_name");
            ele_div.appendChild(ele_anchor);

            var ele_profile_img_anchor = document.createElement("a");
            ele_profile_img_anchor.href = "other_profile.html";
            var ele_img = document.createElement("img");
            ele_img.classList.add("other_user_img");
            ele_img.src = "../img/logo.jpg"; //Should be user img, but no img database atm
            ele_profile_img_anchor.appendChild(ele_img);
            ele_profile_img_anchor.classList.add("other_user_img");
            ele_div.appendChild(ele_profile_img_anchor);

            var ele_message_anchor = document.createElement("a");
            ele_message_anchor.href = "messaging.html";
            ele_message_anchor.innerText = "Message";
            ele_div.appendChild(ele_message_anchor);

            users_matched_container.appendChild(ele_div);
        }
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });
};

/*At the moment, this is same as "load_matched_users_with_database" function.
The database call should be different and href should be different. */
var load_pending_users_with_database = function(){
    $.ajax({
        url:"http://thiman.me:1337/lee/users",
        data:{},
        dataType:"json",
        type:"GET"
    }).done( function(json){
        //Why doesn't $("#users_matched_container") work?
        var pending_users_container = document.getElementById("pending_users_container");
        var json_size = json.length;
        for(var i=0; i<json_size; ++i)
        {
            var ele_div = document.createElement("div");
            ele_div.classList.add("other_user_container");

            var ele_anchor = document.createElement("a");
            ele_anchor.href = "other_profile.html";
            ele_anchor.innerText = json[i].first_name + " " + json[i].last_name;
            ele_anchor.classList.add("other_user_name");
            ele_div.appendChild(ele_anchor);

            var ele_profile_img_anchor = document.createElement("a");
            ele_profile_img_anchor.href = "other_profile.html";
            var ele_img = document.createElement("img");
            ele_img.classList.add("other_user_img");
            ele_img.src = "../img/logo.jpg"; //Should be user img, but no img database atm
            ele_profile_img_anchor.appendChild(ele_img);
            ele_profile_img_anchor.classList.add("other_user_img");
            ele_div.appendChild(ele_profile_img_anchor);

            var ele_message_anchor = document.createElement("a");
            ele_message_anchor.href = "messaging.html";
            ele_message_anchor.innerText = "Message";
            ele_div.appendChild(ele_message_anchor);

            pending_users_container.appendChild(ele_div);
        }
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });
};

var main = function(){
    load_matched_users_with_database();
    load_pending_users_with_database();
};

main();