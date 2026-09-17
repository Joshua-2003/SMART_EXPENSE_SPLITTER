import type { NextFunction, Request, Response } from 'express';
import {
  getMemberPaymentHistory,
  getMemberReliability,
  getOverdueBalances,
} from '../services/accountability.service.js';
import type {
  GetMemberPaymentHistoryResult,
  GetMemberReliabilityResult,
  GetOverdueBalancesResult,
} from '../types/accountability.js';
import { HttpError } from '../utils/http-error.js';

export async function getMemberReliabilityHandler(
  req: Request<{ groupId: string; userId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { groupId, userId } = req.params;
    const actorUserId = req.user?.userId;

    if (!actorUserId) {
      throw new HttpError(401, 'UNAUTHORIZED', 'Authenticated request is missing a user.');
    }

    const result: GetMemberReliabilityResult = await getMemberReliability(
      groupId,
      userId,
      actorUserId,
    );

    res.status(200).json({
      status: 'success',
      data: {
        userId: result.userId,
        name: result.name,
        indicator: result.indicator,
        score: result.score,
        metrics: {
          totalPayments: result.metrics.totalPayments,
          completedOnTime: result.metrics.completedOnTime,
          completedLate: result.metrics.completedLate,
          stillPending: result.metrics.stillPending,
          completionRate: result.metrics.completionRate,
        },
        calculatedAt: result.calculatedAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

export async function getOverdueBalancesHandler(
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

    const overdueAfterDays = req.query.overdueAfterDays ? Number(req.query.overdueAfterDays) : 7;

    const result: GetOverdueBalancesResult = await getOverdueBalances(
      groupId,
      actorUserId,
      overdueAfterDays,
    );

    res.status(200).json({
      status: 'success',
      data: {
        groupId: result.groupId,
        overdueThreshold: result.overdueThreshold,
        overdueMembers: result.overdueMembers.map((member) => ({
          userId: member.userId,
          name: member.name,
          totalOverdueAmount: Number(member.totalOverdueAmount),
          overdueSplits: member.overdueSplits.map((split) => ({
            splitId: split.splitId,
            expenseId: split.expenseId,
            expenseDescription: split.expenseDescription,
            amount: Number(split.amount),
            createdAt: new Date(split.createdAt).toISOString(),
            daysOverdue: split.daysOverdue,
          })),
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

export async function getMemberHistory(
  req: Request<{ groupId: string; userId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { groupId, userId } = req.params;
    const actorUserId = req.user?.userId;

    if (!actorUserId) {
      throw new HttpError(401, 'UNAUTHORIZED', 'Authenticated request is missing a user.');
    }

    const limit = req.query.limit ? Number(req.query.limit) : 30;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    const result: GetMemberPaymentHistoryResult = await getMemberPaymentHistory(
      groupId,
      userId,
      actorUserId,
      limit,
      offset,
    );

    res.status(200).json({
      status: 'success',
      data: {
        userId: result.userId,
        userName: result.userName,
        paymentHistory: result.paymentHistory.map((item) => ({
          paymentHistoryId: item.paymentHistoryId,
          expenseId: item.expenseId,
          expenseDescription: item.expenseDescription,
          assignedAmount: Number(item.assignedAmount),
          status: item.status,
          createdAt: new Date(item.createdAt).toISOString(),
          completedAt: item.completedAt ? new Date(item.completedAt).toISOString() : null,
          daysOverdue: item.daysOverdue,
        })),
        reliabilityIndicator: result.reliabilityIndicator,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}