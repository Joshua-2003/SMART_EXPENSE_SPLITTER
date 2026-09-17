export type NotificationType = 'overdue_alert' | 'payment_reminder' | 'expense_created';

export interface NotificationItem {
  notificationId: string;
  type: NotificationType;
  groupId: string;
  groupName: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface ListNotificationsResult {
  notifications: NotificationItem[];
  total: number;
  unreadCount: number;
}

export interface MarkNotificationReadResult {
  notificationId: string;
  read: true;
  updatedAt: Date;
}