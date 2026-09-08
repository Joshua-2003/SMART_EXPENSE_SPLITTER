import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import type { RequestHandler } from 'express';

import { getProfile, updateProfile } from '../controllers/user.controller.js';
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