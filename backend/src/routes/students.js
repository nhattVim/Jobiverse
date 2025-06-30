const express = require('express')
const router = express.Router()
const studentController = require('../controllers/StudentController')
const verifyToken = require('../middlewares/verifyToken')

router.get('/me', verifyToken(['student']), studentController.getMyProfile)
router.post('/me', verifyToken(['student']), studentController.createProfile)
router.put('/me', verifyToken(['student']), studentController.updateMyProfile)

router.get('/', studentController.getAllProfiles)
router.get('/:id', studentController.getProfileById)

module.exports = router
