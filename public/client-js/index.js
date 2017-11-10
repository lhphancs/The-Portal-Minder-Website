var check_password_and_respond = function(){
    $.ajax({
        url:"http://localhost:3000/user/validation",
        data:{
            email:$("#user_email").val(),
            password:$("#user_password").val()
        },
        dataType:"json",
        type:"POST",
    }).done(function(json){
        if(json){
            window.location.replace("http://localhost:3000/user/profile");
        }
        else
            $("#alert_wrong_password").removeClass("invisible");//Do something that says invalid
    }).fail(function(){
        alert("Failed to grab data from database");
        return false;
    });
}


var override_login_submit = function(){
    $("#login_form").on("submit", function(e){
        e.preventDefault();
        check_password_and_respond();
    });
};

var add_user_to_database = function(parsed_json){
    $.ajax({
        url:'http://localhost:3000/user/add',
        dataType:'json',
        data:parsed_json,
        type:"POST",
        success: function() {
        }
    });
};

var set_generate_random_users_response = function(){
    $("#form_generate_random_users").on("submit", function(e){
        e.preventDefault();
        var amt_of_random_users = $("#input_amt_of_random_users").val();
        if(amt_of_random_users <= 0 ){
            alert("Must enter positive integer to insert random users.");
            return;
        }
        for(var i=0; i<amt_of_random_users; ++i){
            $.ajax({
                url: 'https://randomuser.me/api/',
                dataType:'json',
                success: function(json) {
                    var user_json = json.results[0];
                    var parsed_json = {
                        firstName:user_json.name.first,
                        lastName:user_json.name.last,
                        email:user_json.email,
                        password:user_json.login.password,
                        city:user_json.location.city,
                        description:"",
                        tags:[],
                        education:"",
                        friends:[],
                        pendingFriends:[],
                        photoURL:user_json.picture.thumbnail
                    };
                    add_user_to_database(parsed_json);
                }
            });
        }
        alert("Loaded random users by ajax. Check if successful.");
    });
};

var main = function(){
    override_login_submit();
    set_generate_random_users_response();
};

$(document).ready(function(){
    main();
});