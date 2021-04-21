const express = require('express')
const mongoose = require('mongoose')

const serviceRouter = require('./routes/services')

require('dotenv').config()

const app = express()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.log(err))

const db = mongoose.connection

app.use(express.json())
app.use('/services', serviceRouter)

app.listen(3000, () => console.log('Server started on port 3000'))
