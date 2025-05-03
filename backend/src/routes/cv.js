const express = require('express');
const router = express.Router();
const CVController = require('../controllers/CVController');
const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken(["student"]));
router.get('/', CVController.getStudentCV);
router.put('/', CVController.updateStudentCV);
router.delete('/', CVController.deleteStudentCV);

module.exports = router;
