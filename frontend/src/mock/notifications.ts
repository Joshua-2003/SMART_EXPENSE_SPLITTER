import { NotificationItem } from '../types';

export const mockNotifications: NotificationItem[] = [
  {
    notificationId: 'notif-001',
    type: 'overdue_alert',
    groupId: 'grp-baguio-01',
    groupName: 'Baguio Trip 2026',
    message: 'David Kim has unpaid balance for Camp John Hay Transient House (9 days overdue).',
    read: false,
    createdAt: '2026-04-06T08:00:00Z',
  },
  {
    notificationId: 'notif-002',
    type: 'payment_reminder',
    groupId: 'grp-apartment-02',
    groupName: 'Apartment 4B Roommates',
    message: 'Gentle reminder: Fiber Gigabit Internet Bill split (₱750.00) is awaiting settlement.',
    read: false,
    createdAt: '2026-04-05T14:30:00Z',
  },
  {
    notificationId: 'notif-003',
    type: 'expense_created',
    groupId: 'grp-baguio-01',
    groupName: 'Baguio Trip 2026',
    message: 'Alex Rivera added a new shared expense: Session Road Dinner Feast (₱2,250.00).',
    read: true,
    createdAt: '2026-04-03T20:30:00Z',
  },
  {
    notificationId: 'notif-004',
    type: 'expense_created',
    groupId: 'grp-baguio-01',
    groupName: 'Baguio Trip 2026',
    message: 'Jordan Lee added a new shared expense: Van Express Gas & TPLEX Tollways (₱2,500.00).',
    read: true,
    createdAt: '2026-04-02T09:00:00Z',
  }
];
