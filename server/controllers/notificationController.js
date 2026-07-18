const Notification = require('../models/Notification');
const { aggregateEntity } = require('../services/compatibility/aggregator');

// GET /api/notifications?userId=&cellId=
const getNotifications = async (req, res, next) => {
  try {
    const { userId, cellId } = req.query;
    const notifications = await aggregateEntity('notifications', {
      filterFn: (item) => {
        if (userId && String(item.userId) !== String(userId)) return false;
        if (cellId && String(item.assignedCellId) !== String(cellId)) return false;
        return true;
      },
    });
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/:id/read
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/read-all?userId=
const markAllAsRead = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    await Notification.updateMany(filter, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notifications/:id
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
