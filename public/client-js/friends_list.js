var load_friends = function(){
    $.ajax({
        url:"http://localhost:3000/user/friends",
        data:{},
        dataType:"json",
        type:"GET"
    }).done( function(json){
        ;
    }).fail( function(json){
        alert("Fetching user_matches from database failed.")
    });
};

var main = function(){
    load_friends();
};

$(document).ready(function(){
    main();
});
