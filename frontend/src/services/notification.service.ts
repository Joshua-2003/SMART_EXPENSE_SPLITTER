import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type {
  MarkNotificationReadResult,
  NotificationsResponse,
} from '../types/notification';

export interface ListNotificationsParams {
  limit?: number;
  offset?: number;
  read?: boolean;
}

export async function getNotifications(
  params: ListNotificationsParams = {},
): Promise<NotificationsResponse> {
  const response = await apiClient.get<
    ApiResponseSuccess<NotificationsResponse> | ApiResponseError
  >('/notifications', { params });

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<MarkNotificationReadResult> {
  const response = await apiClient.patch<
    ApiResponseSuccess<MarkNotificationReadResult> | ApiResponseError
  >(`/notifications/${notificationId}`, { read: true });

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}