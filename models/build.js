const mongoose = require('mongoose')

const Schema = mongoose.Schema

const buildSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	testResult: {
		type: new Schema(
			{
				status: {
					type: String,
					required: true,
				},
				coverage: {
					type: Number,
					min: 0,
					max: 100,
					required: true,
				},
				testReport: {
					type: new Schema(
						{
							filename: {
								type: String,
								required: true,
							},
							data: {
								type: Buffer,
								required: true,
							},
						}
					),
					required: false
				}
			}
		),
		required: false
	},
	changelog: {
		type: new Schema(
			{
				filename: {
					type: String,
					required: true,
				},
				data: {
					type: Buffer,
					required: true,
				},
			},
		),
		required: false,
	}
})

module.exports = mongoose.model('Build', buildSchema, 'services')
