import type { PaymentStatus } from './expense.js';

export interface MarkPaymentCompletedInput {
  status: PaymentStatus;
}

export interface MarkPaymentCompletedResult {
  splitId: string;
  expenseId: string;
  userId: string;
  assignedAmount: number;
  status: Extract<PaymentStatus, 'completed'>;
  paidAt: string;
}
