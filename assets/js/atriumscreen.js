var socket = io.connect('/screen');

socket.on('connect', function() {
    socket.on('refresh', function() {
        console.log('refresh!');
        location.reload(true);
    });
});


var AtriumScreen = function() {
}
