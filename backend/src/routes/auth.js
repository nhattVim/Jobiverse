const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')
const { uploadSingle } = require('../middlewares/upload')

router.post('/login', authController.login)
router.post('/register', uploadSingle('avatar'), authController.register)
router.post('/logout', authController.logout)

module.exports = router
