import { Group, GroupMember } from '../types';

export const mockGroups: Group[] = [
  {
    id: 'grp-baguio-01',
    name: 'Baguio Trip 2026',
    description: 'Barkada highland getaway, transient house booking, gas, and food splits.',
    adminId: 'user-001', // Alex Rivera
    memberCount: 5,
    createdAt: '2026-04-01T10:00:00Z',
    currencySymbol: '₱',
  },
  {
    id: 'grp-apartment-02',
    name: 'Apartment 4B Roommates',
    description: 'Monthly utility bills, high-speed fiber internet, and shared household supplies.',
    adminId: 'user-002', // Jordan Lee
    memberCount: 3,
    createdAt: '2026-01-15T09:00:00Z',
    currencySymbol: '₱',
  },
  {
    id: 'grp-design-03',
    name: 'Design Sprint Gala',
    description: 'Quarterly team offsite, workshop catering, and celebration dinner.',
    adminId: 'user-001', // Alex Rivera
    memberCount: 4,
    createdAt: '2026-03-20T12:00:00Z',
    currencySymbol: '₱',
  }
];

export const mockGroupMembers: Record<string, GroupMember[]> = {
  'grp-baguio-01': [
    {
      userId: 'user-001',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      role: 'admin',
      balance: -2450.00, // Negative = group owes Alex (he paid transient house)
      joinedAt: '2026-04-01T10:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      userId: 'user-002',
      name: 'Jordan Lee',
      email: 'jordan.lee@example.com',
      role: 'member',
      balance: 0.00, // Settled
      joinedAt: '2026-04-01T10:15:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      userId: 'user-003',
      name: 'Casey Tan',
      email: 'casey.tan@example.com',
      role: 'member',
      balance: 450.00, // Owes ₱450
      joinedAt: '2026-04-01T10:20:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    },
    {
      userId: 'user-004',
      name: 'Mia Santos',
      email: 'mia.santos@example.com',
      role: 'member',
      balance: 0.00, // Settled
      joinedAt: '2026-04-01T10:30:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    {
      userId: 'user-005',
      name: 'David Kim',
      email: 'david.kim@example.com',
      role: 'member',
      balance: 2000.00, // Owes ₱2,000 (Overdue split!)
      joinedAt: '2026-04-01T11:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    }
  ],
  'grp-apartment-02': [
    {
      userId: 'user-002',
      name: 'Jordan Lee',
      email: 'jordan.lee@example.com',
      role: 'admin',
      balance: -1500.00,
      joinedAt: '2026-01-15T09:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      userId: 'user-001',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      role: 'member',
      balance: 750.00,
      joinedAt: '2026-01-15T09:30:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      userId: 'user-003',
      name: 'Casey Tan',
      email: 'casey.tan@example.com',
      role: 'member',
      balance: 750.00,
      joinedAt: '2026-01-15T10:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    }
  ],
  'grp-design-03': [
    {
      userId: 'user-001',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      role: 'admin',
      balance: -800.00,
      joinedAt: '2026-03-20T12:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      userId: 'user-004',
      name: 'Mia Santos',
      email: 'mia.santos@example.com',
      role: 'member',
      balance: 800.00,
      joinedAt: '2026-03-20T12:15:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    {
      userId: 'user-005',
      name: 'David Kim',
      email: 'david.kim@example.com',
      role: 'member',
      balance: 0.00,
      joinedAt: '2026-03-20T12:30:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    {
      userId: 'user-006',
      name: 'Elena Gomez',
      email: 'elena.gomez@example.com',
      role: 'member',
      balance: 0.00,
      joinedAt: '2026-03-20T13:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    }
  ]
};

export const defaultCurrentGroup = mockGroups[0];
export const defaultGroupMembers = mockGroupMembers['grp-baguio-01'];
