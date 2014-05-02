var keystone = require('keystone');

/**
 * The layout is responsible for deciding what information to display
 * @namespace AtriumScreen
 * @alias Layout
 */
var Layout = module.exports = new keystone.List('Layout');

Layout.add({
    /**
     * The name used to identify the layout
     * @memberof AtriumScreen.Layout#
     * @type String
     */
    name: {
        type: String,
        required: true
    },

    /**
     * The controller responsible for... everything
     * @memberof AtriumScreen.Layout#
     * @type AtriumScreen.Layout.Controller
     */
    controller: {
        type: String,
        required: true
    },

    //TODO: Add basedOn for creating layouts based on other layouts

    /**
     * Settings for this particular layout
     * @memberof AtriumScreen.Layout#
     */
    /*settings: {
        type: { }
    }*/
});

Layout.register();
