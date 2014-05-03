var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    http = require('http'),
    _ = require('lodash'),
    path = require('path'),
    stylus = require('stylus'),
    rfr = require('rfr'),
    keystone = require('keystone'),
    mongoose = require('mongoose'),
    events = require('events'),
    util = require('util');



/**
 * @namespace atriumscreen
 */

var AtriumScreen = function() {

    var self = this;

    /**
     * Express object that is behind the app
     * @todo Allow user to supply their own Express
     */
    this.express = express();

    this.keystone = keystone.connect(mongoose, this.express);
    keystone = this.keystone;

    this.settings = {
    };

    /**
     * Sets a setting to a value (most map to Keystone)
     */
    this.set = function(key, value) {
        switch (key) {
            case "routes":
                this.settings[key] = value;
                break;
            default:
                keystone.set(key, value);
                break;
        }
    };

    /**
     * Gets a setting based on a key
     */
    this.get = function(key, value) {
        if (_.has(settings, key)) {
            return this.settings[key];
        } else {
            return keystone.get(key);
        }
    };

    this.startStage = 0;

    this.nav = { };

    this.dir = path.join(__dirname, "..");

    /**
     * Mass configuring from JSON object
     * @param {object} [settings] - Optional settings to run through configure
     */
    this.init = function(settings) {
        this.startStage = 1;


        keystone.init(_.merge({
            'session': true,
            'auth': true,
            'user model': 'User',
            'cookie secret': 'changemeplease',
            'nav': {}
        }, settings));

        this.registerDefaultPlugins();

        this.nav.core = [
            'screens',
            'deciders',
            'decision-stacks'
        ];

        keystone.set('500', function(err, req, res, next) {
            if (err instanceof Error) {
                message = err.message;
                err = err.stack;
            }
            console.error(err);
            next();
        });

        keystone.pre('routes', function(req, res, next) {
            res.as = {};
            next();
        });
    };

    /**
     * Starts the server
     */
    this.start = function() {

        //If we have already started, get out
        if (this.startStage === 2) {
            return;
        }

        //If init hasn't already been called, call it
        if (this.startStage === 0) {
            this.init();
        }

        //this.registerDefaultPlugins();

        keystone.set('nav', atriumscreen.nav);

        //Routes
        keystone.set('routes', rfr('routes'));

        keystone.start();

        this.startStage = 2;
    };

    /**
     * Registers plugins of core atriumscreen
     */
    this.registerDefaultPlugins = function() {
        require('./layout-mapper').register(this);
    };

    this.pluginSets = {
        'deciderController': [],
        'layoutController': []
    };

    this.register = function(set, name, controller) {
        if (_.has(this.pluginSets, set)) {
            if (!_.has(this.pluginSets[set], name)) {
                this.pluginSets[set][name] = controller;
            } else {
                throw new Error("Namespace " + name + " is already occupied for " + set + "!");
            }

        } else {
            throw new Error(set + " is not registerable");
        }
    };
};

//Make this object your standard event emitter
util.inherits(AtriumScreen, events.EventEmitter);

var atriumscreen = exports = module.exports = new AtriumScreen();

rfr.setRoot(atriumscreen.dir);

atriumscreen.Layout = require('./layout');
atriumscreen.Screen = require('./screen');
atriumscreen.Decider = require('./decider');
atriumscreen.User = require('./user');


