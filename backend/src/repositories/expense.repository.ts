import { db } from '../db/db.js';
import { expenseSplits, expenses } from '../models/index.js';
import type { CreateExpenseResult } from '../types/expense.js';

export async function createWithSplits(
  groupId: string,
  description: string,
  amount: number,
  createdBy: string,
  memberIds: string[],
  assignedAmounts: number[],
): Promise<CreateExpenseResult> {
  return db.transaction(async (tx) => {
    const [expense] = await tx
      .insert(expenses)
      .values({
        groupId,
        description,
        amount: amount.toFixed(2),
        createdBy,
      })
      .returning();

    const splitValues = memberIds.map((userId, index) => ({
      expenseId: expense.id,
      userId,
      assignedAmount: assignedAmounts[index].toFixed(2),
    }));

    const createdSplits = await tx.insert(expenseSplits).values(splitValues).returning();

    return {
      expenseId: expense.id,
      groupId: expense.groupId,
      description: expense.description,
      amount: expense.amount,
      createdBy: expense.createdBy,
      createdAt: expense.createdAt,
      splits: createdSplits.map((split) => ({
        splitId: split.id,
        userId: split.userId,
        assignedAmount: split.assignedAmount,
      })),
    };
  });
}