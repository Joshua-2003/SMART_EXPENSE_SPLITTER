import { createWithAdmin } from '../repositories/group.repository.js';
import { findById } from '../repositories/user.repository.js';
import type { CreateGroupInput, CreateGroupResult } from '../types/group.js';
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