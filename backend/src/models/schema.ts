import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  decimal,
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    unique('users_email_unique').on(table.email),
    index('idx_users_email').on(table.email),
    index('idx_users_created_at').on(table.createdAt),
    check('chk_email_format', sql`${table.email} ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$'`),
    check('chk_name_not_empty', sql`LENGTH(TRIM(${table.name})) > 0`),
  ],
);

export const groups = pgTable(
  'groups',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    adminId: uuid('admin_id')
      .notNull()
      .references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_groups_admin_id').on(table.adminId),
    index('idx_groups_created_at').on(table.createdAt),
    check('chk_group_name_not_empty', sql`LENGTH(TRIM(${table.name})) > 0`),
  ],
);

export const groupMembers = pgTable(
  'group_members',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 20 }).default('member').notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (table) => [
    unique('group_members_group_id_user_id_unique').on(table.groupId, table.userId),
    index('idx_group_members_group_id').on(table.groupId),
    index('idx_group_members_user_id').on(table.userId),
    index('idx_group_members_role').on(table.role),
    check('chk_group_members_role_valid', sql`${table.role} IN ('admin', 'member')`),
  ],
);

export const expenses = pgTable(
  'expenses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    description: varchar('description', { length: 255 }).notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_expenses_group_id').on(table.groupId),
    index('idx_expenses_created_by').on(table.createdBy),
    index('idx_expenses_created_at').on(table.createdAt),
    index('idx_expenses_by_group_date').on(table.groupId, sql`${table.createdAt} DESC`),
    check('chk_description_not_empty', sql`LENGTH(TRIM(${table.description})) > 0`),
    check('chk_expenses_amount_positive', sql`${table.amount} > 0`),
  ],
);

export const expenseSplits = pgTable(
  'expense_splits',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    expenseId: uuid('expense_id')
      .notNull()
      .references(() => expenses.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assignedAmount: decimal('assigned_amount', { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [
    unique('expense_splits_expense_id_user_id_unique').on(table.expenseId, table.userId),
    index('idx_expense_splits_expense_id').on(table.expenseId),
    index('idx_expense_splits_user_id').on(table.userId),
    check('chk_expense_splits_amount_positive', sql`${table.assignedAmount} > 0`),
  ],
);

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    expenseId: uuid('expense_id')
      .notNull()
      .references(() => expenses.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    status: varchar('status', { length: 20 }).default('pending').notNull(),
    paidAt: timestamp('paid_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    unique('payments_expense_id_user_id_unique').on(table.expenseId, table.userId),
    index('idx_payments_expense_id').on(table.expenseId),
    index('idx_payments_user_id').on(table.userId),
    index('idx_payments_status').on(table.status),
    index('idx_payments_created_at').on(table.createdAt),
    check('chk_payments_status_valid', sql`${table.status} IN ('pending', 'completed')`),
    check('chk_payments_amount_positive', sql`${table.amount} > 0`),
  ],
);

export const paymentHistory = pgTable(
  'payment_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'set null' }),
    status: varchar('status', { length: 20 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
  },
  (table) => [
    index('idx_payment_history_user_id').on(table.userId),
    index('idx_payment_history_group_id').on(table.groupId),
    index('idx_payment_history_status').on(table.status),
    index('idx_payment_history_created_at').on(table.createdAt),
    index('idx_payment_history_user_group').on(table.userId, table.groupId),
    check('chk_payment_history_status_valid', sql`${table.status} IN ('pending', 'completed', 'overdue')`),
  ],
);

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 50 }).notNull(),
    message: text('message').notNull(),
    read: boolean('read').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_notifications_user_id').on(table.userId),
    index('idx_notifications_group_id').on(table.groupId),
    index('idx_notifications_read').on(table.read),
    index('idx_notifications_created_at').on(table.createdAt),
    index('idx_notifications_user_read').on(table.userId, table.read).where(sql`NOT ${table.read}`),
    check('chk_notifications_type_valid', sql`${table.type} IN ('overdue_alert', 'payment_reminder', 'expense_created')`),
    check('chk_notifications_message_not_empty', sql`LENGTH(TRIM(${table.message})) > 0`),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  groups: many(groups),
  groupMembers: many(groupMembers),
  expenses: many(expenses),
  expenseSplits: many(expenseSplits),
  payments: many(payments),
  paymentHistory: many(paymentHistory),
  notifications: many(notifications),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  admin: one(users, {
    fields: [groups.adminId],
    references: [users.id],
  }),
  groupMembers: many(groupMembers),
  expenses: many(expenses),
  paymentHistory: many(paymentHistory),
  notifications: many(notifications),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one, many }) => ({
  group: one(groups, {
    fields: [expenses.groupId],
    references: [groups.id],
  }),
  creator: one(users, {
    fields: [expenses.createdBy],
    references: [users.id],
  }),
  splits: many(expenseSplits),
  payments: many(payments),
}));

export const expenseSplitsRelations = relations(expenseSplits, ({ one }) => ({
  expense: one(expenses, {
    fields: [expenseSplits.expenseId],
    references: [expenses.id],
  }),
  user: one(users, {
    fields: [expenseSplits.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  expense: one(expenses, {
    fields: [payments.expenseId],
    references: [expenses.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  history: many(paymentHistory),
}));

export const paymentHistoryRelations = relations(paymentHistory, ({ one }) => ({
  user: one(users, {
    fields: [paymentHistory.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [paymentHistory.groupId],
    references: [groups.id],
  }),
  payment: one(payments, {
    fields: [paymentHistory.paymentId],
    references: [payments.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [notifications.groupId],
    references: [groups.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export type ExpenseSplit = typeof expenseSplits.$inferSelect;
export type NewExpenseSplit = typeof expenseSplits.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type PaymentHistory = typeof paymentHistory.$inferSelect;
export type NewPaymentHistory = typeof paymentHistory.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;