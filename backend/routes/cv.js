const express = require('express');
const router = express.Router();
const CVController = require('../controllers/CVController');

router.get('/', CVController.getStudentCV);
router.post('/', CVController.updateStudentCV);
router.delete('/', CVController.deleteStudentCV);

module.exports = router;
