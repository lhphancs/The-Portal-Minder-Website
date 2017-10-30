
var set_btn_response_add_friend = function(){
    // NEED TO HANDLE REMOVE CASE TOO
    $("#matched_users_container").on("click", ".btn_add_friend", function(){
        $.ajax({
            url:"http://localhost:3000/user//add-friend/" + this.value,
            data:{},
            type:"GET",
            dataType:"json"
        }).done(function(){
            ; //Can't i insert jquery stuff here? is this refferencing somethign else here?
        }).fail(function(){
            alert("FAILED");
        });

        if( $(this).hasClass( "add-mode") ){
            $(this).text("Remove");
        }
        else{
            $(this).text("Add");
        }
        $(this).toggleClass("add-mode");
    });
};

var main = function(){
    set_btn_response_add_friend();
};

$(document).ready(function(){
    main();
});