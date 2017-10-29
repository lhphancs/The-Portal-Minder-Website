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
        if( all_required_inputs_filled() ){
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
                    window.location.replace("/user/profile");
                }
                else{
                    alert("Email duplicate exist. Try again.")
                } 
            }).fail(function(){
                return false;
            });   
        }
    });
};

var main = function(){
    override_submit_btn();
};

$(document).ready(function(){
    main();
});
