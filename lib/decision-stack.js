var keystone = require('keystone'),
    async = require('async');


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
    //Loop asyncronously over the controllers
    async.each(this.deciders, function(decider, callback) {
        //Let the middleware do its work
        req.currentSettings = decider.settings;
        decider.controllerObject.middleware(req, res, callback);
    }, function(err) {
        if (err) {
            next(err);
            return;
        }

        //It's out of our hands
        res.layout.controllerFunction(req, res, next);
    });
};

DecisionStack.register();
