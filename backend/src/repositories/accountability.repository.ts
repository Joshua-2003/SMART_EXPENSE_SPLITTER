import { and, count, eq, sql } from 'drizzle-orm';
import { db } from '../db/db.js';
import {
  expenseSplits,
  expenses,
  paymentHistory,
  payments,
  users,
} from '../models/index.js';
import type {
  OverdueMemberItem,
  PaymentHistoryItem,
  ReliabilityMetrics,
} from '../types/accountability.js';

export async function getMemberPaymentHistory(
  groupId: string,
  userId: string,
  limit: number,
  offset: number,
): Promise<{ items: PaymentHistoryItem[]; total: number }> {
  const rows = await db
    .select({
      paymentHistoryId: paymentHistory.id,
      expenseId: sql<string>`COALESCE(${expenses.id}, '')`,
      expenseDescription: sql<string>`COALESCE(${expenses.description}, '')`,
      assignedAmount: sql<string>`COALESCE(${expenseSplits.assignedAmount}, 0)`,
      status: sql<PaymentHistoryItem['status']>`CASE
        WHEN ${paymentHistory.status} = 'completed' THEN 'completed'
        ELSE 'pending'
      END`,
      createdAt: paymentHistory.createdAt,
      completedAt: paymentHistory.completedAt,
      daysOverdue: sql<number | null>`CASE
        WHEN ${paymentHistory.status} = 'completed' OR ${paymentHistory.completedAt} IS NOT NULL
          THEN NULL
        ELSE FLOOR(EXTRACT(EPOCH FROM (NOW() - ${paymentHistory.createdAt})) / 86400)::int
      END`,
    })
    .from(paymentHistory)
    .leftJoin(payments, eq(payments.id, paymentHistory.paymentId))
    .leftJoin(expenses, eq(expenses.id, payments.expenseId))
    .leftJoin(
      expenseSplits,
      and(eq(expenseSplits.expenseId, expenses.id), eq(expenseSplits.userId, paymentHistory.userId)),
    )
    .where(
      and(eq(paymentHistory.groupId, groupId), eq(paymentHistory.userId, userId)),
    )
    .orderBy(sql`${paymentHistory.createdAt} DESC`)
    .limit(limit)
    .offset(offset);

  const [totalRow] = await db
    .select({ total: count() })
    .from(paymentHistory)
    .where(
      and(eq(paymentHistory.groupId, groupId), eq(paymentHistory.userId, userId)),
    );

  return {
    items: rows.map((row) => ({
      ...row,
      assignedAmount: Number(row.assignedAmount),
    })),
    total: totalRow?.total ?? 0,
  };
}

export async function getMemberReliabilityMetrics(
  groupId: string,
  userId: string,
): Promise<ReliabilityMetrics> {
  const [row] = await db
    .select({
      totalPayments: sql<number>`COUNT(*)::int`,
      completedOnTime: sql<number>`COUNT(
        CASE
          WHEN ${payments.status} = 'completed'
            AND (${payments.paidAt} - ${expenses.createdAt}) <= INTERVAL '7 days'
          THEN 1
        END
      )::int`,
      completedLate: sql<number>`COUNT(
        CASE
          WHEN ${payments.status} = 'completed'
            AND (${payments.paidAt} - ${expenses.createdAt}) > INTERVAL '7 days'
          THEN 1
        END
      )::int`,
      stillPending: sql<number>`COUNT(
        CASE
          WHEN ${payments.status} IS NULL OR ${payments.status} <> 'completed'
          THEN 1
        END
      )::int`,
    })
    .from(expenseSplits)
    .innerJoin(expenses, eq(expenses.id, expenseSplits.expenseId))
    .leftJoin(
      payments,
      and(eq(payments.expenseId, expenseSplits.expenseId), eq(payments.userId, expenseSplits.userId)),
    )
    .where(
      and(
        eq(expenses.groupId, groupId),
        eq(expenseSplits.userId, userId),
      ),
    )
    .limit(1);

  const totalPayments = Number(row?.totalPayments ?? 0);
  const completedOnTime = Number(row?.completedOnTime ?? 0);
  const completedLate = Number(row?.completedLate ?? 0);
  const stillPending = Number(row?.stillPending ?? 0);

  return {
    totalPayments,
    completedOnTime,
    completedLate,
    stillPending,
    completionRate:
      totalPayments === 0 ? 0 : Math.round((completedOnTime / totalPayments) * 100),
  };
}

export async function getReliabilityMetricsForGroup(
  groupId: string,
): Promise<Array<{ userId: string; metrics: ReliabilityMetrics }>> {
  const rows = await db
    .select({
      userId: expenseSplits.userId,
      totalPayments: sql<number>`COUNT(*)::int`,
      completedOnTime: sql<number>`COUNT(
        CASE
          WHEN ${payments.status} = 'completed'
            AND (${payments.paidAt} - ${expenses.createdAt}) <= INTERVAL '7 days'
          THEN 1
        END
      )::int`,
      completedLate: sql<number>`COUNT(
        CASE
          WHEN ${payments.status} = 'completed'
            AND (${payments.paidAt} - ${expenses.createdAt}) > INTERVAL '7 days'
          THEN 1
        END
      )::int`,
      stillPending: sql<number>`COUNT(
        CASE
          WHEN ${payments.status} IS NULL OR ${payments.status} <> 'completed'
          THEN 1
        END
      )::int`,
    })
    .from(expenseSplits)
    .innerJoin(expenses, eq(expenses.id, expenseSplits.expenseId))
    .leftJoin(
      payments,
      and(eq(payments.expenseId, expenseSplits.expenseId), eq(payments.userId, expenseSplits.userId)),
    )
    .where(eq(expenses.groupId, groupId))
    .groupBy(expenseSplits.userId);

  return rows.map((row) => {
    const totalPayments = Number(row.totalPayments ?? 0);
    const completedOnTime = Number(row.completedOnTime ?? 0);

    return {
      userId: row.userId,
      metrics: {
        totalPayments,
        completedOnTime,
        completedLate: Number(row.completedLate ?? 0),
        stillPending: Number(row.stillPending ?? 0),
        completionRate:
          totalPayments === 0 ? 0 : Math.round((completedOnTime / totalPayments) * 100),
      },
    };
  });
}

export async function getOverdueBalancesForGroup(
  groupId: string,
  overdueAfterDays: number,
): Promise<OverdueMemberItem[]> {
  const rows = await db
    .select({
      userId: users.id,
      name: users.name,
      splitId: expenseSplits.id,
      expenseId: expenses.id,
      expenseDescription: expenses.description,
      amount: expenseSplits.assignedAmount,
      createdAt: expenses.createdAt,
      daysOverdue: sql<number>`FLOOR(EXTRACT(EPOCH FROM (NOW() - ${expenses.createdAt})) / 86400)::int`,
    })
    .from(expenseSplits)
    .innerJoin(expenses, eq(expenses.id, expenseSplits.expenseId))
    .innerJoin(users, eq(users.id, expenseSplits.userId))
    .leftJoin(
      payments,
      and(eq(payments.expenseId, expenseSplits.expenseId), eq(payments.userId, expenseSplits.userId)),
    )
    .where(
      and(
        eq(expenses.groupId, groupId),
        sql`(${payments.status} IS NULL OR ${payments.status} <> 'completed')`,
        sql`${expenses.createdAt} < NOW() - make_interval(days => ${overdueAfterDays})`,
      ),
    )
    .orderBy(users.id, expenses.createdAt);

  const grouped = new Map<string, OverdueMemberItem>();

  for (const row of rows) {
    let member = grouped.get(row.userId);

    if (!member) {
      member = {
        userId: row.userId,
        name: row.name,
        totalOverdueAmount: 0,
        overdueSplits: [],
      };
      grouped.set(row.userId, member);
    }

    const amount = Number(row.amount);

    member.totalOverdueAmount += amount;
    member.overdueSplits.push({
      splitId: row.splitId,
      expenseId: row.expenseId,
      expenseDescription: row.expenseDescription,
      amount,
      createdAt: row.createdAt,
      daysOverdue: Number(row.daysOverdue),
    });
  }

  return Array.from(grouped.values());
}