const express = require('express')
const router = express.Router()
const CVController = require('../controllers/CVController')
const verifyToken = require('../middlewares/verifyToken')
const { uploadMultiple } = require('../middlewares/upload')

router.get('/my', verifyToken(['student']), CVController.getAllMyCV)
router.get('/my/uploads', verifyToken(['student']), CVController.getAllMyUpCv)

router.get('/uploads/:id', CVController.getUpCVById)
router.get('/:id', CVController.getCVById)

router.post('/', verifyToken(['student']), CVController.createCV)
router.post('/uploads', verifyToken(['student']), uploadMultiple('files', 5), CVController.uploadCV)
router.delete('/:id', verifyToken(['student']), CVController.deleteCV)
router.delete('/uploads/:id', verifyToken(['student']), CVController.deleteUpCV)
router.put('/:id', verifyToken(['student']), CVController.updateCV)
router.post('/generate-pdf', verifyToken(['student']), CVController.generatePDF)

module.exports = router
