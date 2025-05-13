const express = require('express')
const router = express.Router()
const specializtionController = require('../controllers/SpecializationController')

router.get('/', specializtionController.getAllSpecializations)
router.get('/:id', specializtionController.getSpecializationById)

module.exports = router
