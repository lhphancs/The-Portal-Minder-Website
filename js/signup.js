//These two functions are in form_check.js as well
var check_if_filled_form = function(){
    var eles_inputs = document.getElementsByTagName("input");
    for(var i=0; i<eles_inputs.length; ++i) {
        if (eles_inputs[i].value === "") {
            throw("All fields must be filled");
        }
    }
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

var check_duplicate_email = function(){
    //This function is not working. No filtering process, unless parse entire collection
    $.ajax({
        url: "http://thiman.me:1337/lee/user",
        data: {
            email: $("#input_emails")
        },
        dataType: "JSON",
        type: "GET"
    }).success( function(json){
        alert("SUCCESS!");
    }).fail(function(json){
      alert("Failed to check duplicate email.")  
    });
};

var is_successful_registration = function(){
    try{
        check_if_filled_form();
        check_if_matching_password();
        //check_duplicate_email();
    }
    catch(message){
        alert(message);
        return false;_
    }
    //Success, Insert into database w/ ajax
    $.ajax({
        url:"http://thiman.me:1337/lee/user",
        data: {
            first_name:$("#input_first_name").val(),
            last_name:$("#input_last_name").val(),
            email:$("#input_email").value,
            password:$("#input_password1").val()
        },
        type:"POST",
        dataType: "json"
    }).done(function(){
        return true;
    }).fail(function(){
        alert("Failed to register user");
        return false;
    })
};