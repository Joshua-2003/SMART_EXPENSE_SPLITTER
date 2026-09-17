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
  ReliabilityIndicator,
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

export async function getMemberReliability(
  groupId: string,
  userId: string,
): Promise<ReliabilityIndicator> {
  const [row] = await db
    .select({
      total: sql<number>`COUNT(*)::int`,
      completed: sql<number>`COUNT(
        CASE WHEN ${payments.status} = 'completed' THEN 1 END
      )::int`,
      overdue: sql<number>`COUNT(
        CASE
          WHEN (${payments.status} IS NULL OR ${payments.status} <> 'completed')
            AND ${expenses.createdAt} < (NOW() - INTERVAL '7 days')
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

  const total = Number(row?.total ?? 0);
  const completed = Number(row?.completed ?? 0);
  const overdue = Number(row?.overdue ?? 0);

  if (total === 0 || overdue === 0) {
    return 'Reliable';
  }

  if (overdue >= 3) {
    return 'Unreliable';
  }

  if (completed === 0) {
    return 'Unreliable';
  }

  return 'At Risk';
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