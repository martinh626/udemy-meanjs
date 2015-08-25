'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Topbar = mongoose.model('Topbar'),
	_ = require('lodash');

/**
 * Create a Topbar
 */
exports.create = function(req, res) {
	var topbar = new Topbar(req.body);
	topbar.user = req.user;

	topbar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(topbar);
		}
	});
};

/**
 * Show the current Topbar
 */
exports.read = function(req, res) {
	res.jsonp(req.topbar);
};

/**
 * Update a Topbar
 */
exports.update = function(req, res) {
	var topbar = req.topbar ;

	topbar = _.extend(topbar , req.body);

	topbar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(topbar);
		}
	});
};

/**
 * Delete an Topbar
 */
exports.delete = function(req, res) {
	var topbar = req.topbar ;

	topbar.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(topbar);
		}
	});
};

/**
 * List of Topbars
 */
exports.list = function(req, res) { 
	Topbar.find().sort('-created').populate('user', 'displayName').exec(function(err, topbars) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(topbars);
		}
	});
};

/**
 * Topbar middleware
 */
exports.topbarByID = function(req, res, next, id) { 
	Topbar.findById(id).populate('user', 'displayName').exec(function(err, topbar) {
		if (err) return next(err);
		if (! topbar) return next(new Error('Failed to load Topbar ' + id));
		req.topbar = topbar ;
		next();
	});
};

/**
 * Topbar authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.topbar.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
