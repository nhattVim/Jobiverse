const express = require('express');
const router = express.Router();
const accountController = require('../controllers/AccountController');
const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken(["admin"]));
router.get('/', accountController.getAllAccount);
router.get('/:id', accountController.getAccountById);
router.get('/deleted', accountController.getAllDeletedAccount);
router.delete('/:id', accountController.deleteAccount);
router.delete('/force/:id', accountController.forceDeleteAccount);
router.post('/restore/:id', accountController.restoreAccount);

module.exports = router;
