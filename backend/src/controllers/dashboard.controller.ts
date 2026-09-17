import type { NextFunction, Request, Response } from 'express';
import { getGroupDashboard } from '../services/dashboard.service.js';
import type { GetGroupDashboardResult } from '../types/dashboard.js';
import { HttpError } from '../utils/http-error.js';

export async function getDashboard(
  req: Request<{ groupId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { groupId } = req.params;
    const actorUserId = req.user?.userId;

    if (!actorUserId) {
      throw new HttpError(401, 'UNAUTHORIZED', 'Authenticated request is missing a user.');
    }

    const result: GetGroupDashboardResult = await getGroupDashboard(groupId, actorUserId);

    res.status(200).json({
      status: 'success',
      data: {
        groupId: result.groupId,
        groupName: result.groupName,
        groupAdmin: result.groupAdmin,
        memberCount: result.memberCount,
        expenseCount: result.expenseCount,
        totalExpenses: Number(result.totalExpenses),
        memberBalances: result.memberBalances.map((member) => ({
          userId: member.userId,
          name: member.name,
          role: member.role,
          totalOwes: Number(member.totalOwes),
          totalReceives: Number(member.totalReceives),
          pendingPayments: Number(member.pendingPayments),
          reliabilityIndicator: member.reliabilityIndicator,
        })),
        recentExpenses: result.recentExpenses.map((expense) => ({
          expenseId: expense.expenseId,
          description: expense.description,
          amount: Number(expense.amount),
          createdBy: expense.createdBy,
          createdAt: new Date(expense.createdAt).toISOString(),
        })),
        overdueAlerts: result.overdueAlerts.map((alert) => ({
          userId: alert.userId,
          name: alert.name,
          totalOverdueAmount: Number(alert.totalOverdueAmount),
          oldestOverdue: new Date(alert.oldestOverdue).toISOString(),
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}