var as = require('rfr')('/'),
    path = require('path'),
    express = require('express');
exports.register = function(atriumscreen) {
    var router = express.Router();
    router.get('/', function(req, res) {
        res.render(path.join(as.dir, 'templates/views/layout-editor.jade'));
    });
    atriumscreen.admin.use('/layout', router);
};
