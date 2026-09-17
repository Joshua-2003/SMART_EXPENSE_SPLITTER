import { listForUser, markAsRead } from '../repositories/notification.repository.js';
import { HttpError } from '../utils/http-error.js';
import type {
  ListNotificationsResult,
  MarkNotificationReadResult,
} from '../types/notification.js';

export async function listNotifications(
  actorUserId: string,
  limit: number,
  offset: number,
  read?: boolean,
): Promise<ListNotificationsResult> {
  const { items, total, unreadCount } = await listForUser(
    actorUserId,
    limit,
    offset,
    read,
  );

  return {
    notifications: items,
    total,
    unreadCount,
  };
}

export async function markNotificationRead(
  actorUserId: string,
  notificationId: string,
): Promise<MarkNotificationReadResult> {
  const notification = await markAsRead(notificationId, actorUserId);

  if (!notification) {
    throw new HttpError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found.');
  }

  return {
    notificationId: notification.notificationId,
    read: true,
    updatedAt: new Date(),
  };
}