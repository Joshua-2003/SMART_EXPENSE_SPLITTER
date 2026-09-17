export type ReliabilityIndicator = 'Reliable' | 'At Risk' | 'Unreliable';

export interface PaymentHistoryItem {
  paymentHistoryId: string;
  expenseId: string;
  expenseDescription: string;
  assignedAmount: number;
  status: 'completed' | 'pending';
  createdAt: Date;
  completedAt: Date | null;
  daysOverdue: number | null;
}

export interface GetMemberPaymentHistoryResult {
  userId: string;
  userName: string;
  paymentHistory: PaymentHistoryItem[];
  reliabilityIndicator: ReliabilityIndicator;
}