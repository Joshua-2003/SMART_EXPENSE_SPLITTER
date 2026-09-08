import { Expense } from '../types';

export const mockExpenses: Record<string, Expense[]> = {
  'grp-baguio-01': [
    {
      id: 'exp-baguio-001',
      groupId: 'grp-baguio-01',
      description: 'Camp John Hay Transient House (2 Nights)',
      amount: 4000.00,
      createdBy: 'user-001',
      createdByName: 'Alex Rivera',
      createdAt: '2026-04-02T14:30:00Z',
      category: 'Lodging',
      splits: [
        {
          splitId: 'split-001-1',
          expenseId: 'exp-baguio-001',
          userId: 'user-001',
          userName: 'Alex Rivera',
          userEmail: 'alex.rivera@example.com',
          assignedAmount: 1000.00,
          status: 'completed',
          paidAt: '2026-04-02T14:30:00Z', // Paid at creation by payer
        },
        {
          splitId: 'split-001-2',
          expenseId: 'exp-baguio-001',
          userId: 'user-002',
          userName: 'Jordan Lee',
          userEmail: 'jordan.lee@example.com',
          assignedAmount: 1000.00,
          status: 'completed',
          paidAt: '2026-04-03T10:15:00Z',
        },
        {
          splitId: 'split-001-3',
          expenseId: 'exp-baguio-001',
          userId: 'user-004',
          userName: 'Mia Santos',
          userEmail: 'mia.santos@example.com',
          assignedAmount: 1000.00,
          status: 'completed',
          paidAt: '2026-04-03T11:00:00Z',
        },
        {
          splitId: 'split-001-4',
          expenseId: 'exp-baguio-001',
          userId: 'user-005',
          userName: 'David Kim',
          userEmail: 'david.kim@example.com',
          assignedAmount: 1000.00,
          status: 'pending',
          paidAt: null, // Overdue!
        },
      ],
    },
    {
      id: 'exp-baguio-002',
      groupId: 'grp-baguio-01',
      description: 'Van Express Gas & TPLEX Tollways',
      amount: 2500.00,
      createdBy: 'user-002',
      createdByName: 'Jordan Lee',
      createdAt: '2026-04-02T09:00:00Z',
      category: 'Transport',
      splits: [
        {
          splitId: 'split-002-1',
          expenseId: 'exp-baguio-002',
          userId: 'user-001',
          userName: 'Alex Rivera',
          userEmail: 'alex.rivera@example.com',
          assignedAmount: 500.00,
          status: 'completed',
          paidAt: '2026-04-02T18:00:00Z',
        },
        {
          splitId: 'split-002-2',
          expenseId: 'exp-baguio-002',
          userId: 'user-002',
          userName: 'Jordan Lee',
          userEmail: 'jordan.lee@example.com',
          assignedAmount: 500.00,
          status: 'completed',
          paidAt: '2026-04-02T09:00:00Z',
        },
        {
          splitId: 'split-002-3',
          expenseId: 'exp-baguio-002',
          userId: 'user-003',
          userName: 'Casey Tan',
          userEmail: 'casey.tan@example.com',
          assignedAmount: 500.00,
          status: 'completed',
          paidAt: '2026-04-04T12:00:00Z',
        },
        {
          splitId: 'split-002-4',
          expenseId: 'exp-baguio-002',
          userId: 'user-004',
          userName: 'Mia Santos',
          userEmail: 'mia.santos@example.com',
          assignedAmount: 500.00,
          status: 'completed',
          paidAt: '2026-04-02T19:30:00Z',
        },
        {
          splitId: 'split-002-5',
          expenseId: 'exp-baguio-002',
          userId: 'user-005',
          userName: 'David Kim',
          userEmail: 'david.kim@example.com',
          assignedAmount: 500.00,
          status: 'pending',
          paidAt: null, // Overdue!
        },
      ],
    },
    {
      id: 'exp-baguio-003',
      groupId: 'grp-baguio-01',
      description: 'Session Road Dinner Feast (Cafe by the Ruins)',
      amount: 2250.00,
      createdBy: 'user-001',
      createdByName: 'Alex Rivera',
      createdAt: '2026-04-03T20:30:00Z',
      category: 'Food & Dining',
      splits: [
        {
          splitId: 'split-003-1',
          expenseId: 'exp-baguio-003',
          userId: 'user-001',
          userName: 'Alex Rivera',
          userEmail: 'alex.rivera@example.com',
          assignedAmount: 450.00,
          status: 'completed',
          paidAt: '2026-04-03T20:30:00Z',
        },
        {
          splitId: 'split-003-2',
          expenseId: 'exp-baguio-003',
          userId: 'user-002',
          userName: 'Jordan Lee',
          userEmail: 'jordan.lee@example.com',
          assignedAmount: 450.00,
          status: 'completed',
          paidAt: '2026-04-04T08:00:00Z',
        },
        {
          splitId: 'split-003-3',
          expenseId: 'exp-baguio-003',
          userId: 'user-003',
          userName: 'Casey Tan',
          userEmail: 'casey.tan@example.com',
          assignedAmount: 450.00,
          status: 'pending',
          paidAt: null, // pending
        },
        {
          splitId: 'split-003-4',
          expenseId: 'exp-baguio-003',
          userId: 'user-004',
          userName: 'Mia Santos',
          userEmail: 'mia.santos@example.com',
          assignedAmount: 450.00,
          status: 'completed',
          paidAt: '2026-04-04T09:15:00Z',
        },
        {
          splitId: 'split-003-5',
          expenseId: 'exp-baguio-003',
          userId: 'user-005',
          userName: 'David Kim',
          userEmail: 'david.kim@example.com',
          assignedAmount: 500.00,
          status: 'pending',
          paidAt: null, // pending overdue
        },
      ],
    }
  ],
  'grp-apartment-02': [
    {
      id: 'exp-apt-001',
      groupId: 'grp-apartment-02',
      description: 'Fiber Gigabit Internet Bill (March)',
      amount: 2250.00,
      createdBy: 'user-002',
      createdByName: 'Jordan Lee',
      createdAt: '2026-03-28T10:00:00Z',
      category: 'Utilities',
      splits: [
        {
          splitId: 'split-apt-001-1',
          expenseId: 'exp-apt-001',
          userId: 'user-002',
          userName: 'Jordan Lee',
          userEmail: 'jordan.lee@example.com',
          assignedAmount: 750.00,
          status: 'completed',
          paidAt: '2026-03-28T10:00:00Z',
        },
        {
          splitId: 'split-apt-001-2',
          expenseId: 'exp-apt-001',
          userId: 'user-001',
          userName: 'Alex Rivera',
          userEmail: 'alex.rivera@example.com',
          assignedAmount: 750.00,
          status: 'pending',
          paidAt: null,
        },
        {
          splitId: 'split-apt-001-3',
          expenseId: 'exp-apt-001',
          userId: 'user-003',
          userName: 'Casey Tan',
          userEmail: 'casey.tan@example.com',
          assignedAmount: 750.00,
          status: 'pending',
          paidAt: null,
        }
      ]
    }
  ],
  'grp-design-03': [
    {
      id: 'exp-des-001',
      groupId: 'grp-design-03',
      description: 'Workshop Catering & Healthy Bowls',
      amount: 1600.00,
      createdBy: 'user-001',
      createdByName: 'Alex Rivera',
      createdAt: '2026-04-05T12:00:00Z',
      category: 'Food',
      splits: [
        {
          splitId: 'split-des-001-1',
          expenseId: 'exp-des-001',
          userId: 'user-001',
          userName: 'Alex Rivera',
          userEmail: 'alex.rivera@example.com',
          assignedAmount: 800.00,
          status: 'completed',
          paidAt: '2026-04-05T12:00:00Z',
        },
        {
          splitId: 'split-des-001-2',
          expenseId: 'exp-des-001',
          userId: 'user-004',
          userName: 'Mia Santos',
          userEmail: 'mia.santos@example.com',
          assignedAmount: 800.00,
          status: 'pending',
          paidAt: null,
        }
      ]
    }
  ]
};

export const defaultExpenses: Expense[] = (mockExpenses['grp-baguio-01'] || []).map((e) => ({
  ...e,
  splits: e.splits.map((s) => ({
    ...s,
    paymentStatus: s.paymentStatus || s.status || 'pending',
    status: s.status || s.paymentStatus || 'pending',
  })),
}));
