const express = require('express')
const router = express.Router()
const employerController = require('../controllers/EmployerController')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', employerController.getAllProfiles)
router.get('/detail/:id', employerController.getProfileById)

router.use(verifyToken(['employer']))
router.get('/search', employerController.searchProfiles)
router.get('/me', employerController.getMyProfile)
router.post('/', employerController.createProfile)
router.put('/', employerController.updateMyProfile)

module.exports = router
