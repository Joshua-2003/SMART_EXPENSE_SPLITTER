import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import type { RequestHandler } from 'express';

import {
  addMember,
  createGroup,
  getGroupDetails,
  listGroups,
  removeMember,
  updateGroup,
} from '../controllers/group.controller.js';
import { createExpense, getExpenseDetails, listExpenses } from '../controllers/expense.controller.js';
import { getGroupBalance, getGroupSettlement, markPaymentCompleted } from '../controllers/payment.controller.js';
import { getMemberHistory, getMemberReliabilityHandler, getOverdueBalancesHandler } from '../controllers/accountability.controller.js';
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

groupRouter.get(
  '/:groupId',
  authenticate,
  [param('groupId').isUUID().withMessage('Invalid group id')],
  validate(),
  getGroupDetails,
);

groupRouter.patch(
  '/:groupId',
  authenticate,
  [
    param('groupId').isUUID().withMessage('Invalid group id'),
    body('name')
      .optional()
      .isString()
      .withMessage('Name must be a string')
      .trim()
      .notEmpty()
      .withMessage('Name must not be empty'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body()
      .custom((_value, { req }) => {
        const body = (req.body ?? {}) as Record<string, unknown>;
        return body.name !== undefined || body.description !== undefined;
      })
      .withMessage('Invalid update payload'),
  ],
  validate(),
  updateGroup,
);

groupRouter.post(
  '/:groupId/members',
  authenticate,
  [
    param('groupId').isUUID().withMessage('Invalid group id'),
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
  ],
  validate(),
  addMember,
);

groupRouter.delete(
  '/:groupId/members/:userId',
  authenticate,
  [
    param('groupId').isUUID().withMessage('Invalid group id'),
    param('userId').isUUID().withMessage('Invalid user id'),
  ],
  validate(),
  removeMember,
);

groupRouter.get(
  '/:groupId/members/:userId/history',
  authenticate,
  [
    param('groupId').isUUID().withMessage('Invalid group id'),
    param('userId').isUUID().withMessage('Invalid user id'),
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
  getMemberHistory,
);

groupRouter.get(
  '/:groupId/members/:userId/reliability',
  authenticate,
  [
    param('groupId').isUUID().withMessage('Invalid group id'),
    param('userId').isUUID().withMessage('Invalid user id'),
  ],
  validate(),
  getMemberReliabilityHandler,
);

groupRouter.post(
  '/:groupId/expenses',
  authenticate,
  [
    param('groupId').isUUID().withMessage('Invalid group id'),
    body('description')
      .isString()
      .withMessage('Description must be a string')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 255 })
      .withMessage('Description must be at most 255 characters'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be a positive decimal number'),
    body('splitType')
      .isString()
      .withMessage('splitType must be a string')
      .isIn(['equal', 'manual'])
      .withMessage('splitType must be either "equal" or "manual"'),
    body('memberSplits')
      .optional()
      .isArray()
      .withMessage('memberSplits must be an array'),
    body('memberSplits.*.userId')
      .optional()
      .isUUID()
      .withMessage('Invalid member user id'),
    body('memberSplits.*.amount')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Member split amount must be a positive decimal number'),
  ],
  validate(),
  createExpense,
);

groupRouter.get(
  '/:groupId/expenses',
  authenticate,
  [
    param('groupId').isUUID().withMessage('Invalid group id'),
    query('limit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Limit must be a positive integer'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a non-negative integer'),
    query('sortBy')
      .optional()
      .isIn(['date', 'amount'])
      .withMessage('sortBy must be either "date" or "amount"'),
  ],
  validate(),
  listExpenses,
);

groupRouter.get(
  '/:groupId/balance',
  authenticate,
  [param('groupId').isUUID().withMessage('Invalid group id')],
  validate(),
  getGroupBalance,
);

groupRouter.get(
  '/:groupId/settlement',
  authenticate,
  [param('groupId').isUUID().withMessage('Invalid group id')],
  validate(),
  getGroupSettlement,
);

groupRouter.get(
  '/:groupId/overdue',
  authenticate,
  [
    param('groupId').isUUID().withMessage('Invalid group id'),
    query('overdueAfterDays')
      .optional()
      .isInt({ min: 1 })
      .withMessage('overdueAfterDays must be a positive integer'),
  ],
  validate(),
  getOverdueBalancesHandler,
);

groupRouter.get(
  '/:groupId/expenses/:expenseId',
  authenticate,
  [
    param('groupId').isUUID().withMessage('Invalid group id'),
    param('expenseId').isUUID().withMessage('Invalid expense id'),
  ],
  validate(),
  getExpenseDetails,
);

groupRouter.patch(
  '/:groupId/expenses/:expenseId/splits/:splitId/payment',
  authenticate,
  [
    param('groupId').isUUID().withMessage('Invalid group id'),
    param('expenseId').isUUID().withMessage('Invalid expense id'),
    param('splitId').isUUID().withMessage('Invalid split id'),
    body('status')
      .isString()
      .withMessage('Status must be a string')
      .isIn(['completed'])
      .withMessage('Status must be "completed"'),
  ],
  validate(),
  markPaymentCompleted,
);