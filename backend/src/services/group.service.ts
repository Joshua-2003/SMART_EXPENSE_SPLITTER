import {
  addMember as repoAddMember,
  createWithAdmin,
  deleteGroup as repoDeleteGroup,
  findById,
  findMembership,
  hasOpenObligations,
  listForUser,
  listMembersWithBalances,
  removeMember as repoRemoveMember,
  update,
} from '../repositories/group.repository.js';
import { findById as findUserById, findByEmail } from '../repositories/user.repository.js';
import type {
  AddMemberInput,
  AddMemberResult,
  CreateGroupInput,
  CreateGroupResult,
  GroupDetailsResult,
  ListGroupsInput,
  ListGroupsResult,
  ListGroupMembersResult,
  UpdateGroupInput,
  UpdateGroupResult,
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

export async function updateGroup(
  actorUserId: string,
  groupId: string,
  input: UpdateGroupInput,
): Promise<UpdateGroupResult> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }

  if (group.adminId !== actorUserId) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not admin of this group');
  }

  const data: { name?: string; description?: string | null } = {};
  if (input.name !== undefined) {
    data.name = input.name.trim();
  }
  if (input.description !== undefined) {
    data.description = input.description.trim() || null;
  }

  const updated = await update(groupId, data);
  if (!updated) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }

  return updated;
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

export async function addMember(
  actorUserId: string,
  groupId: string,
  input: AddMemberInput,
): Promise<AddMemberResult> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }

  const actorMembership = await findMembership(groupId, actorUserId);
  if (!actorMembership || actorMembership.role !== 'admin') {
    throw new HttpError(403, 'FORBIDDEN', 'User is not admin of this group');
  }

  const targetUser = await findByEmail(input.email.trim());
  if (!targetUser) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'User not found with the provided email');
  }

  const existingMembership = await findMembership(groupId, targetUser.id);
  if (existingMembership) {
    throw new HttpError(409, 'CONFLICT', 'User is already a member of this group');
  }

  return repoAddMember(groupId, targetUser.id);
}

export async function removeMember(
  actorUserId: string,
  groupId: string,
  targetUserId: string,
): Promise<void> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }

  const actorMembership = await findMembership(groupId, actorUserId);
  if (!actorMembership || actorMembership.role !== 'admin') {
    throw new HttpError(403, 'FORBIDDEN', 'User is not admin of this group');
  }

  if (targetUserId === actorUserId) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Admin cannot remove themselves from the group');
  }

  const targetMembership = await findMembership(groupId, targetUserId);
  if (!targetMembership) {
    throw new HttpError(404, 'NOT_FOUND', 'Member not found in this group');
  }

  const hasObligations = await hasOpenObligations(groupId, targetUserId);
  if (hasObligations) {
    throw new HttpError(
      409,
      'CONFLICT',
      'Member has unsettled obligations in this group and cannot be removed',
    );
  }

  const removed = await repoRemoveMember(groupId, targetUserId);
  if (!removed) {
    throw new HttpError(404, 'NOT_FOUND', 'Member not found in this group');
  }
}

export async function listGroupMembers(
  actorUserId: string,
  groupId: string,
): Promise<ListGroupMembersResult> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }

  const membership = await findMembership(groupId, actorUserId);
  if (!membership) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not a member of this group');
  }

  return {
    members: await listMembersWithBalances(groupId),
  };
}

export async function deleteGroup(
  actorUserId: string,
  groupId: string,
): Promise<void> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }

  if (group.adminId !== actorUserId) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not admin of this group');
  }

  const deleted = await repoDeleteGroup(groupId);
  if (!deleted) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }
}
