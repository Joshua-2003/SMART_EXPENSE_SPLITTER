import { findById, findMembership } from '../repositories/group.repository.js';
import {
  getMemberPaymentHistory as getMemberPaymentHistoryRecords,
  getMemberReliabilityMetrics,
  getOverdueBalancesForGroup,
} from '../repositories/accountability.repository.js';
import { HttpError } from '../utils/http-error.js';
import type {
  GetMemberPaymentHistoryResult,
  GetMemberReliabilityResult,
  GetOverdueBalancesResult,
  ReliabilityIndicator,
  ReliabilityMetrics,
} from '../types/accountability.js';

export function deriveReliabilityIndicator(
  metrics: ReliabilityMetrics,
): ReliabilityIndicator {
  const { totalPayments, completionRate } = metrics;

  if (totalPayments === 0) {
    return 'Reliable';
  }

  if (completionRate >= 90) {
    return 'Reliable';
  }

  if (completionRate >= 50) {
    return 'At Risk';
  }

  return 'Unreliable';
}

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

  const metrics = await getMemberReliabilityMetrics(groupId, memberUserId);

  return {
    userId: memberUserId,
    userName,
    paymentHistory: history.items,
    reliabilityIndicator: deriveReliabilityIndicator(metrics),
  };
}

export async function getMemberReliability(
  groupId: string,
  memberUserId: string,
  actorUserId: string,
): Promise<GetMemberReliabilityResult> {
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

  const member = group.members.find((m) => m.userId === memberUserId);
  const name = member?.name ?? 'Member';

  const metrics = await getMemberReliabilityMetrics(groupId, memberUserId);
  const indicator = deriveReliabilityIndicator(metrics);

  return {
    userId: memberUserId,
    name,
    indicator,
    score: metrics.completionRate,
    metrics,
    calculatedAt: new Date(),
  };
}

export async function getOverdueBalances(
  groupId: string,
  actorUserId: string,
  overdueAfterDays: number,
): Promise<GetOverdueBalancesResult> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'GROUP_NOT_FOUND', 'Group not found.');
  }

  const membership = await findMembership(groupId, actorUserId);
  if (!membership) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not a member of this group.');
  }

  const overdueMembers = await getOverdueBalancesForGroup(groupId, overdueAfterDays);

  return {
    groupId,
    overdueThreshold: overdueAfterDays,
    overdueMembers,
  };
}