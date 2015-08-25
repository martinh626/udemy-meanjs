'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var topbars = require('../../app/controllers/topbars.server.controller');

	// Topbars Routes
	app.route('/topbars')
		.get(topbars.list)
		.post(users.requiresLogin, topbars.create);

	app.route('/topbars/:topbarId')
		.get(topbars.read)
		.put(users.requiresLogin, topbars.hasAuthorization, topbars.update)
		.delete(users.requiresLogin, topbars.hasAuthorization, topbars.delete);

	// Finish by binding the Topbar middleware
	app.param('topbarId', topbars.topbarByID);
};
