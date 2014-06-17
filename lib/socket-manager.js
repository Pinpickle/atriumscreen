var socketioJwt = require('socketio-jwt');


exports = module.exports = function(atriumscreen) {
    var self = this;

    this.io = atriumscreen.io = require('socket.io').listen(atriumscreen.httpServer);
    io.of('/screen').on('connection', function(socket) {
        console.log('We have a screen!');
    });

    io.of('/admin').use(socketioJwt.authorize({
        secret: atriumscreen.keystone.get('cookie secret'),
        handshake: true
    })).on('connection', function(socket) {
        console.log('admin sort of authenticated');
        if (socket.decoded_token.auth) {
            console.log('admin authenticated');
            //We're good to go
            socket.on('refresh', self.refresh);

        }

    });

    this.refresh = function(socket) {
        io.of('/screen').emit('refresh');
    };
}

