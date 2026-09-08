ALTER TABLE "expense_splits" ADD CONSTRAINT "chk_expense_splits_amount_positive" CHECK ("expense_splits"."assigned_amount" > 0);--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "chk_description_not_empty" CHECK (LENGTH(TRIM("expenses"."description")) > 0);--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "chk_expenses_amount_positive" CHECK ("expenses"."amount" > 0);--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "chk_group_members_role_valid" CHECK ("group_members"."role" IN ('admin', 'member'));--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "chk_group_name_not_empty" CHECK (LENGTH(TRIM("groups"."name")) > 0);--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "chk_notifications_type_valid" CHECK ("notifications"."type" IN ('overdue_alert', 'payment_reminder', 'expense_created'));--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "chk_notifications_message_not_empty" CHECK (LENGTH(TRIM("notifications"."message")) > 0);--> statement-breakpoint
ALTER TABLE "payment_history" ADD CONSTRAINT "chk_payment_history_status_valid" CHECK ("payment_history"."status" IN ('pending', 'completed', 'overdue'));--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "chk_payments_status_valid" CHECK ("payments"."status" IN ('pending', 'completed'));--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "chk_payments_amount_positive" CHECK ("payments"."amount" > 0);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "chk_email_format" CHECK ("users"."email" ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "chk_name_not_empty" CHECK (LENGTH(TRIM("users"."name")) > 0);