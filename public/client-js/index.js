var all_required_inputs_filled = function(){
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
    return true;
};

var 

var is_valid_password = function(){
    $.ajax({
        url:"localhost:3000/user/validation",
        data:{
            email:$("#user_email").val(),
            password:$("#user_password").val()
        },
        dataType:"json",
        type:"POST",
    }).done(function(json){
        console.log(json);
        if( json[0].flag)
            return true;
        else{
            alert("Invalid password. Try again.");
            return false;
        }
    }).fail(function(){
        alert("Failed to grab data from database");
        return false;
    });
}