var io = null;
module.exports = {
    init: function(server) {
        io = require('socket.io')(server); // myNote: will listen on the server
        io.on('connection', function(socket){
            console.log('a user connected');
        });
    },
    instance: function() {
        return io;
    }
}