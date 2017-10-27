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
        //emulate form click
        var t_form = document.createElement('form');
        t_form.action = "http://localhost:3000/user/profile";
        t_form.method = "POST";
        var ele_email_input = document.createElement("input");
        ele_email_input.name = "email";
        ele_email_input.value = $("#user_email").val();
        t_form.appendChild(ele_email_input);
        t_form.style.visibility = "hidden";
        document.body.appendChild(t_form);
        t_form.submit();
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