import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import type { RequestHandler } from 'express';

import {
  getNotifications,
  markNotificationAsRead,
} from '../controllers/notification.controller.js';
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

export const notificationRouter = Router();

notificationRouter.get(
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
    query('read')
      .optional()
      .isBoolean()
      .withMessage('read must be a boolean'),
  ],
  validate(),
  getNotifications,
);

notificationRouter.patch(
  '/:notificationId',
  authenticate,
  [
    param('notificationId').isUUID().withMessage('Invalid notification id'),
    body('read')
      .isBoolean()
      .withMessage('read must be a boolean')
      .custom((value) => value === true)
      .withMessage('read must be true'),
  ],
  validate(),
  markNotificationAsRead,
);