import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type { ProfileResult, UpdateProfilePayload, UpdateProfileResult } from '../types/auth';

export async function getProfile(): Promise<ProfileResult> {
  const response = await apiClient.get<ApiResponseSuccess<ProfileResult> | ApiResponseError>(
    '/users/me'
  );

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}

export async function updateProfile(
  userId: string,
  payload: UpdateProfilePayload
): Promise<UpdateProfileResult> {
  const response = await apiClient.patch<
    ApiResponseSuccess<UpdateProfileResult> | ApiResponseError
  >(`/users/${userId}`, payload);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}