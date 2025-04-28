const Notification = require('../models/Notification');

class NotificationController {
  // [GET] /notifications/:id
  async getNotifications(req, res, next) {
    const accountId = req.account._id;
    try {
      const notifications = await Notification.find({ account: accountId }).sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // [GET] /notifications/unread-count
  async getUnreadCount(req, res, next) {
    const accountId = req.account._id;
    try {
      const unreadCount = await Notification.countDocuments({ account: accountId, isRead: false });
      res.status(200).json({ unreadCount });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // [DELETE] /notifications/:id
  async deleteNotification(req, res, next) {
    const notificationId = req.params.id;
    try {
      const notification = await Notification.findByIdAndDelete(notificationId);
      if (!notification) return res.status(404).json({ message: 'Notification not found' });
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // [PUT] /notifications/:id/read
  async markAsRead(req, res, next) {
    const notificationId = req.params.id;
    try {
      const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
      if (!notification) return res.status(404).json({ message: 'Notification not found' });
      res.status(200).json(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new NotificationController();