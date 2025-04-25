const express = require('express');
const router = express.Router();
const employerController = require('../controllers/EmployerController');

router.get('/search', employerController.searchEmployers);

router.get('/', employerController.getAllEmployers);
router.get('/:id', employerController.getEmployerById);
router.post('/', employerController.createEmployerProfile);
router.put('/', employerController.updateEmployerProfile);

module.exports = router;
