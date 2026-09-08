/**
 * Accountability & Reliability Metrics Types
 * Aligned with DatabaseSchema.sql & API_CONTRACT.json
 */

export type ReliabilityIndicator = 'Reliable' | 'At Risk' | 'Unreliable';
export type NotificationType =
  | 'overdue_alert'
  | 'payment_reminder'
  | 'expense_created'
  | 'member_joined';

export interface PaymentHistoryRecord {
  paymentHistoryId: string;
  userId?: string;
  expenseId: string;
  expenseDescription: string;
  assignedAmount: number;
  status: 'completed' | 'pending' | 'overdue';
  createdAt: string;
  completedAt?: string | null;
  daysOverdue?: number | null;
}

export interface ReliabilityMetrics {
  totalPayments: number;
  completedOnTime: number;
  completedLate: number;
  stillPending: number;
  completionRate: number; // 0 - 100
  score?: number; // 0 - 100
  indicator?: ReliabilityIndicator;
}

export interface MemberReliability {
  userId: string;
  name: string;
  indicator: ReliabilityIndicator;
  score: number; // 0 - 100
  metrics: ReliabilityMetrics;
  calculatedAt: string;
}

export interface OverdueSplitItem {
  splitId: string;
  expenseId?: string;
  expenseDescription: string;
  amount: number;
  createdAt: string;
  daysOverdue: number;
  memberId?: string;
  memberName?: string;
}

export interface OverdueMemberReport {
  userId: string;
  name: string;
  totalOverdueAmount: number;
  overdueSplits: OverdueSplitItem[];
}

export interface InAppNotification {
  notificationId: string;
  type: NotificationType;
  groupId: string;
  groupName: string;
  message: string;
  read: boolean;
  createdAt: string;
}
