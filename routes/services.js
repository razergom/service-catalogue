const express = require('express')
const axios = require('axios')
const yaml = require('js-yaml')
const gh = require('parse-github-url')
const Service = require('../models/service')

const router = express.Router()

const getService = async (req, res, next) => {
	try {
		const service = await Service.findById(req.params.id)

		if (!service) {
			return res.status(404).json({ message: `Service not found. (id: ${req.params.id})` })
		}

		res.service = service

		next()
	} catch (err) {
		return res.status(500).json({ message: err.message })
	}
}

router.get('/', async (req, res) => {
	try {
		const services = await Service.find()
		res.json(services)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.post('/register', async (req, res) => {
	const parsedGithubData = gh(req.body.url)

	const githubApiFileUrl = `https://api.github.com/repos/${parsedGithubData.repository}/contents/${parsedGithubData.filepath}`

	axios.get(githubApiFileUrl)
		.then(async response => {
			try {
				const serviceConfig = yaml.load(Buffer.from(response.data.content, 'base64').toString())

				const service = new Service(serviceConfig)

				const savedService = await service.save()

				res.status(201).json(savedService)
			} catch (err) {
				res.status(400).json({ message: err.message })
			}
		})
		.catch(err => res.status(404).json({ message: err.message }))
})

router.delete('/:id', getService, async (req, res) => {
	try {
		await res.service.remove()
		res.json({ message: `Service deleted. (id: ${req.params.id})` })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

module.exports = router
