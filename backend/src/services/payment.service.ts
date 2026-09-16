import { findById, findMembership } from '../repositories/group.repository.js';
import {
  findSplitForPayment,
  markPaymentCompleted,
} from '../repositories/payment.repository.js';
import { HttpError } from '../utils/http-error.js';
import type {
  MarkPaymentCompletedInput,
  MarkPaymentCompletedResult,
} from '../types/payment.js';

export async function markSplitAsPaid(
  groupId: string,
  expenseId: string,
  splitId: string,
  actorUserId: string,
  input: MarkPaymentCompletedInput,
): Promise<MarkPaymentCompletedResult> {
  if (input.status !== 'completed') {
    throw new HttpError(
      400,
      'INVALID_STATUS',
      'Invalid status value. Only "completed" is allowed.',
    );
  }

  const group = await findById(groupId);
  if (!group) {
    throw new HttpError(404, 'GROUP_NOT_FOUND', 'Group not found.');
  }

  const membership = await findMembership(groupId, actorUserId);
  if (!membership) {
    throw new HttpError(403, 'FORBIDDEN', 'User is not a member of this group.');
  }

  const split = await findSplitForPayment(groupId, expenseId, splitId);
  if (!split) {
    throw new HttpError(404, 'PAYMENT_SPLIT_NOT_FOUND', 'Split not found.');
  }

  if (split.userId !== actorUserId && membership.role !== 'admin') {
    throw new HttpError(
      403,
      'FORBIDDEN',
      'User cannot mark a payment as completed for another member unless they are the group admin.',
    );
  }

  return markPaymentCompleted(
    groupId,
    expenseId,
    split.splitId,
    split.userId,
    split.assignedAmount,
  );
}
