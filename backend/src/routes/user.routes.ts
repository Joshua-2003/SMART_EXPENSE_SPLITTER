import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import type { RequestHandler } from 'express';

import { getProfile, listUsers, updateProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { HttpError } from '../utils/http-error.js';

const validate = (): RequestHandler => (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0]?.msg ?? 'Invalid request body';
    next(new HttpError(400, 'VALIDATION_ERROR', message));
    return;
  }
  next();
};

export const userRouter = Router();

userRouter.get('/me', authenticate, getProfile);

userRouter.get(
  '/',
  authenticate,
  [
    query('q')
      .optional()
      .isString()
      .withMessage('Search query must be a string')
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search query must be at most 100 characters'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be an integer between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a non-negative integer'),
  ],
  validate(),
  listUsers,
);

userRouter.patch(
  '/:userId',
  authenticate,
  [
    param('userId').isUUID().withMessage('Invalid user id'),
    body('name')
      .optional()
      .isString()
      .withMessage('Name must be a string')
      .trim()
      .notEmpty()
      .withMessage('Name must not be empty'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail()
      .toLowerCase(),
  ],
  validate(),
  updateProfile,
);