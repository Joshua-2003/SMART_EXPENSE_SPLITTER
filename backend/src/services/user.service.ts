import { findById, findByEmail, update } from '../repositories/user.repository.js';
import type {
  ProfileResult,
  UpdateProfileInput,
  UpdateProfileResult,
} from '../types/auth.js';
import { HttpError } from '../utils/http-error.js';

export async function getProfile(userId: string): Promise<ProfileResult> {
  const user = await findById(userId);
  if (!user) {
    throw new HttpError(404, 'NOT_FOUND', 'User not found');
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export async function updateProfile(
  actorId: string,
  targetUserId: string,
  input: UpdateProfileInput,
): Promise<UpdateProfileResult> {
  if (targetUserId !== actorId) {
    throw new HttpError(403, 'FORBIDDEN', "Cannot update another user's profile");
  }

  const hasName = input.name !== undefined;
  const hasEmail = input.email !== undefined;

  if (!hasName && !hasEmail) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Nothing to update: provide a name or email');
  }

  const fields: { name?: string; email?: string } = {};
  if (hasName) {
    fields.name = input.name!.trim();
  }
  if (hasEmail) {
    const email = input.email!.trim().toLowerCase();

    const existing = await findByEmail(email);
    if (existing && existing.id !== targetUserId) {
      throw new HttpError(409, 'EMAIL_ALREADY_EXISTS', 'Email already exists');
    }

    fields.email = email;
  }

  const user = await update(targetUserId, fields);
  if (!user) {
    throw new HttpError(404, 'NOT_FOUND', 'User not found');
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    updatedAt: user.updatedAt,
  };
}