const mongoose = require('mongoose')
const Build = require('./build')

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
	links: {
		type: [
			new Schema(
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
			)
		],
		required: false,
	},
	spec: {
		type: new Schema({
			lifecycle: {
				type: String,
				required: true,
			},
			owner: {
				type: String,
				required: true,
			},
			type: {
				type: String,
				required: true,
			}
		}),
		required: false
	},
	builds: [Build.schema]
})

module.exports = mongoose.model('Service', serviceSchema, 'services')
