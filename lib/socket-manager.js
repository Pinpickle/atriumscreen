var socketioJwt = require('socketio-jwt');


exports = module.exports = function(atriumscreen) {
    var self = this;

    this.io = atriumscreen.io = require('socket.io').listen(atriumscreen.httpServer);
    io.of('/screen').on('connection', function(socket) {
        console.log('We have a screen!');

        socket.on('get time', function() {
            socket.emit('date', {date: Date.now()});
        });
    });

    io.of('/admin').use(socketioJwt.authorize({
        secret: atriumscreen.keystone.get('cookie secret'),
        handshake: true
    })).on('connection', function(socket) {
        if (socket.decoded_token.auth) {
            console.log('admin authenticated');
            //We're good to go
            socket.on('refresh', self.refresh);
            socket.on('hard refresh', function(socket) {
                io.of('/screen').emit('hard refresh');
            });

        }

    });

    this.refresh = function(socket) {
        io.of('/screen').emit('refresh');
    };
}

