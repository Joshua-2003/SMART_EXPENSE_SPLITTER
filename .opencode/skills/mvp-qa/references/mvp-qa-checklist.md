# Smart Expense Backlog Checklist

Use only the rows relevant to the selected backlog item or phase. Link each row to the acceptance criterion in `docs/BACKLOG.md`. Do not mark a story complete because a build passes; verify its behavior and dependencies.

## Cross-cutting checks

- [ ] Backend builds with `npm run build`.
- [ ] Frontend type/lint check passes with `npm run lint`.
- [ ] Protected routes reject missing and invalid JWTs with `401`.
- [ ] Validation failures use the documented error envelope and `400`.
- [ ] Unauthorized group or user access returns the documented `403` or `404`.
- [ ] Success responses include the documented status, data, and timestamp fields.
- [ ] Timestamps are valid ISO 8601 values.
- [ ] No password hash, token secret, or database internals are exposed.
- [ ] Changes persist across a follow-up read where the feature mutates state.
- [ ] The selected story's dependencies are complete or explicitly reported as blocked.
- [ ] Empty, loading, error, unauthorized, forbidden, not-found, conflict, timeout, and retry states are covered where applicable.
- [ ] No unrelated files, generated output, secrets, tokens, `.env` files, debug dumps, or temporary files are included.
- [ ] Database changes have a reviewable migration and a fresh-database validation path.
- [ ] Commit scope matches exactly one backlog story plus required docs/status updates.

## MVP flow checks

### Authentication

- [ ] Signup accepts valid email, name, and password.
- [ ] Signup rejects missing or invalid fields and duplicate email.
- [ ] Login returns a usable bearer token and expiration metadata.
- [ ] Profile read/update is limited to the authenticated user.

### Groups and membership

- [ ] A valid group is created with the authenticated user as admin.
- [ ] Group listing returns only memberships for the authenticated user.
- [ ] Group details and member roles match persisted records.
- [ ] Admin-only updates and member operations enforce authorization.

### Expenses

- [ ] A group member can create a positive shared expense.
- [ ] MVP equal-split behavior creates valid participant splits.
- [ ] Non-members cannot create or read group expenses.
- [ ] Expense list/detail responses match the contract and database state.

### Payments and balances

- [ ] A valid pending payment can be marked completed.
- [ ] Completion updates `paid_at`, balance views, and payment history as documented.
- [ ] Personal balance and group settlement status reflect pending/completed payments.
- [ ] Invalid or unauthorized payment updates fail safely.

### Accountability

- [ ] Payment history is scoped to the requested member and group.
- [ ] Overdue balances include only qualifying unpaid records.
- [ ] Reliability output follows the documented indicator contract.
- [ ] Empty histories and no-overdue cases return valid empty collections.

### Dashboard

- [ ] A group member can retrieve the dashboard.
- [ ] Non-members cannot retrieve the dashboard.
- [ ] Summary counts and totals agree with group data.
- [ ] Member balances, recent expenses, and overdue alerts have the documented shape.

### Notifications

- [ ] Authenticated users can list only their own notifications.
- [ ] Default pagination is `limit=20`, `offset=0`.
- [ ] `limit`, `offset`, and `read=true|false` filters work and reject invalid values.
- [ ] `total` and `unreadCount` are correct for the result scope.
- [ ] Notification type is one of `overdue_alert`, `payment_reminder`, or `expense_created`.
- [ ] Marking a notification read returns the updated identifier, `read=true`, and `updatedAt`.
- [ ] A notification belonging to another user is not revealed or changed.
- [ ] Invalid UUID and unknown notification IDs return the documented failure.
- [ ] The UI shows the notification list and unread count.
- [ ] The UI mark-read action updates the server-backed state or clearly reports integration failure.

### Phase 5: Reconciliation and hardening

- [ ] Contract-only endpoints are either implemented and tested or consistently marked deferred.
- [ ] Cross-group settlement queries cannot include records from another group.
- [ ] Repeated payment completion is idempotent and does not duplicate history.
- [ ] Payment creation, pending state, completion, overdue state, and history transitions are consistent.
- [ ] Session reload, invalid-token handling, logout cleanup, and interceptor startup are verified.
- [ ] Member removal cannot orphan active financial obligations.
- [ ] Live API data is authoritative; mock fallback is not silently presented as production data.

### Phase 6: Product completeness and operations

- [ ] Email verification, password recovery, invitations, and reminder flows protect tokens and handle expiry/failure safely.
- [ ] Notification triggers are idempotent, user-scoped, preference-aware, and observable on delivery failure.
- [ ] Client/server validation covers boundaries, precision, dates, UUIDs, pagination, stale state, and cross-group inputs.
- [ ] User-facing errors are actionable and do not expose implementation details or secrets.
- [ ] Core workflows pass responsive, keyboard, focus, semantic, contrast, and reduced-motion checks.
- [ ] Rate limits, security headers, CORS, request limits, secret management, and sensitive-data redaction are verified.
- [ ] Query performance, connection limits, health checks, logs, metrics, backups, restore, retention, and deployment gates are documented/tested.

### Phase 7: Advanced capabilities

- [ ] Manual split amounts/percentages reconcile exactly in cents and reject invalid participants.
- [ ] Expense edits/deletes preserve payment, balance, authorization, and audit invariants.
- [ ] Categories, attachments, search, recurring schedules, exports, currency, and localization are scoped and group-authorized.
- [ ] Real-time events are authorized, reconnect-safe, deduplicated, and conflict-aware.
- [ ] Payment provider integrations use signed webhooks, idempotency, safe credentials, and explicit refund/error handling.
- [ ] Analytics and reliability insights are explainable, privacy-aware, and neutral for insufficient history.

### Commit and push safety

- [ ] `git status --short` reviewed before and after validation.
- [ ] `git diff --check` passes.
- [ ] `git diff --name-only` contains only intended files.
- [ ] Staged diff contains no secrets, credentials, generated artifacts, or unrelated changes.
- [ ] Branch and remote are verified before any push recommendation.
- [ ] No merge/rebase conflict or untracked release blocker remains.
- [ ] Push is recommended only when the user explicitly requested it; otherwise provide a command, not an execution.

## Evidence guidance

For each checked row, capture the command or request, the observed status code and key response fields, and the data/UI state that proves the result. Redact credentials and tokens. Keep evidence reproducible and concise.
