import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { sendValidationError } from '@/utils/responseUtils.js';

/**
 * Validation error handler middleware
 * Checks if express-validator found any errors and returns 400 if validation failed
 * If validation passed, calls next() to proceed to controller
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Validation failed - format errors for response
    const errorMessages: Record<string, string> = {};
    errors.array().forEach((error: any) => {
      if (error.type === 'field') {
        errorMessages[error.path] = error.msg;
      }
    });

    // Send 400 Bad Request with error details
    sendValidationError(res, errorMessages);
    return;
  }

  // Validation passed - proceed to controller
  next();
}

/**
 * Signup validation middleware
 * Validates the request body for user registration
 *
 * Required fields:
 * - email: Must be a valid email, max 255 characters
 * - password: Must be at least 8 characters long
 * - name: Must be 1-255 characters, not empty
 */
export const validateSignup = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),

  // Error handler must be the last in the chain
  handleValidationErrors,
];

/**
 * Login validation middleware
 * Validates the request body for user authentication
 *
 * Required fields:
 * - email: Must be a valid email address
 * - password: Must be non-empty
 */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  // Error handler must be the last in the chain
  handleValidationErrors,
];
