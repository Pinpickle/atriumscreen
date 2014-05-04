var keystone = require('keystone');

exports.register = function(atriumscreen) {
    atriumscreen.register('deciderController', 'layout-mapper', {
        settings: {
            layout: {
                type: String,
                required: true
            }
        },
        middleware: function(req, res, next) {
            res.layout = req.currentSettings.layout;
            console.log('I execute!');
            next();
        }
    });
};
