
//Load the badge number for notification using database

//Set the socket to listen for notifications
var socket = io();
socket.emit("on_connect", self_id );
socket.on('notify', function(data){
    alert(data);
});

