const express = require('express')
const router = express.Router()
const studentController = require('../controllers/StudentController')
const verifyToken = require('../middlewares/verifyToken')
const { uploadSingle } = require('../middlewares/upload')

router.get('/', studentController.getAllProfiles)
router.get('/:id', studentController.getProfileById)

router.get('/filter', studentController.filterProfile)

router.get('/recomment/:id', studentController.recommendProfile)

router.use(verifyToken(['student']))
router.get('/search', studentController.searchProfiles)
router.get('/me', studentController.getMyProfile)
router.post('/', studentController.createProfile)
router.put('/', studentController.updateMyProfile)

module.exports = router
