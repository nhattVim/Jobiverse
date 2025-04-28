const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');
const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken(["student", "employer"]));
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.delete('/:id', notificationController.deleteNotification);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
