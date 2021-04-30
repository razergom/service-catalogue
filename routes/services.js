const express = require('express')
const axios = require('axios')
const yaml = require('js-yaml')
const gh = require('parse-github-url')
const Service = require('../models/service')

const router = express.Router()

const getFileContentFromGithub = async (githubUrl) => {
	const parsedGithubData = gh(githubUrl)

	const githubApiFileUrl = `https://api.github.com/repos/${parsedGithubData.repository}/contents/${parsedGithubData.filepath}`

	return axios.get(githubApiFileUrl)
}

const extractYamlConfig = (data) => yaml.load(Buffer.from(data, 'base64').toString())

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

const getBuild = async (req, res, next) => {
	try {
		const build = res.service.builds.find(build => build.id === req.params.buildId)

		if (!build) {
			return res.status(404).json({ message: `Build not found. (id: ${req.params.buildId})` })
		}

		res.build = build

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
	getFileContentFromGithub(req.body.url)
		.then(async response => {
			try {
				const serviceConfig = extractYamlConfig(response.data.content)

				if (serviceConfig.links) {
					serviceConfig.links = [...serviceConfig.links, { title: 'Service Metadata Source', url: req.body.url }]
				} else {
					serviceConfig.links = [{ title: 'Service Metadata Source', url: req.body.url }]
				}

				const service = new Service(serviceConfig)

				const savedService = await service.save()

				res.status(201).json(savedService)
			} catch (err) {
				res.status(400).json({ message: err.message })
			}
		})
		.catch(err => res.status(404).json({ message: err.message }))
})

router.put('/:id', getService, async (req, res) => {
	try {
		const service = res.service

		const githubLink = service.links.find(link => link.title === 'Service Metadata Source')

		if (!githubLink) {
			return res.status(404).json({ message: 'metadata source not provided.' })
		}

		getFileContentFromGithub(githubLink.url)
			.then(async response => {
				try {
					const serviceConfig = extractYamlConfig(response.data.content)

					if (serviceConfig.links) {
						serviceConfig.links = [...serviceConfig.links, { title: 'Service Metadata Source', url: req.body.url }]
					} else {
						serviceConfig.links = [{ title: 'Service Metadata Source', url: req.body.url }]
					}

					serviceConfig.builds = service.builds

					await Service.replaceOne({ _id: service._id }, serviceConfig)

					const updatedService = await Service.findById(req.params.id)

					if (!updatedService) {
						return res.status(404).json({ message: 'service not found.' })
					}

					res.status(200).json(updatedService)
				} catch (err) {
					res.status(400).json({ message: err.message })
				}
			})
			.catch(err => {
				res.status(404).json({ message: err.message })
			})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.get('/:id', getService, async (req, res) => {
	try {
		res.status(200).json(res.service)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.delete('/:id', getService, async (req, res) => {
	try {
		await res.service.remove()
		res.json({ message: `Service deleted. (id: ${req.params.id})` })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.get('/:id/builds', getService, async (req, res) =>  {
	try {
		res.status(200).json(res.service.builds)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.get('/:id/builds/:buildId', getService, getBuild, async (req, res) =>  {
	try {
		res.status(200).json(res.build)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.post('/:id/builds', getService, async (req, res) => {
	try {
		const service = res.service

		const build = {
			name: req.body.name,
			status: 'PROCESS',
		}

		service.builds = [...service.builds, build]

		const savedService = await service.save()

		res.status(201).json(savedService.builds[savedService.builds.length - 1])
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.patch('/:id/builds/:buildId/complete_build', getService, getBuild, async (req, res) => {
	try {
		const updatedBuilds = res.service.builds.map(build => {
			if (build.id !== req.params.buildId) {
				return build
			}

			build.status = 'COMPLETED'

			return build
		})

		const service = res.service
		service.builds = updatedBuilds

		await service.save()

		res.status(200).json(res.build)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.patch('/:id/builds/:buildId/fail_build', getService, getBuild, async (req, res) => {
	try {
		const updatedBuilds = res.service.builds.map(build => {
			if (build.id !== req.params.buildId) {
				return build
			}

			build.status = 'FAILED'

			return build
		})

		const service = res.service
		service.builds = updatedBuilds

		await service.save()

		res.status(200).json(res.build)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.patch('/:id/builds/:buildId/tests', getService, getBuild, async (req, res) => {
	try {
		const service = res.service
		const build = res.build

		if (build.testResult) {
			return res.status(200).json({ message: 'already exists' })
		}

		let fileData = null

		const testData = {
			status: req.body.status,
			coverage: req.body.coverage,
		}

		if (req.body.testReport) {
			fileData = req.files.find(f => f.fieldname === 'testReport[data]')

			if (!fileData) {
				return res.status(400).json({ message: 'test report file not provided' })
			}

			testData.testReport = {
				filename: req.body.testReport.filename,
				data: fileData.buffer.data,
			}
		}

		service.builds = service.builds.map(b => {
			if (b.id === build.id) {
				b.testResult = {
					status: testData.status,
					coverage: testData.coverage,
					testReport: {
						filename: testData.testReport.filename,
						data: testData.testReport.data,
					},
				}

				return b
			}

			return b
		})

		await service.save()

		res.status(200).json(build)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

router.patch('/:id/builds/:buildId/changelog', getService, getBuild, async (req, res) => {
	try {
		const service = res.service
		const build = res.build

		if (build.changelog) {
			return res.status(200).json({ message: 'already exists' })
		}

		const fileData = req.files.find(f => f.fieldname === 'data')

		if (!fileData) {
			return res.status(400).json({ message: 'test report file not provided' })
		}

		service.builds = service.builds.map(b => {
			if (b.id === build.id) {
				b.changelog = {
					filename: req.body.filename,
					data: fileData.buffer.data,
				}

				return b
			}

			return b
		})

		await service.save()

		res.status(200).json(build)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

module.exports = router
