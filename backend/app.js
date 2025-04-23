require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const route = require('./routes')
const db = require('./config/db')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Connect to database
db.connect()

// Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route handler
route(app)

module.exports = app;
