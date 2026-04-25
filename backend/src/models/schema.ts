import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  decimal,
  boolean,
  pgEnum,
  uniqueIndex,
  index,
  foreignKey,
  unique,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// =====================================================================
// ENUMS
// =====================================================================

export const userRoleEnum = pgEnum('user_role', ['admin', 'member']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed']);
export const paymentHistoryStatusEnum = pgEnum('payment_history_status', ['pending', 'completed', 'overdue']);
export const notificationTypeEnum = pgEnum('notification_type', [
  'overdue_alert',
  'payment_reminder',
  'expense_created',
]);

// =====================================================================
// TABLE 1: USERS
// Purpose: Store user accounts and authentication data
// =====================================================================

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
    createdAtIdx: index('idx_users_created_at').on(table.createdAt),
  })
);

// =====================================================================
// TABLE 2: GROUPS
// Purpose: Store expense groups
// =====================================================================

export const groups = pgTable(
  'groups',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    adminId: uuid('admin_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    adminIdFk: foreignKey({
      columns: [table.adminId],
      foreignColumns: [users.id],
      name: 'fk_groups_admin_id',
    }).onDelete('set null'),
    adminIdIdx: index('idx_groups_admin_id').on(table.adminId),
    createdAtIdx: index('idx_groups_created_at').on(table.createdAt),
  })
);

// =====================================================================
// TABLE 3: GROUP_MEMBERS
// Purpose: Track group membership and roles
// =====================================================================

export const groupMembers = pgTable(
  'group_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    groupId: uuid('group_id').notNull(),
    userId: uuid('user_id').notNull(),
    role: userRoleEnum('role').notNull().default('member'),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
  },
  (table) => ({
    groupIdFk: foreignKey({
      columns: [table.groupId],
      foreignColumns: [groups.id],
      name: 'fk_group_members_group_id',
    }).onDelete('cascade'),
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'fk_group_members_user_id',
    }).onDelete('cascade'),
    groupUserUnique: unique('uq_group_members_group_user').on(table.groupId, table.userId),
    groupIdIdx: index('idx_group_members_group_id').on(table.groupId),
    userIdIdx: index('idx_group_members_user_id').on(table.userId),
    roleIdx: index('idx_group_members_role').on(table.role),
  })
);

// =====================================================================
// TABLE 4: EXPENSES
// Purpose: Store shared expenses
// =====================================================================

export const expenses = pgTable(
  'expenses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    groupId: uuid('group_id').notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    createdBy: uuid('created_by').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    groupIdFk: foreignKey({
      columns: [table.groupId],
      foreignColumns: [groups.id],
      name: 'fk_expenses_group_id',
    }).onDelete('cascade'),
    createdByFk: foreignKey({
      columns: [table.createdBy],
      foreignColumns: [users.id],
      name: 'fk_expenses_created_by',
    }).onDelete('set null'),
    amountCheck: check('chk_expenses_amount_positive', sql`amount > 0`),
    groupIdIdx: index('idx_expenses_group_id').on(table.groupId),
    createdByIdx: index('idx_expenses_created_by').on(table.createdBy),
    createdAtIdx: index('idx_expenses_created_at').on(table.createdAt),
  })
);

// =====================================================================
// TABLE 5: EXPENSE_SPLITS
// Purpose: Define individual shares of each expense
// =====================================================================

export const expenseSplits = pgTable(
  'expense_splits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    expenseId: uuid('expense_id').notNull(),
    userId: uuid('user_id').notNull(),
    assignedAmount: decimal('assigned_amount', { precision: 12, scale: 2 }).notNull(),
  },
  (table) => ({
    expenseIdFk: foreignKey({
      columns: [table.expenseId],
      foreignColumns: [expenses.id],
      name: 'fk_expense_splits_expense_id',
    }).onDelete('cascade'),
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'fk_expense_splits_user_id',
    }).onDelete('cascade'),
    expenseUserUnique: unique('uq_expense_splits_expense_user').on(table.expenseId, table.userId),
    amountCheck: check('chk_expense_splits_amount_positive', sql`assigned_amount > 0`),
    expenseIdIdx: index('idx_expense_splits_expense_id').on(table.expenseId),
    userIdIdx: index('idx_expense_splits_user_id').on(table.userId),
  })
);

// =====================================================================
// TABLE 6: PAYMENTS
// Purpose: Track payment settlement status
// =====================================================================

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    expenseId: uuid('expense_id').notNull(),
    userId: uuid('user_id').notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    status: paymentStatusEnum('status').notNull().default('pending'),
    paidAt: timestamp('paid_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    expenseIdFk: foreignKey({
      columns: [table.expenseId],
      foreignColumns: [expenses.id],
      name: 'fk_payments_expense_id',
    }).onDelete('cascade'),
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'fk_payments_user_id',
    }).onDelete('cascade'),
    expenseUserUnique: unique('uq_payments_expense_user').on(table.expenseId, table.userId),
    amountCheck: check('chk_payments_amount_positive', sql`amount > 0`),
    expenseIdIdx: index('idx_payments_expense_id').on(table.expenseId),
    userIdIdx: index('idx_payments_user_id').on(table.userId),
    statusIdx: index('idx_payments_status').on(table.status),
    createdAtIdx: index('idx_payments_created_at').on(table.createdAt),
  })
);

// =====================================================================
// TABLE 7: PAYMENT_HISTORY
// Purpose: Historical record of payment behavior for reliability tracking
// =====================================================================

export const paymentHistory = pgTable(
  'payment_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    groupId: uuid('group_id').notNull(),
    paymentId: uuid('payment_id'),
    status: paymentHistoryStatusEnum('status').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'fk_payment_history_user_id',
    }).onDelete('cascade'),
    groupIdFk: foreignKey({
      columns: [table.groupId],
      foreignColumns: [groups.id],
      name: 'fk_payment_history_group_id',
    }).onDelete('cascade'),
    paymentIdFk: foreignKey({
      columns: [table.paymentId],
      foreignColumns: [payments.id],
      name: 'fk_payment_history_payment_id',
    }).onDelete('set null'),
    userIdIdx: index('idx_payment_history_user_id').on(table.userId),
    groupIdIdx: index('idx_payment_history_group_id').on(table.groupId),
    statusIdx: index('idx_payment_history_status').on(table.status),
    createdAtIdx: index('idx_payment_history_created_at').on(table.createdAt),
    userGroupIdx: index('idx_payment_history_user_group').on(table.userId, table.groupId),
  })
);

// =====================================================================
// TABLE 8: NOTIFICATIONS
// Purpose: Store notifications for users
// =====================================================================

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    groupId: uuid('group_id').notNull(),
    type: notificationTypeEnum('type').notNull(),
    message: text('message').notNull(),
    read: boolean('read').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'fk_notifications_user_id',
    }).onDelete('cascade'),
    groupIdFk: foreignKey({
      columns: [table.groupId],
      foreignColumns: [groups.id],
      name: 'fk_notifications_group_id',
    }).onDelete('cascade'),
    userIdIdx: index('idx_notifications_user_id').on(table.userId),
    groupIdIdx: index('idx_notifications_group_id').on(table.groupId),
    readIdx: index('idx_notifications_read').on(table.read),
    createdAtIdx: index('idx_notifications_created_at').on(table.createdAt),
    userReadIdx: index('idx_notifications_user_read').on(table.userId, table.read),
  })
);

// =====================================================================
// SCHEMA EXPORT
// =====================================================================

export const schema = {
  users,
  groups,
  groupMembers,
  expenses,
  expenseSplits,
  payments,
  paymentHistory,
  notifications,
  // Enums
  userRoleEnum,
  paymentStatusEnum,
  paymentHistoryStatusEnum,
  notificationTypeEnum,
};

export default schema;
