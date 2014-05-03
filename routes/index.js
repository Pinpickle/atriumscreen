var atriumscreen = require('rfr')('');

exports = module.exports = function(app) {
    app.get('/screen/:slug', require('./screen'));
    atriumscreen.emit('routes', app);
};
