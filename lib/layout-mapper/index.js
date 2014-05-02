var keystone = require('keystone');

exports.register = function(AtriumScreen) {
    AtriumScreen.register('deciderControllers', 'layout-mapper', {
        settings: {
            layout: {
                type: String,
                required: true
            }
        },
        middleware: function(req, res, next) {
            res.layout = req.currentSettings;
        }
    });
};
