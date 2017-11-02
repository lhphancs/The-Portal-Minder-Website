
//This file contains functions that are used in all the display discovered using results
var set_btn_response_add_friend = function(){
    // NEED TO HANDLE REMOVE CASE TOO
    $("#matched_users_container").on("click", ".btn_add_friend", function(){
        if( $(this).hasClass("add-mode") ){
            $(this).text("Remove");
            $.ajax({
                url:"http://localhost:3000/user/add-friend",
                data:{id:this.value},
                type:"POST",
                dataType:"json"
            }).done(function(){
                ;
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
            }).done(function(){
            }).fail(function(){
                alert("FAILED REMOVE");
            });
        }
        $(this).toggleClass("add-mode");
    });
};