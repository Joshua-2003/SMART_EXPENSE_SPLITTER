import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  User,
  Group,
  GroupMember,
  Expense,
  ExpenseSplit,
  NotificationItem,
  PaymentHistoryItem,
  ReliabilityMetrics,
  SimplifiedDebt,
  OverdueSplitItem,
} from '../types';
import { mockUsers, defaultCurrentUser } from '../mock/users';
import { mockGroups, mockGroupMembers } from '../mock/groups';
import { mockExpenses } from '../mock/expenses';
import { mockMemberHistory, mockMemberReliability } from '../mock/history';
import { mockNotifications } from '../mock/notifications';
import { ToastMessage, ToastContainer } from '../components/common/Toast';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
  currentGroup: Group;
  setCurrentGroup: (group: Group) => void;
  groups: Group[];
  members: GroupMember[];
  expenses: Expense[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  isLoading: boolean;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Group actions
  createGroup: (name: string, description?: string) => Promise<Group>;
  updateGroup: (groupId: string, name: string, description?: string) => Promise<void>;

  // Member actions
  addMemberToGroup: (email: string) => Promise<void>;
  removeMemberFromGroup: (userId: string) => Promise<void>;

  // Expense actions
  createExpense: (
    description: string,
    amount: number,
    splitType: 'equal' | 'manual',
    memberSplits?: { userId: string; amount: number }[]
  ) => Promise<Expense>;

  // Settlement & Payment actions
  markSplitPaid: (expenseId: string, splitId: string, userId: string) => Promise<void>;

  // Accountability & Reminder actions
  sendGentleReminder: (userId: string, expenseDescription?: string, amount?: number) => void;
  getMemberHistory: (userId: string) => PaymentHistoryItem[];
  getMemberReliability: (userId: string) => ReliabilityMetrics;
  getOverdueSplits: (overdueDaysThreshold?: number) => OverdueSplitItem[];
  getSimplifiedDebts: () => SimplifiedDebt[];

  // Notification actions
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;

  // Active user group context
  isCurrentUserAdmin: boolean;
  currentUserBalance: number; // positive = owes, negative = receives
  totalGroupExpenses: number;
  totalGroupPendingAmount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(defaultCurrentUser);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [currentGroupId, setCurrentGroupId] = useState<string>(mockGroups[0].id);
  const [groupMembersMap, setGroupMembersMap] = useState<Record<string, GroupMember[]>>(mockGroupMembers);
  const [expensesMap, setExpensesMap] = useState<Record<string, Expense[]>>(mockExpenses);
  const [historyMap, setHistoryMap] = useState<Record<string, PaymentHistoryItem[]>>(mockMemberHistory);
  const [reliabilityMap, setReliabilityMap] = useState<Record<string, ReliabilityMetrics>>(mockMemberReliability);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentGroup = useMemo(() => {
    return groups.find((g) => g.id === currentGroupId) || groups[0];
  }, [groups, currentGroupId]);

  const members = useMemo(() => {
    return groupMembersMap[currentGroup.id] || [];
  }, [groupMembersMap, currentGroup.id]);

  const expenses = useMemo(() => {
    return expensesMap[currentGroup.id] || [];
  }, [expensesMap, currentGroup.id]);

  const isCurrentUserAdmin = useMemo(() => {
    return currentGroup.adminId === currentUser.id;
  }, [currentGroup, currentUser]);

  const currentUserBalance = useMemo(() => {
    const m = members.find((mem) => mem.userId === currentUser.id);
    return m ? m.balance : 0;
  }, [members, currentUser]);

  const totalGroupExpenses = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const totalGroupPendingAmount = useMemo(() => {
    let pending = 0;
    expenses.forEach((exp) => {
      exp.splits.forEach((s) => {
        if (s.status === 'pending') {
          pending += s.assignedAmount;
        }
      });
    });
    return pending;
  }, [expenses]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Recalculate balances for a group
  const recalculateGroupBalances = (
    groupId: string,
    currentExpenses: Expense[],
    currentMembers: GroupMember[]
  ): GroupMember[] => {
    return currentMembers.map((m) => {
      let owes = 0;
      let paidForOthers = 0;

      currentExpenses.forEach((exp) => {
        // If this member paid for the expense originally, they are owed by other pending splits
        if (exp.createdBy === m.userId) {
          exp.splits.forEach((s) => {
            if (s.userId !== m.userId && s.status === 'pending') {
              paidForOthers += s.assignedAmount;
            }
          });
        }
        // If this member owes a split that is pending
        exp.splits.forEach((s) => {
          if (s.userId === m.userId && s.status === 'pending' && exp.createdBy !== m.userId) {
            owes += s.assignedAmount;
          }
        });
      });

      const netBalance = owes - paidForOthers;
      return {
        ...m,
        balance: Math.round(netBalance * 100) / 100,
      };
    });
  };

  // -------------------------------------------------------------
  // GROUP ACTIONS
  // -------------------------------------------------------------

  // API_INTEGRATION_POINT: POST /api/groups
  const createGroup = async (name: string, description?: string): Promise<Group> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // Simulate API network latency

    const newGroup: Group = {
      id: `grp-${Date.now().toString(36)}`,
      name: name.trim(),
      description: description?.trim() || '',
      adminId: currentUser.id,
      memberCount: 1,
      createdAt: new Date().toISOString(),
      currencySymbol: '₱',
    };

    const adminMember: GroupMember = {
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: 'admin',
      balance: 0,
      joinedAt: new Date().toISOString(),
      avatarUrl: currentUser.avatarUrl,
    };

    setGroups((prev) => [newGroup, ...prev]);
    setGroupMembersMap((prev) => ({
      ...prev,
      [newGroup.id]: [adminMember],
    }));
    setExpensesMap((prev) => ({
      ...prev,
      [newGroup.id]: [],
    }));
    setCurrentGroupId(newGroup.id);
    setIsLoading(false);

    addToast({
      type: 'success',
      title: 'Group Created',
      message: `Group "${name}" has been successfully created.`,
    });

    return newGroup;
  };

  // API_INTEGRATION_POINT: PATCH /api/groups/{groupId}
  const updateGroup = async (groupId: string, name: string, description?: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, name: name.trim(), description: description?.trim() || '' }
          : g
      )
    );
    setIsLoading(false);

    addToast({
      type: 'success',
      title: 'Group Updated',
      message: 'Group settings were saved.',
    });
  };

  // -------------------------------------------------------------
  // MEMBER ACTIONS
  // -------------------------------------------------------------

  // API_INTEGRATION_POINT: POST /api/groups/{groupId}/members
  const addMemberToGroup = async (email: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 350));

    const cleanEmail = email.trim().toLowerCase();
    const existing = members.find((m) => m.email.toLowerCase() === cleanEmail);
    if (existing) {
      setIsLoading(false);
      addToast({
        type: 'error',
        title: 'Already a Member',
        message: `${cleanEmail} is already part of this group.`,
      });
      return;
    }

    // Match with registered users or create placeholder
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    const newMemberId = foundUser ? foundUser.id : `user-${Date.now().toString(36)}`;
    const newMemberName = foundUser ? foundUser.name : cleanEmail.split('@')[0];

    const newMember: GroupMember = {
      userId: newMemberId,
      name: newMemberName,
      email: cleanEmail,
      role: 'member',
      balance: 0,
      joinedAt: new Date().toISOString(),
      avatarUrl: foundUser?.avatarUrl,
    };

    setGroupMembersMap((prev) => ({
      ...prev,
      [currentGroup.id]: [...(prev[currentGroup.id] || []), newMember],
    }));

    setGroups((prev) =>
      prev.map((g) =>
        g.id === currentGroup.id ? { ...g, memberCount: g.memberCount + 1 } : g
      )
    );

    // Initialize reliability metrics if not present
    if (!reliabilityMap[newMemberId]) {
      setReliabilityMap((prev) => ({
        ...prev,
        [newMemberId]: {
          totalPayments: 0,
          completedOnTime: 0,
          completedLate: 0,
          stillPending: 0,
          completionRate: 100,
          score: 100,
          indicator: 'Reliable',
        },
      }));
    }

    setIsLoading(false);
    addToast({
      type: 'success',
      title: 'Member Added',
      message: `${newMemberName} (${cleanEmail}) joined ${currentGroup.name}.`,
    });
  };

  // API_INTEGRATION_POINT: DELETE /api/groups/{groupId}/members/{userId}
  const removeMemberFromGroup = async (userId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 350));

    const memberToRemove = members.find((m) => m.userId === userId);
    if (memberToRemove && Math.abs(memberToRemove.balance) > 0.01) {
      setIsLoading(false);
      addToast({
        type: 'warning',
        title: 'Cannot Remove Member',
        message: `${memberToRemove.name} has an unsettled balance (${currentGroup.currencySymbol}${Math.abs(
          memberToRemove.balance
        ).toFixed(2)}). Please settle first.`,
      });
      return;
    }

    setGroupMembersMap((prev) => ({
      ...prev,
      [currentGroup.id]: (prev[currentGroup.id] || []).filter((m) => m.userId !== userId),
    }));

    setGroups((prev) =>
      prev.map((g) =>
        g.id === currentGroup.id ? { ...g, memberCount: Math.max(1, g.memberCount - 1) } : g
      )
    );

    setIsLoading(false);
    addToast({
      type: 'info',
      title: 'Member Removed',
      message: `${memberToRemove?.name || 'User'} has been removed from the group.`,
    });
  };

  // -------------------------------------------------------------
  // EXPENSE ACTIONS
  // -------------------------------------------------------------

  // API_INTEGRATION_POINT: POST /api/groups/{groupId}/expenses
  const createExpense = async (
    description: string,
    amount: number,
    splitType: 'equal' | 'manual',
    memberSplits?: { userId: string; amount: number }[]
  ): Promise<Expense> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 450)); // Simulating backend validation

    const expenseId = `exp-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    let computedSplits: ExpenseSplit[] = [];

    if (splitType === 'equal') {
      const activeMembers = members;
      const count = activeMembers.length;
      const baseShare = Math.floor((amount / count) * 100) / 100;
      const remainder = Math.round((amount - baseShare * count) * 100) / 100;

      computedSplits = activeMembers.map((m, idx) => {
        // Payer's own split is marked completed immediately
        const isPayer = m.userId === currentUser.id;
        const assigned = idx === 0 ? baseShare + remainder : baseShare;

        return {
          splitId: `split-${expenseId}-${m.userId}`,
          expenseId,
          userId: m.userId,
          userName: m.name,
          userEmail: m.email,
          assignedAmount: Math.round(assigned * 100) / 100,
          status: isPayer ? 'completed' : 'pending',
          paymentStatus: isPayer ? 'completed' : 'pending',
          paidAt: isPayer ? now : null,
        };
      });
    } else if (memberSplits) {
      computedSplits = memberSplits.map((ms) => {
        const mem = members.find((m) => m.userId === ms.userId);
        const isPayer = ms.userId === currentUser.id;
        return {
          splitId: `split-${expenseId}-${ms.userId}`,
          expenseId,
          userId: ms.userId,
          userName: mem?.name || 'Member',
          userEmail: mem?.email || '',
          assignedAmount: Math.round(ms.amount * 100) / 100,
          status: isPayer ? 'completed' : 'pending',
          paymentStatus: isPayer ? 'completed' : 'pending',
          paidAt: isPayer ? now : null,
        };
      });
    }

    const newExpense: Expense = {
      id: expenseId,
      groupId: currentGroup.id,
      description: description.trim(),
      amount: Math.round(amount * 100) / 100,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: now,
      splits: computedSplits,
    };

    const updatedExpenses = [newExpense, ...expenses];

    // Recalculate group balances
    const updatedMembers = recalculateGroupBalances(currentGroup.id, updatedExpenses, members);

    setExpensesMap((prev) => ({
      ...prev,
      [currentGroup.id]: updatedExpenses,
    }));

    setGroupMembersMap((prev) => ({
      ...prev,
      [currentGroup.id]: updatedMembers,
    }));

    // In-app notification creation
    const newNotif: NotificationItem = {
      notificationId: `notif-${Date.now()}`,
      type: 'expense_created',
      groupId: currentGroup.id,
      groupName: currentGroup.name,
      message: `${currentUser.name} recorded a shared expense: "${description}" (${currentGroup.currencySymbol}${amount.toFixed(2)}).`,
      read: false,
      createdAt: now,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setIsLoading(false);
    addToast({
      type: 'success',
      title: 'Expense Recorded',
      message: `"${description}" added to ${currentGroup.name}. Splits calculated.`,
    });

    return newExpense;
  };

  // -------------------------------------------------------------
  // PAYMENT SETTLEMENT ACTIONS
  // -------------------------------------------------------------

  // API_INTEGRATION_POINT: PATCH /api/groups/{groupId}/expenses/{expenseId}/splits/{splitId}/payment
  const markSplitPaid = async (expenseId: string, splitId: string, userId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const now = new Date().toISOString();
    let paidAmount = 0;
    let expenseDesc = '';

    const updatedExpenses = expenses.map((exp) => {
      if (exp.id !== expenseId) return exp;
      expenseDesc = exp.description;
      const updatedSplits = exp.splits.map((s) => {
        if (s.splitId === splitId || s.userId === userId) {
          paidAmount = s.assignedAmount;
          return {
            ...s,
            status: 'completed' as const,
            paidAt: now,
          };
        }
        return s;
      });
      return { ...exp, splits: updatedSplits };
    });

    // Recalculate group balances
    const updatedMembers = recalculateGroupBalances(currentGroup.id, updatedExpenses, members);

    setExpensesMap((prev) => ({
      ...prev,
      [currentGroup.id]: updatedExpenses,
    }));

    setGroupMembersMap((prev) => ({
      ...prev,
      [currentGroup.id]: updatedMembers,
    }));

    // Update payment history
    const payerMember = members.find((m) => m.userId === userId);
    const newHistItem: PaymentHistoryItem = {
      paymentHistoryId: `hist-${Date.now()}`,
      expenseId,
      expenseDescription: expenseDesc || 'Expense settlement',
      assignedAmount: paidAmount,
      status: 'completed',
      createdAt: now,
      completedAt: now,
      daysOverdue: 0,
    };

    setHistoryMap((prev) => ({
      ...prev,
      [userId]: [newHistItem, ...(prev[userId] || [])],
    }));

    // Update reliability score
    setReliabilityMap((prev) => {
      const currentRel = prev[userId] || {
        totalPayments: 0,
        completedOnTime: 0,
        completedLate: 0,
        stillPending: 0,
        completionRate: 100,
        score: 100,
        indicator: 'Reliable',
      };

      const newTotal = currentRel.totalPayments + 1;
      const newOnTime = currentRel.completedOnTime + 1;
      const newPending = Math.max(0, currentRel.stillPending - 1);
      const rate = Math.round((newOnTime / newTotal) * 100);
      const score = Math.min(100, Math.round(rate * 0.95 + 5));
      const indicator = score >= 85 ? 'Reliable' : score >= 65 ? 'At Risk' : 'Unreliable';

      return {
        ...prev,
        [userId]: {
          totalPayments: newTotal,
          completedOnTime: newOnTime,
          completedLate: currentRel.completedLate,
          stillPending: newPending,
          completionRate: rate,
          score,
          indicator,
        },
      };
    });

    setIsLoading(false);
    addToast({
      type: 'success',
      title: 'Payment Confirmed',
      message: `${payerMember?.name || 'Member'} split for "${expenseDesc}" marked as completed.`,
    });
  };

  // -------------------------------------------------------------
  // ACCOUNTABILITY & REMINDER ACTIONS
  // -------------------------------------------------------------

  // API_INTEGRATION_POINT: Notification trigger / reminder
  const sendGentleReminder = (userId: string, expenseDescription?: string, amount?: number) => {
    const member = members.find((m) => m.userId === userId);
    if (!member) return;

    const notifMessage = expenseDescription
      ? `Gentle reminder for ${member.name}: ${currentGroup.currencySymbol}${amount?.toFixed(
          2
        )} split for "${expenseDescription}" is awaiting settlement.`
      : `Gentle reminder for ${member.name}: Outstanding balance of ${
          currentGroup.currencySymbol
        }${Math.abs(member.balance).toFixed(2)} in ${currentGroup.name}.`;

    const newNotif: NotificationItem = {
      notificationId: `notif-${Date.now()}`,
      type: 'payment_reminder',
      groupId: currentGroup.id,
      groupName: currentGroup.name,
      message: notifMessage,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotif, ...prev]);

    addToast({
      type: 'info',
      title: 'Gentle Reminder Sent',
      message: `Friendly payment prompt delivered to ${member.name} (${member.email}).`,
    });
  };

  // API_INTEGRATION_POINT: GET /api/groups/{groupId}/members/{userId}/history
  const getMemberHistory = (userId: string): PaymentHistoryItem[] => {
    return historyMap[userId] || [];
  };

  // API_INTEGRATION_POINT: GET /api/groups/{groupId}/members/{userId}/reliability
  const getMemberReliability = (userId: string): ReliabilityMetrics => {
    return (
      reliabilityMap[userId] || {
        totalPayments: 1,
        completedOnTime: 1,
        completedLate: 0,
        stillPending: 0,
        completionRate: 100,
        score: 95,
        indicator: 'Reliable',
      }
    );
  };

  // API_INTEGRATION_POINT: GET /api/groups/{groupId}/overdue?overdueAfterDays=7
  const getOverdueSplits = (overdueDaysThreshold = 7): OverdueSplitItem[] => {
    const overdueList: OverdueSplitItem[] = [];
    const now = new Date().getTime();

    expenses.forEach((exp) => {
      const expenseDate = new Date(exp.createdAt).getTime();
      const diffDays = Math.floor((now - expenseDate) / (1000 * 60 * 60 * 24));

      if (diffDays >= overdueDaysThreshold) {
        exp.splits.forEach((s) => {
          if (s.status === 'pending') {
            overdueList.push({
              splitId: s.splitId,
              expenseId: exp.id,
              expenseDescription: exp.description,
              amount: s.assignedAmount,
              createdAt: exp.createdAt,
              daysOverdue: diffDays,
              memberId: s.userId,
              memberName: s.userName,
            });
          }
        });
      }
    });

    return overdueList;
  };

  // Algorithm for simplified debt resolution (who owes whom)
  const getSimplifiedDebts = (): SimplifiedDebt[] => {
    // Collect net balances: positive owes money, negative is owed money
    const debtors: { userId: string; name: string; amount: number }[] = [];
    const creditors: { userId: string; name: string; amount: number }[] = [];

    members.forEach((m) => {
      if (m.balance > 0.01) {
        debtors.push({ userId: m.userId, name: m.name, amount: m.balance });
      } else if (m.balance < -0.01) {
        creditors.push({ userId: m.userId, name: m.name, amount: Math.abs(m.balance) });
      }
    });

    const debts: SimplifiedDebt[] = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const settledAmount = Math.min(debtor.amount, creditor.amount);

      if (settledAmount > 0.01) {
        debts.push({
          fromUserId: debtor.userId,
          fromUserName: debtor.name,
          toUserId: creditor.userId,
          toUserName: creditor.name,
          amount: Math.round(settledAmount * 100) / 100,
        });
      }

      debtor.amount -= settledAmount;
      creditor.amount -= settledAmount;

      if (debtor.amount <= 0.01) dIdx++;
      if (creditor.amount <= 0.01) cIdx++;
    }

    return debts;
  };

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------

  // API_INTEGRATION_POINT: PATCH /api/notifications/{notificationId}
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers: mockUsers,
        currentGroup,
        setCurrentGroup: (g) => setCurrentGroupId(g.id),
        groups,
        members,
        expenses,
        notifications,
        unreadNotificationCount,
        isLoading,
        toasts,
        addToast,
        dismissToast,
        createGroup,
        updateGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        createExpense,
        markSplitPaid,
        sendGentleReminder,
        getMemberHistory,
        getMemberReliability,
        getOverdueSplits,
        getSimplifiedDebts,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isCurrentUserAdmin,
        currentUserBalance,
        totalGroupExpenses,
        totalGroupPendingAmount,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
