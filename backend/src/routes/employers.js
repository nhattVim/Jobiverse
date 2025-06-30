const express = require('express')
const router = express.Router()
const employerController = require('../controllers/EmployerController')
const verifyToken = require('../middlewares/verifyToken')

router.get('/me', verifyToken(['employer']), employerController.getMyProfile)
router.post('/me', verifyToken(['employer']), employerController.createProfile)
router.put('/me', verifyToken(['employer']), employerController.updateMyProfile)

router.get('/', employerController.getAllProfiles)
router.get('/:id', employerController.getProfileById)

module.exports = router
