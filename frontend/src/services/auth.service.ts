import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type { SignupPayload } from '../types/auth';

export interface SignupResult {
  userId: string;
  email: string;
  name: string;
  token: string;
  createdAt: string;
}

export async function signup(payload: SignupPayload): Promise<SignupResult> {
  const response = await apiClient.post<
    ApiResponseSuccess<SignupResult> | ApiResponseError
  >('/auth/signup', payload);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}