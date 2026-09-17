import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type {
  MemberReliability,
  OverdueMemberReport,
  PaymentHistoryRecord,
  ReliabilityIndicator,
} from '../types';

export interface MemberPaymentHistory {
  userId: string;
  userName: string;
  paymentHistory: PaymentHistoryRecord[];
  reliabilityIndicator: ReliabilityIndicator;
}

export interface GroupOverdueBalances {
  groupId: string;
  overdueThreshold: number;
  overdueMembers: OverdueMemberReport[];
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

export async function getMemberReliability(
  groupId: string,
  userId: string,
): Promise<MemberReliability> {
  const response = await apiClient.get<
    ApiResponseSuccess<MemberReliability> | ApiResponseError
  >(`/groups/${groupId}/members/${userId}/reliability`);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}

export async function getOverdueBalances(
  groupId: string,
  overdueAfterDays?: number,
): Promise<GroupOverdueBalances> {
  const response = await apiClient.get<
    ApiResponseSuccess<GroupOverdueBalances> | ApiResponseError
  >(`/groups/${groupId}/overdue`, {
    params: {
      overdueAfterDays,
    },
  });

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}