import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Result, ValidationError } from 'express-validator';

import { HttpError } from '../utils/http-error.js';

interface ErrorEnvelope {
  status: 'error';
  code: string;
  message: string;
  details?: Record<string, unknown> | ValidationError[];
  timestamp: string;
}

function formatValidationErrors(errors: ValidationError[]): ErrorEnvelope {
  return {
    status: 'error',
    code: 'VALIDATION_ERROR',
    message: 'Invalid request body',
    details: errors,
    timestamp: new Date().toISOString(),
  };
}

function formatHttpError(error: HttpError): ErrorEnvelope {
  return {
    status: 'error',
    code: error.code,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
    timestamp: new Date().toISOString(),
  };
}

function formatUnexpectedError(message: string): ErrorEnvelope {
  return {
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message,
    timestamp: new Date().toISOString(),
  };
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, 'NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json(formatHttpError(err));
    return;
  }

  if (err instanceof Result) {
    res.status(400).json(formatValidationErrors(err.array()));
    return;
  }

  console.error(err);
  res.status(500).json(formatUnexpectedError('Internal server error'));
};
