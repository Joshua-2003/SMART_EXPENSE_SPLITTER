import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './axios';

/**
 * Setup Request and Response Interceptors for Axios
 * - Request: Injects Bearer token from localStorage
 * - Response: Handles standard envelopes and token expiration (401)
 */
export function setupAxiosInterceptors(onUnauthorized?: () => void): void {
  // Request Interceptor
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('smart_splitter_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Clear expired credentials
        localStorage.removeItem('smart_splitter_token');
        if (onUnauthorized) {
          onUnauthorized();
        }
      }
      return Promise.reject(error);
    }
  );
}
