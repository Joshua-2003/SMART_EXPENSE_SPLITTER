/**
 * Standard API Envelope and Request/Response Types
 * Aligned strictly with API_CONTRACT.json
 */

export interface ApiResponseSuccess<T> {
  status: 'success';
  data: T;
  timestamp: string;
}

export interface ApiResponseError {
  status: 'error';
  code: string;
  message: string;
  details?: Record<string, unknown> | string;
  timestamp: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  data: T[];
}
