import type { MemberRole } from './group';
import type { ReliabilityIndicator } from './accountability';

export interface DashboardMemberBalance {
  userId: string;
  name: string;
  role: MemberRole;
  totalOwes: number;
  totalReceives: number;
  pendingPayments: number;
  reliabilityIndicator: ReliabilityIndicator;
}

export interface DashboardRecentExpense {
  expenseId: string;
  description: string;
  amount: number;
  createdBy: string;
  createdAt: string;
}

export interface DashboardOverdueAlert {
  userId: string;
  name: string;
  totalOverdueAmount: number;
  oldestOverdue: string;
}

export interface DashboardData {
  groupId: string;
  groupName: string;
  groupAdmin: string;
  memberCount: number;
  expenseCount: number;
  totalExpenses: number;
  memberBalances: DashboardMemberBalance[];
  recentExpenses: DashboardRecentExpense[];
  overdueAlerts: DashboardOverdueAlert[];
}