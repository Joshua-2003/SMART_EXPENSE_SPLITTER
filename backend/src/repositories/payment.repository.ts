import { and, eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import { expenseSplits, expenses, paymentHistory, payments } from '../models/index.js';
import type { MarkPaymentCompletedResult } from '../types/payment.js';

export interface SplitForPayment {
  splitId: string;
  expenseId: string;
  userId: string;
  assignedAmount: number;
}

export async function findSplitForPayment(
  groupId: string,
  expenseId: string,
  splitId: string,
): Promise<SplitForPayment | undefined> {
  const [split] = await db
    .select({
      splitId: expenseSplits.id,
      expenseId: expenseSplits.expenseId,
      userId: expenseSplits.userId,
      assignedAmount: expenseSplits.assignedAmount,
    })
    .from(expenseSplits)
    .innerJoin(expenses, eq(expenses.id, expenseSplits.expenseId))
    .where(
      and(
        eq(expenseSplits.id, splitId),
        eq(expenseSplits.expenseId, expenseId),
        eq(expenses.groupId, groupId),
      ),
    )
    .limit(1);

  if (!split) {
    return undefined;
  }

  return {
    splitId: split.splitId,
    expenseId: split.expenseId,
    userId: split.userId,
    assignedAmount: Number(split.assignedAmount),
  };
}

export async function markPaymentCompleted(
  groupId: string,
  expenseId: string,
  splitId: string,
  userId: string,
  assignedAmount: number,
): Promise<MarkPaymentCompletedResult> {
  const paidAt = new Date();

  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: payments.id })
      .from(payments)
      .where(and(eq(payments.expenseId, expenseId), eq(payments.userId, userId)))
      .limit(1);

    let paymentId: string;

    if (existing) {
      const [updated] = await tx
        .update(payments)
        .set({
          status: 'completed',
          paidAt,
        })
        .where(eq(payments.id, existing.id))
        .returning({
          id: payments.id,
          paidAt: payments.paidAt,
        });

      paymentId = updated.id;
    } else {
      const [created] = await tx
        .insert(payments)
        .values({
          expenseId,
          userId,
          amount: assignedAmount.toFixed(2),
          status: 'completed',
          paidAt,
        })
        .returning({
          id: payments.id,
          paidAt: payments.paidAt,
        });

      paymentId = created.id;
    }

    await tx.insert(paymentHistory).values({
      userId,
      groupId,
      paymentId,
      status: 'completed',
      completedAt: paidAt,
    });

    return {
      splitId,
      expenseId,
      userId,
      assignedAmount,
      status: 'completed',
      paidAt: paidAt.toISOString(),
    };
  });
}
