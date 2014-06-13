var atriumscreen = require('rfr')(''),
    express = require('express'),
    path = require('path');

exports = module.exports = function(app) {
    app.get('/screen/:screen', require('./screen'));
    atriumscreen.emit('routes', app);
};
