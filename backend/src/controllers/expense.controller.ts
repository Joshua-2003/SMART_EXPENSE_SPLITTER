import type { NextFunction, Request, Response } from 'express';

import * as expenseService from '../services/expense.service.js';

export async function createExpense(
  req: Request<{ groupId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actorId = req.user?.userId;
    if (!actorId) {
      throw new Error('Authenticated request is missing a user');
    }

    const result = await expenseService.createExpense(actorId, req.params.groupId, {
      description: req.body.description,
      amount: req.body.amount,
      splitType: req.body.splitType,
      memberSplits: req.body.memberSplits,
    });

    res.status(201).json({
      status: 'success',
      data: {
        expenseId: result.expenseId,
        groupId: result.groupId,
        description: result.description,
        amount: Number(result.amount),
        createdBy: result.createdBy,
        createdAt: result.createdAt.toISOString(),
        splits: result.splits.map((split) => ({
          splitId: split.splitId,
          userId: split.userId,
          assignedAmount: Number(split.assignedAmount),
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}