var atriumscreen = require('rfr')(''),
    keystone = atriumscreen.keystone,
    express = require('express'),
    path = require('path'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    lessMiddleware = require('less-middleware');



exports.initially = function(app) {
    app.use(exports.screenRender);
    atriumscreen.emit('middleware', app);
    keystone.pre('routes', exports.requireUser);
    keystone.pre('routes', function(req, res, next) {
        res.locals.jwt = jwt.sign({auth: true}, keystone.get('cookie secret'));
        next();
    });

    //Create arrays for filling with custom scripts and styles
    keystone.pre('routes', function(req, res, next) {
        res.locals.styles = [];
        res.locals.scripts = [];
        res.locals.headScripts = [];
        res.locals.nav = atriumscreen.navDash;
        next();
    });

    keystone.pre('routes', exports.adminRender);
}

exports.finally = function(app) {
    app.use('/public/as', lessMiddleware(path.join(atriumscreen.dir, 'assets')));
    app.use('/public/as', express.static(path.join(atriumscreen.dir, 'assets')));
    atriumscreen.emit('static', app);
}

exports.screenRender = function(req, res, next) {

    //So we can define our own scripts and styles
    //TODO: Stop the same file being loaded twice
    //TODO: Make super slick bower integration for package management to solve the above
    res.locals.styles = [];
    res.locals.scripts = [];
    res.locals.headScripts = [];

    res.clientData = {as: { } };

    res.screen = function(view, locals) {
        if (!locals) locals = {};
        req.app.render(view, locals, function(err, html) {
            if (err) {
                return next(err);
            }
            locals.content = html;
            locals.clientData = JSON.stringify(res.clientData);

            res.locals.scripts = parseScripts(res.locals.scripts);
            res.locals.headScripts = parseScripts(res.locals.headScripts);

            res.render(path.join(atriumscreen.dir, 'templates/masters/client-frame.jade'), locals);
        });
    }
    next();
}

function parseScripts(scripts) {
    newScripts = [];
    _.each(scripts, function(script) {
        if (_.isObject(script)) {
            newScripts.push(_.assign({src: '', inline: false}, script));
        } else {
            newScripts.push({src: script, inline: false});
        }
    });
    return newScripts;
}

//Quickly steal that last function for the dash
exports.adminRender = function(req, res, next) {
    res.admin = function(view, locals) {
        if (!locals) locals = {};
        req.app.render(view, locals || {}, function(err, html) {
            if (err) {
                return next(err);
            }
            locals.content = html;

            var view = new keystone.View(req, res);
            view.render(path.join(atriumscreen.dir, 'templates/masters/admin.jade'), locals);
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
    if ((req.url != '/keystone/signin') && (keystone.get('auth'))) {
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
