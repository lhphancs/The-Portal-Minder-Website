var all_inputs_filled_on_page = function(){
    var eles_inputs = document.getElementsByTagName("input");
    for(var i=0; i<eles_inputs.length; ++i) {
        if (eles_inputs[i].value === "") {
            alert("All fields must be filled");
            return false
        }
    }
    return true;
}

var is_valid_signup = function(){
    if( all_inputs_filled_on_page() )
    {
        var ele_input_password1 = document.getElementById("input_password1");
        var ele_input_password2 = document.getElementById("input_password2");
        if(ele_input_password1.value === ele_input_password2.value ){
            return true;
        }
        else{
            alert("Passwords do not match. Try again.");
            ele_input_password1.value = "";
            ele_input_password2.value = "";
            return false;
        }
    }
    else
        return false;
}