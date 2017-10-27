//These two functions are in form_check.js as well
//BROKEN ATM. Trouble detecting blank.
var is_filled_form = function(){
    $("input.required_input").each(function() {
        if ($(this).val() === "") {
            return false;
        }
    });
    return true;
}

var check_if_matching_password = function(){
    var ele_input_password1 = document.getElementById("input_password1");
    var ele_input_password2 = document.getElementById("input_password2");
    if(ele_input_password1.value !== ele_input_password2.value ){
        ele_input_password1.value = "";
        ele_input_password2.value = "";
        throw("Passwords do not match. Try again.");
    }
}

var override_submit_btn = function(){
    $("#signup_form").on("submit", function(e){
        e.preventDefault();
        if( is_filled_form() ){
            var register_successful = $.ajax({
                url:"http://localhost:3000/user/add",
                data: {
                    email: $("#input_email").val(),
                    password: $("#input_password1").val(),
                    firstName: $("#input_first_name").val(),
                    lastName: $("#input_last_name").val(),
                    city: $("#input_city").val()
                },
                type:"POST",
                dataType: "json"
            }).done(function(){
                return true;
            }).fail(function(){
                return false;
            });
            if(register_successful)
            redirect_to_profile();
            else
                alert("Email duplicate exist. Try again.")
        }
        else
            alert("All required inputs must be filled");
    });
};

var redirect_to_profile = function(){
    var t_form = document.createElement('form');
    t_form.action = "http://localhost:3000/user/register";
    t_form.method = "POST";
    var ele_email_input = document.createElement("input");
    ele_email_input.name = "email";
    ele_email_input.value = $("#input_email").val();
    t_form.appendChild(ele_email_input);
    t_form.style.visibility = "hidden";
    document.body.appendChild(t_form);
    t_form.submit();
};

var main = function(){
    override_submit_btn();
};

main();