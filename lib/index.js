var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    http = require('http'),
    _ = require('lodash'),
    path = require('path'),
    stylus = require('stylus'),
    rfr = require('rfr'),
    keystone = require('keystone');



/**
 * @namespace AtriumScreen
 */

var AtriumScreen = module.exports = {
    /**
     * Express object that is behind the app
     * @todo Allow user to supply their own Express
     */
    express: express(),

    keystone: keystone,

    /**
     * Sets a setting to a value (maps to Keystone)
     */
    set: keystone.set,

    /**
     * Gets a setting based on a key (Keystone)
     */
    get: keystone.get,

    startStage: 0,

    nav: { },

    /**
     * Mass configuring from JSON object
     * @param {object} [settings] - Optional settings to run through configure
     */
    init: function(settings) {
        AtriumScreen.startStage = 1;


        keystone.init(_.merge({
            'session': true,
            'auth': true,
            'user model': 'User',
            'cookie secret': 'changemeplease',
            'nav': {}
        }, settings));

        AtriumScreen.registerDefaultPlugins();

        AtriumScreen.nav.core = [
            'screens',
            'deciders',
            'decision-stacks'
        ];
    },

    /**
     * Starts the server
     */
    start: function() {

        //If we have already started, get out
        if (AtriumScreen.startStage === 2) {
            return;
        }

        //If init hasn't already been called, call it
        if (AtriumScreen.startStage === 0) {
            AtriumScreen.init();
        }

        //this.registerDefaultPlugins();

        keystone.set('nav', AtriumScreen.nav);

        keystone.start();

        AtriumScreen.startStage = 2;
    },

    /**
     * Registers plugins of core AtriumScreen
     */
    registerDefaultPlugins: function() {
        AtriumScreen.Screen = require('./screen');
        AtriumScreen.Decider = require('./decider');
        AtriumScreen.User = require('./user');
    },

    pluginSets: {
        'deciderControllers': [],
        'layoutControllers': []
    },

    register: function(set, name, controller) {
        if (_.has(AtriumScreen.pluginSets, set)) {
            if (!_.has(AtriumScreen.pluginSets[set], name)) {
                AtriumScreen.pluginSets[set][name] = controller;
            } else {
                throw new Error("Namespace " + name + " is already occupied for " + set + "!");
            }

            //Special cases - adminRouter
            if (set === "adminRouter") {
                AtriumScreen.admin.use('/' + name, controller);
            }

        } else {
            throw new Error(set + " is not registerable");
        }
    }
};

var dir = module.exports.dir = path.join(__dirname, "..");
rfr.setRoot(dir);
