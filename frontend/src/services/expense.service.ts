import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type {
  CreateExpensePayload,
  CreateExpenseResult,
  Expense,
  ExpenseApiDetailItem,
  ExpenseApiListItem,
  ExpenseSortBy,
  ListExpensesResult,
} from '../types/expense';

export async function createExpense(
  groupId: string,
  payload: CreateExpensePayload,
): Promise<CreateExpenseResult> {
  const response = await apiClient.post<
    ApiResponseSuccess<CreateExpenseResult> | ApiResponseError
  >(`/groups/${groupId}/expenses`, payload);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}

export interface ListExpensesParams {
  limit?: number;
  offset?: number;
  sortBy?: ExpenseSortBy;
}

interface ListExpensesResponseData {
  expenses: ExpenseApiListItem[];
  total: number;
  limit: number;
  offset: number;
}

export async function listGroupExpenses(
  groupId: string,
  params: ListExpensesParams = {},
): Promise<ListExpensesResult> {
  const response = await apiClient.get<
    ApiResponseSuccess<ListExpensesResponseData> | ApiResponseError
  >(`/groups/${groupId}/expenses`, { params });

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return {
    expenses: body.data.expenses.map(
      (item): Expense => ({
        id: item.expenseId,
        groupId,
        description: item.description,
        amount: item.amount,
        createdBy: item.createdBy,
        createdByName: item.createdByName,
        createdAt: item.createdAt,
        splits: item.splits.map((split) => ({
          splitId: split.splitId,
          userId: split.userId,
          userName: split.userName,
          assignedAmount: split.assignedAmount,
        })),
      }),
    ),
    total: body.data.total,
    limit: body.data.limit,
    offset: body.data.offset,
  };
}

export async function getExpenseDetails(
  groupId: string,
  expenseId: string,
): Promise<Expense> {
  const response = await apiClient.get<
    ApiResponseSuccess<ExpenseApiDetailItem> | ApiResponseError
  >(`/groups/${groupId}/expenses/${expenseId}`);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  const item = body.data;

  return {
    id: item.expenseId,
    groupId: item.groupId,
    description: item.description,
    amount: item.amount,
    createdBy: item.createdBy,
    createdByName: item.createdByName,
    createdAt: item.createdAt,
    splits: item.splits.map((split) => ({
      splitId: split.splitId,
      userId: split.userId,
      userName: split.userName,
      assignedAmount: split.assignedAmount,
      paymentStatus: split.paymentStatus,
      status: split.paymentStatus,
    })),
  };
}