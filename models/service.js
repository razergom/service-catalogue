const mongoose = require('mongoose')

const Schema = mongoose.Schema

const serviceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: String,
	version: {
		type: String,
		required: true,
	},
	tags: [String],
	links: [
		{
			title: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			},
		}
	],
	spec: {
		lifecycle: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		owner: {
			type: String,
			required: true,
		}
	}
})

module.exports = mongoose.model('Service', serviceSchema)
