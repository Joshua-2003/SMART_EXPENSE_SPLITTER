import { PaymentHistoryItem, ReliabilityMetrics } from '../types';

export const mockMemberHistory: Record<string, PaymentHistoryItem[]> = {
  // Alex Rivera (Payer & Organizer)
  'user-001': [
    {
      paymentHistoryId: 'hist-001',
      expenseId: 'exp-baguio-001',
      expenseDescription: 'Camp John Hay Transient House (2 Nights)',
      assignedAmount: 1000.00,
      status: 'completed',
      createdAt: '2026-04-02T14:30:00Z',
      completedAt: '2026-04-02T14:30:00Z',
      daysOverdue: 0,
    },
    {
      paymentHistoryId: 'hist-002',
      expenseId: 'exp-baguio-002',
      expenseDescription: 'Van Express Gas & TPLEX Tollways',
      assignedAmount: 500.00,
      status: 'completed',
      createdAt: '2026-04-02T09:00:00Z',
      completedAt: '2026-04-02T18:00:00Z',
      daysOverdue: 0,
    },
    {
      paymentHistoryId: 'hist-003',
      expenseId: 'exp-baguio-003',
      expenseDescription: 'Session Road Dinner Feast',
      assignedAmount: 450.00,
      status: 'completed',
      createdAt: '2026-04-03T20:30:00Z',
      completedAt: '2026-04-03T20:30:00Z',
      daysOverdue: 0,
    },
    {
      paymentHistoryId: 'hist-004',
      expenseId: 'exp-apt-001',
      expenseDescription: 'Fiber Gigabit Internet Bill (March)',
      assignedAmount: 750.00,
      status: 'pending',
      createdAt: '2026-03-28T10:00:00Z',
      completedAt: null,
      daysOverdue: 2,
    }
  ],

  // Jordan Lee (Prompt payer, highly reliable)
  'user-002': [
    {
      paymentHistoryId: 'hist-010',
      expenseId: 'exp-baguio-001',
      expenseDescription: 'Camp John Hay Transient House (2 Nights)',
      assignedAmount: 1000.00,
      status: 'completed',
      createdAt: '2026-04-02T14:30:00Z',
      completedAt: '2026-04-03T10:15:00Z',
      daysOverdue: 0,
    },
    {
      paymentHistoryId: 'hist-011',
      expenseId: 'exp-baguio-002',
      expenseDescription: 'Van Express Gas & TPLEX Tollways',
      assignedAmount: 500.00,
      status: 'completed',
      createdAt: '2026-04-02T09:00:00Z',
      completedAt: '2026-04-02T09:00:00Z',
      daysOverdue: 0,
    },
    {
      paymentHistoryId: 'hist-012',
      expenseId: 'exp-baguio-003',
      expenseDescription: 'Session Road Dinner Feast',
      assignedAmount: 450.00,
      status: 'completed',
      createdAt: '2026-04-03T20:30:00Z',
      completedAt: '2026-04-04T08:00:00Z',
      daysOverdue: 0,
    }
  ],

  // Casey Tan (Average, sometimes settles late)
  'user-003': [
    {
      paymentHistoryId: 'hist-020',
      expenseId: 'exp-baguio-002',
      expenseDescription: 'Van Express Gas & TPLEX Tollways',
      assignedAmount: 500.00,
      status: 'completed',
      createdAt: '2026-04-02T09:00:00Z',
      completedAt: '2026-04-04T12:00:00Z',
      daysOverdue: 0,
    },
    {
      paymentHistoryId: 'hist-021',
      expenseId: 'exp-baguio-003',
      expenseDescription: 'Session Road Dinner Feast',
      assignedAmount: 450.00,
      status: 'pending',
      createdAt: '2026-04-03T20:30:00Z',
      completedAt: null,
      daysOverdue: 3,
    },
    {
      paymentHistoryId: 'hist-022',
      expenseId: 'exp-apt-001',
      expenseDescription: 'Fiber Gigabit Internet Bill (March)',
      assignedAmount: 750.00,
      status: 'pending',
      createdAt: '2026-03-28T10:00:00Z',
      completedAt: null,
      daysOverdue: 4,
    }
  ],

  // Mia Santos (Rock solid 100% reliable)
  'user-004': [
    {
      paymentHistoryId: 'hist-030',
      expenseId: 'exp-baguio-001',
      expenseDescription: 'Camp John Hay Transient House (2 Nights)',
      assignedAmount: 1000.00,
      status: 'completed',
      createdAt: '2026-04-02T14:30:00Z',
      completedAt: '2026-04-03T11:00:00Z',
      daysOverdue: 0,
    },
    {
      paymentHistoryId: 'hist-031',
      expenseId: 'exp-baguio-002',
      expenseDescription: 'Van Express Gas & TPLEX Tollways',
      assignedAmount: 500.00,
      status: 'completed',
      createdAt: '2026-04-02T09:00:00Z',
      completedAt: '2026-04-02T19:30:00Z',
      daysOverdue: 0,
    },
    {
      paymentHistoryId: 'hist-032',
      expenseId: 'exp-baguio-003',
      expenseDescription: 'Session Road Dinner Feast',
      assignedAmount: 450.00,
      status: 'completed',
      createdAt: '2026-04-03T20:30:00Z',
      completedAt: '2026-04-04T09:15:00Z',
      daysOverdue: 0,
    }
  ],

  // David Kim (Chronic delays, Overdue split > 7 days => At Risk/Unreliable)
  'user-005': [
    {
      paymentHistoryId: 'hist-040',
      expenseId: 'exp-baguio-001',
      expenseDescription: 'Camp John Hay Transient House (2 Nights)',
      assignedAmount: 1000.00,
      status: 'overdue',
      createdAt: '2026-04-02T14:30:00Z',
      completedAt: null,
      daysOverdue: 9, // Beyond 7-day default threshold!
    },
    {
      paymentHistoryId: 'hist-041',
      expenseId: 'exp-baguio-002',
      expenseDescription: 'Van Express Gas & TPLEX Tollways',
      assignedAmount: 500.00,
      status: 'overdue',
      createdAt: '2026-04-02T09:00:00Z',
      completedAt: null,
      daysOverdue: 9,
    },
    {
      paymentHistoryId: 'hist-042',
      expenseId: 'exp-baguio-003',
      expenseDescription: 'Session Road Dinner Feast',
      assignedAmount: 500.00,
      status: 'pending',
      createdAt: '2026-04-03T20:30:00Z',
      completedAt: null,
      daysOverdue: 4,
    }
  ]
};

export const mockPaymentHistory: PaymentHistoryItem[] = Object.entries(mockMemberHistory).flatMap(
  ([userId, records]) => records.map((r) => ({ ...r, userId }))
);
export const mockHistory = mockPaymentHistory;

export const mockMemberReliability: Record<string, any> = {
  'user-001': {
    userId: 'user-001',
    name: 'Alex Rivera',
    indicator: 'Reliable',
    score: 94,
    metrics: {
      totalPayments: 12,
      completedOnTime: 11,
      completedLate: 1,
      stillPending: 1,
      completionRate: 92,
      score: 94,
      indicator: 'Reliable',
    },
    calculatedAt: '2026-04-06T12:00:00Z',
  },
  'user-002': {
    userId: 'user-002',
    name: 'Jordan Lee',
    indicator: 'Reliable',
    score: 99,
    metrics: {
      totalPayments: 10,
      completedOnTime: 10,
      completedLate: 0,
      stillPending: 0,
      completionRate: 100,
      score: 99,
      indicator: 'Reliable',
    },
    calculatedAt: '2026-04-06T12:00:00Z',
  },
  'user-003': {
    userId: 'user-003',
    name: 'Casey Tan',
    indicator: 'At Risk',
    score: 72,
    metrics: {
      totalPayments: 8,
      completedOnTime: 5,
      completedLate: 2,
      stillPending: 2,
      completionRate: 75,
      score: 72,
      indicator: 'At Risk',
    },
    calculatedAt: '2026-04-06T12:00:00Z',
  },
  'user-004': {
    userId: 'user-004',
    name: 'Mia Santos',
    indicator: 'Reliable',
    score: 100,
    metrics: {
      totalPayments: 14,
      completedOnTime: 14,
      completedLate: 0,
      stillPending: 0,
      completionRate: 100,
      score: 100,
      indicator: 'Reliable',
    },
    calculatedAt: '2026-04-06T12:00:00Z',
  },
  'user-005': {
    userId: 'user-005',
    name: 'David Kim',
    indicator: 'Unreliable',
    score: 38,
    metrics: {
      totalPayments: 9,
      completedOnTime: 3,
      completedLate: 3,
      stillPending: 3,
      completionRate: 44,
      score: 38,
      indicator: 'Unreliable',
    },
    calculatedAt: '2026-04-06T12:00:00Z',
  },
  'user-006': {
    userId: 'user-006',
    name: 'Elena Gomez',
    indicator: 'Reliable',
    score: 95,
    metrics: {
      totalPayments: 1,
      completedOnTime: 1,
      completedLate: 0,
      stillPending: 0,
      completionRate: 100,
      score: 95,
      indicator: 'Reliable',
    },
    calculatedAt: '2026-04-06T12:00:00Z',
  },
};
