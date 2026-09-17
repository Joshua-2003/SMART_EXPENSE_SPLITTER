import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type { PaymentHistoryRecord, ReliabilityIndicator } from '../types';

export interface MemberPaymentHistory {
  userId: string;
  userName: string;
  paymentHistory: PaymentHistoryRecord[];
  reliabilityIndicator: ReliabilityIndicator;
}

export async function getMemberPaymentHistory(
  groupId: string,
  userId: string,
  limit?: number,
  offset?: number,
): Promise<MemberPaymentHistory> {
  const response = await apiClient.get<
    ApiResponseSuccess<MemberPaymentHistory> | ApiResponseError
  >(`/groups/${groupId}/members/${userId}/history`, {
    params: {
      limit,
      offset,
    },
  });

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}