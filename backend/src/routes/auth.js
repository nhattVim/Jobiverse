const express = require('express')
const router = express.Router()
const multer = require('multer')
const authController = require('../controllers/AuthController')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/login', authController.loginAccount)
router.post('/register', upload.single('avatar'), authController.registerAccount)
router.post('/logout', authController.logoutAccount)

module.exports = router
