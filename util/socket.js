var io = null;
module.exports = {
    init: function(server) {
        io = require('socket.io')(server); // myNote: will listen on the server
        io.on('connection', function(socket){
            console.log('a user connected');
            socket.on('disconnect', function(){
                console.log('user disconnected');
              });

            socket.on('chat message', function(msg){
                socket.broadcast.emit('chat message', msg);
            });
        });
        
    },
    instance: function() {
        return io;
    }
}