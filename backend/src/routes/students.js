const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', studentController.getAllStudents); // change to admin

router.get('/filter', studentController.filterStudent); 

router.use(verifyToken(["student"]));
router.get('/search', studentController.searchStudents); 
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudentProfile);
router.put('/', studentController.updateStudentProfile);

module.exports = router;
