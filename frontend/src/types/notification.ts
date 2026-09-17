import type { InAppNotification } from './accountability';

export interface NotificationsResponse {
  notifications: InAppNotification[];
  total: number;
  unreadCount: number;
}

export interface MarkNotificationReadResult {
  notificationId: string;
  read: boolean;
  updatedAt: string;
}