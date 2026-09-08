import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type { CreateGroupPayload, CreateGroupResult } from '../types/group';

export async function createGroup(payload: CreateGroupPayload): Promise<CreateGroupResult> {
  const response = await apiClient.post<
    ApiResponseSuccess<CreateGroupResult> | ApiResponseError
  >('/groups', payload);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}