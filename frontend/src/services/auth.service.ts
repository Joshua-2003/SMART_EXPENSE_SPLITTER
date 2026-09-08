import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type { LoginPayload, SignupPayload } from '../types/auth';

export interface SignupResult {
  userId: string;
  email: string;
  name: string;
  token: string;
  createdAt: string;
}

export interface LoginResult {
  userId: string;
  email: string;
  name: string;
  token: string;
  expiresIn: number;
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

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await apiClient.post<
    ApiResponseSuccess<LoginResult> | ApiResponseError
  >('/auth/login', payload);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}