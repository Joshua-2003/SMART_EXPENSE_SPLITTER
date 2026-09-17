import type { NextFunction, Request, Response } from 'express';
import { getMemberPaymentHistory } from '../services/accountability.service.js';
import type { GetMemberPaymentHistoryResult } from '../types/accountability.js';
import { HttpError } from '../utils/http-error.js';

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