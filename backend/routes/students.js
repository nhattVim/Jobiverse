const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');

router.get('/search', studentController.searchStudents);

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudentProfile);
router.put('/:id', studentController.updateStudentProfile);

module.exports = router;
