ALTER TABLE "expenses" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "admin_id" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_payments_user_expense" ON "payments" USING btree ("user_id","expense_id");--> statement-breakpoint
CREATE VIEW "public"."outstanding_balances" AS (
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
  WHERE p.status = 'pending'
);--> statement-breakpoint
CREATE VIEW "public"."user_balances_per_group" AS (
  SELECT
    u.id as user_id,
    g.id as group_id,
    u.name,
    COALESCE(SUM(CASE WHEN es.user_id = u.id THEN es.assigned_amount ELSE 0 END), 0) as total_owes,
    COALESCE(SUM(CASE WHEN e.created_by = u.id AND es.user_id != u.id THEN es.assigned_amount ELSE 0 END), 0) as amount_created_for_others,
    (COALESCE(SUM(CASE WHEN es.user_id = u.id THEN es.assigned_amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN e.created_by = u.id AND es.user_id != u.id THEN es.assigned_amount ELSE 0 END), 0)) as net_balance
  FROM users u
  CROSS JOIN groups g
  LEFT JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = u.id
  LEFT JOIN expenses e ON e.group_id = g.id
  LEFT JOIN expense_splits es ON es.expense_id = e.id
  WHERE gm.user_id IS NOT NULL
  GROUP BY u.id, g.id, u.name
);