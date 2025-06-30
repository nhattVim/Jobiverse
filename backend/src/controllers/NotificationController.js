const Notification = require('../models/Notification')

class NotificationController {
  // [GET] /notify
  async getNotifications(req, res, next) {
    const accountId = req.account._id
    try {
      const notifications = await Notification.find({ account: accountId }).select('-__v').sort({ createdAt: -1 })
      res.status(200).json(notifications)
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message })
    }
  }

  // [GET] /notify/unread-count
  async getUnreadCount(req, res, next) {
    const accountId = req.account._id
    if (!accountId) return res.status(200).json({ unreadCount: 0 })
    try {
      const unreadCount = await Notification.countDocuments({ account: accountId, isRead: false })
      res.status(200).json({ unreadCount })
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message })
    }
  }

  // [DELETE] /notify/:id
  async deleteNotification(req, res, next) {
    const notificationId = req.params.id
    try {
      const notification = await Notification.findByIdAndDelete(notificationId)
      if (!notification) return res.status(404).json({ message: 'Notification not found' })
      res.status(200).json({ message: 'Notification deleted successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message })
    }
  }

  // [DELETE] /notify
  async deleteAllNotifications(req, res, next) {
    const accountId = req.account._id
    try {
      await Notification.deleteMany({ account: accountId })
      res.status(200).json({ message: 'All notifications deleted successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message })
    }
  }

  // [PUT] /notify/mark-as-read
  async markAsRead(req, res, next) {
    try {
      await Notification.updateMany({ account: req.account._id, isRead: false }, { isRead: true })
      res.status(200).json({ message: 'Marked as read' })
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message })
    }
  }
}

module.exports = new NotificationController()
