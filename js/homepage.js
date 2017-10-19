var check_login_info = function(){
    alert("AA");
    return false;
    $.ajax({
       // The URL for the request
       url: "http://thiman.me:1337/lee/users",
    
       // The data to send (will be converted to a query string)
       data: {
           
       },
    
       // Whether this is a POST or GET request
       type: "GET",
    
       // The type of data we expect back
       dataType : "json",
   })
     // Code to run if the request succeeds (is done);
     // The response is passed to the function
     .done(function( json ) {
         console.log(json);
     })
     // Code to run if the request fails; the raw request and
     // status codes are passed to the function
     .fail(function( xhr, status, errorThrown ) {
       alert( "Sorry, there was a problem!" );
       console.log( "Error: " + errorThrown );
       console.log( "Status: " + status );
       console.dir( xhr );
     })
     // Code to run regardless of success or failure;
     .always(function( xhr, status ) {
       alert( "The request is complete!" );
     });
};
