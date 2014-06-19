var socket = io.connect('/screen');

socket.on('connect', function() {
    socket.on('refresh', function() {
        atriumscreen.refresh();
    });
});


var atriumscreen = new (function() {
    var self = this;
    if (asData.as.refresh) {
        this.refreshTime = (new Date(asData.as.refresh)).getTime() - 2000; //To account for the fadeout animation time
    } else {
        this.refreshTime = null;
    }
    //The auto refresh is here!
    setInterval(function() {
        if ((self.refreshTime) && ((new Date()).getTime() > self.refreshTime)) {
            self.refresh();
        }
    }, 1000);

    this.refresh = function() {
        $('.as-blockade').removeClass('ready');
        setTimeout(function() {
            location.reload(true);
        }, 2000);
    };

    $(document).ready(function() {
        $('.as-blockade').addClass('ready');
    });

})
