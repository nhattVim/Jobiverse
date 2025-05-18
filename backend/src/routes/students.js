const express = require('express')
const router = express.Router()
const studentController = require('../controllers/StudentController')
const verifyToken = require('../middlewares/verifyToken')
const { uploadSingle } = require('../middlewares/upload')

router.get('/', studentController.getAllStudents)

router.get('/filter', studentController.filterStudent)

router.get('/recomment/:id', studentController.recommendStudent)

router.use(verifyToken(['student']))
router.get('/search', studentController.searchStudents)
router.get('/me', studentController.getMyProfile)
router.get('/:id', studentController.getStudentById)
router.post('/', uploadSingle('avatar'), studentController.saveStudentProfile)

module.exports = router
