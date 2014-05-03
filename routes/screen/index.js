var atriumscreen = require('rfr')('lib');

exports = module.exports = function(req, res, next) {
    //Extract screen slug from url
    var screen = req.params.screen;
    if (!screen) {
        //Just keep going for a 404
        next();
        return;
    }

    atriumscreen.Screen.findOne({slug: screen}, function(err, screen) {
        if ((err) || (!screen)) {
            next();
            return;
        }

        //It's out of our hands now
        screen.render(req, res, next);
    });
};
