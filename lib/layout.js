var keystone = require('keystone');

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
        required: true
    },

    /**
     * The controller responsible for... everything
     * @memberof atriumscreen.Layout#
     * @type atriumscreen.Layout.Controller
     */
    controller: {
        type: String,
        required: true
    },

    //TODO: Add basedOn for creating layouts based on other layouts

    /**
     * Settings for this particular layout
     * @memberof atriumscreen.Layout#
     */
    /*settings: {
        type: { }
    }*/
});

Layout.register();
