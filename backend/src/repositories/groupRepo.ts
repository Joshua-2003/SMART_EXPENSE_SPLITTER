import { db } from '@/db/db.js';
import { groups } from '@/models/schema.js';
import { eq } from 'drizzle-orm';
import { CreateGroupInput, GroupResponse, GroupDetailsResponse } from '@/types/group.js';

export async function getGroupById(groupId: string): Promise<GroupDetailsResponse | null> {
    const group = await db
        .query.groups.findFirst({
            where: eq(groups.id, groupId),
            with: {
                members: {
                    with: {
                        user: {
                            columns: {
                                email: true,
                                name: true, 
                            }
                        }
                    }
                },
            },
        })

    return (group as GroupDetailsResponse) || null;
}

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