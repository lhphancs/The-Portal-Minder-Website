var set_save_setting_response = function(){
    $("#form_settings").on("submit", function(e){
        e.preventDefault();

        var current_password = $("#input_current_password").val();
        var new_password1 = $("#input_new_password1").val();
        var new_password2 = $("#input_new_password2").val();
        

        //Check if any of password fields are filled. If so, require all of them to be filled.
        if(current_password || new_password1 || new_password2){
            if(!current_password || !new_password1 || !new_password2){
                $("#alert_change_password").removeClass("invisible").text("To change password, must fill out all password fields.");
                return;
            }

            //All fields filled, so check if both new password match
            else if(new_password1 !== new_password2){
                $("#alert_change_password").removeClass("invisible").text("New passwords do not match. Try again");
                return;
            }
        }
        //If reach here, tries to save settings. If current_password filled, it checks for match
        $('#checkbox').is(':checked'); 
        var is_checked_accept_friend_requests = $("#checkbox_accepted_friend_requests").is(":checked");
        var is_checked_chat_initiated = $("#checkbox_chat_initiated").is(":checked");
        $.ajax({
            url: "/settings/save",
            data: {
                current_password: current_password,
                new_password1: new_password1,
                is_accept_friend_requests: is_checked_accept_friend_requests,
                is_accept_chat_initiated: is_checked_chat_initiated,
            },
            type: "PATCH",
            dataType: "json"
        }).done(function(save_successful){
            if(save_successful)
                window.location.replace("/settings");
            else{
                $("#alert_change_password").removeClass("invisible").text("Invalid current password. Try again.");
            }
        });
        
    });
};

var main = function(){
    set_save_setting_response();
};

$(document).ready(function(){
    main();
});