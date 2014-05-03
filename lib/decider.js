var keystone = require('keystone'),
    _ = require('lodash'),
    atriumscreen = require('rfr')('./lib');

var Decider = module.exports = keystone.List('Decider');

Decider.add({
    name: {
        type: String,
        initial: true,
        required: true
    },

    controller: {
        type: String,
        initial: true,
        required: true
    },

    //TODO: Implement settings
    /*settings: {
        type: { }
    }*/
});

//Put settings just on the schema
Decider.schema.add({
    settings: { }
});

Decider.schema.virtual('controllerObject').get(function() {
    if (_.has(atriumscreen.pluginSets.deciderController, this.controller)) {
        return atriumscreen.pluginSets.deciderController[this.controller];
    } else {
        throw new Error("Decider Controller " + this.controller + " not registered!");
    }
});

Decider.register();
Decider.DecisionStack = require('./decision-stack');
