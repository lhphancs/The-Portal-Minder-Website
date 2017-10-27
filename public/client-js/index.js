var all_required_inputs_filled = function(){
    return true;
    var eles_input = $("input.required_input");
    /* Not working for some reason
    for(var i=0; i<eles_input.length; ++i){
        if(eles_input[i].val() === ""){
            alert(eles_input[i].val());
            alert("All fields in form must be filled");
            return false;
        }
        alert( eles_input[i].val() );
    }
    return false;
    */
};

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
            alert("WRONG PASSWORD");//Do something that says invalid
    }).fail(function(){
        alert("Failed to grab data from database");
        return false;
    });
}

var override_submit_btn = function(){
    $("#login_form").on("submit", function(e){
        e.preventDefault();
        if( all_required_inputs_filled() )
        check_password_and_respond();
    });
};

var main = function(){
    override_submit_btn();
};

main();