var express = require('express'),
    rfr = require('rfr'),
    as = rfr('/'),
    stylus = require('stylus'),
    path = require('path');

var router = module.exports = express.Router();

//Stylusify things up
router.use('/assets', stylus.middleware({
    src: path.join(as.dir, 'templates'),
    dest: path.join(as.dir, 'public')
}));

//Serve the static files of AtriumScreen core
router.use('/assets', express.static(path.join(as.dir, 'public')));

router.get('/', function(req, res) {
    res.render(path.join(as.dir, 'templates/masters/admin.jade'));
});
