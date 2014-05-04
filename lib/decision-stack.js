var keystone = require('keystone'),
    async = require('async'),
    atriumscreen = require('rfr')('./lib');


/**
 * The decision stack is basically a series of middleware that will set a whole bunch of information that will ultimately end up at the layout
 * @memberof atriumscreen.Decider
 * @alias DecisionStack
 */
var DecisionStack = module.exports = new keystone.List('DecisionStack');

DecisionStack.add({

    name: {
        type: String,
        required: true,
        initial: true
    },

    deciders: {
        type: keystone.Field.Types.Relationship,
        ref: 'Decider',
        many: true
    }
});


/**
 * Executes the decision stack (acts as an express valid middleware)
 */
DecisionStack.schema.methods.execute = function(req, res, next) {
    var self = this;
    var loop = function() {
        //Loop asyncronously over the controllers

        async.each(self.deciders, function(decider, callback) {
            //Let the middleware do its work
            console.log(decider);
            req.currentSettings = decider.settings;
            decider.controllerObject.middleware(req, res, callback);
        }, function(err) {
            if (err) {
                next(err);
                return;
            }

            //It's out of our hands
            if (res.layout) {
                atriumscreen.Layout.model.findById(res.layout, function(err, layout) {
                    if ((err) || (!layout)) {
                        next();
                        return;
                    }
                    layout.controllerFunction(req, res, next);
                });
            } else {
                next();
            }
        });
    };
    if (this.populated('deciders')) {
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

DecisionStack.register();
