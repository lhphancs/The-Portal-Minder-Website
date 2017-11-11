var load_all_users = function(mode){
    var ending_path;
    switch(mode){
        case "all": ending_path = "get-all-users"; break;
        case "local": ending_path = "get-all-local-users"; break;
        case "tags": ending_path = "get-all-tags-users"; break;
        default: alert("load_all_users() did not detect any modes!");
    }
    $.ajax({
        url:"http://localhost:3000/discover/" + ending_path,
        data:{},
        dataType:"json",
        type:"GET",
    }).done(function(json){
        console.log(json);
        var matched_users_container = $("#matched_users_container");
        //Show each user
        for(var i=0; i<json.length; ++i){
            var user_first_name = json[i].firstName?json[i].firstName:"[FirstNamePlaceHolder]";
            var user_last_name = json[i].lastName?json[i].lastName:"[LastNamePlaceHolder]";
            var user_id = json[i]._id;
            var photo_url = json[i].photoURL?json[i].photoURL:"/images/logo.jpg";

            var display_name = user_first_name + " " + user_last_name;
            var user_profile_href = "/discover/profile/" + user_id;

            //Create elements to add to container
            var other_user_container = $("<div>").addClass("other_user_container");
            other_user_container.append( $("<a>").addClass("other_user_name").attr("href", user_profile_href).text(display_name) );
            other_user_container.append( $("<img>").addClass("other_user_img").attr("src", photo_url) );
            other_user_container.append( $("<button>").addClass("btn_add_friend add-mode").attr("value", user_id).text("ADD") );
    
            matched_users_container.append(other_user_container);
        }
    }).fail(function(){
        alert("Failed to grab data from database");
        return false;
    });
}

var set_btn_response_toggle_add_friend = function(){
    $("#matched_users_container").on("click", ".btn_add_friend", function(){
        if( $(this).hasClass("add-mode") ){
            $(this).text("Remove");
            $.ajax({
                url:"http://localhost:3000/user/add-friend",
                data:{id:this.value},
                type:"POST",
                dataType:"json"
            }).fail(function(){
                alert("FAILED ADD");
            });
        }
        else{
            $(this).text("Add");
            $.ajax({
                url:"http://localhost:3000/user/remove-friend",
                data:{id:this.value},
                type:"POST",
                dataType:"json"
            }).fail(function(){
                alert("FAILED REMOVE");
            });
        }
        $(this).toggleClass("add-mode");
    });
};

var main = function(){
    load_all_users(mode); // mode variable is loaded in discover_results.html is there way to extract w/ javascript?
    set_btn_response_toggle_add_friend();
};

$(document).ready(function(){
    main();
});