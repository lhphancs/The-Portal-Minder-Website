
var set_btn_response_add_friend = function(){
    // NEED TO HANDLE REMOVE CASE TOO
    $("#matched_users_container").on("click", ".btn_add_friend", function(){
        if( $(this).hasClass( "add-mode") ){
            $(this).text("Remove");

            $.ajax({
                url:"http://localhost:3000/user//add-friend/" + this.value,
                data:{},
                type:"GET",
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
                url:"http://localhost:3000/user//remove-friend/" + this.value,
                data:{},
                type:"GET",
                dataType:"json"
            }).done(function(){
            }).fail(function(){
                alert("FAILED REMOVE");
            });
        }

        $(this).toggleClass("add-mode");
    });
};