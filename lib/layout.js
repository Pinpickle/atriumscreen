var keystone = require('keystone'),
    _ = require('lodash'),
    atriumscreen = require('rfr')('./lib');

/**
 * The layout is responsible for deciding what information to display
 * @namespace atriumscreen
 * @alias Layout
 */
var Layout = module.exports = new keystone.List('Layout');

Layout.add({
    /**
     * The name used to identify the layout
     * @memberof atriumscreen.Layout#
     * @type String
     */
    name: {
        type: String,
        required: true,
        initial: true
    },

    /**
     * The controller responsible for... everything
     * @memberof atriumscreen.Layout#
     * @type atriumscreen.Layout.Controller
     */
    controller: {
        type: String,
        required: true,
        initial: true
    },

    //For the time being, we can enter settings as text
    settingsString: {
        type: keystone.Field.Types.Textarea,
        set: function(val) {
            var str;
            if (typeof val === 'string') {
                str = val;
            } else {
                str = JSON.stringify(val);
            }

            this.settings = JSON.parse(str);
            return str;
        }
    }

    //TODO: Add basedOn for creating layouts based on other layouts
});

/**
 * Settings for this particular layout
 * @memberof atriumscreen.Layout#
 */
Layout.schema.add({
    settings: { }
});

Layout.schema.virtual('controllerFunction').get(function() {
    if (_.has(atriumscreen.pluginSets.layoutController, this.controller)) {
        return atriumscreen.pluginSets.layoutController[this.controller].middleware;
    } else {
        throw new Error("Layout Controller " + this.controller + " not registered!");
    }
});

Layout.schema.virtual('controllerObject').get(function() {
    if (_.has(atriumscreen.pluginSets.layoutController, this.controller)) {
        return atriumscreen.pluginSets.layoutController[this.controller];
    } else {
        throw new Error("Layout Controller " + this.controller + " not registered!");
    }
});

Layout.register();
