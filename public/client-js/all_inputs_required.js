var all_required_inputs_filled = function(){
    var eles_input = document.querySelectorAll(".required_input");
    for(var i=0; i<eles_input.length; ++i){
        if(eles_input[i].value === ""){
            alert("All fields in form must be filled");
            return false;
        }
    }
    return true;
};