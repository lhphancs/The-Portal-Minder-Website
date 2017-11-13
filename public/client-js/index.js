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

var main = function(){
    override_login_submit();
};

$(document).ready(function(){
    main();
});