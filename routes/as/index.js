var atriumscreen = require('rfr')(''),
    keystone = atriumscreen.keystone,
    path = require('path');

module.exports = function(app) {
    atriumscreen.emit('keystone routes', app);


    app.get('/', function(req, res) {
        res.admin(path.join(atriumscreen.dir, 'templates/views/home.jade'));
    });
}
