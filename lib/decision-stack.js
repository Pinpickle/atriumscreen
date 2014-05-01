var _ = require('lodash'),
    mongoose = require('mongoose');


/**
 * The decision stack is basically a series of middleware that will set a whole bunch of information that will ultimately end up at the layout
 * @memberof AtriumScreen.Decider
 * @alias DecisionStack
 */
var decisionStackSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    controllers: {
        type: [{
            /*type: {
                instance: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Decider',
                    required: true
                },
                settings: {
                    type: { }
                }
            }*/
        }]
    }
});

var DecisionStack = module.exports = mongoose.model('DecisionStack', decisionStackSchema);
