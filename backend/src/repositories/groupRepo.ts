import { db } from '@/db/db.js';
import { groups } from '@/models/schema.js';
import { CreateGroupInput, GroupResponse } from '@/types/group.js';

export async function createGroup(input: CreateGroupInput): Promise<GroupResponse | null> {
    const [group] = await db
        .insert(groups)
        .values({
            name: input.name,
            description: input.description,
            adminId: input.adminId,
        
        })
        .returning();

    return (group as GroupResponse) || null;
}