import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import { login, signup } from '../controllers/auth.controller.js';
import { HttpError } from '../utils/http-error.js';
import type { RequestHandler } from 'express';

const validate = (): RequestHandler => (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0]?.msg ?? 'Invalid request body';
    next(new HttpError(400, 'VALIDATION_ERROR', message));
    return;
  }
  next();
};

export const authRouter = Router();

authRouter.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail()
      .toLowerCase(),
    body('password')
      .isString()
      .withMessage('Password must be a string')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  validate(),
  login,
);

authRouter.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail()
      .toLowerCase(),
    body('password')
      .isString()
      .withMessage('Password must be a string')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('name')
      .isString()
      .withMessage('Name must be a string')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
  ],
  validate(),
  signup,
);
