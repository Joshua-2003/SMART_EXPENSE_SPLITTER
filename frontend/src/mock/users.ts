import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'alex.rivera@example.com',
    name: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-002',
    email: 'jordan.lee@example.com',
    name: 'Jordan Lee',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'user-003',
    email: 'casey.tan@example.com',
    name: 'Casey Tan',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 'user-004',
    email: 'mia.santos@example.com',
    name: 'Mia Santos',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10T14:20:00Z',
  },
  {
    id: 'user-005',
    email: 'david.kim@example.com',
    name: 'David Kim',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-02-18T16:45:00Z',
  },
  {
    id: 'user-006',
    email: 'elena.gomez@example.com',
    name: 'Elena Gomez',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-03-01T10:15:00Z',
  }
];

export const defaultCurrentUser: User = mockUsers[0]; // Alex Rivera (Admin)
