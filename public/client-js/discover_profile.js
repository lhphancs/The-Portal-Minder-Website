
var set_toggle_friend_response = function(){
    $("#btn_add_friend").click(function(){
        var discover_user_id = $(this).attr("data-user-id");
        if( $(this).hasClass("add-mode") ){
            $(this).text("Remove Friend");
            $.ajax({
                url:"http://localhost:3000/user/add-friend",
                data:{id: discover_user_id},
                type:"POST",
                dataType:"json"
            }).done(function(json){
                ;
            }).fail(function(){
                alert("FAILED ADD");
            });
        }
        else{
            $(this).text("Add Friend");
            $.ajax({
                url:"http://localhost:3000/user/remove-friend",
                data:{id: discover_user_id},
                type:"POST",
                dataType:"json"
            }).done(function(){
            }).fail(function(){
                alert("FAILED REMOVE");
            });
        }
        $(this).toggleClass("add-mode");
    });
};

var main = function(){
    set_toggle_friend_response();
};

$(document).ready(function(){
    main();
});