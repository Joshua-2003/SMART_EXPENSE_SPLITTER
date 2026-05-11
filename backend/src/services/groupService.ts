import * as userRepo from '@/repositories/userRepo.js';
import * as groupRepo from '@/repositories/groupRepo.js';
import { AuthenticationError, ConflictError } from '@/utils/errorUtils.js';
import { CreateGroupInput, GroupResponse, GroupDetailsResponse } from '@/types/group.js';

export async function getGroupById(groupId: string): Promise<GroupDetailsResponse | null> {
    return await groupRepo.getGroupById(groupId);
}

export async function createGroup(input: CreateGroupInput): Promise<GroupResponse> {
    const adminUser = await userRepo.findUserById(input.adminId);
    if (!adminUser) {
        throw new AuthenticationError('Admin user not found');
    };

    const groupRecord = await groupRepo.createGroup({
        name: input.name,
        description: input.description,
        adminId: input.adminId,
    });

    if (!groupRecord) {
        throw new ConflictError('Failed to create group');
    }

    return groupRecord;
}