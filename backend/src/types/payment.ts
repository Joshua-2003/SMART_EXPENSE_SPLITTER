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

export interface GetPersonalBalanceResult {
  userId: string;
  groupId: string;
  totalOwes: number;
  totalReceives: number;
  netBalance: number;
  lastUpdated: Date;
}
