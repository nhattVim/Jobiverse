const express = require('express')
const router = express.Router()
const majorController = require('../controllers/MajorController')

router.get('/', majorController.getAllMajors)
router.get('/:id', majorController.getMajorById)

module.exports = router
