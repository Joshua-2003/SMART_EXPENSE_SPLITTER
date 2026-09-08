import axios, { AxiosInstance } from 'axios';

/**
 * Core Axios HTTP Client
 * Configured with environment base URL and standard headers.
 * Base URL defaults to VITE_API_BASE_URL or fallback to http://localhost:3000/api
 */
const API_BASE_URL =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ||
  '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default apiClient;
