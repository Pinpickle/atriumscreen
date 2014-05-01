var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    http = require('http'),
    _ = require('lodash'),
    path = require('path'),
    stylus = require('stylus'),
    rfr = require('rfr');



/**
 * @namespace AtriumScreen
 */

var AtriumScreen = module.exports = function() {

    var self = this;

    /**
     * Express object that is behind the app
     * @todo Allow user to supply their own Express
     */
    this.express = express();

    /**
     * Object that contains all of the configuration
     * @private
     */
    this.settings = {
        mongo: "localhost",
        secret: "pleasepleasepleasechangeme"
    };

    /**
     * What function has been called (0 for nothing, 1 for inited, 2 for started)
     * @private
     */
    this.startStage = 0;

    /**
     * Sets a setting to a value
     */
    this.set = function(key, value) {
        this.settings[key] = value;
    };

    /**
     * Gets a setting based on a key
     */
    this.get = function(key) {
        return this.settings[key];
    };

    /**
     * Mass configuring from JSON object
     */
    this.configure = function(settings) {
        _.each(settings, function(value, key, list) {
            self.settings[key] = value;
        });
    };

    /**
     * Mass configuring from JSON object
     * @param {object} [settings] - Optional settings to run through configure
     */
    this.init = function(settings) {
        if (settings) {
            this.configure(settings);
        }

        this.express.set('port', process.env.PORT || 3000);
        this.express.set('view engine', 'jade');
        this.express.use(cookieParser());

        //TODO: Secure this up
        this.express.use(session({
            secret: this.get('secret'),
            key: 'sid'
        }));

        this.startStage = 1;
    };

    /**
     * Starts the server
     */
    this.start = function() {

        //If we have already started, get out
        if (this.startStage === 3) {
            return;
        }

        //If init hasn't already been called, call it
        if (this.startStage === 0) {
            this.init();
        }

        this.express.use('/as', require(path.join(dir, 'routes/as/index.js')));

        http.createServer(this.express).listen(this.express.get('port'), function() {
            console.log('AtriumScreen has liftoff on port ' + self.express.get('port'));
            this.startStage = 3;
        });
    };

    /**
     * Registers plugins of core AtriumScreen
     */
    this.registerDefaultPlugins = function() {
    };

    this.pluginSets = {
        deciderController: { },
        layoutController: { },
        adminRouter: { }
    };



    this.register = function(set, name, controller) {
        if (_.has(this.pluginSets, set)) {
            if (!_.has(this.pluginSets[set], name)) {
                this.pluginSets[set][name] = controller;
            } else {
                throw new Error("Namespace " + name + " is already occupied for " + set + "!");
            }

            //Special cases - adminRouter
            if (set === "adminRouter") {
                this.express.use('/as/' + name, controller);
            }

        } else {
            throw new Error(set + " is not registerable");
        }
    };
};

var dir = module.exports.dir = path.join(__dirname, "..");
rfr.setRoot(dir);

exports.Screen = require('./screen');
exports.Decider = require('./decider');
