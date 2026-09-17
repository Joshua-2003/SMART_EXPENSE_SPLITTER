import { findById, findMembership } from '../repositories/group.repository.js';
import {
  getMemberPaymentHistory as getMemberPaymentHistoryRecords,
  getMemberReliability,
} from '../repositories/accountability.repository.js';
import { HttpError } from '../utils/http-error.js';
import type { GetMemberPaymentHistoryResult } from '../types/accountability.js';

export async function getMemberPaymentHistory(
  groupId: string,
  memberUserId: string,
  actorUserId: string,
  limit: number,
  offset: number,
): Promise<GetMemberPaymentHistoryResult> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'GROUP_NOT_FOUND', 'Group not found.');
  }

  const actorMembership = await findMembership(groupId, actorUserId);
  if (!actorMembership) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not a member of this group.');
  }

  const memberMembership = await findMembership(groupId, memberUserId);
  if (!memberMembership) {
    throw new HttpError(404, 'MEMBER_NOT_FOUND', 'Group or member not found.');
  }

  if (actorUserId !== memberUserId && actorMembership.role !== 'admin') {
    throw new HttpError(
      403,
      'FORBIDDEN',
      'User is not admin or member viewing own history.',
    );
  }

  const member = group.members.find((m) => m.userId === memberUserId);
  const userName = member?.name ?? 'Member';

  const history = await getMemberPaymentHistoryRecords(
    groupId,
    memberUserId,
    limit,
    offset,
  );

  const reliabilityIndicator = await getMemberReliability(groupId, memberUserId);

  return {
    userId: memberUserId,
    userName,
    paymentHistory: history.items,
    reliabilityIndicator,
  };
}