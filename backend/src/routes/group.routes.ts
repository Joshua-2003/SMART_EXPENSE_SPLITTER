import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import type { RequestHandler } from 'express';

import { createGroup, listGroups } from '../controllers/group.controller.js';
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

export const groupRouter = Router();

groupRouter.post(
  '/',
  authenticate,
  [
    body('name')
      .isString()
      .withMessage('Group name must be a string')
      .trim()
      .notEmpty()
      .withMessage('Group name is required'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
  ],
  validate(),
  createGroup,
);

groupRouter.get(
  '/',
  authenticate,
  [
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
  listGroups,
);