import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db/db.js';
import { expenseSplits, expenses, payments, users } from '../models/index.js';
import type {
  CreateExpenseResult,
  ExpenseDetailResult,
  ExpenseListItem,
  ExpenseSortBy,
  PaymentStatus,
} from '../types/expense.js';

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

export async function listForGroup(
  groupId: string,
  limit: number,
  offset: number,
  sortBy: ExpenseSortBy,
): Promise<{ items: ExpenseListItem[]; total: number }> {
  const orderBy =
    sortBy === 'amount'
      ? sql`${expenses.amount} DESC`
      : sql`${expenses.createdAt} DESC`;

  const rows = await db
    .select({
      expenseId: expenses.id,
      description: expenses.description,
      amount: expenses.amount,
      createdBy: expenses.createdBy,
      createdByName: users.name,
      createdAt: expenses.createdAt,
    })
    .from(expenses)
    .innerJoin(users, eq(users.id, expenses.createdBy))
    .where(eq(expenses.groupId, groupId))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const [totalRow] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(expenses)
    .where(eq(expenses.groupId, groupId));

  const expenseIds = rows.map((row) => row.expenseId);

  let splitRows: {
    splitId: string;
    expenseId: string;
    userId: string;
    userName: string;
    assignedAmount: string;
  }[] = [];

  if (expenseIds.length > 0) {
    splitRows = await db
      .select({
        splitId: expenseSplits.id,
        expenseId: expenseSplits.expenseId,
        userId: expenseSplits.userId,
        userName: users.name,
        assignedAmount: expenseSplits.assignedAmount,
      })
      .from(expenseSplits)
      .innerJoin(users, eq(users.id, expenseSplits.userId))
      .where(inArray(expenseSplits.expenseId, expenseIds));
  }

  const splitsByExpense = new Map<string, typeof splitRows>();
  for (const split of splitRows) {
    const list = splitsByExpense.get(split.expenseId) ?? [];
    list.push(split);
    splitsByExpense.set(split.expenseId, list);
  }

  const items: ExpenseListItem[] = rows.map((row) => ({
    expenseId: row.expenseId,
    description: row.description,
    amount: row.amount,
    createdBy: row.createdBy,
    createdByName: row.createdByName,
    createdAt: row.createdAt,
    splits: (splitsByExpense.get(row.expenseId) ?? []).map((split) => ({
      splitId: split.splitId,
      userId: split.userId,
      userName: split.userName,
      assignedAmount: split.assignedAmount,
    })),
  }));

  return {
    items,
    total: totalRow?.total ?? 0,
  };
}

export async function findDetailById(
  groupId: string,
  expenseId: string,
): Promise<ExpenseDetailResult | undefined> {
  const [expense] = await db
    .select({
      expenseId: expenses.id,
      groupId: expenses.groupId,
      description: expenses.description,
      amount: expenses.amount,
      createdBy: expenses.createdBy,
      createdByName: users.name,
      createdAt: expenses.createdAt,
    })
    .from(expenses)
    .innerJoin(users, eq(users.id, expenses.createdBy))
    .where(and(eq(expenses.id, expenseId), eq(expenses.groupId, groupId)))
    .limit(1);

  if (!expense) {
    return undefined;
  }

  const splitRows = await db
    .select({
      splitId: expenseSplits.id,
      userId: expenseSplits.userId,
      userName: users.name,
      assignedAmount: expenseSplits.assignedAmount,
      paymentStatus: payments.status,
    })
    .from(expenseSplits)
    .innerJoin(users, eq(users.id, expenseSplits.userId))
    .leftJoin(
      payments,
      and(
        eq(payments.expenseId, expenseSplits.expenseId),
        eq(payments.userId, expenseSplits.userId),
      ),
    )
    .where(eq(expenseSplits.expenseId, expenseId));

  return {
    expenseId: expense.expenseId,
    groupId: expense.groupId,
    description: expense.description,
    amount: expense.amount,
    createdBy: expense.createdBy,
    createdByName: expense.createdByName,
    createdAt: expense.createdAt,
    splits: splitRows.map((split) => ({
      splitId: split.splitId,
      userId: split.userId,
      userName: split.userName,
      assignedAmount: split.assignedAmount,
      paymentStatus: (split.paymentStatus ?? 'pending') as PaymentStatus,
    })),
  };
}