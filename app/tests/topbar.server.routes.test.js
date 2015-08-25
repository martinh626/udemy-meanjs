'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Topbar = mongoose.model('Topbar'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, topbar;

/**
 * Topbar routes tests
 */
describe('Topbar CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Topbar
		user.save(function() {
			topbar = {
				name: 'Topbar Name'
			};

			done();
		});
	});

	it('should be able to save Topbar instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Topbar
				agent.post('/topbars')
					.send(topbar)
					.expect(200)
					.end(function(topbarSaveErr, topbarSaveRes) {
						// Handle Topbar save error
						if (topbarSaveErr) done(topbarSaveErr);

						// Get a list of Topbars
						agent.get('/topbars')
							.end(function(topbarsGetErr, topbarsGetRes) {
								// Handle Topbar save error
								if (topbarsGetErr) done(topbarsGetErr);

								// Get Topbars list
								var topbars = topbarsGetRes.body;

								// Set assertions
								(topbars[0].user._id).should.equal(userId);
								(topbars[0].name).should.match('Topbar Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Topbar instance if not logged in', function(done) {
		agent.post('/topbars')
			.send(topbar)
			.expect(401)
			.end(function(topbarSaveErr, topbarSaveRes) {
				// Call the assertion callback
				done(topbarSaveErr);
			});
	});

	it('should not be able to save Topbar instance if no name is provided', function(done) {
		// Invalidate name field
		topbar.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Topbar
				agent.post('/topbars')
					.send(topbar)
					.expect(400)
					.end(function(topbarSaveErr, topbarSaveRes) {
						// Set message assertion
						(topbarSaveRes.body.message).should.match('Please fill Topbar name');
						
						// Handle Topbar save error
						done(topbarSaveErr);
					});
			});
	});

	it('should be able to update Topbar instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Topbar
				agent.post('/topbars')
					.send(topbar)
					.expect(200)
					.end(function(topbarSaveErr, topbarSaveRes) {
						// Handle Topbar save error
						if (topbarSaveErr) done(topbarSaveErr);

						// Update Topbar name
						topbar.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Topbar
						agent.put('/topbars/' + topbarSaveRes.body._id)
							.send(topbar)
							.expect(200)
							.end(function(topbarUpdateErr, topbarUpdateRes) {
								// Handle Topbar update error
								if (topbarUpdateErr) done(topbarUpdateErr);

								// Set assertions
								(topbarUpdateRes.body._id).should.equal(topbarSaveRes.body._id);
								(topbarUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Topbars if not signed in', function(done) {
		// Create new Topbar model instance
		var topbarObj = new Topbar(topbar);

		// Save the Topbar
		topbarObj.save(function() {
			// Request Topbars
			request(app).get('/topbars')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Topbar if not signed in', function(done) {
		// Create new Topbar model instance
		var topbarObj = new Topbar(topbar);

		// Save the Topbar
		topbarObj.save(function() {
			request(app).get('/topbars/' + topbarObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', topbar.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Topbar instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Topbar
				agent.post('/topbars')
					.send(topbar)
					.expect(200)
					.end(function(topbarSaveErr, topbarSaveRes) {
						// Handle Topbar save error
						if (topbarSaveErr) done(topbarSaveErr);

						// Delete existing Topbar
						agent.delete('/topbars/' + topbarSaveRes.body._id)
							.send(topbar)
							.expect(200)
							.end(function(topbarDeleteErr, topbarDeleteRes) {
								// Handle Topbar error error
								if (topbarDeleteErr) done(topbarDeleteErr);

								// Set assertions
								(topbarDeleteRes.body._id).should.equal(topbarSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Topbar instance if not signed in', function(done) {
		// Set Topbar user 
		topbar.user = user;

		// Create new Topbar model instance
		var topbarObj = new Topbar(topbar);

		// Save the Topbar
		topbarObj.save(function() {
			// Try deleting Topbar
			request(app).delete('/topbars/' + topbarObj._id)
			.expect(401)
			.end(function(topbarDeleteErr, topbarDeleteRes) {
				// Set message assertion
				(topbarDeleteRes.body.message).should.match('User is not logged in');

				// Handle Topbar error error
				done(topbarDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Topbar.remove().exec();
		done();
	});
});