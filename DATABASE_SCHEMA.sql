-- =====================================================================
-- Smart Expense Splitter Database Schema
-- PostgreSQL DDL (Data Definition Language)
-- Version: 1.0
-- Date: 2026-04-19
-- Status: Implementation-Ready
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- TABLE 1: USERS
-- Purpose: Store user accounts and authentication data
-- =====================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT chk_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_created_at ON users (created_at);

COMMENT ON TABLE users IS 'Core user accounts table';
COMMENT ON COLUMN users.id IS 'Unique user identifier (UUID)';
COMMENT ON COLUMN users.email IS 'User email for login (unique)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt or Argon2 hashed password';
COMMENT ON COLUMN users.name IS 'User display name';

-- =====================================================================
-- TABLE 2: GROUPS
-- Purpose: Store expense groups
-- =====================================================================
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_group_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX idx_groups_admin_id ON groups (admin_id);
CREATE INDEX idx_groups_created_at ON groups (created_at);

COMMENT ON TABLE groups IS 'Expense groups (e.g., trip, household, project)';
COMMENT ON COLUMN groups.id IS 'Unique group identifier';
COMMENT ON COLUMN groups.name IS 'Group display name';
COMMENT ON COLUMN groups.admin_id IS 'User who manages the group';

-- =====================================================================
-- TABLE 3: GROUP_MEMBERS
-- Purpose: Track group membership and roles
-- =====================================================================
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(group_id, user_id),
  CONSTRAINT chk_role_valid CHECK (role IN ('admin', 'member'))
);

CREATE INDEX idx_group_members_group_id ON group_members (group_id);
CREATE INDEX idx_group_members_user_id ON group_members (user_id);
CREATE INDEX idx_group_members_role ON group_members (role);

COMMENT ON TABLE group_members IS 'Membership records linking users to groups with roles';
COMMENT ON COLUMN group_members.role IS 'admin or member role within the group';

-- =====================================================================
-- TABLE 4: EXPENSES
-- Purpose: Store shared expenses
-- =====================================================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_description_not_empty CHECK (LENGTH(TRIM(description)) > 0),
  CONSTRAINT chk_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_expenses_group_id ON expenses (group_id);
CREATE INDEX idx_expenses_created_by ON expenses (created_by);
CREATE INDEX idx_expenses_created_at ON expenses (created_at);

COMMENT ON TABLE expenses IS 'Shared expenses within groups';
COMMENT ON COLUMN expenses.amount IS 'Total expense amount in decimal (supports currency)';
COMMENT ON COLUMN expenses.created_by IS 'User who recorded the expense';

-- =====================================================================
-- TABLE 5: EXPENSE_SPLITS
-- Purpose: Define individual shares of each expense
-- =====================================================================
CREATE TABLE IF NOT EXISTS expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_amount DECIMAL(12, 2) NOT NULL CHECK (assigned_amount > 0),
  
  UNIQUE(expense_id, user_id),
  CONSTRAINT chk_assigned_amount_positive CHECK (assigned_amount > 0)
);

CREATE INDEX idx_expense_splits_expense_id ON expense_splits (expense_id);
CREATE INDEX idx_expense_splits_user_id ON expense_splits (user_id);

COMMENT ON TABLE expense_splits IS 'Individual user shares for each expense (many-to-many)';
COMMENT ON COLUMN expense_splits.assigned_amount IS 'Amount this user owes for this expense';

-- =====================================================================
-- TABLE 6: PAYMENTS
-- Purpose: Track payment settlement status
-- =====================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  paid_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(expense_id, user_id),
  CONSTRAINT chk_status_valid CHECK (status IN ('pending', 'completed')),
  CONSTRAINT chk_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_payments_expense_id ON payments (expense_id);
CREATE INDEX idx_payments_user_id ON payments (user_id);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_payments_created_at ON payments (created_at);

COMMENT ON TABLE payments IS 'Payment settlement records for each split';
COMMENT ON COLUMN payments.status IS 'pending or completed';
COMMENT ON COLUMN payments.paid_at IS 'Timestamp when marked as completed';

-- =====================================================================
-- TABLE 7: PAYMENT_HISTORY
-- Purpose: Historical record of payment behavior for reliability tracking
-- =====================================================================
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'overdue')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  
  CONSTRAINT chk_status_valid CHECK (status IN ('pending', 'completed', 'overdue'))
);

CREATE INDEX idx_payment_history_user_id ON payment_history (user_id);
CREATE INDEX idx_payment_history_group_id ON payment_history (group_id);
CREATE INDEX idx_payment_history_status ON payment_history (status);
CREATE INDEX idx_payment_history_created_at ON payment_history (created_at);
CREATE INDEX idx_payment_history_user_group ON payment_history (user_id, group_id);

COMMENT ON TABLE payment_history IS 'Denormalized history for fast reliability calculations';
COMMENT ON COLUMN payment_history.status IS 'pending, completed, or overdue';

-- =====================================================================
-- TABLE 8: NOTIFICATIONS
-- Purpose: Store notifications for users
-- =====================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_type_valid CHECK (type IN ('overdue_alert', 'payment_reminder', 'expense_created')),
  CONSTRAINT chk_message_not_empty CHECK (LENGTH(TRIM(message)) > 0)
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_group_id ON notifications (group_id);
CREATE INDEX idx_notifications_read ON notifications (read);
CREATE INDEX idx_notifications_created_at ON notifications (created_at);
CREATE INDEX idx_notifications_user_read ON notifications (user_id, read) WHERE NOT read;

COMMENT ON TABLE notifications IS 'In-app notifications for group members';
COMMENT ON COLUMN notifications.type IS 'overdue_alert, payment_reminder, or expense_created';
COMMENT ON COLUMN notifications.read IS 'Whether user has marked notification as read';

-- =====================================================================
-- VIEWS (Materialized views for common queries)
-- =====================================================================

-- View 1: User Balances Per Group
CREATE OR REPLACE VIEW user_balances_per_group AS
SELECT 
  u.id as user_id,
  g.id as group_id,
  u.name,
  COALESCE(SUM(CASE WHEN es.user_id = u.id THEN es.assigned_amount ELSE 0 END), 0) as total_owes,
  COALESCE(SUM(CASE WHEN e.created_by = u.id AND es.user_id != u.id THEN es.assigned_amount ELSE 0 END), 0) as amount_created_for_others,
  (COALESCE(SUM(CASE WHEN es.user_id = u.id THEN es.assigned_amount ELSE 0 END), 0) - 
   COALESCE(SUM(CASE WHEN e.created_by = u.id AND es.user_id != u.id THEN es.assigned_amount ELSE 0 END), 0)) as net_balance
FROM users u
CROSS JOIN groups g
LEFT JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = u.id
LEFT JOIN expenses e ON e.group_id = g.id
LEFT JOIN expense_splits es ON es.expense_id = e.id
WHERE gm.user_id IS NOT NULL
GROUP BY u.id, g.id, u.name;

COMMENT ON VIEW user_balances_per_group IS 'Calculated balances for each user in each group';

-- View 2: Outstanding Balances
CREATE OR REPLACE VIEW outstanding_balances AS
SELECT 
  p.user_id,
  p.expense_id,
  g.id as group_id,
  u.name,
  es.assigned_amount,
  e.description,
  e.created_at
FROM payments p
JOIN expense_splits es ON p.expense_id = es.expense_id AND p.user_id = es.user_id
JOIN expenses e ON p.expense_id = e.id
JOIN groups g ON e.group_id = g.id
JOIN users u ON p.user_id = u.id
WHERE p.status = 'pending';

COMMENT ON VIEW outstanding_balances IS 'All unpaid balances with details';

-- =====================================================================
-- INDEXES FOR COMMON QUERIES
-- =====================================================================

-- Index for finding groups by member
CREATE INDEX IF NOT EXISTS idx_groups_by_member ON group_members (user_id, group_id);

-- Index for finding expenses in date range
CREATE INDEX IF NOT EXISTS idx_expenses_by_group_date ON expenses (group_id, created_at DESC);

-- Index for finding member payments
CREATE INDEX IF NOT EXISTS idx_payments_by_user_group ON payments (user_id, (SELECT group_id FROM expenses WHERE id = payments.expense_id));

-- =====================================================================
-- FOREIGN KEY RELATIONSHIPS SUMMARY
-- =====================================================================
/*
RELATIONSHIP DIAGRAM:

users (1) ──────(many)─────────► group_members (many) ──────(1)─── groups
                                      │
                                      │ (admin)
                                      └──────────────► groups

users (1) ──────(many)─────────► expenses (many) ──────(1)─────► groups
                    (created_by)

expenses (1) ──────(many)─────────► expense_splits (many) ──────(1)─── users
                                     (assigned shares)

expenses (1) ──────(many)─────────► payments (many) ──────(1)─────► users
                                     (settlement status)

payments (1) ──────(many)─────────► payment_history (many)
                                     (for auditing)

users (1) ──────(many)─────────► notifications (many) ──────(1)─── groups
*/

-- =====================================================================
-- SAMPLE QUERIES FOR COMMON OPERATIONS
-- =====================================================================

-- Query 1: Calculate user's balance in a group
/*
SELECT 
  COALESCE(SUM(es.assigned_amount), 0) as total_owes,
  (SELECT COALESCE(SUM(es.assigned_amount), 0)
   FROM expenses e2
   JOIN expense_splits es ON e2.id = es.expense_id
   WHERE e2.group_id = $groupId
   AND e2.created_by = $userId) as amount_created_for_others
FROM expenses e
JOIN expense_splits es ON e.id = es.expense_id
WHERE e.group_id = $groupId
AND es.user_id = $userId;
*/

-- Query 2: Get outstanding balances for a group
/*
SELECT 
  u.id,
  u.name,
  SUM(es.assigned_amount) as total_owed
FROM users u
JOIN expense_splits es ON u.id = es.user_id
JOIN expenses e ON es.expense_id = e.id
JOIN payments p ON e.id = p.expense_id AND u.id = p.user_id
WHERE e.group_id = $groupId
AND p.status = 'pending'
GROUP BY u.id, u.name
HAVING SUM(es.assigned_amount) > 0;
*/

-- Query 3: Get member reliability indicator (payment history stats)
/*
SELECT 
  COUNT(*) as total_payments,
  SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN p.status = 'pending' AND (NOW() - e.created_at) > INTERVAL '7 days' THEN 1 ELSE 0 END) as overdue
FROM payments p
JOIN expenses e ON p.expense_id = e.id
WHERE p.user_id = $userId
AND e.group_id = $groupId;
*/

-- Query 4: Get recent expenses for a group
/*
SELECT 
  e.id,
  e.description,
  e.amount,
  e.created_by,
  u.name as created_by_name,
  e.created_at
FROM expenses e
JOIN users u ON e.created_by = u.id
WHERE e.group_id = $groupId
ORDER BY e.created_at DESC
LIMIT 10;
*/

-- Query 5: Get group members with current balances
/*
SELECT 
  u.id,
  u.name,
  u.email,
  gm.role,
  gm.joined_at,
  ubpg.net_balance
FROM users u
JOIN group_members gm ON u.id = gm.user_id
LEFT JOIN user_balances_per_group ubpg ON u.id = ubpg.user_id AND gm.group_id = ubpg.group_id
WHERE gm.group_id = $groupId
ORDER BY u.name;
*/

-- =====================================================================
-- MIGRATION NOTES
-- =====================================================================

/*
IMPLEMENTATION NOTES:

1. UUID Extension
   - Requires PostgreSQL extension: uuid-ossp
   - Provides gen_random_uuid() function for auto-generating UUIDs

2. Constraints
   - All amounts use DECIMAL(12, 2) for precise currency calculations
   - CHECK constraints enforce data integrity at database level
   - UNIQUE constraints prevent duplicate entries

3. Cascading Deletes
   - ON DELETE CASCADE used for child tables to maintain referential integrity
   - ON DELETE SET NULL used for admin_id in groups to preserve group on admin deletion

4. Indexes
   - Indexes created on frequently queried columns for performance
   - Composite indexes for common WHERE + ORDER BY combinations
   - Partial indexes on boolean/enum columns where appropriate

5. Timestamps
   - created_at: Immutable record creation timestamp
   - updated_at: Modified when record is updated
   - paid_at: Nullable, populated when payment is marked completed
   - completed_at: In payment_history for tracking completion time

6. Views
   - user_balances_per_group: Pre-computed for faster dashboard queries
   - outstanding_balances: For quick lookup of unpaid amounts

7. Denormalization
   - payment_history table is partially denormalized for reliability calculations
   - Reduces query complexity for accountability features

8. Future Optimization Opportunities
   - Materialized views with refresh strategy for balance calculations
   - Partitioning payment_history by user_id for large datasets
   - Archive old expenses/payments to separate schema
*/

-- =====================================================================
-- END OF DATABASE SCHEMA
-- =====================================================================
