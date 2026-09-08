import { createWithAdmin, listForUser } from '../repositories/group.repository.js';
import { findById } from '../repositories/user.repository.js';
import type {
  CreateGroupInput,
  CreateGroupResult,
  ListGroupsInput,
  ListGroupsResult,
} from '../types/group.js';
import { HttpError } from '../utils/http-error.js';

export async function createGroup(
  actorUserId: string,
  input: CreateGroupInput,
): Promise<CreateGroupResult> {
  const name = input.name.trim();

  const admin = await findById(actorUserId);
  if (!admin) {
    throw new HttpError(404, 'NOT_FOUND', 'User not found');
  }

  const description = input.description?.trim() || null;

  return createWithAdmin(name, description, actorUserId);
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