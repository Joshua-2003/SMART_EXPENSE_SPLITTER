import { db } from '../db/db.js';
import { groups, groupMembers } from '../models/index.js';
import type { CreateGroupResult } from '../types/group.js';

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