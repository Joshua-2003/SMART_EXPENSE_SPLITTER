import { findById, findMembership } from '../repositories/group.repository.js';
import { getGroupSettlementStatus } from '../repositories/payment.repository.js';
import { getDashboardOverview } from '../repositories/dashboard.repository.js';
import {
  getOverdueBalancesForGroup,
  getReliabilityMetricsForGroup,
} from '../repositories/accountability.repository.js';
import { deriveReliabilityIndicator } from './accountability.service.js';
import { HttpError } from '../utils/http-error.js';
import type {
  DashboardOverdueAlert,
  GetGroupDashboardResult,
} from '../types/dashboard.js';

const RECENT_EXPENSE_LIMIT = 5;
const DEFAULT_OVERDUE_DAYS = 7;

export async function getGroupDashboard(
  groupId: string,
  actorUserId: string,
): Promise<GetGroupDashboardResult> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'GROUP_NOT_FOUND', 'Group not found.');
  }

  const membership = await findMembership(groupId, actorUserId);
  if (!membership) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not a member of this group.');
  }

  const overview = await getDashboardOverview(groupId, RECENT_EXPENSE_LIMIT);
  const settlement = await getGroupSettlementStatus(groupId);
  const reliabilityRows = await getReliabilityMetricsForGroup(groupId);
  const overdueRows = await getOverdueBalancesForGroup(groupId, DEFAULT_OVERDUE_DAYS);

  const reliabilityByUser = new Map(
    reliabilityRows.map((row) => [row.userId, deriveReliabilityIndicator(row.metrics)]),
  );
  const settlementByUser = new Map(settlement.members.map((member) => [member.userId, member]));

  const adminMember = group.members.find((member) => member.role === 'admin');

  const memberBalances = group.members.map((member) => {
    const balance = settlementByUser.get(member.userId);

    return {
      userId: member.userId,
      name: member.name,
      role: member.role,
      totalOwes: balance?.totalOwes ?? 0,
      totalReceives: balance?.totalReceives ?? 0,
      pendingPayments: balance?.pendingPayments ?? 0,
      reliabilityIndicator:
        reliabilityByUser.get(member.userId) ??
        ('Reliable' as const),
    };
  });

  const overdueAlerts: DashboardOverdueAlert[] = overdueRows.map((member) => {
    const oldestTimestamp = member.overdueSplits.reduce<number | null>((oldest, split) => {
      const ts = new Date(split.createdAt).getTime();
      return oldest === null || ts < oldest ? ts : oldest;
    }, null);

    return {
      userId: member.userId,
      name: member.name,
      totalOverdueAmount: member.totalOverdueAmount,
      oldestOverdue: oldestTimestamp === null ? new Date() : new Date(oldestTimestamp),
    };
  });

  return {
    groupId,
    groupName: group.name,
    groupAdmin: adminMember?.name ?? 'Group Admin',
    memberCount: group.members.length,
    expenseCount: overview.expenseCount,
    totalExpenses: overview.totalExpenses,
    memberBalances,
    recentExpenses: overview.recentExpenses,
    overdueAlerts,
  };
}