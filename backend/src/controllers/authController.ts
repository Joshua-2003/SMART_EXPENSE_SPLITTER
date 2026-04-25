import { Request, Response } from 'express';
import * as authService from '@/services/authService.js';
import { sendSuccess, sendError } from '@/utils/responseUtils.js';
import { ConflictError, AuthenticationError } from '@/utils/errorUtils.js';
import { AuthenticatedRequest } from '@/middlewares/authMiddleware.js';

/**
 * @param req - Express request with userId set by authMiddleware
 * @param res - Express response
 */
export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
      const userId = req.userId; // Set by authMiddleware
      const user = await authService.getUserProfile(userId!);
      sendSuccess(res, 200, user);
  } catch (error) {
      sendError(res, 500, 'Internal server error');
  }
}

/**
 * @param req - Express request
 * @param res - Express response
 */
export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body;

    // Call service layer
    const result = await authService.signup({ email, password, name });

    // Return success response (201 Created)
    sendSuccess(res, 201, result);
  } catch (error) {
    // Handle business logic errors (not validation errors)
    if (error instanceof ConflictError) {
      sendError(res, 409, 'Email already exists');
    } else {
      sendError(res, 500, 'Internal server error');
    }
  }
}

/** 
 * @param req - Express request
 * @param res - Express response
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Call service layer
    const result = await authService.login({ email, password });

    // Return success response (200 OK)
    sendSuccess(res, 200, result);
  } catch (error) {
    // Handle business logic errors
    if (error instanceof AuthenticationError) {
      sendError(res, 401, 'Invalid email or password');
    } else {
      sendError(res, 500, 'Internal server error');
    }
  }
}

/**
 * Handle token refresh (POST /api/auth/refresh)
 * NOTE: Not implemented in MVP - kept for future use
 * @param _req - Express request with Bearer token in Authorization header
 * @param res - Express response
 */
export async function refresh(_req: Request, res: Response): Promise<void> {
  sendError(res, 501, 'Token refresh is not available in MVP');
}
