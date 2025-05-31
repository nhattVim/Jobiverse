const express = require('express')
const router = express.Router()
const accountController = require('../controllers/AccountController')
const verifyToken = require('../middlewares/verifyToken')
const { uploadSingle } = require('../middlewares/upload')

router.get('/detail', verifyToken([]), accountController.getAccountDetail)
router.get('/has-password', verifyToken([]), accountController.hasPassword)
router.put('/update-password', verifyToken([]), accountController.updatePassword)
router.put('/update-phone', verifyToken([]), accountController.updatePhone)
router.get('/avatar', verifyToken([]), accountController.getAvatar)
router.put('/avatar', verifyToken([]), uploadSingle('avatar'), accountController.changeAvatar)
router.put('/profile', verifyToken([]), accountController.hasProfile)

router.use(verifyToken(['admin']))
router.get('/', accountController.getAllAccount)
router.get('/deleted', accountController.getAllDeletedAccount)
router.get('/:id', accountController.getAccountById)
router.delete('/:id', accountController.deleteAccount)
router.delete('/force/:id', accountController.forceDeleteAccount)
router.post('/restore/:id', accountController.restoreAccount)

module.exports = router
