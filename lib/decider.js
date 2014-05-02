var keystone = require('keystone');

var Decider = module.exports = keystone.List('Decider');

Decider.add({
    name: {
        type: String,
        required: true
    },

    controller: {
        type: String,
        required: true
    },

    //TODO: Implement settings
    /*settings: {
        type: { }
    }*/
});

Decider.register();
Decider.DecisionStack = require('./decision-stack');
