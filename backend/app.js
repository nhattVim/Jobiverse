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
app.use(cors({ origin: 'https://localhost:5173', credentials: true }))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Route handler
route(app)

module.exports = app
