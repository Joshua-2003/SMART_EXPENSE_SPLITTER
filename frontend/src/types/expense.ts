export type SplitType = 'equal' | 'manual';
export type PaymentStatus = 'pending' | 'completed';

export interface ExpenseSplit {
  splitId: string;
  expenseId?: string;
  userId: string;
  userName: string;
  userEmail?: string;
  assignedAmount: number;
  paymentStatus?: PaymentStatus;
  status?: PaymentStatus;
  paidAt?: string | null;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  category?: string;
  splits: ExpenseSplit[];
}

export interface CreateExpensePayload {
  description: string;
  amount: number;
  splitType: SplitType;
  memberSplits?: Array<{
    userId: string;
    amount?: number;
  }>;
}

export interface SimplifiedDebt {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}
