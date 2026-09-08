import { createWithAdmin, findById, findMembership, listForUser } from '../repositories/group.repository.js';
import { findById as findUserById } from '../repositories/user.repository.js';
import type {
  CreateGroupInput,
  CreateGroupResult,
  GroupDetailsResult,
  ListGroupsInput,
  ListGroupsResult,
} from '../types/group.js';
import { HttpError } from '../utils/http-error.js';

export async function createGroup(
  actorUserId: string,
  input: CreateGroupInput,
): Promise<CreateGroupResult> {
  const name = input.name.trim();

  const admin = await findUserById(actorUserId);
  if (!admin) {
    throw new HttpError(404, 'NOT_FOUND', 'User not found');
  }

  const description = input.description?.trim() || null;

  return createWithAdmin(name, description, actorUserId);
}

export async function getGroupDetails(
  actorUserId: string,
  groupId: string,
): Promise<GroupDetailsResult> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }

  const membership = await findMembership(groupId, actorUserId);
  if (!membership) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not a member of this group');
  }

  return group;
}

export async function listGroups(
  actorUserId: string,
  input: ListGroupsInput,
): Promise<ListGroupsResult> {
  const limit = Math.min(input.limit ?? 20, 100);
  const offset = input.offset ?? 0;

  const { items, total } = await listForUser(actorUserId, limit, offset);

  return {
    groups: items,
    total,
    limit,
    offset,
  };
}