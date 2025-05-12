const express = require('express');
const router = express.Router();
const CVController = require('../controllers/CVController');
const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken(["student"]));
router.get('/', CVController.getAllStudentCV);
router.get('/:id', CVController.getStudentCV);
router.post('/', CVController.createStudentCV);
router.post('/generate-pdf', CVController.generatePDF);
router.put('/:id', CVController.updateStudentCV);
router.delete('/:id', CVController.deleteStudentCV);

module.exports = router;
