import { findById, findMembership } from '../repositories/group.repository.js';
import { createWithSplits, findDetailById, listForGroup } from '../repositories/expense.repository.js';
import type {
  CreateExpenseInput,
  CreateExpenseResult,
  ExpenseDetailResult,
  ListExpensesInput,
  ListExpensesResult,
} from '../types/expense.js';
import { HttpError } from '../utils/http-error.js';

function computeEqualSplits(total: number, count: number): number[] {
  const totalCents = Math.round(total * 100);
  const baseCents = Math.floor(totalCents / count);
  const remainderCents = totalCents - baseCents * count;

  return Array.from({ length: count }, (_, index) => {
    const shareCents = index === 0 ? baseCents + remainderCents : baseCents;
    return shareCents / 100;
  });
}

export async function createExpense(
  actorUserId: string,
  groupId: string,
  input: CreateExpenseInput,
): Promise<CreateExpenseResult> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }

  const membership = await findMembership(groupId, actorUserId);
  if (!membership) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not a member of this group');
  }

  if (input.splitType === 'manual') {
    throw new HttpError(
      400,
      'VALIDATION_ERROR',
      'Manual split assignment is not supported in the MVP; only equal splitting is available',
    );
  }

  const members = group.members;
  if (members.length === 0) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Group has no members to split the expense with');
  }

  if (input.memberSplits && input.memberSplits.length > 0) {
    const memberIds = new Set(members.map((member) => member.userId));
    const missingMember = input.memberSplits.find(
      (split) => !memberIds.has(split.userId),
    );
    if (missingMember) {
      throw new HttpError(404, 'NOT_FOUND', 'Member not found in this group');
    }
  }

  const description = input.description.trim();
  const memberIds = members.map((member) => member.userId);
  const assignedAmounts = computeEqualSplits(input.amount, members.length);

  return createWithSplits(
    groupId,
    description,
    input.amount,
    actorUserId,
    memberIds,
    assignedAmounts,
  );
}

export async function listGroupExpenses(
  actorUserId: string,
  groupId: string,
  input: ListExpensesInput,
): Promise<ListExpensesResult> {
  const limit = input.limit ?? 50;
  const offset = input.offset ?? 0;
  const sortBy = input.sortBy ?? 'date';

  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }

  const membership = await findMembership(groupId, actorUserId);
  if (!membership) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not a member of this group');
  }

  const { items, total } = await listForGroup(groupId, limit, offset, sortBy);

  return {
    expenses: items,
    total,
    limit,
    offset,
  };
}

export async function getExpenseDetails(
  actorUserId: string,
  groupId: string,
  expenseId: string,
): Promise<ExpenseDetailResult> {
  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  }

  const membership = await findMembership(groupId, actorUserId);
  if (!membership) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not a member of this group');
  }

  const expense = await findDetailById(groupId, expenseId);
  if (!expense) {
    throw new HttpError(404, 'NOT_FOUND', 'Group or expense not found');
  }

  return expense;
}