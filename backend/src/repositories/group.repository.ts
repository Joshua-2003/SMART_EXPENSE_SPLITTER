import { and, count, eq, sql } from 'drizzle-orm';
import { db } from '../db/db.js';
import { expenseSplits, expenses, groupMembers, groups, payments, users } from '../models/index.js';
import type {
  AddMemberResult,
  CreateGroupResult,
  GroupDetailsResult,
  GroupListItem,
  GroupMemberItem,
  UpdateGroupResult,
} from '../types/group.js';

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

export async function findById(groupId: string): Promise<GroupDetailsResult | undefined> {
  const [group] = await db
    .select({
      groupId: groups.id,
      name: groups.name,
      description: groups.description,
      adminId: groups.adminId,
      createdAt: groups.createdAt,
    })
    .from(groups)
    .where(eq(groups.id, groupId))
    .limit(1);

  if (!group) {
    return undefined;
  }

  return {
    ...group,
    members: await listMembers(groupId),
  };
}

export async function findMembership(
  groupId: string,
  userId: string,
): Promise<{ role: 'admin' | 'member'; joinedAt: Date } | undefined> {
  const [membership] = await db
    .select({
      role: groupMembers.role,
      joinedAt: groupMembers.joinedAt,
    })
    .from(groupMembers)
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)))
    .limit(1);

  if (!membership) {
    return undefined;
  }

  return {
    role: membership.role as 'admin' | 'member',
    joinedAt: membership.joinedAt,
  };
}

export async function listMembers(groupId: string): Promise<GroupMemberItem[]> {
  const rows = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      role: groupMembers.role,
      joinedAt: groupMembers.joinedAt,
    })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groupMembers.groupId, groupId))
    .orderBy(sql`${groupMembers.joinedAt} ASC`);

  return rows.map((row) => ({
    ...row,
    role: row.role as 'admin' | 'member',
  }));
}

export async function update(
  groupId: string,
  data: { name?: string; description?: string | null },
): Promise<UpdateGroupResult | undefined> {
  const [group] = await db
    .update(groups)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(groups.id, groupId))
    .returning();

  if (!group) {
    return undefined;
  }

  return {
    groupId: group.id,
    name: group.name,
    description: group.description ?? null,
    updatedAt: group.updatedAt,
  };
}

export async function addMember(
  groupId: string,
  userId: string,
): Promise<AddMemberResult> {
  await db.insert(groupMembers).values({
    groupId,
    userId,
    role: 'member',
  });

  const [member] = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      role: groupMembers.role,
      joinedAt: groupMembers.joinedAt,
    })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)))
    .limit(1);

  return {
    userId: member.userId,
    name: member.name,
    email: member.email,
    role: member.role as 'member',
    joinedAt: member.joinedAt,
  };
}

export async function removeMember(
  groupId: string,
  userId: string,
): Promise<boolean> {
  const result = await db
    .delete(groupMembers)
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)));

  return (result.rowCount ?? 0) > 0;
}

export async function hasOpenObligations(
  groupId: string,
  userId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ openCount: sql<number>`count(*)::int` })
    .from(expenseSplits)
    .innerJoin(expenses, eq(expenses.id, expenseSplits.expenseId))
    .leftJoin(
      payments,
      and(
        eq(payments.expenseId, expenseSplits.expenseId),
        eq(payments.userId, expenseSplits.userId),
      ),
    )
    .where(
      and(
        eq(expenses.groupId, groupId),
        sql`(${payments.status} IS NULL OR ${payments.status} <> 'completed')`,
        sql`(
          (${expenseSplits.userId} = ${userId} AND ${expenses.createdBy} <> ${userId})
          OR (${expenses.createdBy} = ${userId} AND ${expenseSplits.userId} <> ${userId})
        )`,
      ),
    );

  return (row?.openCount ?? 0) > 0;
}
