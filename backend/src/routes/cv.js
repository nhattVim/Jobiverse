const express = require('express')
const router = express.Router()
const CVController = require('../controllers/CVController')
const verifyToken = require('../middlewares/verifyToken')
const { uploadMultiple } = require('../middlewares/upload')

router.use(verifyToken(['student']))
router.get('/', CVController.getAllMyCV)
router.get('/uploads', CVController.getAllUpCv)
router.get('/:id', CVController.getCVById)
router.get('/uploads/:id', CVController.getUpCVById)
router.post('/', CVController.createCV)
router.post('/uploads', uploadMultiple('files', 5), CVController.uploadCV)
router.delete('/:id', CVController.deleteCV)
router.delete('/uploads/:id', CVController.deleteUpCV)
router.put('/:id', CVController.updateCV)
router.post('/generate-pdf', CVController.generatePDF)

module.exports = router
