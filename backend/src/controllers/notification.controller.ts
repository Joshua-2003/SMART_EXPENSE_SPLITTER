import type { NextFunction, Request, Response } from 'express';
import {
  listNotifications,
  markNotificationRead,
} from '../services/notification.service.js';
import type {
  ListNotificationsResult,
  MarkNotificationReadResult,
} from '../types/notification.js';
import { HttpError } from '../utils/http-error.js';

export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actorUserId = req.user?.userId;

    if (!actorUserId) {
      throw new HttpError(401, 'UNAUTHORIZED', 'Authenticated request is missing a user.');
    }

    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const read = req.query.read === undefined ? undefined : req.query.read === 'true';

    const result: ListNotificationsResult = await listNotifications(
      actorUserId,
      limit,
      offset,
      read,
    );

    res.status(200).json({
      status: 'success',
      data: {
        notifications: result.notifications.map((notification) => ({
          notificationId: notification.notificationId,
          type: notification.type,
          groupId: notification.groupId,
          groupName: notification.groupName,
          message: notification.message,
          read: notification.read,
          createdAt: new Date(notification.createdAt).toISOString(),
        })),
        total: result.total,
        unreadCount: result.unreadCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsRead(
  req: Request<{ notificationId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actorUserId = req.user?.userId;

    if (!actorUserId) {
      throw new HttpError(401, 'UNAUTHORIZED', 'Authenticated request is missing a user.');
    }

    const result: MarkNotificationReadResult = await markNotificationRead(
      actorUserId,
      req.params.notificationId,
    );

    res.status(200).json({
      status: 'success',
      data: {
        notificationId: result.notificationId,
        read: result.read,
        updatedAt: new Date(result.updatedAt).toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}