'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Topbar Schema
 */
var TopbarSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Topbar name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Topbar', TopbarSchema);