import { db, delay } from '../mock/db';
import type { Notification } from '../types';

export const notificationService = {
  getNotifications: async (userId: string): Promise<Notification[]> => {
    await delay();
    return db.notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  markAsRead: async (id: string): Promise<void> => {
    await delay();
    await db.markNotificationRead(id);
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    await delay();
    await db.markAllNotificationsRead(userId);
  },

  deleteNotification: async (id: string): Promise<void> => {
    await delay();
    const index = db.notifications.findIndex(n => n.id === id);
    if (index >= 0) {
      db.notifications.splice(index, 1);
    }
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    const notifications = await notificationService.getNotifications(userId);
    return notifications.filter((n) => !n.read).length;
  },
};
