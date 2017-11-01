var load_all_users = function(){
    $.ajax({
        url:"http://localhost:3000/user/get-all-local-users",
        data:{},
        dataType:"json",
        type:"GET",
    }).done(function(json){
        var matched_users_container = $("#matched_users_container");
        //Show each user
        for(var i=0; i<json.length; ++i){
            var user_first_name = json[i].firstName;
            var user_last_name = json[i].lastName;
            var user_id = json[i]._id;
            display_name = user_first_name + " " + user_last_name;
            user_profile_href = "/user/" + user_id;

            //Create elements to add to container
            var other_user_container = $("<div>").addClass("other_user_container");
            other_user_container.append( $("<a>").addClass("other_user_name").attr("href", user_profile_href).text(display_name) );
            other_user_container.append( $("<img>").addClass("other_user_img").attr("src", "/images/logo.jpg") );
            other_user_container.append( $("<button>").addClass("btn_add_friend add-mode").attr("value", user_id).text("ADD") );
    
            matched_users_container.append(other_user_container);
        }
    }).fail(function(){
        alert("Failed to grab data from database");
        return false;
    });
}

var main = function(){
    set_btn_response_add_friend();
};

$(document).ready(function(){
    load_all_users();
    main();
});