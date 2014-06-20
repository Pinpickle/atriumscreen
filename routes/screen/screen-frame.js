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

    atriumscreen.Screen.model.findOne({slug: screen}).populate('decisionStack').exec(function(err, screen) {
        if ((err) || (!screen)) {
            next();
            return;
        }
        console.log(screen.decisionStack);
        //It's out of our hands now
        screen.render(req, res, next);
    });
};
