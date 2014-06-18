var socket = io.connect('/screen');

socket.on('connect', function() {
    socket.on('refresh', function() {
        console.log('refresh!');
        location.reload(true);
    });
});


var atriumscreen = new (function() {
    var self = this;
    if (asData.as.refresh) {
        this.refresh = (new Date(asData.as.refresh)).getTime();
    } else {
        this.refresh = null;
    }
    //The auto refresh is here!
    setInterval(function() {
        if ((self.refresh) && ((new Date()).getTime() > self.refresh)) {
            location.reload(true);
        }
    }, 1000);

})
