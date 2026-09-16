import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type { CreateExpensePayload, CreateExpenseResult } from '../types/expense';

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