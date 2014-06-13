var atriumscreen = require('rfr')(''),
    keystone = atriumscreen.keystone,
    express = require('express'),
    path = require('path'),
    _ = require('lodash');


exports.initially = function(app) {
    app.use(exports.screenRender);
    atriumscreen.emit('middleware', app);
    keystone.pre('routes', exports.requireUser);

}

exports.finally = function(app) {
    app.use('/public/as', express.static(path.join(atriumscreen.dir, 'assets')));
    atriumscreen.emit('static', app);
}

exports.screenRender = function(req, res, next) {
    res.screen = function(view, locals) {
        req.app.render(view, locals, function(err, html) {
            if (err) {
                return next(err);
            }
            locals.content = html;
            res.render(path.join(atriumscreen.dir, 'templates/masters/client.jade'), locals);
        });
    }
    next();
}

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {

	var locals = res.locals;

	locals.navLinks = [
		{ label: 'Home',		key: 'home',		href: '/' },
		{ label: 'Contact',		key: 'contact',		href: '/contact' }
	];

	locals.user = req.user;

	next();

};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {

	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};

	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false;

	next();

};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
    if (req.url != '/keystone/signin') {
        if (!req.user) {
            req.flash('error', 'Please sign in to access this page.');
            res.redirect('/as/keystone/signin');
        } else if (!req.user.canAccessKeystone) {
            req.flash('error', 'Insufficient privelages.');
            res.redirect('/');
        } else {
            next();
        }
    } else {
        next();
    }

}
