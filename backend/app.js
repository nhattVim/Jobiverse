require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const route = require('./src/routes')
const db = require('./src/config/db')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// Connect to database
db.connect()

// Middlewares
app.use(cors({ origin: process.env.FE_URL, credentials: true }))
app.use(logger('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Check if server is ready
app.get('/health-check', (req, res) => {
  res.status(200).send('OK')
})

// Route handler
route(app)

module.exports = app
