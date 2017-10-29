var load_matched_users_with_database = function(){
    $.ajax({
        url:"http://thiman.me:1337/lee/users",
        data:{},
        dataType:"json",
        type:"GET"
    }).done( function(json){
        var ele_matched_users_container = document.getElementById("matched_users_container");
        var json_size = json.length;
        for(var i=0; i<json_size; ++i){
            var ele_other_user_container = document.createElement("div");
            ele_other_user_container.classList.add("other_user_container");
            var ele_anchor_user_text = document.createElement("a");
            ele_anchor_user_text.classList.add("other_user_name");
            ele_anchor_user_text.innerText = json[i].first_name + " " + json[i].last_name;
            ele_anchor_user_text.href = "other_profile.html";
            ele_other_user_container.appendChild(ele_anchor_user_text);

            var ele_anchor_user_img = document.createElement("img");
            ele_anchor_user_img.src = "../img/logo.jpg";
            ele_anchor_user_img.classList.add("other_user_img");
            ele_anchor_user_text.appendChild(ele_anchor_user_img);

            ele_matched_users_container.appendChild(ele_other_user_container);       
        }
    } ).fail( function(json){
        alert("Failed to get matched users from database.")
    } );
}


var main = function(){
    load_matched_users_with_database();
};

main();