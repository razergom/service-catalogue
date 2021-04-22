const express = require('express')
const axios = require('axios')
const gh = require('parse-github-url')
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
	const parsedGithubUrl = gh(req.body.url)

	const githubApiFileUrl = `https://api.github.com/repos/${parsedGithubUrl.repository}/contents/${parsedGithubUrl.filepath}`

	axios.get(githubApiFileUrl)
		.then(response => res.json(Buffer.from(response.data.content, 'base64').toString()))
		.catch(err => res.status(500).json({ message: err.message }))
})

module.exports = router
