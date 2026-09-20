# Project Backlog

## Project Summary

This project delivers a group expense management system for friends, roommates, travelers, and small teams. The MVP focuses on secure authentication, group creation and membership management, shared expense capture, equal-split allocation, payment settlement tracking, group balance visibility, accountability reporting, notifications, and dashboard monitoring. The backlog below is organized to match the documented scope in PRD, System Design, Database Schema, and API Contract while preserving the source-of-truth ordering for any future conflicts.

## Module Summary

| Module | Description | Primary Sources |
|---|---|---|
| AUTH | User signup, login, session access, and profile retrieval/update | PRD, API Contract, DB schema |
| GROUP | Group lifecycle, membership, role assignment, and member management | PRD, API Contract, DB schema |
| EXPENSE | Expense creation, listing, and detail retrieval for group spending | PRD, API Contract, DB schema |
| PAYMENT | Payment completion, personal balance, and settlement tracking | PRD, API Contract, DB schema |
| ACCOUNTABILITY | Payment history, overdue balance detection, and reliability indicator logic | PRD, API Contract, DB schema |
| NOTIFICATION | Notification retrieval and read-state tracking | PRD, API Contract, DB schema |
| DASHBOARD | Group summary and overview reporting | PRD, API Contract, DB schema |
| EMAIL | Email verification, invitations, password recovery, and email reminders | PRD, System Design, Open Questions |
| PLATFORM | Cross-cutting validation, security, reliability, performance, and operational concerns | PRD, System Design, API Contract |
| UX | Accessibility, responsive workflows, feedback states, and user-friendly error handling | PRD, System Design |

## Phase Summary

| Phase | Scope | Stories |
|---|---|---|
| Phase 1: Foundation & Access | Authentication, account access, and core security plumbing | AUTH-001, AUTH-002, AUTH-003 |
| Phase 2: Group & Expense Core | Groups, memberships, and shared expense creation/visibility | GROUP-001, GROUP-002, GROUP-003, GROUP-004, GROUP-005, EXP-001, EXP-002, EXP-003 |
| Phase 3: Settlement & Accountability | Payment completion, balances, overdue tracking, and reliability reporting | PAY-001, PAY-002, PAY-003, ACC-001, ACC-002, ACC-003 |
| Phase 4: Reporting & Notifications | Dashboard, reminders, and read-state notification controls | DASH-001, NOTIF-001 |
| Phase 5: Reconciliation & Production Hardening | Contract/schema alignment, correctness bugs, session reliability, authoritative live state, and regression coverage | HARD-001, HARD-002, HARD-003, HARD-004, HARD-005, HARD-006, HARD-007, HARD-008, HARD-009 |
| Phase 6: Product Completeness & Operational Readiness | Email, durable reminders, validation, UX feedback, accessibility, security, performance, observability, and release operations | PROD-001, PROD-002, PROD-003, PROD-004, PROD-005, PROD-006, PROD-007, PROD-008, PROD-009, PROD-010 |
| Phase 7: Advanced Collaboration & Intelligence | Flexible expense workflows, recurring expenses, analytics, exports, currencies, real-time updates, and payment integrations | ADV-001, ADV-002, ADV-003, ADV-004, ADV-005, ADV-006, ADV-007, ADV-008, ADV-009 |

## Complete Backlog Table

| ID | Module | Phase | Priority | Title | Complexity | Status |
|---|---|---|---|---|---|---|
| AUTH-001 | AUTH | Phase 1 | P0 | User Signup | M | Done |
| AUTH-002 | AUTH | Phase 1 | P0 | User Login | M | Done |
| AUTH-003 | AUTH | Phase 1 | P1 | User Profile Retrieval and Update | M | Done |
| GROUP-001 | GROUP | Phase 2 | P0 | Create Group | M | Done |
| GROUP-002 | GROUP | Phase 2 | P0 | List Groups for Authenticated User | S | Done |
| GROUP-003 | GROUP | Phase 2 | P0 | Get Group Details and Members | M | Done |
| GROUP-004 | GROUP | Phase 2 | P1 | Update Group Details (Admin Only) | S | Done |
| GROUP-005 | GROUP | Phase 2 | P1 | Add and Remove Group Members | M | Done |
| EXP-001 | EXPENSE | Phase 2 | P0 | Create Shared Expense | M | Done |
| EXP-002 | EXPENSE | Phase 2 | P0 | List Group Expenses | S | Done |
| EXP-003 | EXPENSE | Phase 2 | P1 | Get Expense Details | S | Done |
| PAY-001 | PAYMENT | Phase 3 | P0 | Mark Payment as Completed | M | Done |
| PAY-002 | PAYMENT | Phase 3 | P0 | Get Personal Balance in Group | S | Done |
| PAY-003 | PAYMENT | Phase 3 | P1 | Get Group Settlement Status | M | Done |
| ACC-001 | ACCOUNTABILITY | Phase 3 | P1 | Get Member Payment History | M | Done |
| ACC-002 | ACCOUNTABILITY | Phase 3 | P1 | Get Overdue Balances | M | Done |
| ACC-003 | ACCOUNTABILITY | Phase 3 | P1 | Get Member Reliability Indicator | M | Done |
| DASH-001 | DASHBOARD | Phase 4 | P0 | Get Group Dashboard | M | Done |
| NOTIF-001 | NOTIFICATION | Phase 4 | P1 | Manage User Notifications | M | Done |
| HARD-001 | PLATFORM | Phase 5 | P0 | Reconcile Contract and Backlog Coverage | M | Done |
| HARD-002 | DATA | Phase 5 | P0 | Correct Schema Constraints, Indexes, and Views | M | Not Started |
| HARD-003 | PAYMENT | Phase 5 | P0 | Enforce Group-Isolated, Idempotent Settlement | L | Not Started |
| HARD-004 | PAYMENT | Phase 5 | P0 | Define and Materialize Payment Lifecycle | M | Not Started |
| HARD-005 | AUTH | Phase 5 | P0 | Make Authentication Durable Across Reloads | M | Not Started |
| HARD-006 | GROUP | Phase 5 | P0 | Protect Active Obligations During Member Changes | M | Not Started |
| HARD-007 | GROUP | Phase 5 | P1 | Complete Group Delete and Member List Contract | M | Not Started |
| HARD-008 | FRONTEND | Phase 5 | P1 | Remove Mock Fallbacks and Fix Live State Propagation | L | Not Started |
| HARD-009 | QUALITY | Phase 5 | P1 | Add Regression Tests and Clean Verification Gates | L | Not Started |
| PROD-001 | EMAIL | Phase 6 | P0 | Add Email Verification and Password Recovery | M | Not Started |
| PROD-002 | EMAIL | Phase 6 | P0 | Persist Invitations and Email Reminders | L | Not Started |
| PROD-003 | NOTIFICATION | Phase 6 | P1 | Add Notification Triggers, Preferences, and Delivery Status | M | Not Started |
| PROD-004 | UX | Phase 6 | P0 | Standardize Validation and User-Friendly Error States | M | Not Started |
| PROD-005 | UX | Phase 6 | P1 | Complete Responsive and Accessible Workflows | L | Not Started |
| PROD-006 | PLATFORM | Phase 6 | P0 | Harden Authentication and API Security | L | Not Started |
| PROD-007 | PLATFORM | Phase 6 | P1 | Improve Query Performance and Scalability | L | Not Started |
| PROD-008 | PLATFORM | Phase 6 | P1 | Add Observability, Auditability, and Reliability Operations | L | Not Started |
| PROD-009 | QUALITY | Phase 6 | P1 | Establish Release, Backup, and Recovery Readiness | M | Not Started |
| PROD-010 | PLATFORM | Phase 6 | P1 | Define Privacy, Retention, and Data Governance | M | Not Started |
| ADV-001 | EXPENSE | Phase 7 | P0 | Support Manual and Flexible Expense Splits | M | Not Started |
| ADV-002 | EXPENSE | Phase 7 | P1 | Add Expense Editing, Deletion, and Audit History | L | Not Started |
| ADV-003 | EXPENSE | Phase 7 | P1 | Add Categories, Notes, Attachments, and Search | M | Not Started |
| ADV-004 | EXPENSE | Phase 7 | P1 | Add Recurring Expenses and Scheduled Splits | L | Not Started |
| ADV-005 | REPORTING | Phase 7 | P1 | Add Exports and Advanced Reports | M | Not Started |
| ADV-006 | PLATFORM | Phase 7 | P1 | Add Multi-Currency and Localization Support | L | Not Started |
| ADV-007 | PLATFORM | Phase 7 | P1 | Add Real-Time Updates and Conflict Handling | L | Not Started |
| ADV-008 | PAYMENT | Phase 7 | P2 | Integrate External Payment Providers | L | Not Started |
| ADV-009 | DASHBOARD | Phase 7 | P2 | Add Spending Analytics and Smarter Accountability | L | Not Started |

## Phase 1

### AUTH-001

- Backlog ID: AUTH-001
- Title: User Signup
- Module: AUTH
- Phase: Phase 1
- Priority: P0
- Complexity: M
- Status: Done (2026-09-08)

#### User Story
> As a new user, I want to create an account so that I can join groups and manage shared expenses.

#### Description
Implement the user registration flow using the documented JWT-based authentication flow. The backend must validate required fields, enforce email format and password constraints, store a secure password hash, and return a JWT token on successful signup. This story covers the documented signup endpoint and the related database record creation for users.

#### Acceptance Criteria
- A user can submit email, password, and name to create an account.
- Invalid email format or missing required fields are rejected with the documented validation behavior.
- Duplicate emails are prevented using the unique constraint defined in the users table.
- A new user record is created in the users table with a password hash and timestamps.
- Successful signup returns the documented response payload including token and createdAt.
- The response follows the documented success/error schema.

#### Dependencies
> None

#### Database References
- users

#### API References
- POST /auth/signup

#### UI References
- Sign up page
- Authentication entry flow

#### Notes
- Enforce the DB validation rules for email format and non-empty name.
- This story creates the access foundation for all subsequent authenticated flows.

---

### AUTH-002

- Backlog ID: AUTH-002
- Title: User Login
- Module: AUTH
- Phase: Phase 1
- Priority: P0
- Complexity: M
- Status: Done (2026-09-09)

#### User Story
> As a registered user, I want to log in so that I can securely access my groups and account data.

#### Description
Implement the documented login endpoint and token issuance flow. The system must validate user credentials, verify secure password hashes, and return a JWT token with expiration metadata so that the user can authenticate against protected endpoints.

#### Acceptance Criteria
- A user can log in with valid email and password.
- Invalid credentials fail with the documented unauthorized response.
- Missing email or password is rejected with a validation error.
- Successful login returns the documented user payload and token details.
- The token is accepted by the protected routes defined in the API contract.

#### Dependencies
- AUTH-001

#### Database References
- users

#### API References
- POST /auth/login

#### UI References
- Login page
- Authentication session state

#### Notes
- Password verification must align with the stored hash strategy used by the backend.

---

### AUTH-003

- Backlog ID: AUTH-003
- Title: User Profile Retrieval and Update
- Module: AUTH
- Phase: Phase 1
- Priority: P1
- Complexity: M
- Status: Done (2026-09-09)

#### User Story
> As an authenticated user, I want to view and update my profile so that I can keep my account information accurate and current.

#### Description
Implement the authenticated profile endpoints for fetching the current user and updating a user record. This story includes access control, validation for email uniqueness, and return payload handling for the user profile operations.

#### Acceptance Criteria
- An authenticated user can fetch their own profile via the current-user endpoint.
- A user can update their name and email when permitted.
- Updating another user profile is blocked with the documented authorization failure.
- Duplicate email updates are rejected.
- Valid updates persist to the users table and return updated timestamps.

#### Dependencies
- AUTH-001
- AUTH-002

#### Database References
- users

#### API References
- GET /users/me
- PATCH /users/{userId}

#### UI References
- Profile screen
- Account settings screen

#### Notes
- Confirm that update rules match the documented permission model.

---

## Phase 2

### GROUP-001

- Backlog ID: GROUP-001
- Title: Create Group
- Module: GROUP
- Phase: Phase 2
- Priority: P0
- Complexity: M
- Status: Done (2026-09-09)

#### User Story
> As an authenticated user, I want to create a group so that I can organize shared expenses with others.

#### Description
Implement group creation for authenticated users. The API must accept a group name and optional description, create a groups record, and assign the creator as admin. The system should also reflect the admin role in the related membership table.

#### Acceptance Criteria
- An authenticated user can create a group with a valid name.
- A group record is created in the groups table with the admin_id set to the authenticated user.
- A matching group_members record is created for the admin with role = admin.
- Validation rejects empty group names.
- The response includes the expected created group fields and timestamp.

#### Dependencies
- AUTH-002

#### Database References
- groups
- group_members

#### API References
- POST /groups

#### UI References
- Create Group modal
- Group list page

#### Notes
- This is the foundation for all subsequent group-based flows.

---

### GROUP-002

- Backlog ID: GROUP-002
- Title: List Groups for Authenticated User
- Module: GROUP
- Phase: Phase 2
- Priority: P0
- Complexity: S
- Status: Done (2026-09-09)

#### User Story
> As a user, I want to view the groups I belong to so that I can navigate my shared expense activities.

#### Description
Implement the authenticated list groups endpoint and UI behavior for retrieving all group memberships for the current user. The list should include pagination parameters and group metadata required by the contract.

#### Acceptance Criteria
- A user receives only the groups they belong to.
- Each group item includes the required metadata such as groupId, name, description, adminId, role, memberCount, and createdAt.
- Limit and offset work as documented.
- Unauthenticated requests are rejected.

#### Dependencies
- AUTH-002
- GROUP-001

#### Database References
- groups
- group_members

#### API References
- GET /groups

#### UI References
- Group list page
- Dashboard navigation sidebar or cards

#### Notes
- This supports both admin and member views of available groups.

---

### GROUP-003

- Backlog ID: GROUP-003
- Title: Get Group Details and Members
- Module: GROUP
- Phase: Phase 2
- Priority: P0
- Complexity: M
- Status: Done (2026-09-09)

#### User Story
> As a member of a group, I want to view the group details and membership roster so that I can understand the participants and group context.

#### Description
Implement the group detail endpoint that returns basic group information plus the members of the group. Access control requires the caller to be a member of that group; admin-only restrictions are handled as defined by the API contract.

#### Acceptance Criteria
- Only group members can access the group detail endpoint.
- The response includes group metadata and a list of members with role and join timestamp.
- The response clearly distinguishes admin and member roles.
- Non-member access returns the documented forbidden response.
- Missing groups return a 404 response.

#### Dependencies
- AUTH-002
- GROUP-001

#### Database References
- groups
- group_members
- users

#### API References
- GET /groups/{groupId}

#### UI References
- Group detail page
- Members panel

#### Notes
- This screen is foundational for member management and expense flows.

---

### GROUP-004

- Backlog ID: GROUP-004
- Title: Update Group Details (Admin Only)
- Module: GROUP
- Phase: Phase 2
- Priority: P1
- Complexity: S
- Status: Done (2026-09-09)

#### User Story
> As a group admin, I want to update group information so that the group remains accurate and current.

#### Description
Implement the admin-only group update endpoint. This endpoint should accept group name and description updates and restrict mutation to the group admin.

#### Acceptance Criteria
- Only the group admin can update a group.
- Name and description updates persist to the groups table.
- Non-admin attempts are rejected.
- The response includes updatedAt and current group data.

#### Dependencies
- AUTH-002
- GROUP-001
- GROUP-003

#### Database References
- groups

#### API References
- PATCH /groups/{groupId}

#### UI References
- Group settings or edit modal

#### Notes
- Matches the requirements for admin-only update access.

---

### GROUP-005

- Backlog ID: GROUP-005
- Title: Add and Remove Group Members
- Module: GROUP
- Phase: Phase 2
- Priority: P1
- Complexity: M
- Status: Done (2026-09-10)

#### User Story
> As a group admin, I want to add and remove members so that I can control who participates in the group.

#### Description
Implement member management flows for the group. This includes adding a user to a group by email or userId and removing a group member by userId while respecting admin-only authorization and uniqueness constraints.

#### Acceptance Criteria
- An admin can add a valid user to a group.
- Duplicate group membership is prevented by the unique constraint.
- A group admin can remove a user from a group.
- Non-admin attempts to add or remove members are blocked.
- Successful member operations persist to the group_members table.

#### Dependencies
- AUTH-002
- GROUP-001
- GROUP-003

#### Database References
- group_members
- users

#### API References
- POST /groups/{groupId}/members
- DELETE /groups/{groupId}/members/{userId}

#### UI References
- Add member modal
- Group members list

#### Notes
- This story directly supports the group collaboration flow.

---

### EXP-001

- Backlog ID: EXP-001
- Title: Create Shared Expense
- Module: EXPENSE
- Phase: Phase 2
- Priority: P0
- Complexity: M
- Status: Done (2026-09-16)

#### User Story
> As a group member, I want to record a shared expense so that the group can track and settle shared costs accurately.

#### Description
Implement the expense creation flow for authenticated group members. The API must validate group membership, accept expense amount and description, and create one or more split records for the involved members according to the documented equal-split logic in the MVP.

#### Acceptance Criteria
- A valid group member can create a shared expense for the group.
- The expense is stored in the expenses table with group_id, description, amount, and created_by.
- Split records are created in the expense_splits table for affected members.
- Group members cannot create expense records for groups they do not belong to.
- The documented success response includes created expense details and split information.

#### Dependencies
- AUTH-002
- GROUP-001
- GROUP-003

#### Database References
- expenses
- expense_splits
- group_members

#### API References
- POST /groups/{groupId}/expenses

#### UI References
- Create expense modal
- Group expense list

#### Notes
- This is the core financial event for the application.
- MVP scope supports equal splitting; manual split assignment is explicitly excluded from the current scope.

---

### EXP-002

- Backlog ID: EXP-002
- Title: List Group Expenses
- Module: EXPENSE
- Phase: Phase 2
- Priority: P0
- Complexity: S
- Status: Done (2026-09-16)

#### User Story
> As a group member, I want to view the expense history so that I can understand recent and cumulative spending.

#### Description
Implement retrieval of all expenses for a group, with filtering and sorting capabilities as defined in the API contract. The endpoint must respect group membership and return paginated expense data.

#### Acceptance Criteria
- Group members can list expenses for their own groups.
- Expenses include the fields required by the API contract and are sorted by date or amount as requested.
- Limit and offset behavior matches the documented contract.
- Non-members cannot access group expense lists.

#### Dependencies
- AUTH-002
- GROUP-003
- EXP-001

#### Database References
- expenses
- users
- groups

#### API References
- GET /groups/{groupId}/expenses

#### UI References
- Expense list page
- Group activity feed

#### Notes
- Supports the underlying data for dashboard visuals and settlement summaries.

---

### EXP-003

- Backlog ID: EXP-003
- Title: Get Expense Details
- Module: EXPENSE
- Phase: Phase 2
- Priority: P1
- Complexity: S
- Status: Done (2026-09-16)

#### User Story
> As a group member, I want to view a specific expense detail so that I can confirm what was paid and how the split was assigned.

#### Description
Implement the expense detail endpoint to retrieve the full record for a specific expense including split breakdown and related metadata. Access must be restricted to valid group members.

#### Acceptance Criteria
- A valid group member can fetch a single expense by ID.
- The returned payload contains the expense details and member split breakdown.
- Group membership rules are enforced.
- Missing expenses or group mismatches return the appropriate not-found behavior.

#### Dependencies
- AUTH-002
- GROUP-003
- EXP-001

#### Database References
- expenses
- expense_splits
- users

#### API References
- GET /groups/{groupId}/expenses/{expenseId}

#### UI References
- Expense detail modal
- Expense item detail view

#### Notes
- This is a read-only detail view; update/delete endpoints are outside MVP.

---

## Phase 3

### PAY-001

- Backlog ID: PAY-001
- Title: Mark Payment as Completed
- Module: PAYMENT
- Phase: Phase 3
- Priority: P0
- Complexity: M

#### User Story
> As a member who owes a share, I want to mark my payment as complete so that my balance and settlement status reflect the payment.

#### Description
Implement the payment settlement flow that updates a split payment status to completed, records the payment timestamp, and updates the related financial state. The system must enforce the documented authorization rules for who can complete a payment.

#### Acceptance Criteria
- A member can mark their own payment as completed.
- Admin may also complete payment if permitted by the documented access rules.
- Invalid status values are rejected.
- Payment records update in the payments table and the correct timestamp is recorded.
- The payment status changes are reflected in related balance and history data.

#### Dependencies
- AUTH-002
- GROUP-003
- EXP-001

#### Database References
- payments
- expense_splits
- payment_history

#### API References
- PATCH /groups/{groupId}/expenses/{expenseId}/splits/{splitId}/payment

#### UI References
- Payment action in expense or balance views
- Settlement status row

#### Notes
- This story is the settlement trigger for balance and accountability updates.

---

### PAY-002

- Backlog ID: PAY-002
- Title: Get Personal Balance in Group
- Module: PAYMENT
- Phase: Phase 3
- Priority: P0
- Complexity: S
- Status: Done (2026-09-17)

#### User Story
> As a group member, I want to see my current balance so that I know what I owe or am owed in the group.

#### Description
Implement the personal balance endpoint so that authenticated members can retrieve their current balance in a group, including the net amount and updated timestamp. This drive sustains view logic for personal financial state.

#### Acceptance Criteria
- A user can fetch their current balance in a specific group.
- The response includes the userId, groupId, balance status, and lastUpdated.
- Non-members cannot access balances for another user's group context.
- The output reflects the latest recorded payment and expense states.

#### Dependencies
- AUTH-002
- GROUP-003
- EXP-001
- PAY-001

#### Database References
- payments
- expense_splits
- groups
- users

#### API References
- GET /groups/{groupId}/balance

#### UI References
- Personal balance panel
- Member responsibility summary

#### Notes
- Uses the same balance logic that the dashboard relies on.

---

### PAY-003

- Backlog ID: PAY-003
- Title: Get Group Settlement Status
- Module: PAYMENT
- Phase: Phase 3
- Priority: P1
- Complexity: M
- Status: Done (2026-09-17)

#### User Story
> As a group admin or member, I want to see settlement status across all members so that I can quickly identify who has paid and who has not.

#### Description
Implement the group settlement summary endpoint that reveals the payment status for all members in a group. The endpoint should return settlement-level information and support the accountability dashboard needs.

#### Acceptance Criteria
- A group member can fetch the settlement status for the group.
- The response includes per-member payment state and totals.
- Non-members cannot access the settlement summary.
- The output remains synchronized with payment completion history.

#### Dependencies
- AUTH-002
- GROUP-003
- PAY-001

#### Database References
- payments
- expense_splits
- users
- groups

#### API References
- GET /groups/{groupId}/settlement

#### UI References
- Settlement tracking table
- Group overview card

#### Notes
- This is the settlement companion to the personal balance endpoint.

---

### ACC-001

- Backlog ID: ACC-001
- Title: Get Member Payment History
- Module: ACCOUNTABILITY
- Phase: Phase 3
- Priority: P1
- Complexity: M
- Status: Done (2026-09-17)

#### User Story
> As a group member or admin, I want to view a member's payment history so that I can understand payment behavior and accountability.

#### Description
Implement the payment history endpoint to return a member's historical payment activity and the derived reliability indicator. Access should be restricted to the relevant member or the group admin according to the contract.

#### Acceptance Criteria
- A valid member or admin can request payment history for a group member.
- Results include the payment history records required by the contract.
- Pagination with limit and offset is supported.
- Unauthorized history access is rejected.

#### Dependencies
- AUTH-002
- GROUP-003
- PAY-001

#### Database References
- payment_history
- payments
- users
- groups

#### API References
- GET /groups/{groupId}/members/{userId}/history

#### UI References
- Member history panel
- Accountability detail view

#### Notes
- This is a key deliverable for the accountability feature set.

---

### ACC-002

- Backlog ID: ACC-002
- Title: Get Overdue Balances
- Module: ACCOUNTABILITY
- Phase: Phase 3
- Priority: P1
- Complexity: M
- Status: Done (2026-09-17)

#### User Story
> As a group member or admin, I want to see overdue balances so that unpaid obligations are highlighted and addressed promptly.

#### Description
Implement the overdue balance query for a group. The system should identify payments or balances that exceed the configured overdue threshold and return the relevant records for highlighting within the group overview and reminders flow.

#### Acceptance Criteria
- The endpoint returns overdue balances for group members when present.
- The overdue result reflects the documented group-level data model.
- Only valid group members can request overdue balances.
- The return includes group and member identifiers needed for visibility.

#### Dependencies
- AUTH-002
- GROUP-003
- PAY-001

#### Database References
- payments
- payment_history
- expense_splits
- groups

#### API References
- GET /groups/{groupId}/overdue

#### UI References
- Overdue balance highlight
- Admin oversight panel

#### Notes
- This story supports accountability highlighting and reminder logic.

---

### ACC-003

- Backlog ID: ACC-003
- Title: Get Member Reliability Indicator
- Module: ACCOUNTABILITY
- Phase: Phase 3
- Priority: P1
- Complexity: M
- Status: Done (2026-09-17)

#### User Story
> As a group member, I want to see a member's reliability indicator so that I can understand payment consistency before making financial decisions.

#### Description
Implement the member reliability indicator endpoint. The API should calculate a reliability summary using payment history and payment completion rates and return the derived status and metrics. This functionality is explicitly part of the accountability differentiation in the PRD.

#### Acceptance Criteria
- A valid group member can request reliability information for a member in the group.
- The endpoint returns the expected metrics such as totalPayments, completionRate, and the reliability indicator value.
- The calculation is derived from payment history and completion data in the documented schema.
- Non-member access is blocked.

#### Dependencies
- AUTH-002
- GROUP-003
- PAY-001
- ACC-001

#### Database References
- payment_history
- payments
- users
- groups

#### API References
- GET /groups/{groupId}/members/{userId}/reliability

#### UI References
- Reliability indicator badge
- Accountability detail card

#### Notes
- The exact score formula is not fully specified in the docs; the implementation should follow the documented reliability concept and the data model available.

---

### DASH-001

- Backlog ID: DASH-001
- Title: Get Group Dashboard
- Module: DASHBOARD
- Phase: Phase 4
- Priority: P0
- Complexity: M
- Status: Done (2026-09-18)

#### User Story
> As a group member or admin, I want a dashboard overview so that I can quickly understand spending, balances, recent activity, and overdue alerts.

#### Description
Implement the complete group dashboard endpoint aggregating the data needed for a summary view: member balances, recent expenses, overdue alerts, and group statistics. This will serve as the main overview for the application.

#### Acceptance Criteria
- A group member can fetch dashboard data for a valid group.
- The response includes core group summary information and a member balance list.
- Recent expense data and overdue alerts are returned in the documented structure.
- Non-members cannot access dashboard data.

#### Dependencies
- AUTH-002
- GROUP-003
- EXP-002
- PAY-002
- PAY-003
- ACC-002

#### Database References
- groups
- group_members
- expenses
- expense_splits
- payments
- payment_history

#### API References
- GET /groups/{groupId}/dashboard

#### UI References
- Group dashboard page
- Admin overview screen
- Recent activity section

#### Notes
- This story synthesizes the data from several earlier stories and is central to the MVP experience.

---

### NOTIF-001

- Backlog ID: NOTIF-001
- Title: Manage User Notifications
- Module: NOTIFICATION
- Phase: Phase 4
- Priority: P1
- Complexity: M
- Status: Done (2026-09-18)

#### User Story
> As a user, I want to view my notifications and mark them as read so that I can stay informed about overdue balances and payment reminders.

#### Description
Implement the user notification endpoints for listing notifications and marking them as read. The system should support the documented notification types and read tracking required by the schema.

#### Acceptance Criteria
- A user can retrieve their notifications with pagination.
- Unread and read notifications are distinguished correctly.
- A notification can be marked as read.
- Invalid notification IDs return the appropriate not-found behavior.

#### Dependencies
- AUTH-002
- ACC-002

#### Database References
- notifications
- users
- groups

#### API References
- GET /notifications
- PATCH /notifications/{notificationId}

#### UI References
- Notification center
- User alert feed

#### Notes
- Notification delivery and scheduling are future enhancement work; this story covers the documented MVP notification behavior only.

---

## Phase 5

Phase 5 is a required stabilization phase before treating the MVP as production-ready. It addresses defects found by comparing the PRD, system design, API contract, database artifacts, and current frontend/backend implementation.

### HARD-001: Reconcile Contract and Backlog Coverage

- **Priority:** P0
- **Status:** Done (2026-09-21)
- **Scope:** Reconcile the API contract, PRD, schema, implementation, and backlog so every documented endpoint has an explicit delivery decision. Resolve the manual-split MVP mismatch and document overdue and reliability policies.
- **Acceptance criteria:** `DELETE /groups/{groupId}` and `GET /groups/{groupId}/members` are implemented and tested or explicitly deferred everywhere; manual splits have one consistent scope; overdue threshold, due-date behavior, reliability thresholds, zero-history behavior, and score formula are documented; completed statuses are verified against source and test evidence.
- **Resolution:** See `docs/RECONCILIATION.md` for the endpoint delivery matrix and decision records. `DELETE /groups/{groupId}` and `GET /groups/{groupId}/members` are explicitly deferred to HARD-007; manual splits are resolved to equal-only MVP (backend already rejects `manual`) with delivery tracked by ADV-001; overdue (7-day threshold, due-date from expense `created_at`) and reliability (90/50 thresholds, zero-history = Reliable, score = completionRate) policies are documented; completed statuses are verified against `payments`/`payment_history` source and the automated test-evidence gap is tracked by HARD-009.

### HARD-002: Correct Schema Constraints, Indexes, and Views

- **Priority:** P0
- **Status:** Not Started
- **Scope:** Make the SQL schema, Drizzle schema, migrations, and documented views mutually executable and consistent. Fix `NOT NULL` plus `ON DELETE SET NULL` contradictions and replace the unsupported payment index expression.
- **Acceptance criteria:** User deletion behavior is explicitly selected and consistent; the payment lookup index is valid PostgreSQL and migrated where required; documented balance/outstanding views either exist and are tested or are removed; fresh migration and seed succeed.

### HARD-003: Enforce Group-Isolated, Idempotent Settlement

- **Priority:** P0
- **Status:** Not Started
- **Scope:** Correct settlement aggregation so it cannot include expenses from another group, and make repeated payment completion requests deterministic.
- **Acceptance criteria:** Settlement queries constrain expenses, splits, and payments to the requested group; repeated completion does not duplicate history; payment and history writes are atomic; regression coverage includes a user in multiple groups.

### HARD-004: Define and Materialize Payment Lifecycle

- **Priority:** P0
- **Status:** Not Started
- **Scope:** Decide whether every expense split creates a pending payment and history record at expense creation, then apply the selected lifecycle consistently across balances, overdue queries, history, and reliability.
- **Acceptance criteria:** Every split has a deterministic status from creation through completion; pending/completed/overdue semantics are documented; settled obligations are excluded correctly; expense creation and initial payment materialization are transactional.

### HARD-005: Make Authentication Durable Across Reloads

- **Priority:** P0
- **Status:** Not Started
- **Scope:** Restore authenticated sessions safely and clear credentials on logout. Initialize Axios authentication handling before protected data requests can run.
- **Acceptance criteria:** A valid stored token hydrates the session and current user after reload; invalid tokens clear auth and route to login; logout removes the token and cached protected state; interceptors are ready before startup requests.

### HARD-006: Protect Active Obligations During Member Changes

- **Priority:** P0
- **Status:** Not Started
- **Scope:** Prevent member removal from silently orphaning expense splits, payments, and accountability records. Define behavior for members with open obligations.
- **Acceptance criteria:** Removal is blocked for unsettled obligations or the documented settlement/archival policy is applied; historical records remain attributable; admin, self-removal, and non-admin rules are tested; the policy is reflected in the contract and UI.

### HARD-007: Complete Group Delete and Member List Contract

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Close the contract gap for group deletion and the member list endpoint, including authorization, cascade behavior, and balance payloads.
- **Acceptance criteria:** Both endpoints are registered, protected, and return documented payloads; deletion is admin-only and cascade behavior is verified; member listing is group-scoped and returns correct balances; frontend actions match the contract.

### HARD-008: Remove Mock Fallbacks and Fix Live State Propagation

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Make live API responses the source of truth in authenticated screens. Remove silent mock fallback and ensure settlement, reminders, and post-mutation state reflect server data.
- **Acceptance criteria:** Protected pages do not initialize from mock records; API failures show explicit loading/empty/error states; settlement renders authoritative balances for every member; reminders persist through the backend or are removed until persistence exists.

### HARD-009: Add Regression Tests and Clean Verification Gates

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Add automated coverage and build checks for the high-risk contracts and known regressions before further feature expansion.
- **Acceptance criteria:** Backend tests cover authorization, group isolation, idempotent payment completion, member removal, pagination, and cascades; frontend tests cover reload hydration, logout cleanup, live settlement, and API errors; migration/seed/build/lint/type checks are reproducible; the Dashboard utility warning is resolved or tracked.

## Phase 6

Phase 6 closes the product and operational gaps that prevent the MVP from being dependable for real users. It covers email delivery, durable alerts, form and API validation, user-facing failures, accessibility, security, performance, monitoring, recovery, and privacy.

### PROD-001: Add Email Verification and Password Recovery

- **Priority:** P0
- **Status:** Not Started
- **Scope:** Add verified email ownership, forgot-password requests, expiring reset tokens, password reset, and safe user-facing email flows.
- **Acceptance criteria:** Signup can require email verification according to an agreed policy; reset tokens are single-use, hashed at rest, expiring, and never logged; reset responses do not reveal whether an email exists; expired and reused tokens return friendly errors; email delivery failures are observable and retryable.

### PROD-002: Persist Invitations and Email Reminders

- **Priority:** P0
- **Status:** Not Started
- **Scope:** Replace direct-only member addition and frontend-only reminders with invitation records, acceptance/decline flows, secure invite links, and opt-in email reminders for overdue balances.
- **Acceptance criteria:** Invites can target registered or unregistered email addresses; invite tokens expire and cannot be reused; accepting an invite creates membership transactionally; duplicate, revoked, expired, and self-invites are handled clearly; reminders are persisted and rate-limited.

### PROD-003: Add Notification Triggers, Preferences, and Delivery Status

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Generate in-app notifications from expense creation, payment changes, invitations, overdue detection, and reminders. Add per-user preferences and delivery status without exposing other users' notifications.
- **Acceptance criteria:** Each trigger is idempotent; notification type and group context are preserved; users can mute categories or channels; unread counts remain correct; failed delivery is visible to operators and does not block financial transactions.

### PROD-004: Standardize Validation and User-Friendly Error States

- **Priority:** P0
- **Status:** Not Started
- **Scope:** Align client and server validation for UUIDs, amounts, decimal precision, dates, pagination, split membership, names, emails, and allowed state transitions. Standardize API errors and map them to actionable UI messages.
- **Acceptance criteria:** Invalid, missing, empty, negative, oversized, duplicate, stale, and cross-group inputs are rejected consistently; errors use the documented status/code/message/timestamp shape; forms identify the affected field; network, timeout, conflict, forbidden, and server failures have recoverable UI states; technical details are not shown to users.

### PROD-005: Complete Responsive and Accessible Workflows

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Audit all auth, group, expense, settlement, accountability, notification, and profile screens for mobile behavior, keyboard operation, focus management, contrast, semantics, and empty/loading/error states.
- **Acceptance criteria:** Core flows work at mobile and desktop widths without clipped tables or overlapping controls; dialogs trap focus and close safely; forms have labels and accessible validation; status is not conveyed by color alone; screen-reader names, keyboard navigation, and reduced-motion behavior are covered by checks.

### PROD-006: Harden Authentication and API Security

- **Priority:** P0
- **Status:** Not Started
- **Scope:** Reduce token exposure and abuse risk and add defense-in-depth around authentication and protected resources.
- **Acceptance criteria:** Token storage strategy is reviewed and an HttpOnly/SameSite approach is used where compatible; login/signup/reset endpoints have rate limits and brute-force protection; password policy and hashing parameters are documented; CORS, security headers, request size limits, UUID authorization, and sensitive-data redaction are enforced; secrets are environment-managed and never committed.

### PROD-007: Improve Query Performance and Scalability

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Meet the documented dashboard and balance response targets as data grows through query plans, indexes, bounded queries, caching, and controlled concurrency.
- **Acceptance criteria:** Dashboard responses meet the documented targets on a representative dataset; N+1 queries and unbounded result sets are removed; indexes match real filters and joins; expensive balance calculations have an explicit cache or aggregation strategy; connection-pool, timeout, and pagination limits are configured.

### PROD-008: Add Observability, Auditability, and Reliability Operations

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Add structured logs, request correlation, metrics, health checks, error tracking, and an audit trail for security-sensitive and admin actions.
- **Acceptance criteria:** Operators can trace a request without logging passwords or tokens; readiness and liveness checks cover API and database dependencies; failures expose actionable context; group deletion, membership, expense, payment, and role changes have actor/time/action records; alert thresholds and ownership are documented.

### PROD-009: Establish Release, Backup, and Recovery Readiness

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Define environment configuration, migration rollout, rollback, backup, restore, disaster recovery, and deployment verification procedures.
- **Acceptance criteria:** Development, test, and production configuration is separated; migrations are repeatable and reviewed; automated backups have retention and encryption; restore drills demonstrate recoverable data; deployment health checks and rollback steps are documented; CI runs typecheck, lint, tests, migration validation, and builds.

### PROD-010: Define Privacy, Retention, and Data Governance

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Resolve the undocumented lifecycle of accounts, groups, payment history, notifications, invitations, and email delivery data.
- **Acceptance criteria:** Data classification, retention, deletion/export behavior, account deactivation, group dissolution, and notification cleanup are documented; personal data access is limited by role; email preferences and consent are recorded; logs and backups follow the retention policy.

## Phase 7

Phase 7 contains advanced capabilities identified in the PRD, project brief, system design, and future-enhancement list. These should follow Phases 5 and 6 because they increase data, consistency, and operational complexity.

### ADV-001: Support Manual and Flexible Expense Splits

- **Priority:** P0
- **Status:** Not Started
- **Scope:** Implement manual amount, percentage, and selected-member splits with exact cent-level reconciliation.
- **Acceptance criteria:** Split amounts equal the expense total exactly; duplicate members, non-members, zero/negative values, excessive precision, and missing participants are rejected; rounding is deterministic and visible; equal and manual modes share one validated contract.

### ADV-002: Add Expense Editing, Deletion, and Audit History

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Add controlled expense update/delete workflows with rules for existing payments, recalculation, confirmation, and immutable audit history.
- **Acceptance criteria:** Permissions are explicit; settled expenses cannot be changed silently; dependent payments and balances are recalculated transactionally; destructive actions require confirmation; users can see who changed what and when.

### ADV-003: Add Categories, Notes, Attachments, and Search

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Improve expense context and retrieval with categories, notes, optional receipts, filters, and full-text search.
- **Acceptance criteria:** File type/size/access checks protect receipts; search and filters are group-scoped and paginated; attachments are private by authorization; category changes do not alter financial calculations.

### ADV-004: Add Recurring Expenses and Scheduled Splits

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Support recurring rent, utilities, subscriptions, and other predictable group expenses with schedule control and failure handling.
- **Acceptance criteria:** Recurrence rules, timezone, start/end, pause, and next-run state are explicit; duplicate runs are prevented; generated expenses are traceable to a schedule; membership changes are handled before generating splits; failures are retried and surfaced.

### ADV-005: Add Exports and Advanced Reports

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Export authorized expense, balance, settlement, and accountability data to CSV/PDF and provide date-range summaries.
- **Acceptance criteria:** Exports are group-scoped, paginated or streamed, and authorization-checked; totals reconcile with the dashboard; large exports do not block request workers; generated files expire and are protected.

### ADV-006: Add Multi-Currency and Localization Support

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Add group currency, locale-aware formatting, timezone handling, and an explicit exchange-rate policy.
- **Acceptance criteria:** Currency is stored with financial records; no floating-point arithmetic changes totals; rates and conversion timestamps are auditable; users see consistent date/number formats; mixed-currency expenses are either supported explicitly or rejected clearly.

### ADV-007: Add Real-Time Updates and Conflict Handling

- **Priority:** P1
- **Status:** Not Started
- **Scope:** Synchronize group activity, balances, payments, and notifications through WebSocket or server-sent events with reconnect and stale-state handling.
- **Acceptance criteria:** Authorized clients receive only group-appropriate events; reconnects do not duplicate updates; optimistic changes reconcile with server truth; versioning or conflict rules prevent lost updates; polling remains a fallback.

### ADV-008: Integrate External Payment Providers

- **Priority:** P2
- **Status:** Not Started
- **Scope:** Evaluate and optionally integrate GCash, Stripe, PayPal, or another provider for payment initiation and verified webhooks.
- **Acceptance criteria:** Provider selection, fees, supported countries/currencies, refund behavior, and compliance responsibilities are documented; webhook signatures and idempotency are enforced; the app never stores raw payment credentials; provider state cannot bypass internal authorization.

### ADV-009: Add Spending Analytics and Smarter Accountability

- **Priority:** P2
- **Status:** Not Started
- **Scope:** Add category/time/member trends, settlement completion metrics, configurable reliability policies, and explainable accountability insights.
- **Acceptance criteria:** Analytics are group-scoped and privacy-aware; reliability calculations are explainable and not presented as credit scores; small-sample and no-history states are neutral; metrics have documented definitions and aggregation windows; ML predictions remain opt-in and out of financial decision automation.

## Dependency Graph

```text
AUTH-001
    ↓
AUTH-002
    ↓
GROUP-001
    ├──> GROUP-002
    ├──> GROUP-003
    ├──> GROUP-004
    └──> GROUP-005

GROUP-003
    ├──> EXP-001
    ├──> EXP-002
    └──> EXP-003

EXP-001
    ├──> PAY-001
    ├──> PAY-002
    └──> PAY-003

PAY-001
    ├──> ACC-001
    ├──> ACC-002
    └──> ACC-003

PAY-002
    └──> DASH-001

PAY-003
    └──> DASH-001

ACC-002
    └──> NOTIF-001

DASH-001
    └──> UI polish and validation hardening

Phase 5 hardening dependencies:

HARD-001
    ├──> HARD-002
    ├──> HARD-004
    └──> HARD-007

HARD-003
    └──> HARD-009

HARD-004
    ├──> HARD-003
    └──> HARD-009

HARD-005
    └──> HARD-009

HARD-006
    └──> HARD-009

HARD-007
    └──> HARD-008

HARD-008
    └──> HARD-009

Phase 6 and Phase 7 dependencies:

HARD-001
    └──> PROD-004

HARD-004
    └──> PROD-003

HARD-005
    └──> PROD-006

HARD-009
    ├──> PROD-001
    ├──> PROD-004
    ├──> PROD-005
    └──> PROD-009

PROD-001
    └──> PROD-002

PROD-002
    └──> PROD-003

PROD-004
    ├──> ADV-001
    └──> ADV-002

PROD-006
    ├──> PROD-008
    └──> ADV-008

PROD-007
    └──> ADV-005

PROD-009
    └──> ADV-004

ADV-001
    ├──> ADV-002
    └──> ADV-004

ADV-002
    └──> ADV-005
```

## Recommended Implementation Order

- AUTH-001
- AUTH-002
- GROUP-001
- GROUP-002
- GROUP-003
- GROUP-005
- EXP-001
- EXP-002
- EXP-003
- PAY-001
- PAY-002
- PAY-003
- ACC-001
- ACC-002
- ACC-003
- DASH-001
- NOTIF-001
- HARD-001
- HARD-002
- HARD-003
- HARD-004
- HARD-005
- HARD-006
- HARD-007
- HARD-008
- HARD-009
- PROD-001
- PROD-002
- PROD-004
- PROD-005
- PROD-006
- PROD-009
- PROD-003
- PROD-007
- PROD-008
- PROD-010
- ADV-001
- ADV-002
- ADV-003
- ADV-004
- ADV-005
- ADV-006
- ADV-007
- ADV-008
- ADV-009

## Risks & Missing Requirements

- Manual expense split assignment is explicitly out of MVP scope; the implementation should not add custom split logic unless a later requirement changes the project scope. HARD-001 reconciled this as equal-only MVP and annotated the contract, PRD, and system design accordingly; manual splitting is tracked as ADV-001.
- Real-time updates are explicitly listed as future work and should not be assumed as a required MVP feature.
- Automated reminder scheduling is documented as a future enhancement; the current notification story only covers retrieval and read-state tracking.
- Reminder controls currently update frontend-only state; they are not durable notifications until a persistence flow is implemented.
- The frontend retains mock-state initialization and silent fallbacks in several authenticated paths; this must not be treated as production data.
- The API contract documents group deletion and member listing, but the original backlog did not track them as stories. HARD-001 resolved this with an explicit deferral to HARD-007, recorded in docs/RECONCILIATION.md and annotated in the contract.
- Overdue threshold, due-date behavior, reliability thresholds, zero-history behavior, and the reliability score formula are now documented as canonical policy in docs/RECONCILIATION.md (HARD-001).
- Payment settlement has correctness risks around cross-group aggregation, repeated completion requests, and delayed creation of pending payment rows.
- Schema artifacts disagree on foreign-key deletion behavior, payment indexes, and documented views; migrations must be the executable source of truth.
- Authentication requires session hydration and logout cleanup to be reliable across browser reloads.
- The PRD's "real-time" value proposition conflicts with its future-scope classification; the product must define whether polling is sufficient for MVP.
- The PRD and API contract describe invitations, but the current member endpoint models direct addition and has no invitation lifecycle.
- No email provider, template system, verification flow, password recovery flow, consent model, or delivery retry policy is defined.
- Notification types exist in the schema, but durable trigger generation, user preferences, delivery channels, deduplication, and delivery status are incomplete.
- API error envelopes and frontend error states need a single contract; raw database/network errors must not reach users.
- Input limits, decimal/date/timezone rules, stale updates, idempotency keys, and edge cases for empty groups and one-person splits need explicit policy.
- JWT in browser storage, absent rate limiting, missing security headers, and undefined secret/rotation policy are security risks requiring a threat-model review.
- Dashboard performance targets lack dataset-size assumptions, query-plan evidence, caching strategy, and operational monitoring.
- Backup, restore, uptime, incident response, audit logging, privacy, retention, and account deletion policies are not defined.
- Advanced features must not be implemented before financial invariants, authorization, and migration safety are tested.
- The API contract contains some abbreviated examples and not every field shape is fully expanded in the summary; implementation should validate against the current backend and frontend contracts in use before finalizing payload handling.
- The source document uses DATABASE_SCHEMA.sql rather than DATABASE_SCHEMA.md; the SQL schema remains the authoritative schema artifact for this project.

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-09-08 | Initial backlog generation from PRD, System Design, database schema, and API contract. |
| 1.1 | 2026-09-08 | AUTH-001 (User Signup) completed: backend signup endpoint + frontend wiring. |
| 1.2 | 2026-09-09 | AUTH-002 (User Login) completed: backend login endpoint + frontend wiring; app now starts unauthenticated. |
| 1.3 | 2026-09-09 | AUTH-003 (User Profile Retrieval and Update) completed: protected GET /users/me + PATCH /users/{userId}, auth middleware, Profile page. |
| 1.4 | 2026-09-09 | GROUP-001 (Create Group) completed: POST /groups with transactional group + admin membership creation, Create Group modal wired to real API. |
| 1.5 | 2026-09-09 | GROUP-002 (List Groups for Authenticated User) completed: protected paginated GET /groups with role + memberCount, app-wide group list loading in MainLayout with auto-select. |
| 1.6 | 2026-09-09 | GROUP-003 (Get Group Details and Members) completed: protected GET /groups/{groupId} with member-only access control and member roster join, group details + members loaded into store on active workspace change. |
| 1.7 | 2026-09-09 | GROUP-004 (Update Group Details, Admin Only) completed: protected PATCH /groups/{groupId} with admin-only access control and partial name/description updates, edit modal wired to the live API in GroupsPage. |
| 1.8 | 2026-09-10 | GROUP-005 (Add and Remove Group Members) completed: protected POST /groups/{groupId}/members and DELETE /groups/{groupId}/members/{userId} with admin-only access control, duplicate prevention, and self-removal guard; AddMemberModal and MembersPage wired to real API. |
| 1.9 | 2026-09-16 | EXP-001 (Create Shared Expense) completed: protected POST /groups/{groupId}/expenses with member-only access control, express-validator rules, transactional expense + equal-split creation (cents-based with remainder to first member); manual split assignment rejected as out of MVP scope; CreateExpenseModal rewired to the real API and limited to equal split. |
| 1.10 | 2026-09-16 | EXP-002 (List Group Expenses) completed: protected GET /groups/{groupId}/expenses with member-only access control, express-validator query rules (limit/offset/sortBy), paginated listing with creator names and per-expense split breakdown sorted by date or amount descending; ExpensesPage reloads real expense data on group change. |
| 1.11 | 2026-09-16 | EXP-003 (Get Expense Details) completed: protected GET /groups/{groupId}/expenses/{expenseId} with member-only access control, group/expense mismatch 404s, and per-split paymentDetail joined from the payments table (coalesced to pending); ExpenseDetailModal now fetches live split details on row click. |
| 1.12 | 2026-09-17 | PAY-001 (Mark Payment as Completed) completed: added MarkPaymentCompleted types, protected PATCH /groups/:groupId/expenses/:expenseId/splits/:splitId/payment (admin-or-self authorization with admin override, 400 on invalid status, 404 group/expense/split, 403 non-member), payment repository upset + payment history, controller + service wired, group PATCH route registered, and ExpenseDetailModal now calls the real markSplitAsPaid API via payment.service with success/error toasts and live member balance updates. |
| 1.13 | 2026-09-17 | ACC-001 (Get Member Payment History) completed: added accountability types, repository (payment_history joined to payments/expenses/expense_splits for history + reliability computed from expense_splits/payments with 7-day overdue threshold), service with 404 group/member and admin-or-self authorization, controller, and protected GET /groups/:groupId/members/:userId/history with limit/offset query validation (defaults 30/0); frontend accountability.service added and MemberAccountabilityModal now fetches the live member history with loading/error handling instead of mockHistory. |
| 1.14 | 2026-09-17 | ACC-002 (Get Overdue Balances) completed: added OverdueSplitItem/OverdueMemberItem/GetOverdueBalancesResult types, repository getOverdueBalancesForGroup (expense_splits joined to expenses/users with LEFT JOIN payments, unpaid splits older than overdueAfterDays grouped per member with totalOverdueAmount and per-split daysOverdue), service with 404 group/member-only 403 authorization, controller, and protected GET /groups/:groupId/overdue with overdueAfterDays query validation (default 7); frontend getOverdueBalances service added, accountabilitySlice overdueBalances state + setOverdueBalances reducer, and AccountabilityPage now fetches live overdue data on group/threshold change with the previous client-side computation retained as fallback. |
| 1.15 | 2026-09-17 | ACC-003 (Get Member Reliability Indicator) completed: unified reliability computation by replacing the crude getMemberReliability with getMemberReliabilityMetrics (expense_splits joined to expenses/users with LEFT JOIN payments, counting completedOnTime/completedLate via paidAt vs created_at 7-day threshold, stillPending, and rounded completionRate) plus a shared pure deriveReliabilityIndicator (0 payments or rate >= 90 => Reliable, >= 50 => At Risk, else Unreliable) also applied to ACC-001's history response; added GetMemberReliabilityResult/ReliabilityMetrics types, service getMemberReliability with 404 group/member and member-only 403 authorization, controller, and protected GET /groups/:groupId/members/:userId/reliability; frontend getMemberReliability service added and MemberAccountabilityModal now fetches the live reliability indicator/score/metrics for the badge and score card with reliabilityScores slice data retained as fallback. |
| 1.16 | 2026-09-18 | DASH-001 (Get Group Dashboard) completed: added DashboardMemberBalance/DashboardRecentExpense/DashboardOverdueAlert/GetGroupDashboardResult types, dashboard repository getDashboardOverview (expense COUNT + SUM with last-5 recent expenses joined to users for creator names), service getGroupDashboard with 404 group/member-only 403 authorization aggregating group meta (name, admin, memberCount) with reused settlement balances (payment.repository getGroupSettlementStatus), unified reliability indicators (new grouped getReliabilityMetricsForGroup + deriveReliabilityIndicator), and AC C-002 overdue alerts (reused getOverdueBalancesForGroup at 7 days, oldestOverdue = oldest overdue split date), controller, and protected GET /groups/:groupId/dashboard; frontend dashboard types/service/slice added and DashboardPage now fetches live dashboard data on group change for the metric cards, recent expense feed, overdue banner, and member balances (with reliability badges) while retaining the existing store/local computation as fallback. |
| 1.17 | 2026-09-18 | NOTIF-001 (Manage User Notifications) completed: added NotificationItem/ListNotificationsResult/MarkNotificationReadResult types, notification repository (listForUser joining notifications to groups for groupName with total + unreadCount and optional read filter, markAsRead scoped to the owner user), service with login-scoped access and 404 for missing/foreign notifications (server-computed updatedAt since the notifications table has no updated_at column per the authoritative SQL schema), controller, and protected GET /notifications with limit/offset/read query validation (defaults 20/0) plus PATCH /notifications/:notificationId requiring read=true; router mounted at /notifications; frontend notification types/service/slice (setNotifications) added and MainLayout notification bell now fetches live notifications on mount and marks individual/all notifications read through the real API with the existing store mock retained as fallback. |
| 1.18 | 2026-09-21 | Added Phase 5: Reconciliation & Production Hardening for contract/schema gaps, settlement and payment correctness bugs, durable authentication, member-removal safety, missing group endpoints, mock-state removal, and regression verification. |
| 1.19 | 2026-09-21 | Added Phase 6: Product Completeness & Operational Readiness for email, invitations, durable notifications, validation, error UX, accessibility, security, performance, observability, recovery, privacy, and release operations; added Phase 7: Advanced Collaboration & Intelligence for flexible splits, expense lifecycle, recurring expenses, exports, currencies, real-time updates, payment integrations, and analytics. |
