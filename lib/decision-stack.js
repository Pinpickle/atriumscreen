var keystone = require('keystone');


/**
 * The decision stack is basically a series of middleware that will set a whole bunch of information that will ultimately end up at the layout
 * @memberof AtriumScreen.Decider
 * @alias DecisionStack
 */

var DecisionStack = module.exports = new keystone.List('DecisionStack');

DecisionStack.add({

    name: {
        type: String,
        required: true
    },

    controllers: {
        type: keystone.Field.Types.Relationship,
        ref: 'Decider',
        many: true
    }
});

DecisionStack.register();
