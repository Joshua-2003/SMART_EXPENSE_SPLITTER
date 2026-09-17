export interface DashboardMemberBalance {
  userId: string;
  name: string;
  role: 'admin' | 'member';
  totalOwes: number;
  totalReceives: number;
  pendingPayments: number;
  reliabilityIndicator: 'Reliable' | 'At Risk' | 'Unreliable';
}

export interface DashboardRecentExpense {
  expenseId: string;
  description: string;
  amount: number;
  createdBy: string;
  createdAt: Date;
}

export interface DashboardOverdueAlert {
  userId: string;
  name: string;
  totalOverdueAmount: number;
  oldestOverdue: Date;
}

export interface GetGroupDashboardResult {
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