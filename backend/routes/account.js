const express = require('express');
const router = express.Router();
const accountController = require('../controllers/AccountController');

router.post('/login', accountController.loginAccount);
router.post('/:register', accountController.registerAccount);
router.delete('/:id', accountController.deleteAccount);
router.post('/restore/:id', accountController.restoreAccount);

module.exports = router;
