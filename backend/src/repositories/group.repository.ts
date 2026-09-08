import { eq, sql } from 'drizzle-orm';
import { db } from '../db/db.js';
import { groups, groupMembers } from '../models/index.js';
import type { CreateGroupResult, GroupListItem } from '../types/group.js';

export async function createWithAdmin(
  name: string,
  description: string | null,
  adminId: string,
): Promise<CreateGroupResult> {
  const result = await db.transaction(async (tx) => {
    const [group] = await tx
      .insert(groups)
      .values({
        name,
        description,
        adminId,
      })
      .returning();

    await tx.insert(groupMembers).values({
      groupId: group.id,
      userId: adminId,
      role: 'admin',
    });

    return group;
  });

  return {
    groupId: result.id,
    name: result.name,
    description: result.description ?? null,
    adminId: result.adminId,
    createdAt: result.createdAt,
  };
}

export async function listForUser(
  userId: string,
  limit: number,
  offset: number,
): Promise<{ items: GroupListItem[]; total: number }> {
  const membersAlias = sql.raw('members_sub');
  const membersGroupIdColumn = sql.raw('group_id');

  const rows = await db
    .select({
      groupId: groups.id,
      name: groups.name,
      description: groups.description,
      adminId: groups.adminId,
      role: groupMembers.role,
      memberCount: sql<number>`(
        SELECT count(*)::int FROM ${groupMembers} AS ${membersAlias}
        WHERE ${membersAlias}.${membersGroupIdColumn} = ${groups.id}
      )`,
      createdAt: groups.createdAt,
    })
    .from(groupMembers)
    .innerJoin(groups, eq(groups.id, groupMembers.groupId))
    .where(eq(groupMembers.userId, userId))
    .orderBy(sql`${groups.createdAt} DESC`)
    .limit(limit)
    .offset(offset);

  const [totalRow] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(groupMembers)
    .where(eq(groupMembers.userId, userId));

  return {
    items: rows.map((row) => ({
      ...row,
      role: row.role as 'admin' | 'member',
    })),
    total: totalRow?.total ?? 0,
  };
}