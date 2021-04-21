const express = require('express')
const Service = require('../models/service')

const router = express.Router()

router.get('/', async (req, res) => {
	try {
		const services = await Service.find()
		res.json(services)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.post('/', async (req, res) => {
	// Временно, для теста, вместо этого файл с данными будет браться из нужного репозитория
	const service = new Service({
		name: req.body.name,
		description: req.body.description,
		version: req.body.version,
		tags: req.body.tags,
		links: req.body.links,
		spec: req.body.spec,
	})

	try {
		const newService = await service.save()
		res.status(201).json(newService)
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

module.exports = router
