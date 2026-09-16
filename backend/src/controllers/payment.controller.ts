import type { NextFunction, Request, Response } from 'express';
import { getPersonalBalance, markSplitAsPaid } from '../services/payment.service.js';
import type {
  GetPersonalBalanceResult,
  MarkPaymentCompletedInput,
  MarkPaymentCompletedResult,
} from '../types/payment.js';
import { HttpError } from '../utils/http-error.js';

export async function getGroupBalance(
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

    const result: GetPersonalBalanceResult = await getPersonalBalance(groupId, actorUserId);

    res.status(200).json({
      status: 'success',
      data: {
        userId: result.userId,
        groupId: result.groupId,
        totalOwes: Number(result.totalOwes),
        totalReceives: Number(result.totalReceives),
        netBalance: Number(result.netBalance),
        lastUpdated: result.lastUpdated.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

export async function markPaymentCompleted(
  req: Request<{ groupId: string; expenseId: string; splitId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { groupId, expenseId, splitId } = req.params;
    const actorUserId = req.user?.userId;

    if (!actorUserId) {
      throw new HttpError(401, 'UNAUTHORIZED', 'Authenticated request is missing a user.');
    }

    const input: MarkPaymentCompletedInput = req.body;

    const result: MarkPaymentCompletedResult = await markSplitAsPaid(
      groupId,
      expenseId,
      splitId,
      actorUserId,
      input,
    );

    res.status(200).json({
      status: 'success',
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}
