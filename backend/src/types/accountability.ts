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

export interface OverdueSplitItem {
  splitId: string;
  expenseId: string;
  expenseDescription: string;
  amount: number;
  createdAt: Date;
  daysOverdue: number;
}

export interface OverdueMemberItem {
  userId: string;
  name: string;
  totalOverdueAmount: number;
  overdueSplits: OverdueSplitItem[];
}

export interface GetOverdueBalancesResult {
  groupId: string;
  overdueThreshold: number;
  overdueMembers: OverdueMemberItem[];
}

export interface ReliabilityMetrics {
  totalPayments: number;
  completedOnTime: number;
  completedLate: number;
  stillPending: number;
  completionRate: number;
}

export interface GetMemberReliabilityResult {
  userId: string;
  name: string;
  indicator: ReliabilityIndicator;
  score: number;
  metrics: ReliabilityMetrics;
  calculatedAt: Date;
}