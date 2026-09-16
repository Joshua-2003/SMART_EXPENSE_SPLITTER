export type SplitType = 'equal' | 'manual';
export type ExpenseSortBy = 'date' | 'amount';

export interface ExpenseMemberSplit {
  userId: string;
  amount?: number;
}

export interface CreateExpenseInput {
  description: string;
  amount: number;
  splitType: SplitType;
  memberSplits?: ExpenseMemberSplit[];
}

export interface ExpenseSplitResult {
  splitId: string;
  userId: string;
  assignedAmount: string;
}

export interface CreateExpenseResult {
  expenseId: string;
  groupId: string;
  description: string;
  amount: string;
  createdBy: string;
  createdAt: Date;
  splits: ExpenseSplitResult[];
}

export interface ListExpensesInput {
  limit?: number;
  offset?: number;
  sortBy?: ExpenseSortBy;
}

export interface ExpenseSplitListItem {
  splitId: string;
  userId: string;
  userName: string;
  assignedAmount: string;
}

export interface ExpenseListItem {
  expenseId: string;
  description: string;
  amount: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  splits: ExpenseSplitListItem[];
}

export interface ListExpensesResult {
  expenses: ExpenseListItem[];
  total: number;
  limit: number;
  offset: number;
}