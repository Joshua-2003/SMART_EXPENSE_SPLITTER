import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type { DashboardData } from '../types';

export async function getGroupDashboard(groupId: string): Promise<DashboardData> {
  const response = await apiClient.get<
    ApiResponseSuccess<DashboardData> | ApiResponseError
  >(`/groups/${groupId}/dashboard`);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}