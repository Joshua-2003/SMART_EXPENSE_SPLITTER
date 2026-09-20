-- HARD-004: Materialize the payment lifecycle for existing data.
--
-- Every expense split now creates exactly one pending payment row and one linked
-- payment_history row at expense creation. Splits created before this migration
-- have no payment materialization, so backfill them by inserting a pending
-- payment (and its pending history row) for every split that lacks one.
-- Completed splits always have a payment row (created on completion), so any
-- split missing a payment row is pending by definition.
--> statement-breakpoint
WITH newly_materialized AS (
  INSERT INTO "payments" ("expense_id", "user_id", "amount", "status", "paid_at", "created_at", "updated_at")
  SELECT
    s."expense_id",
    s."user_id",
    s."assigned_amount",
    'pending',
    NULL,
    e."created_at",
    e."created_at"
  FROM "expense_splits" s
  JOIN "expenses" e ON e."id" = s."expense_id"
  WHERE NOT EXISTS (
    SELECT 1 FROM "payments" p
    WHERE p."expense_id" = s."expense_id" AND p."user_id" = s."user_id"
  )
  RETURNING "id", "expense_id", "user_id"
)
INSERT INTO "payment_history" ("user_id", "group_id", "payment_id", "status", "created_at", "completed_at")
SELECT
  nm."user_id",
  e."group_id",
  nm."id",
  'pending',
  e."created_at",
  NULL
FROM newly_materialized nm
JOIN "expenses" e ON e."id" = nm."expense_id"