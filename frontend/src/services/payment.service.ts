import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';

export interface MarkSplitAsPaidResult {
  splitId: string;
  expenseId: string;
  groupId: string;
  userId: string;
  assignedAmount: number;
  status: 'completed';
  paidAt: string;
}

export async function markSplitAsPaid(
  groupId: string,
  expenseId: string,
  splitId: string,
): Promise<MarkSplitAsPaidResult> {
  const response = await apiClient.patch<
    ApiResponseSuccess<MarkSplitAsPaidResult> | ApiResponseError
  >(`/groups/${groupId}/expenses/${expenseId}/splits/${splitId}/payment`, {
    status: 'completed',
  });

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}
