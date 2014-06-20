var atriumscreen = require('rfr')(''),
    express = require('express'),
    path = require('path');

exports = module.exports = function(app) {
    app.get('/screen/:screen', require('./screen'));
    app.get('/screen-frame/:screen', require('./screen/screen-frame'));
    atriumscreen.emit('routes', app);
};
