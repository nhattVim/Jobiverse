const Notification = require('../models/Notification');

class NotificationController {
  // [GET] /notifications/:id
  async getNotifications(req, res, next) {
    const accountId = req.account._id;
    try {
      const notifications = await Notification.find({ account: accountId }).sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }

  // [GET] /notifications/unread-count
  async getUnreadCount(req, res, next) {
    const accountId = req.account._id;
    try {
      const unreadCount = await Notification.countDocuments({ account: accountId, isRead: false });
      res.status(200).json({ unreadCount });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }

  // [DELETE] /notifications/:id
  async deleteNotification(req, res, next) {
    const notificationId = req.params.id;
    try {
      const notification = await Notification.findByIdAndDelete(notificationId);
      if (!notification) return res.status(404).json({ message: 'Notification not found' });
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }

  // [PUT] /notifications/:id/read
  async markAsRead(req, res, next) {
    const notificationId = req.params.id;
    try {
      const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
      if (!notification) return res.status(404).json({ message: 'Notification not found' });
      res.status(200).json(notification);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
}

module.exports = new NotificationController();