const express = require('express')
const router = express.Router()
const employerController = require('../controllers/EmployerController')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', employerController.getAllEmployers)

router.use(verifyToken(['employer']))
router.get('/search', employerController.searchEmployers)
router.get('/:id', employerController.getEmployerById)
router.get('/me', employerController.getMyEmployerProfile)
router.post('/', employerController.createEmployerProfile)
router.put('/', employerController.updateEmployerProfile)

module.exports = router
