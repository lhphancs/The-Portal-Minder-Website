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

            socket.on('disconnect', function(){
                console.log('user disconnected');
              });

            socket.on('sent_chat_msg', function(data){
                socket.to(data.room_id).emit('received_chat_msg', data.msg);
            });
        });
        
    },
    instance: function() {
        return io;
    }
}