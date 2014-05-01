var mongoose = require('mongoose');

var deciderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    controller: {
        type: String,
        required: true
    },

    settings: {
        type: mongoose.Schema.Types.Mixed
    }
});

var Decider = module.exports = mongoose.model('Decider', deciderSchema);
Decider.DecisionStack = require('./decision-stack');
