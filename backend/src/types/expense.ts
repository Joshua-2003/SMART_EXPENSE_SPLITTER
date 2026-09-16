export type SplitType = 'equal' | 'manual';

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