/**
 * Shared Type Definitions
 * 
 * Common types used throughout the application
 */

/**
 * API Response Types
 */
export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  status: 'error';
  error: {
    code: number;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

/**
 * User Types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password_hash'> {}

/**
 * Group Types
 */
export interface Group {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupWithAdmin extends Group {
  admin: User;
}

/**
 * Expense Types
 */
export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: string; // decimal as string
  createdBy: string;
  createdAt: Date;
}

export interface ExpenseWithSplits extends Expense {
  splits: ExpenseSplit[];
}

/**
 * Expense Split Types
 */
export interface ExpenseSplit {
  id: string;
  expenseId: string;
  userId: string;
  assignedAmount: string; // decimal as string
}

/**
 * Payment Types
 */
export type PaymentStatus = 'pending' | 'completed';

export interface Payment {
  id: string;
  expenseId: string;
  userId: string;
  amount: string; // decimal as string
  status: PaymentStatus;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notification Types
 */
export type NotificationType = 'overdue_alert' | 'payment_reminder' | 'expense_created';

export interface Notification {
  id: string;
  userId: string;
  groupId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
}

/**
 * Balance Types
 */
export interface Balance {
  userId: string;
  groupId: string;
  totalOwes: string; // decimal as string
  amountCreatedForOthers: string; // decimal as string
  netBalance: string; // decimal as string
}

/**
 * Pagination Types
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
