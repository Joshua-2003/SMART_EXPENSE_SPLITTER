import type { NextFunction, Request, Response } from 'express';

import * as expenseService from '../services/expense.service.js';
import type { ExpenseSortBy } from '../types/expense.js';

export async function getExpenseDetails(
  req: Request<{ groupId: string; expenseId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actorId = req.user?.userId;
    if (!actorId) {
      throw new Error('Authenticated request is missing a user');
    }

    const expense = await expenseService.getExpenseDetails(
      actorId,
      req.params.groupId,
      req.params.expenseId,
    );

    res.status(200).json({
      status: 'success',
      data: {
        expenseId: expense.expenseId,
        groupId: expense.groupId,
        description: expense.description,
        amount: Number(expense.amount),
        createdBy: expense.createdBy,
        createdByName: expense.createdByName,
        createdAt: expense.createdAt.toISOString(),
        splits: expense.splits.map((split) => ({
          splitId: split.splitId,
          userId: split.userId,
          userName: split.userName,
          assignedAmount: Number(split.assignedAmount),
          paymentStatus: split.paymentStatus,
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

export async function listExpenses(
  req: Request<{ groupId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actorId = req.user?.userId;
    if (!actorId) {
      throw new Error('Authenticated request is missing a user');
    }

    const result = await expenseService.listGroupExpenses(actorId, req.params.groupId, {
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      offset: req.query.offset ? Number(req.query.offset) : undefined,
      sortBy: (req.query.sortBy as ExpenseSortBy | undefined) ?? undefined,
    });

    res.status(200).json({
      status: 'success',
      data: {
        expenses: result.expenses.map((expense) => ({
          expenseId: expense.expenseId,
          description: expense.description,
          amount: Number(expense.amount),
          createdBy: expense.createdBy,
          createdByName: expense.createdByName,
          createdAt: expense.createdAt.toISOString(),
          splits: expense.splits.map((split) => ({
            splitId: split.splitId,
            userId: split.userId,
            userName: split.userName,
            assignedAmount: Number(split.assignedAmount),
          })),
        })),
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

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