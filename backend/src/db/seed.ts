import bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';

import { db, pool } from './db.js';
import {
  expenses,
  expenseSplits,
  groupMembers,
  groups,
  notifications,
  paymentHistory,
  payments,
  users,
} from '../models/schema.js';

const DEMO_PASSWORD = 'password123';
const wipeOnly = process.argv.includes('--wipe');

const TABLES = 'notifications, payment_history, payments, expense_splits, expenses, group_members, groups, users';

function daysAgo(days: number, hour = 12): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function hoursAfter(base: Date, hours: number): Date {
  return new Date(base.getTime() + hours * 60 * 60 * 1000);
}

type SeedSplit = {
  email: string;
  amount: string;
  paid: boolean;
  paidAt?: Date;
  historyStatus?: 'pending' | 'overdue';
};

type SeedExpense = {
  group: string;
  description: string;
  amount: string;
  createdBy: string;
  createdAt: Date;
  splits: SeedSplit[];
};

const demoUsers = [
  { email: 'alex.rivera@example.com', name: 'Alex Rivera' },
  { email: 'jordan.lee@example.com', name: 'Jordan Lee' },
  { email: 'casey.tan@example.com', name: 'Casey Tan' },
  { email: 'mia.santos@example.com', name: 'Mia Santos' },
  { email: 'david.kim@example.com', name: 'David Kim' },
  { email: 'elena.gomez@example.com', name: 'Elena Gomez' },
];

const demoGroups = [
  {
    name: 'Baguio Trip 2026',
    description: 'Barkada highland getaway, transient house booking, gas, and food splits.',
    admin: 'alex.rivera@example.com',
    createdAt: daysAgo(45, 10),
  },
  {
    name: 'Apartment 4B Roommates',
    description: 'Monthly utility bills, high-speed fiber internet, and shared household supplies.',
    admin: 'jordan.lee@example.com',
    createdAt: daysAgo(120, 9),
  },
  {
    name: 'Design Sprint Gala',
    description: 'Quarterly team offsite, workshop catering, and celebration dinner.',
    admin: 'alex.rivera@example.com',
    createdAt: daysAgo(140, 12),
  },
];

const demoMemberships: { group: string; email: string; role: 'admin' | 'member'; joinedAt: Date }[] = [
  { group: 'Baguio Trip 2026', email: 'alex.rivera@example.com', role: 'admin', joinedAt: daysAgo(45, 10) },
  { group: 'Baguio Trip 2026', email: 'jordan.lee@example.com', role: 'member', joinedAt: daysAgo(45, 10) },
  { group: 'Baguio Trip 2026', email: 'casey.tan@example.com', role: 'member', joinedAt: daysAgo(45, 10) },
  { group: 'Baguio Trip 2026', email: 'mia.santos@example.com', role: 'member', joinedAt: daysAgo(45, 11) },
  { group: 'Baguio Trip 2026', email: 'david.kim@example.com', role: 'member', joinedAt: daysAgo(45, 11) },
  { group: 'Apartment 4B Roommates', email: 'jordan.lee@example.com', role: 'admin', joinedAt: daysAgo(120, 9) },
  { group: 'Apartment 4B Roommates', email: 'alex.rivera@example.com', role: 'member', joinedAt: daysAgo(120, 9) },
  { group: 'Apartment 4B Roommates', email: 'casey.tan@example.com', role: 'member', joinedAt: daysAgo(120, 10) },
  { group: 'Design Sprint Gala', email: 'alex.rivera@example.com', role: 'admin', joinedAt: daysAgo(140, 12) },
  { group: 'Design Sprint Gala', email: 'mia.santos@example.com', role: 'member', joinedAt: daysAgo(140, 12) },
  { group: 'Design Sprint Gala', email: 'david.kim@example.com', role: 'member', joinedAt: daysAgo(140, 13) },
  { group: 'Design Sprint Gala', email: 'elena.gomez@example.com', role: 'member', joinedAt: daysAgo(140, 13) },
];

const baguio = daysAgo(12, 14);
const demoExpenses: SeedExpense[] = [
  {
    group: 'Baguio Trip 2026',
    description: 'Camp John Hay Transient House (2 Nights)',
    amount: '4000.00',
    createdBy: 'alex.rivera@example.com',
    createdAt: baguio,
    splits: [
      { email: 'alex.rivera@example.com', amount: '1000.00', paid: true, paidAt: baguio },
      { email: 'jordan.lee@example.com', amount: '1000.00', paid: true, paidAt: hoursAfter(baguio, 20) },
      { email: 'mia.santos@example.com', amount: '1000.00', paid: true, paidAt: hoursAfter(baguio, 21) },
      { email: 'david.kim@example.com', amount: '1000.00', paid: false, historyStatus: 'overdue' },
    ],
  },
  {
    group: 'Baguio Trip 2026',
    description: 'Van Express Gas & TPLEX Tollways',
    amount: '2500.00',
    createdBy: 'jordan.lee@example.com',
    createdAt: daysAgo(12, 9),
    splits: [
      { email: 'alex.rivera@example.com', amount: '500.00', paid: true, paidAt: daysAgo(11, 18) },
      { email: 'jordan.lee@example.com', amount: '500.00', paid: true, paidAt: daysAgo(12, 9) },
      { email: 'casey.tan@example.com', amount: '500.00', paid: true, paidAt: daysAgo(10, 12) },
      { email: 'mia.santos@example.com', amount: '500.00', paid: true, paidAt: daysAgo(11, 19) },
      { email: 'david.kim@example.com', amount: '500.00', paid: false, historyStatus: 'overdue' },
    ],
  },
  {
    group: 'Baguio Trip 2026',
    description: 'Session Road Dinner Feast (Cafe by the Ruins)',
    amount: '2250.00',
    createdBy: 'alex.rivera@example.com',
    createdAt: daysAgo(11, 20),
    splits: [
      { email: 'alex.rivera@example.com', amount: '450.00', paid: true, paidAt: daysAgo(11, 20) },
      { email: 'jordan.lee@example.com', amount: '450.00', paid: true, paidAt: daysAgo(10, 8) },
      { email: 'casey.tan@example.com', amount: '450.00', paid: false },
      { email: 'mia.santos@example.com', amount: '450.00', paid: true, paidAt: daysAgo(10, 9) },
      { email: 'david.kim@example.com', amount: '450.00', paid: false },
    ],
  },
  {
    group: 'Apartment 4B Roommates',
    description: 'Fiber Gigabit Internet Bill (March)',
    amount: '2250.00',
    createdBy: 'jordan.lee@example.com',
    createdAt: daysAgo(18, 10),
    splits: [
      { email: 'jordan.lee@example.com', amount: '750.00', paid: true, paidAt: daysAgo(18, 10) },
      { email: 'alex.rivera@example.com', amount: '750.00', paid: false },
      { email: 'casey.tan@example.com', amount: '750.00', paid: false, historyStatus: 'overdue' },
    ],
  },
  {
    group: 'Design Sprint Gala',
    description: 'Workshop Catering & Healthy Bowls',
    amount: '1600.00',
    createdBy: 'alex.rivera@example.com',
    createdAt: daysAgo(10, 12),
    splits: [
      { email: 'alex.rivera@example.com', amount: '800.00', paid: true, paidAt: daysAgo(10, 12) },
      { email: 'mia.santos@example.com', amount: '800.00', paid: false },
    ],
  },
];

const demoNotifications = [
  {
    email: 'alex.rivera@example.com',
    group: 'Baguio Trip 2026',
    type: 'overdue_alert',
    message: 'David Kim has unpaid balance for Camp John Hay Transient House (9 days overdue).',
    read: false,
    createdAt: daysAgo(6, 8),
  },
  {
    email: 'casey.tan@example.com',
    group: 'Apartment 4B Roommates',
    type: 'payment_reminder',
    message: 'Gentle reminder: Fiber Gigabit Internet Bill split (₱750.00) is awaiting settlement.',
    read: false,
    createdAt: daysAgo(7, 14),
  },
  {
    email: 'jordan.lee@example.com',
    group: 'Baguio Trip 2026',
    type: 'expense_created',
    message: 'Alex Rivera added a new shared expense: Session Road Dinner Feast (₱2,250.00).',
    read: true,
    createdAt: daysAgo(11, 20),
  },
  {
    email: 'casey.tan@example.com',
    group: 'Baguio Trip 2026',
    type: 'expense_created',
    message: 'Jordan Lee added a new shared expense: Van Express Gas & TPLEX Tollways (₱2,500.00).',
    read: true,
    createdAt: daysAgo(12, 9),
  },
];

async function reset(): Promise<void> {
  await db.execute(sql`TRUNCATE TABLE ${sql.raw(TABLES)} CASCADE`);
}

async function seed(): Promise<void> {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await db.transaction(async (tx) => {
    const insertedUsers = await tx
      .insert(users)
      .values(demoUsers.map((user) => ({ ...user, passwordHash })))
      .returning({ id: users.id, email: users.email });
    const userIdByEmail = new Map(insertedUsers.map((user) => [user.email, user.id]));

    const insertedGroups = await tx
      .insert(groups)
      .values(
        demoGroups.map((group) => ({
          name: group.name,
          description: group.description,
          adminId: userIdByEmail.get(group.admin)!,
          createdAt: group.createdAt,
          updatedAt: group.createdAt,
        })),
      )
      .returning({ id: groups.id, name: groups.name });
    const groupIdByName = new Map(insertedGroups.map((group) => [group.name, group.id]));

    await tx.insert(groupMembers).values(
      demoMemberships.map((membership) => ({
        groupId: groupIdByName.get(membership.group)!,
        userId: userIdByEmail.get(membership.email)!,
        role: membership.role,
        joinedAt: membership.joinedAt,
      })),
    );

    let expenseCount = 0;
    let splitCount = 0;
    let paidCount = 0;

    for (const expense of demoExpenses) {
      const { splits, ...expenseRow } = expense;
      const [insertedExpense] = await tx
        .insert(expenses)
        .values({
          groupId: groupIdByName.get(expenseRow.group)!,
          description: expenseRow.description,
          amount: expenseRow.amount,
          createdBy: userIdByEmail.get(expenseRow.createdBy)!,
          createdAt: expenseRow.createdAt,
        })
        .returning({ id: expenses.id });

      expenseCount += 1;
      const groupId = groupIdByName.get(expenseRow.group)!;

      for (const split of splits) {
        const userId = userIdByEmail.get(split.email)!;

        await tx.insert(expenseSplits).values({
          expenseId: insertedExpense.id,
          userId,
          assignedAmount: split.amount,
        });
        splitCount += 1;

        const [payment] = await tx
          .insert(payments)
          .values({
            expenseId: insertedExpense.id,
            userId,
            amount: split.amount,
            status: split.paid ? 'completed' : 'pending',
            paidAt: split.paid ? split.paidAt! : null,
            createdAt: expenseRow.createdAt,
            updatedAt: split.paid ? split.paidAt! : expenseRow.createdAt,
          })
          .returning({ id: payments.id });

        if (split.paid) {
          paidCount += 1;
        }

        await tx.insert(paymentHistory).values({
          userId,
          groupId,
          paymentId: payment.id,
          status: split.paid ? 'completed' : (split.historyStatus ?? 'pending'),
          createdAt: expenseRow.createdAt,
          completedAt: split.paid ? split.paidAt! : null,
        });
      }
    }

    await tx.insert(notifications).values(
      demoNotifications.map((notification) => ({
        userId: userIdByEmail.get(notification.email)!,
        groupId: groupIdByName.get(notification.group)!,
        type: notification.type,
        message: notification.message,
        read: notification.read,
        createdAt: notification.createdAt,
      })),
    );

    console.log(`Seeded ${demoUsers.length} users, ${demoGroups.length} groups, ${demoMemberships.length} memberships, ${expenseCount} expenses, ${splitCount} splits (${paidCount} paid), ${demoNotifications.length} notifications.`);
    console.log(`Demo login: any of the seeded emails with password "${DEMO_PASSWORD}" (e.g. alex.rivera@example.com).`);
  });
}

async function main(): Promise<void> {
  await reset();
  if (wipeOnly) {
    console.log('Database reset complete — all tables emptied.');
    return;
  }
  await seed();
}

try {
  await main();
} finally {
  await pool.end();
}