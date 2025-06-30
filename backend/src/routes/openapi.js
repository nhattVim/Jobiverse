const express = require('express')
const router = express.Router()
const openapiController = require('../controllers/OpenapiController')

router.get('/locations', openapiController.getLocations)

module.exports = router
