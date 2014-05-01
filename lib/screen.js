var _ = require('lodash'),
    mongoose = require('mongoose');

/**
 * Defines a screen which will display delicious content
 * @alias Screen
 * @class
 * @memberof AtriumScreen
 */
var screenSchema = mongoose.Schema({
    /**
     * Name of screen for ease of finding
     * @memberof AtriumScreen.Screen#
     */
    name: {
        type: String,
        required: true
    },
    /**
     * Path that will be taken to reach the screen
     * @memberof AtriumScreen.Screen#
     */
    url: String,
    /**
     * Stack of middleware to decide which layout to display
     * @memberof AtriumScreen.Screen#
     */
    decisionStack: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DecisionStack'
    }
});

//Turn schema into an object so we can use it
var Screen = module.exports = mongoose.model('Screen', screenSchema);
