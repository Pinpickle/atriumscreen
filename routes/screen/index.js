var atriumscreen = require('rfr')('lib'),
    path = require('path');

exports = module.exports = function(req, res, next) {
    //Extract screen slug from url
    var screen = req.params.screen;
    if (!screen) {
        //Just keep going for a 404
        next();
        return;
    }

    res.render(path.join(atriumscreen.dir, 'templates/masters/client.jade'), {screen: screen});
};
