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
            $.ajax({
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
            }).done(function(json){
                if(json){
                    window.location.replace("http://localhost:3000/user/profile");
                }
                else{
                    alert("DUPLICATE EMAIL");
                }
            }).fail(function(){
                return false;
            });
        }
        else
            alert("All required inputs must be filled");
    });
};

var main = function(){
    override_submit_btn();
};

main();