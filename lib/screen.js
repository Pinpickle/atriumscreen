var keystone = require('keystone'),
    _ = require('lodash'),
    async = require('async'),
    atriumscreen = require('rfr')('./lib');

/**
 * Defines a screen which will display delicious content
 * @alias Screen
 * @class
 * @memberof atriumscreen
 */
var Screen = module.exports = new keystone.List('Screen', {
    autokey: { path: 'slug', from: 'name', unique: true}
});

Screen.add({
    /**
     * Name of screen for ease of finding
     * @memberof atriumscreen.Screen#
     */
    name: {
        type: String,
        required: true,
        initial: true
    },
    /**
     * Stack of middleware to decide which layout to display
     * @memberof atriumscreen.Screen#
     */
    deciders: {
        type: keystone.Field.Types.Relationship,
        ref: 'Decider',
        many: true
    }
});


Screen.schema.methods.render = function(req, res, next) {
    var self = this;
    var loop = function() {
        //Loop asyncronously over the controllers
        
        async.eachSeries(self.deciders, function(decider, callback) {
            //Let the middleware do its work
            req.currentSettings = decider.settings;
            decider.controllerObject.middleware(req, res, callback);
        }, function(err) {
            if (err) {
                next(err);
                return;
            }

            //It's out of our hands
            if (res.layout) {
                if (res.layout.constructor.name === 'model') {
                    res.layout.controllerFunction(req, res, next);
                } else {
                    atriumscreen.Layout.model.findById(res.layout, function(err, layout) {
                        if ((err) || (!layout)) {
                            next();
                            return;
                        }
                        layout.controllerFunction(req, res, next);
                    });
                }
            } else {
                next();
            }
        });
    };

    if (_.filter(this.deciders, function(d, i) { return d.constructor.name !== 'model' }).length === 0) {
        loop();
    } else {
        this.populate('deciders', function(err) {
            if (err) {
                console.error(err);
                next(new Error('Could not get decider'));
                return;
            }
            loop();
        });
    }
};



Screen.register();
