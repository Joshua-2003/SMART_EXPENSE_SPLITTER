# Contract & Backlog Reconciliation

**Document Version**: 1.0
**Date**: 2026-09-21
**Status**: Implemented-Ready
**Owner Backlog Item**: HARD-001 — Reconcile Contract and Backlog Coverage (Phase 5)

---

## 1. Purpose

This document records the explicit delivery decisions that reconcile the API
contract (`docs/API_CONTRACT.json`), the PRD (`docs/PRD.md`), the system design
(`docs/SYSTEM_DESIGN.md`), the database schema (`docs/DATABASE_SCHEMA.sql`), the
implementation, and the backlog (`docs/BACKLOG.md`). Every endpoint documented in
the API contract now has one explicit delivery decision and evidence location, so
no endpoint is silently unimplemented.

The ordering in `docs/BACKLOG.md` governs when sources conflict. Where a policy was
implemented in code but never written down, this document is the canonical policy
record going forward.

---

## 2. Endpoint Delivery Matrix

Legend:
- **Implemented** — the endpoint exists in the backend, returns the documented
  envelope, and is consumed by the frontend.
- **Deferred** — the endpoint is in MVP contract scope but its implementation is
  explicitly tracked by a later backlog item; no silent fallback is presented.
- **Not in MVP** — the endpoint is documented for the future but excluded from MVP.

| Contract ID | Method + Path | Decision | Evidence / Tracking |
|---|---|---|---|
| auth-signup | `POST /auth/signup` | Implemented | `backend/src/routes/auth.routes.ts`, `auth.controller.ts`, `auth.service.ts` |
| auth-login | `POST /auth/login` | Implemented | `backend/src/routes/auth.routes.ts` |
| auth-refresh | `POST /auth/refresh` | Not in MVP | Contract `mvpStatus: "NOT_IN_MVP"`; no route registered (intentional) |
| user-get-profile | `GET /users/me` | Implemented | `backend/src/routes/user.routes.ts`, `user.controller.ts` |
| user-update-profile | `PATCH /users/{userId}` | Implemented | `backend/src/routes/user.routes.ts` |
| group-create | `POST /groups` | Implemented | `backend/src/routes/group.routes.ts`, `group.controller.ts` |
| group-list | `GET /groups` | Implemented | `backend/src/routes/group.routes.ts` |
| group-get | `GET /groups/{groupId}` | Implemented | `backend/src/routes/group.routes.ts` |
| group-update | `PATCH /groups/{groupId}` | Implemented | `backend/src/routes/group.routes.ts` |
| **group-delete** | `DELETE /groups/{groupId}` | Implemented | HARD-007 — `backend/src/routes/group.routes.ts`, `group.controller.ts` / `group.service.ts` / `group.repository.ts`; admin-only, 204, cascades via FK `ON DELETE CASCADE` |
| member-add | `POST /groups/{groupId}/members` | Implemented | `backend/src/routes/group.routes.ts` |
| member-remove | `DELETE /groups/{groupId}/members/{userId}` | Implemented | `backend/src/routes/group.routes.ts` |
| **member-list** | `GET /groups/{groupId}/members` | Implemented | HARD-007 — `backend/src/routes/group.routes.ts`, `group.controller.ts` / `group.service.ts` / `group.repository.ts`; group-scoped, member-only, balances match `/settlement` |
| expense-create | `POST /groups/{groupId}/expenses` | Implemented (equal only) | `backend/src/routes/group.routes.ts`, `expense.service.ts` (manual rejected) |
| expense-list | `GET /groups/{groupId}/expenses` | Implemented | `backend/src/routes/group.routes.ts` |
| expense-get | `GET /groups/{groupId}/expenses/{expenseId}` | Implemented | `backend/src/routes/group.routes.ts` |
| payment-mark-completed | `PATCH /groups/{groupId}/expenses/{expenseId}/splits/{splitId}/payment` | Implemented | `backend/src/routes/group.routes.ts`, `payment.service.ts` |
| balance-get | `GET /groups/{groupId}/balance` | Implemented | `backend/src/routes/group.routes.ts` |
| settlement-get | `GET /groups/{groupId}/settlement` | Implemented | `backend/src/routes/group.routes.ts` |
| accountability-history | `GET /groups/{groupId}/members/{userId}/history` | Implemented | `backend/src/routes/group.routes.ts` |
| accountability-overdue | `GET /groups/{groupId}/overdue` | Implemented | `backend/src/routes/group.routes.ts` |
| accountability-reliability | `GET /groups/{groupId}/members/{userId}/reliability` | Implemented | `backend/src/routes/group.routes.ts` |
| dashboard-get | `GET /groups/{groupId}/dashboard` | Implemented | `backend/src/routes/group.routes.ts` |
| notification-list | `GET /notifications` | Implemented | `backend/src/routes/notification.routes.ts` |
| notification-mark-read | `PATCH /notifications/{notificationId}` | Implemented | `backend/src/routes/notification.routes.ts` |

The API contract `summary` block has been corrected to the actual documented
count: **25 endpoints total**, **24 in MVP scope**, with `auth-refresh` the only
explicit `NOT_IN_MVP` entry. The `authentication` category count was corrected to
match the endpoints listed.

---

## 3. Decision Records

### D1 — Group deletion and member listing are explicitly deferred to HARD-007

`DELETE /groups/{groupId}` and `GET /groups/{groupId}/members` are documented MVP
endpoints in the API contract and system design, but the original backlog did not
track them as stories. To keep each backlog item scoped, HARD-001 records the
decision and **defers both endpoints to HARD-007** (Complete Group Delete and
Member List Contract), per the dependency graph `HARD-001 -> HARD-007`.

Implications:
- Both endpoints were implemented by **HARD-007** (Done 2026-09-22) and are now
  registered, protected (admin-only for delete, member-only for listing), and
  verified against the live database; see the matrix above.
- The frontend now consumes `GET /groups/{groupId}/members` for authoritative
  member balances and exposes an admin-only group delete action.

### D2 — Manual expense splits are out of MVP; equal split is the only MVP scope

Sources disagreed on manual splits:
- PRD §7.1 listed "Manual expense splits (equal split only in MVP)" under
  **Not in MVP**, while PRD §4.1 described manual assignment as a core feature.
- The API contract `expense-create` exposed `splitType` values `["equal", "manual"]`
  and a `memberSplits` array without a scope qualifier.
- The system design described handling equal **and** manual splits.

Resolution:
- **MVP supports equal splitting only.** The backend rejects `splitType: "manual"`
  with a documented `400 VALIDATION_ERROR` (`backend/src/services/expense.service.ts`),
  so the runtime behavior already matches this decision.
- `splitType: "manual"` and per-member split amounts remain part of the full API
  design, explicitly deferred to **ADV-001** (Phase 7), where exact cent-level
  reconciliation is defined.
- The contract now annotates `expense-create` with this scope, PRD §4.1 is
  corrected to match §7.1, and the system design notes the restriction.

---

## 4. Policy Records

These policies were previously implemented in code without a documented source of
truth. They are now canonical.

### P1 — Overdue policy

- **Default threshold**: `overdueAfterDays = 7`.
  - Backend default for the dashboard: `DEFAULT_OVERDUE_DAYS = 7` in
    `backend/src/services/dashboard.service.ts`.
  - Overdue endpoint default matches the contract query default of `7`.
- **Due-date behavior**: a split's due date derives from the expense
  `created_at` plus the threshold; there is no separate per-split due date in MVP.
- **Overdue rule**: a split is overdue when it is not completed
  (`payments.status` is `NULL` or `<> 'completed'`) **and**
  `expenses.created_at < NOW() - <threshold days>`.
  Implemented in `backend/src/repositories/accountability.repository.ts`
  (`getOverdueBalancesForGroup`).
- **`daysOverdue`**: computed as the whole-day difference between `created_at`
  and now for non-completed records; it is `null` once the split is completed or
  is within the deadline. History records return `null` for completed entries.
- **Dashboard overdueAlerts**: computed with the same default 7-day threshold and
  derive `oldestOverdue` from the oldest qualifying split.

### P2 — Reliability policy

- **Inputs**: metrics over a member's expense splits in the group
  (`totalPayments`, `completedOnTime`, `completedLate`, `stillPending`).
- **On-time window**: a payment is "on time" when
  `paid_at - expense.created_at <= INTERVAL '7 days'`; otherwise it is
  `completedLate`.
- **Completion rate (score)**: `round(completedOnTime / totalPayments * 100)`,
  0-100. `completedLate` does not count toward the completion rate; `stillPending`
  lowers the effective rate by increasing `totalPayments`.
- **Indicator thresholds** (`backend/src/services/accountability.service.ts`):
  - `totalPayments === 0` (zero history) → **Reliable**
  - `completionRate >= 90` → **Reliable**
  - `completionRate >= 50` → **At Risk**
  - otherwise → **Unreliable**
- **Score field**: the reliability endpoint returns `score = metrics.completionRate`
  (the percentage 0-100). Dashboard/UI default to `Reliable` when no history row
  exists for a member.
- **Zero-history behavior**: a member with no splits qualifies as **Reliable**
  (neutral, not penalized); empty collections are returned for empty histories.

### P3 — Payment lifecycle

- **Decision**: every expense split creates **exactly one** `payments` row with
  `status = 'pending'` and **exactly one** `payment_history` row with
  `status = 'pending'` (linked via `payment_id`) when the expense is created.
  Expense, splits, payments, and payment history are written in the **same
  transaction** (`backend/src/repositories/expense.repository.ts`,
  `createWithSplits`).
- **States**:
  - `pending` — the split's obligation exists and is not yet settled; it is
    counted in balances, settlement counts, overdue queries, history, and the
    `stillPending` reliability metric.
  - `completed` — the obligation is settled. `payments.status = 'completed'`
    with `paid_at` set, and the linked `payment_history` row is updated to
    `'completed'` with `completed_at` in the same transaction as the payment
    update (`backend/src/repositories/payment.repository.ts`,
    `markPaymentCompleted`). There is **no** `pending→overdue` or reverse
    transition endpoint; completion is one-way.
  - `overdue` — a **derived** query state, not persisted: a `pending` split whose
    expense `created_at` is older than the overdue threshold (policy P1). History
    rows written as `'overdue'` exist only in seed data; the history endpoint maps
    any non-`completed` history to `'pending'` per the API contract
    (`status` enum is `completed|pending`).
- **History integrity**: one payment history row per split keeps the lifecycle
  linear (pending → completed) and prevents duplicate history on repeated
  completion. `markPaymentCompleted` updates the existing history row instead of
  inserting; splits that predate materialization (no payment/history rows) are
  backfilled by migration `0003_materialize_payments` and still complete safely
  via the insert fallback.
- **Settled-obligation exclusion**: all balance/settlement/overdue queries
  exclude a split once its payment is `completed` (see §3.3 query patterns and
  the repository implementations), so a completed split no longer contributes to
  owes, pending counts, or overdue amounts.

### P4 — Member removal and open obligations

- **Decision**: member removal is **blocked while the member has any open
  obligation in the group**. This is the "block" branch of HARD-006; no archival
  table exists in the MVP schema, and schema/archival work is out of scope here.
- **Open obligation definition**: the member has at least one non-completed
  expense split in the group where they are either the **debtor**
  (`expense_splits.user_id = member` and `expenses.created_by <> member`) or the
  **creditor** (`expenses.created_by = member` and `expense_splits.user_id <> member`),
  and the linked `payments.status` is `NULL` or `<> 'completed'`. A member's own
  split on an expense they created is excluded, matching the personal-balance
  semantics. Implemented in
  `backend/src/repositories/group.repository.ts` (`hasOpenObligations`).
- **Response**: `DELETE /groups/{groupId}/members/{userId}` returns
  `409 CONFLICT` (`"Member has unsettled obligations ... and cannot be removed"`)
  when the target has open obligations
  (`backend/src/services/group.service.ts`, `removeMember`).
- **Existing rules preserved**: only a group admin may remove members (`403`
  otherwise); an admin cannot remove themselves (`400 VALIDATION_ERROR`); a
  missing group or member returns `404`. Non-admins cannot self-remove because
  the endpoint is admin-only.
- **Historical attribution**: removing a fully settled member deletes only the
  `group_members` row. Their `expense_splits`, `payments`, and `payment_history`
  rows remain (they reference `users`, not `group_members`), so historical
  records stay attributable after removal.
- **Surfacing**: the contract (`docs/API_CONTRACT.json`, `member-remove`), the
  design doc (`docs/SYSTEM_DESIGN.md` §2.4.2), and the members UI
  (`frontend/src/pages/members/MembersPage.tsx` confirmation + error toast)
  reflect this policy.

---

## 5. Verification — Completed statuses

The `completed` status is verified against the source-of-truth tables and the
evidence written for accountability:

- **Source of truth**: `payments.status` (`'pending' | 'completed'`) and
  `payments.paid_at`. Completion is applied within a transaction in
  `backend/src/repositories/payment.repository.ts` (`markPaymentCompleted`),
  which updates the materialized payment row and sets `paid_at` (falling back to
  creating the row for legacy splits).
- **Audit evidence**: the single `payment_history` row per split is updated to
  `status = 'completed'` (with `payment_id` and `completed_at`) in the **same
  transaction** as the payment update. Balances, settlement, overdue, history,
  and reliability reads derive `pending` from `payments.status = 'pending'`
  (left-join), and pending history rows now resolve their expense/split because
  `payment_id` is set at creation.
- **Consumer alignment**: dashboards, balances, settlement, overdue, history, and
  reliability all read from the `payments`/`payment_history` state, so a completed
  payment is reflected consistently after the atomic write.
- **Test evidence**: as of this reconciliation there is **no automated test
  suite** in the repository. Functional verification of the completed-status flow
  is defined in the MVP checklist (`docs` + `.opencode/skills/mvp-qa`); the
  automated regression evidence gap is explicitly tracked by **HARD-009** (Add
  Regression Tests and Clean Verification Gates), which depends on HARD-003/HARD-005.

---

## 6. Follow-ups tracked elsewhere

| Item | Backlog ID | Why it is out of scope here |
|---|---|---|
| Implement `DELETE /groups/{groupId}` and `GET /groups/{groupId}/members` | HARD-007 | Done — implemented in HARD-007 (2026-09-22); see endpoint matrix and HARD-007 resolution |
| Schema constraints, indexes, views consistency | HARD-002 | Derived from HARD-001 (schema phase) |
| Payment lifecycle materialization | HARD-004 | Resolved — every split materializes a pending payment + pending history row at expense creation (Policy P3) |
| Automated regression tests + verification gates | HARD-009 | Test-evidence gap (verification section) |
| Manual / flexible expense splits | ADV-001 | Post-MVP delivery of decision D2 |