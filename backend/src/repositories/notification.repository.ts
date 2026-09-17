import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db/db.js';
import { groups, notifications } from '../models/index.js';
import type { NotificationItem } from '../types/notification.js';

export async function listForUser(
  userId: string,
  limit: number,
  offset: number,
  read?: boolean,
): Promise<{ items: NotificationItem[]; total: number; unreadCount: number }> {
  const where = and(
    eq(notifications.userId, userId),
    read === undefined ? undefined : eq(notifications.read, read),
  );

  const rows = await db
    .select({
      notificationId: notifications.id,
      type: notifications.type,
      groupId: notifications.groupId,
      groupName: groups.name,
      message: notifications.message,
      read: notifications.read,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .innerJoin(groups, eq(groups.id, notifications.groupId))
    .where(where)
    .orderBy(sql`${notifications.createdAt} DESC`)
    .limit(limit)
    .offset(offset);

  const [totalRow] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(notifications)
    .where(where);

  const [unreadRow] = await db
    .select({ unreadCount: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));

  return {
    items: rows.map((row) => ({
      ...row,
      type: row.type as NotificationItem['type'],
    })),
    total: totalRow?.total ?? 0,
    unreadCount: unreadRow?.unreadCount ?? 0,
  };
}

export async function markAsRead(
  notificationId: string,
  userId: string,
): Promise<NotificationItem | undefined> {
  const [updated] = await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
    .returning({
      notificationId: notifications.id,
      type: notifications.type,
      groupId: notifications.groupId,
      message: notifications.message,
      read: notifications.read,
      createdAt: notifications.createdAt,
    });

  if (!updated) {
    return undefined;
  }

  const [row] = await db
    .select({ groupName: groups.name })
    .from(groups)
    .where(eq(groups.id, updated.groupId))
    .limit(1);

  return {
    ...updated,
    groupName: row?.groupName ?? 'Unknown group',
    type: updated.type as NotificationItem['type'],
  };
}