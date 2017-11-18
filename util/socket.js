var io = null;
module.exports = {
    init: function(server) {
        io = require('socket.io')(server); // myNote: will listen on the server
        io.on('connection', function(socket){
            console.log('a user connected');
            socket.on("subscribe", function(room_id){
                console.log("User joined room: " + room_id);
                socket.join(room_id);
                
            });
            socket.on("on_connect", function(id){
                console.log("User on_connect: " + id);
                socket.join(id);
            });

            socket.on('disconnect', function(){
                console.log('user disconnected');
              });

            //sent_chat_msg 'data' is {room_id:self+selectedID, msg: "some message"} where room_id sorted by alphabetical
            socket.on('sent_chat_msg', function(data){ 
                socket.broadcast.to(data.room_id).emit('received_chat_msg', data.msg);
            });

            socket.on('notify', function(data){
                console.log("SENT");
                socket.to(data.id).emit('notify', data.msg);
                console.log(data.id);
            })
        });
        
    },
    instance: function() {
        return io;
    }
}