import { eq, sql } from 'drizzle-orm';
import { db } from '../db/db.js';
import { expenses, users } from '../models/index.js';
import type { DashboardRecentExpense } from '../types/dashboard.js';

export interface GroupOverview {
  expenseCount: number;
  totalExpenses: number;
  recentExpenses: DashboardRecentExpense[];
}

export async function getDashboardOverview(
  groupId: string,
  recentLimit: number,
): Promise<GroupOverview> {
  const [stats] = await db
    .select({
      expenseCount: sql<number>`COUNT(*)::int`,
      totalExpenses: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS NUMERIC)), 0)::float`,
    })
    .from(expenses)
    .where(eq(expenses.groupId, groupId));

  const recentRows = await db
    .select({
      expenseId: expenses.id,
      description: expenses.description,
      amount: expenses.amount,
      createdBy: users.name,
      createdAt: expenses.createdAt,
    })
    .from(expenses)
    .innerJoin(users, eq(users.id, expenses.createdBy))
    .where(eq(expenses.groupId, groupId))
    .orderBy(sql`${expenses.createdAt} DESC`)
    .limit(recentLimit);

  return {
    expenseCount: Number(stats?.expenseCount ?? 0),
    totalExpenses: Number(stats?.totalExpenses ?? 0),
    recentExpenses: recentRows.map((row) => ({
      expenseId: row.expenseId,
      description: row.description,
      amount: Number(row.amount),
      createdBy: row.createdBy,
      createdAt: row.createdAt,
    })),
  };
}