var keystone = require('keystone');

/**
 * Defines a screen which will display delicious content
 * @alias Screen
 * @class
 * @memberof atriumscreen
 */
var Screen = module.exports = new keystone.List('Screen');

Screen.add({
    /**
     * Name of screen for ease of finding
     * @memberof atriumscreen.Screen#
     */
    name: {
        type: String,
        required: true
    },
    /**
     * Path that will be taken to reach the screen
     * @memberof atriumscreen.Screen#
     */
    slug: String,
    /**
     * Stack of middleware to decide which layout to display
     * @memberof atriumscreen.Screen#
     */
    decisionStack: {
        type: keystone.Field.Types.Relationship,
        ref: 'DecisionStack'
    }
});

Screen.register();
