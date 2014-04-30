var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    http = require('http');

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


    this.express.set('port', process.env.PORT || 3000);
    this.express.set('view engine', 'jade');

    this.express.use(cookieParser());

    //TODO: Secure this up
    this.express.use(session({
        secret: 'Thisneedstobechangedatsomepointimeanreally',
        key: 'sid'
    }));

    this.init = function() {
        http.createServer(this.express).listen(this.express.get('port'), function() {
            console.log('AtriumScreen has liftoff on port ' + self.express.get('port'));
        });
    };
};


exports.screen = require('./screen');
