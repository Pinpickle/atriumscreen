
exports = module.exports = function(atriumscreen) {
    var io = atriumscreen.io = require('socket.io').listen(atriumscreen.httpServer);
    io.on('connection', function(socket) {
        console.log('We have connection!');
    });
}
