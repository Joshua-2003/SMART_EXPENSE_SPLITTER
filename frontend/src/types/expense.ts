export type SplitType = 'equal' | 'manual';
export type PaymentStatus = 'pending' | 'completed';
export type ExpenseSortBy = 'date' | 'amount';

export interface ListExpensesParams {
  limit?: number;
  offset?: number;
  sortBy?: ExpenseSortBy;
}

export interface ExpenseSplitApiListItem {
  splitId: string;
  userId: string;
  userName: string;
  assignedAmount: number;
}

export interface ExpenseApiListItem {
  expenseId: string;
  description: string;
  amount: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  splits: ExpenseSplitApiListItem[];
}

export interface ListExpensesResult {
  expenses: Expense[];
  total: number;
  limit: number;
  offset: number;
}

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

export interface ExpenseSplitApiItem {
  splitId: string;
  userId: string;
  assignedAmount: number;
}

export interface CreateExpenseResult {
  expenseId: string;
  groupId: string;
  description: string;
  amount: number;
  createdBy: string;
  createdAt: string;
  splits: ExpenseSplitApiItem[];
}

export interface SimplifiedDebt {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}
