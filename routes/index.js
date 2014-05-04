var atriumscreen = require('rfr')('');

exports = module.exports = function(app) {
    app.get('/screen/:screen', require('./screen'));
    atriumscreen.emit('routes', app);
};
