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

## Phase Summary

| Phase | Scope | Stories |
|---|---|---|
| Phase 1: Foundation & Access | Authentication, account access, and core security plumbing | AUTH-001, AUTH-002, AUTH-003 |
| Phase 2: Group & Expense Core | Groups, memberships, and shared expense creation/visibility | GROUP-001, GROUP-002, GROUP-003, GROUP-004, GROUP-005, EXP-001, EXP-002, EXP-003 |
| Phase 3: Settlement & Accountability | Payment completion, balances, overdue tracking, and reliability reporting | PAY-001, PAY-002, PAY-003, ACC-001, ACC-002, ACC-003 |
| Phase 4: Reporting & Notifications | Dashboard, reminders, and read-state notification controls | DASH-001, NOTIF-001 |

## Complete Backlog Table

| ID | Module | Phase | Priority | Title | Complexity |
|---|---|---|---|---|---|
| AUTH-001 | AUTH | Phase 1 | P0 | User Signup | M |
| AUTH-002 | AUTH | Phase 1 | P0 | User Login | M |
| AUTH-003 | AUTH | Phase 1 | P1 | User Profile Retrieval and Update | M |
| GROUP-001 | GROUP | Phase 2 | P0 | Create Group | M |
| GROUP-002 | GROUP | Phase 2 | P0 | List Groups for Authenticated User | S |
| GROUP-003 | GROUP | Phase 2 | P0 | Get Group Details and Members | M |
| GROUP-004 | GROUP | Phase 2 | P1 | Update Group Details (Admin Only) | S |
| GROUP-005 | GROUP | Phase 2 | P1 | Add and Remove Group Members | M |
| EXP-001 | EXPENSE | Phase 2 | P0 | Create Shared Expense | M |
| EXP-002 | EXPENSE | Phase 2 | P0 | List Group Expenses | S |
| EXP-003 | EXPENSE | Phase 2 | P1 | Get Expense Details | S |
| PAY-001 | PAYMENT | Phase 3 | P0 | Mark Payment as Completed | M |
| PAY-002 | PAYMENT | Phase 3 | P0 | Get Personal Balance in Group | S |
| PAY-003 | PAYMENT | Phase 3 | P1 | Get Group Settlement Status | M |
| ACC-001 | ACCOUNTABILITY | Phase 3 | P1 | Get Member Payment History | M |
| ACC-002 | ACCOUNTABILITY | Phase 3 | P1 | Get Overdue Balances | M |
| ACC-003 | ACCOUNTABILITY | Phase 3 | P1 | Get Member Reliability Indicator | M |
| DASH-001 | DASHBOARD | Phase 4 | P0 | Get Group Dashboard | M |
| NOTIF-001 | NOTIFICATION | Phase 4 | P1 | Manage User Notifications | M |

## Phase 1

### AUTH-001

- Backlog ID: AUTH-001
- Title: User Signup
- Module: AUTH
- Phase: Phase 1
- Priority: P0
- Complexity: M

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

## Risks & Missing Requirements

- Manual expense split assignment is explicitly out of MVP scope; the implementation should not add custom split logic unless a later requirement changes the project scope.
- Real-time updates are explicitly listed as future work and should not be assumed as a required MVP feature.
- Automated reminder scheduling is documented as a future enhancement; the current notification story only covers retrieval and read-state tracking.
- The API contract contains some abbreviated examples and not every field shape is fully expanded in the summary; implementation should validate against the current backend and frontend contracts in use before finalizing payload handling.
- The source document uses DATABASE_SCHEMA.sql rather than DATABASE_SCHEMA.md; the SQL schema remains the authoritative schema artifact for this project.

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-09-08 | Initial backlog generation from PRD, System Design, database schema, and API contract. |
