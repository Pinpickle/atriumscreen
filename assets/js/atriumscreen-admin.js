var socket = io('/admin', {
    query: 'token=' + jwt
});
socket.on('connect', function() {
    console.log('connection');
    //Ready to do things
    socket.on('kill', function() {
        location.href = '/';
    });

    $('#refresh').click(function() {
        socket.emit('refresh');
    });

    $('#hard-refresh').click(function() {
        socket.emit('hard refresh');
    });
});
