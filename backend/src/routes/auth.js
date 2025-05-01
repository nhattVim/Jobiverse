const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/login', authController.loginAccount);
router.post('/register', authController.registerAccount);
router.post('/logout', authController.logoutAccount);
router.get('/profile', verifyToken([]), authController.getAccountProfile);

module.exports = router;
