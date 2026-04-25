import { Response } from 'express';

interface SuccessResponse<T> {
  status: 'success';
  data: T;
  timestamp: string;
}

interface ErrorResponse {
  status: 'error';
  error: {
    code: number;
    message: string;
  };
  timestamp: string;
}

/**
 * Send success response
 */
export function sendSuccess<T>(res: Response, statusCode: number, data: T): Response {
  return res.status(statusCode).json({
    status: 'success',
    data,
    timestamp: new Date().toISOString(),
  } as SuccessResponse<T>);
}

/**
 * Send error response
 */
export function sendError(res: Response, statusCode: number, message: string): Response {
  return res.status(statusCode).json({
    status: 'error',
    error: {
      code: statusCode,
      message,
    },
    timestamp: new Date().toISOString(),
  } as ErrorResponse);
}

/**
 * Send validation error response
 */
export function sendValidationError(
  res: Response,
  errors: Record<string, string>
): Response {
  return res.status(400).json({
    status: 'error',
    error: {
      code: 400,
      message: 'Validation failed',
      details: errors,
    },
    timestamp: new Date().toISOString(),
  });
}
