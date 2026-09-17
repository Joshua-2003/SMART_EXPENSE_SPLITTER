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

export interface GroupSettlementMember {
  userId: string;
  name: string;
  totalOwes: number;
  totalReceives: number;
  pendingPayments: number;
  completedPayments: number;
}

export interface GroupSettlement {
  groupId: string;
  totalGroupExpenses: number;
  members: GroupSettlementMember[];
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

export async function getGroupSettlement(groupId: string): Promise<GroupSettlement> {
  const response = await apiClient.get<
    ApiResponseSuccess<GroupSettlement> | ApiResponseError
  >(`/groups/${groupId}/settlement`);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}
