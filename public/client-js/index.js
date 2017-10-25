var all_required_inputs_filled = function(){
    var eles_input = $("input.required_input");
    for(var i=0; i<eles_input.length; ++i){
        if(eles_input[i].val() === ""){
            alert(eles_input[i].val());
            alert("All fields in form must be filled");
            return false;
        }
        alert( eles_input[i].val() );
    }
    return false;
};
