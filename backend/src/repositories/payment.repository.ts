import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db/db.js';
import { expenseSplits, expenses, groupMembers, paymentHistory, payments, users } from '../models/index.js';
import type {
  GetGroupSettlementResult,
  GetPersonalBalanceResult,
  MarkPaymentCompletedResult,
} from '../types/payment.js';

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

export async function getPersonalBalanceForMember(
  groupId: string,
  userId: string,
): Promise<GetPersonalBalanceResult> {
  const [row] = await db
    .select({
      totalOwes: sql<number>`COALESCE(
        SUM(
          CASE 
            WHEN ${expenseSplits.userId} = ${userId}
              AND ${expenses.createdBy} <> ${userId}
              AND (${payments.status} IS NULL OR ${payments.status} = 'pending')
            THEN CAST(${expenseSplits.assignedAmount} AS NUMERIC)
            ELSE 0
          END
        ), 0
      )::float`,
      totalReceives: sql<number>`COALESCE(
        SUM(
          CASE 
            WHEN ${expenseSplits.userId} <> ${userId}
              AND ${expenses.createdBy} = ${userId}
              AND (${payments.status} IS NULL OR ${payments.status} = 'pending')
            THEN CAST(${expenseSplits.assignedAmount} AS NUMERIC)
            ELSE 0
          END
        ), 0
      )::float`,
      lastUpdated: sql<Date | null>`MAX(COALESCE(${payments.updatedAt}, ${expenses.createdAt}))`,
    })
    .from(expenseSplits)
    .innerJoin(expenses, eq(expenses.id, expenseSplits.expenseId))
    .leftJoin(
      payments,
      and(
        eq(payments.expenseId, expenseSplits.expenseId),
        eq(payments.userId, expenseSplits.userId),
      ),
    )
    .where(eq(expenses.groupId, groupId));

  const totalOwes = Number(row?.totalOwes ?? 0);
  const totalReceives = Number(row?.totalReceives ?? 0);
  const lastUpdated = row?.lastUpdated ?? new Date();

  return {
    userId,
    groupId,
    totalOwes,
    totalReceives,
    netBalance: totalOwes - totalReceives,
    lastUpdated,
  };
}

export async function getGroupSettlementStatus(
  groupId: string,
): Promise<GetGroupSettlementResult> {
  const [totalRow] = await db
    .select({ totalGroupExpenses: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS NUMERIC)), 0)::float` })
    .from(expenses)
    .where(eq(expenses.groupId, groupId));

  const members = await db
    .select({
      userId: users.id,
      name: users.name,
      totalOwes: sql<number>`COALESCE(
        SUM(
          CASE
            WHEN ${expenseSplits.userId} = ${users.id}
              AND ${expenses.createdBy} <> ${users.id}
              AND (${payments.status} IS NULL OR ${payments.status} = 'pending')
            THEN CAST(${expenseSplits.assignedAmount} AS NUMERIC)
            ELSE 0
          END
        ), 0
      )::float`,
      totalReceives: sql<number>`COALESCE(
        SUM(
          CASE
            WHEN ${expenseSplits.userId} <> ${users.id}
              AND ${expenses.createdBy} = ${users.id}
              AND (${payments.status} IS NULL OR ${payments.status} = 'pending')
            THEN CAST(${expenseSplits.assignedAmount} AS NUMERIC)
            ELSE 0
          END
        ), 0
      )::float`,
      pendingPayments: sql<number>`COUNT(
        CASE
          WHEN ${expenseSplits.userId} = ${users.id}
            AND ${expenses.id} IS NOT NULL
            AND (${payments.status} IS NULL OR ${payments.status} = 'pending')
          THEN 1
        END
      )::int`,
      completedPayments: sql<number>`COUNT(
        CASE
          WHEN ${expenseSplits.userId} = ${users.id}
            AND ${expenses.id} IS NOT NULL
            AND ${payments.status} = 'completed'
          THEN 1
        END
      )::int`,
    })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .leftJoin(expenseSplits, eq(expenseSplits.userId, users.id))
    .leftJoin(
      expenses,
      and(eq(expenses.id, expenseSplits.expenseId), eq(expenses.groupId, groupId)),
    )
    .leftJoin(
      payments,
      and(eq(payments.expenseId, expenseSplits.expenseId), eq(payments.userId, expenseSplits.userId)),
    )
    .where(eq(groupMembers.groupId, groupId))
    .groupBy(users.id, users.name);

  return {
    groupId,
    totalGroupExpenses: Number(totalRow?.totalGroupExpenses ?? 0),
    members: members.map((member) => ({
      userId: member.userId,
      name: member.name,
      totalOwes: Number(member.totalOwes ?? 0),
      totalReceives: Number(member.totalReceives ?? 0),
      pendingPayments: Number(member.pendingPayments ?? 0),
      completedPayments: Number(member.completedPayments ?? 0),
    })),
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
      .select({
        id: payments.id,
        status: payments.status,
        paidAt: payments.paidAt,
      })
      .from(payments)
      .where(and(eq(payments.expenseId, expenseId), eq(payments.userId, userId)))
      .limit(1);

    if (existing && existing.status === 'completed' && existing.paidAt) {
      return {
        splitId,
        expenseId,
        userId,
        assignedAmount,
        status: 'completed',
        paidAt: existing.paidAt.toISOString(),
      };
    }

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

    const [historyRow] = await tx
      .select({ id: paymentHistory.id })
      .from(paymentHistory)
      .where(
        and(
          eq(paymentHistory.paymentId, paymentId),
          eq(paymentHistory.userId, userId),
        ),
      )
      .limit(1);

    if (historyRow) {
      await tx
        .update(paymentHistory)
        .set({ status: 'completed', completedAt: paidAt })
        .where(eq(paymentHistory.id, historyRow.id));
    } else {
      await tx.insert(paymentHistory).values({
        userId,
        groupId,
        paymentId,
        status: 'completed',
        completedAt: paidAt,
      });
    }

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
