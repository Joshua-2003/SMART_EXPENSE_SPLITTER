# System Design Document
## Smart Expense Splitter for Groups (with Real Accountability)

**Architecture Version**: 1.0  
**Date**: April 2026  
**Status**: Implementation-Ready  
**Scope**: MVP (from PRD v1.0)  

---

## 1. System Architecture

### 1.1 High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  React + Tailwind + React Router + Redux                   │
│  - Authentication Pages                                    │
│  - Dashboard (Groups, Expenses, Balances)                 │
│  - Group Management UI                                     │
│  - Expense Management UI                                   │
│  - Member Management & Accountability Views               │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS/JSON
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  API GATEWAY / BACKEND                      │
│  Node.js + Express                                         │
│  - Authentication Service (JWT)                           │
│  - User Management Service                                │
│  - Group Management Service                               │
│  - Expense Management Service                             │
│  - Balance Calculation Service                            │
│  - Payment Settlement Service                             │
│  - Reliability & Accountability Service                   │
│  - Notification Service                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │ SQL
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE                                 │
│  PostgreSQL (Drizzle ORM)                                  │
│  - Users Table                                             │
│  - Groups Table                                            │
│  - Group Members Table                                     │
│  - Expenses Table                                          │
│  - Expense Splits Table                                    │
│  - Payments Table                                          │
│  - Payment History Table                                   │
│  - Notifications Table                                     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Component Layers

#### **Frontend Layer (Client)**
- **Type**: Single Page Application (SPA)
- **Technology**: React 18+, TypeScript
- **State Management**: Redux
- **Routing**: React Router v6+
- **Styling**: Tailwind CSS
- **Communication**: Axios/Fetch for REST API calls
- **Storage**: localStorage (auth tokens), sessionStorage (temporary state)

#### **Backend Layer (Server)**
- **Type**: REST API
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Session**: Token-based (stateless)

#### **Data Layer (Persistence)**
- **Type**: Relational Database
- **System**: PostgreSQL
- **ORM Integration**: Drizzle ORM (migrations, query building)
- **Transactions**: ACID compliance for payment settlements

### 1.3 Data Flow Diagram (Text-Based)

```
USER CREATES EXPENSE:
1. Frontend Form → User inputs expense data (amount, description, members)
2. Frontend Action → Redux dispatches "CREATE_EXPENSE" action
3. API Call → POST /api/expenses with expense payload
4. Backend Route → Express receives and validates request
5. Service Layer → Expense Service creates expense record
6. Split Calculation → Calculate splits per member (equal or manual)
7. Database Write → INSERT into Expenses, Expense_Splits tables
8. Response → Return created expense + splits to frontend
9. Frontend Update → Redux updates state, UI reflects new expense
10. Dashboard Refresh → Balance calculations trigger automatically

USER MARKS PAYMENT AS COMPLETED:
1. Frontend UI → Member clicks "Mark Paid" button
2. API Call → PATCH /api/payments/{paymentId} with {status: "completed"}
3. Backend Processing → Payment Service updates payment record
4. Balance Recalculation → Trigger balance update for affected members
5. Database Update → UPDATE Payments, recalculate member balances
6. History Logging → Log payment in Payment_History for reliability tracking
7. Response → Return updated payment + new balances
8. Frontend Update → Redux updates payment status and member balances
9. UI Refresh → Dashboard shows updated balances, payment highlighted as complete

ADMIN VIEWS GROUP DASHBOARD:
1. Frontend Load → User navigates to group dashboard
2. Redux Check → Look for cached group data with timestamp
3. If stale/missing → API Call → GET /api/groups/{groupId}/dashboard
4. Backend Query → Group Service fetches:
   - All expenses for group
   - All members with current balances
   - Payment settlement status
   - Overdue balances
5. Database Queries → Multiple SELECT statements with JOINs
6. Aggregation → Backend calculates totals, status flags
7. Response → Return complete dashboard data (expenses, members, balances)
8. Redux Store → Actions dispatch to update Redux store
9. UI Render → Components subscribe to Redux state and render dashboard
```

### 1.4 Technology Stack Justification

| Component | Technology | Rationale (from PRD) |
|-----------|-----------|----------|
| Frontend Framework | React | Explicitly specified |
| Styling | Tailwind | Explicitly specified |
| State Management | Redux | Explicitly specified |
| Routing | React Router | Explicitly specified |
| Backend | Node.js + Express | Explicitly specified |
| ORM | Drizzle | Explicitly specified |
| Database | PostgreSQL | Explicitly specified |
| Language | TypeScript | Explicitly specified throughout |
| Auth | JWT | Standard for stateless REST APIs, simple for groups |
| Data Format | JSON | REST API standard |

---

## 2. API Design (REST)

### 2.1 Authentication Endpoints

#### **2.1.1 User Signup**
```
POST /api/auth/signup

Purpose: Register a new user account

Request Body:
{
  "email": "string (unique, valid email)",
  "password": "string (minimum 8 characters)",
  "name": "string (user's full name)"
}

Response Body (201 Created):
{
  "userId": "UUID",
  "email": "string",
  "name": "string",
  "token": "JWT token",
  "createdAt": "ISO 8601 timestamp"
}

Error Responses:
- 400: Invalid email format or password too short
- 409: Email already exists
- 500: Database error
```

#### **2.1.2 User Login**
```
POST /api/auth/login

Purpose: Authenticate user and return JWT token

Request Body:
{
  "email": "string",
  "password": "string"
}

Response Body (200 OK):
{
  "userId": "UUID",
  "email": "string",
  "name": "string",
  "token": "JWT token",
  "expiresIn": 86400
}

Error Responses:
- 400: Missing email or password
- 401: Invalid email or password
- 500: Database error
```

#### **2.1.3 Token Refresh**
```
POST /api/auth/refresh

Purpose: Refresh expired JWT token (optional for MVP)

Headers: 
  Authorization: "Bearer {refresh_token}"

Response Body (200 OK):
{
  "token": "JWT token",
  "expiresIn": 86400
}

Error Responses:
- 401: Invalid or expired token
```

---

### 2.2 User Management Endpoints

#### **2.2.1 Get Current User Profile**
```
GET /api/users/me

Purpose: Retrieve authenticated user's profile information

Headers: 
  Authorization: "Bearer {JWT token}"

Response Body (200 OK):
{
  "userId": "UUID",
  "email": "string",
  "name": "string",
  "createdAt": "ISO 8601 timestamp"
}

Error Responses:
- 401: Invalid or missing token
- 404: User not found
```

#### **2.2.2 Update User Profile**
```
PATCH /api/users/{userId}

Purpose: Update user's profile information

Headers: 
  Authorization: "Bearer {JWT token}"

Request Body (at least one field):
{
  "name": "string (optional)",
  "email": "string (optional, must be unique)"
}

Response Body (200 OK):
{
  "userId": "UUID",
  "email": "string",
  "name": "string",
  "updatedAt": "ISO 8601 timestamp"
}

Error Responses:
- 400: Invalid email format or empty update
- 401: Invalid or missing token
- 403: Cannot update another user's profile
- 404: User not found
- 409: Email already exists
```

---

### 2.3 Group Management Endpoints

#### **2.3.1 Create Group**
```
POST /api/groups

Purpose: Create a new expense group

Headers: 
  Authorization: "Bearer {JWT token}"

Request Body:
{
  "name": "string (required, e.g., 'Baguio Trip')",
  "description": "string (optional)"
}

Response Body (201 Created):
{
  "groupId": "UUID",
  "name": "string",
  "description": "string (or null)",
  "adminId": "UUID (the creator)",
  "createdAt": "ISO 8601 timestamp"
}

Error Responses:
- 400: Missing required fields
- 401: Invalid or missing token
- 500: Database error
```

#### **2.3.2 Get Group Details**
```
GET /api/groups/{groupId}

Purpose: Retrieve group information and members

Headers: 
  Authorization: "Bearer {JWT token}"

Response Body (200 OK):
{
  "groupId": "UUID",
  "name": "string",
  "description": "string (or null)",
  "adminId": "UUID",
  "members": [
    {
      "userId": "UUID",
      "name": "string",
      "email": "string",
      "role": "admin|member",
      "joinedAt": "ISO 8601 timestamp"
    }
  ],
  "createdAt": "ISO 8601 timestamp"
}

Error Responses:
- 401: Invalid or missing token
- 403: User is not a member of this group
- 404: Group not found
```

#### **2.3.3 List User's Groups**
```
GET /api/groups

Purpose: Retrieve all groups the user is a member of

Headers: 
  Authorization: "Bearer {JWT token}"

Query Parameters:
  - limit: number (default: 20, max: 100)
  - offset: number (default: 0, for pagination)

Response Body (200 OK):
{
  "groups": [
    {
      "groupId": "UUID",
      "name": "string",
      "description": "string (or null)",
      "adminId": "UUID",
      "role": "admin|member",
      "memberCount": "number",
      "createdAt": "ISO 8601 timestamp"
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}

Error Responses:
- 401: Invalid or missing token
```

#### **2.3.4 Update Group**
```
PATCH /api/groups/{groupId}

Purpose: Update group details (admin only)

Headers: 
  Authorization: "Bearer {JWT token}"

Request Body (at least one field):
{
  "name": "string (optional)",
  "description": "string (optional)"
}

Response Body (200 OK):
{
  "groupId": "UUID",
  "name": "string",
  "description": "string",
  "updatedAt": "ISO 8601 timestamp"
}

Error Responses:
- 400: Invalid update payload
- 401: Invalid or missing token
- 403: User is not admin of this group
- 404: Group not found
```

#### **2.3.5 Delete Group**
```
DELETE /api/groups/{groupId}

Purpose: Delete a group and all associated data (admin only)

Headers: 
  Authorization: "Bearer {JWT token}"

Response Body (204 No Content)

Error Responses:
- 401: Invalid or missing token
- 403: User is not admin of this group
- 404: Group not found
```

---

### 2.4 Group Member Management Endpoints

#### **2.4.1 Add Member to Group**
```
POST /api/groups/{groupId}/members

Purpose: Invite or add a user to a group (admin only)

Headers: 
  Authorization: "Bearer {JWT token}"

Request Body:
{
  "email": "string (or userId for direct addition)"
}

Response Body (201 Created):
{
  "userId": "UUID",
  "name": "string",
  "email": "string",
  "role": "member",
  "joinedAt": "ISO 8601 timestamp"
}

Error Responses:
- 400: Invalid email or user not found
- 401: Invalid or missing token
- 403: User is not admin of this group
- 404: Group not found
- 409: User is already a member of this group
```

#### **2.4.2 Remove Member from Group**
```
DELETE /api/groups/{groupId}/members/{userId}

Purpose: Remove a user from a group (admin only)

Headers: 
  Authorization: "Bearer {JWT token}"

Response Body (204 No Content)

Error Responses:
- 401: Invalid or missing token
- 403: User is not admin of this group
- 404: Group or member not found
```

#### **2.4.3 List Group Members**
```
GET /api/groups/{groupId}/members

Purpose: Get all members of a group with current balances

Headers: 
  Authorization: "Bearer {JWT token}"

Response Body (200 OK):
{
  "members": [
    {
      "userId": "UUID",
      "name": "string",
      "email": "string",
      "role": "admin|member",
      "balance": "number (positive = owes, negative = receives)",
      "joinedAt": "ISO 8601 timestamp"
    }
  ]
}

Error Responses:
- 401: Invalid or missing token
- 403: User is not a member of this group
- 404: Group not found
```

---

### 2.5 Expense Management Endpoints

#### **2.5.1 Create Expense**
```
POST /api/groups/{groupId}/expenses

Purpose: Create a new shared expense and calculate splits

Headers: 
  Authorization: "Bearer {JWT token}"

Request Body:
{
  "description": "string (e.g., 'Hotel booking')",
  "amount": "number (positive, in decimal)",
  "splitType": "equal|manual",
  "memberSplits": [
    {
      "userId": "UUID",
      "amount": "number (for manual splits, for equal ignored)"
    }
  ]
}

Response Body (201 Created):
{
  "expenseId": "UUID",
  "groupId": "UUID",
  "description": "string",
  "amount": "number",
  "createdBy": "UUID",
  "createdAt": "ISO 8601 timestamp",
  "splits": [
    {
      "splitId": "UUID",
      "userId": "UUID",
      "assignedAmount": "number"
    }
  ]
}

Error Responses:
- 400: Invalid amount, missing fields, or invalid split data
- 401: Invalid or missing token
- 403: User is not a member of this group
- 404: Group or member not found
```

#### **2.5.2 Get Group Expenses**
```
GET /api/groups/{groupId}/expenses

Purpose: Retrieve all expenses for a group

Headers: 
  Authorization: "Bearer {JWT token}"

Query Parameters:
  - limit: number (default: 50)
  - offset: number (default: 0)
  - sortBy: "date|amount" (default: "date", descending)

Response Body (200 OK):
{
  "expenses": [
    {
      "expenseId": "UUID",
      "description": "string",
      "amount": "number",
      "createdBy": "UUID",
      "createdByName": "string",
      "createdAt": "ISO 8601 timestamp",
      "splits": [
        {
          "splitId": "UUID",
          "userId": "UUID",
          "userName": "string",
          "assignedAmount": "number"
        }
      ]
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}

Error Responses:
- 401: Invalid or missing token
- 403: User is not a member of this group
- 404: Group not found
```

#### **2.5.3 Get Expense Details**
```
GET /api/groups/{groupId}/expenses/{expenseId}

Purpose: Retrieve specific expense details

Headers: 
  Authorization: "Bearer {JWT token}"

Response Body (200 OK):
{
  "expenseId": "UUID",
  "groupId": "UUID",
  "description": "string",
  "amount": "number",
  "createdBy": "UUID",
  "createdByName": "string",
  "createdAt": "ISO 8601 timestamp",
  "splits": [
    {
      "splitId": "UUID",
      "userId": "UUID",
      "userName": "string",
      "assignedAmount": "number",
      "paymentStatus": "pending|completed"
    }
  ]
}

Error Responses:
- 401: Invalid or missing token
- 403: User is not a member of this group
- 404: Group or expense not found
```

#### **2.5.4 Update Expense** (Optional - Not in MVP)
```
Status: NOT IN MVP SCOPE
Will be added in future version with more flexible expense management
```

#### **2.5.5 Delete Expense** (Optional - Not in MVP)
```
Status: NOT IN MVP SCOPE
Complex cascading impacts on payments and balances deferred to future
```

---

### 2.6 Payment & Settlement Endpoints

#### **2.6.1 Mark Payment as Completed**
```
PATCH /api/groups/{groupId}/expenses/{expenseId}/splits/{splitId}/payment

Purpose: Mark a split as paid by the member owing it

Headers: 
  Authorization: "Bearer {JWT token}"

Request Body:
{
  "status": "completed"
}

Response Body (200 OK):
{
  "splitId": "UUID",
  "expenseId": "UUID",
  "userId": "UUID",
  "assignedAmount": "number",
  "status": "completed",
  "paidAt": "ISO 8601 timestamp"
}

Error Responses:
- 400: Invalid status value
- 401: Invalid or missing token
- 403: User cannot mark payment for another member (unless admin)
- 404: Split not found
```

#### **2.6.2 Get Member's Personal Balance**
```
GET /api/groups/{groupId}/balance

Purpose: Get current user's balance in a group

Headers: 
  Authorization: "Bearer {JWT token}"

Response Body (200 OK):
{
  "userId": "UUID",
  "groupId": "UUID",
  "totalOwes": "number (positive amount user owes to group)",
  "totalReceives": "number (positive amount group owes to user)",
  "netBalance": "number (owes - receives, positive = owes, negative = owed)",
  "lastUpdated": "ISO 8601 timestamp"
}

Error Responses:
- 401: Invalid or missing token
- 403: User is not a member of this group
- 404: Group not found
```

#### **2.6.3 Get Group Settlement Status**
```
GET /api/groups/{groupId}/settlement

Purpose: Get complete settlement/payment status for all members

Headers: 
  Authorization: "Bearer {JWT token}"

Response Body (200 OK):
{
  "groupId": "UUID",
  "totalGroupExpenses": "number",
  "members": [
    {
      "userId": "UUID",
      "name": "string",
      "totalOwes": "number",
      "totalReceives": "number",
      "pendingPayments": "number (count of unpaid splits)",
      "completedPayments": "number (count of paid splits)"
    }
  ]
}

Error Responses:
- 401: Invalid or missing token
- 403: User is not a member of this group
- 404: Group not found
```

---

### 2.7 Accountability & Reporting Endpoints

#### **2.7.1 Get Member Payment History**
```
GET /api/groups/{groupId}/members/{userId}/history

Purpose: Retrieve payment history for reliability tracking

Headers: 
  Authorization: "Bearer {JWT token}"

Query Parameters:
  - limit: number (default: 30)
  - offset: number (default: 0)

Response Body (200 OK):
{
  "userId": "UUID",
  "userName": "string",
  "paymentHistory": [
    {
      "paymentHistoryId": "UUID",
      "expenseId": "UUID",
      "expenseDescription": "string",
      "assignedAmount": "number",
      "status": "completed|pending",
      "createdAt": "ISO 8601 timestamp",
      "completedAt": "ISO 8601 timestamp (null if pending)",
      "daysOverdue": "number (null if completed or within deadline)"
    }
  ],
  "reliabilityIndicator": "string (Reliable|At Risk|Unreliable)"
}

Error Responses:
- 401: Invalid or missing token
- 403: User is not admin or member viewing own history
- 404: Group or member not found
```

#### **2.7.2 Get Overdue Balances**
```
GET /api/groups/{groupId}/overdue

Purpose: Highlight overdue payments in a group

Headers: 
  Authorization: "Bearer {JWT token}"

Query Parameters:
  - overdueAfterDays: number (default: 7, for flexibility in future)

Response Body (200 OK):
{
  "groupId": "UUID",
  "overdueThreshold": "number of days",
  "overdueMembers": [
    {
      "userId": "UUID",
      "name": "string",
      "totalOverdueAmount": "number",
      "overdueSplits": [
        {
          "splitId": "UUID",
          "expenseDescription": "string",
          "amount": "number",
          "createdAt": "ISO 8601 timestamp",
          "daysOverdue": "number"
        }
      ]
    }
  ]
}

Error Responses:
- 401: Invalid or missing token
- 403: User is not a member of this group
- 404: Group not found
```

#### **2.7.3 Get Member Reliability Indicator**
```
GET /api/groups/{groupId}/members/{userId}/reliability

Purpose: Get calculated reliability score for a member

Headers: 
  Authorization: "Bearer {JWT token}"

Response Body (200 OK):
{
  "userId": "UUID",
  "name": "string",
  "indicator": "string (Reliable|At Risk|Unreliable)",
  "score": "number (0-100, for future expansion)",
  "metrics": {
    "totalPayments": "number",
    "completedOnTime": "number",
    "completedLate": "number",
    "stillPending": "number",
    "completionRate": "number (percentage)"
  },
  "calculatedAt": "ISO 8601 timestamp"
}

Error Responses:
- 401: Invalid or missing token
- 403: User is not a member of this group
- 404: Group or member not found
```

---

### 2.8 Dashboard & Summary Endpoints

#### **2.8.1 Get Group Dashboard**
```
GET /api/groups/{groupId}/dashboard

Purpose: Retrieve complete group dashboard data (all summaries)

Headers: 
  Authorization: "Bearer {JWT token}"

Response Body (200 OK):
{
  "groupId": "UUID",
  "groupName": "string",
  "groupAdmin": "string (name)",
  "memberCount": "number",
  "expenseCount": "number",
  "totalExpenses": "number",
  
  "memberBalances": [
    {
      "userId": "UUID",
      "name": "string",
      "role": "admin|member",
      "totalOwes": "number",
      "totalReceives": "number",
      "pendingPayments": "number",
      "reliabilityIndicator": "string"
    }
  ],
  
  "recentExpenses": [
    {
      "expenseId": "UUID",
      "description": "string",
      "amount": "number",
      "createdBy": "string (name)",
      "createdAt": "ISO 8601 timestamp"
    }
  ],
  
  "overdueAlerts": [
    {
      "userId": "UUID",
      "name": "string",
      "totalOverdueAmount": "number",
      "oldestOverdue": "ISO 8601 timestamp"
    }
  ]
}

Error Responses:
- 401: Invalid or missing token
- 403: User is not a member of this group
- 404: Group not found
```

---

### 2.9 Notifications Endpoints (Basic for MVP)

#### **2.9.1 Get User Notifications**
```
GET /api/notifications

Purpose: Retrieve user's notifications (overdue alerts, settlement reminders)

Headers: 
  Authorization: "Bearer {JWT token}"

Query Parameters:
  - limit: number (default: 20)
  - offset: number (default: 0)
  - read: boolean (optional, filter by read status)

Response Body (200 OK):
{
  "notifications": [
    {
      "notificationId": "UUID",
      "type": "string (overdue_alert|payment_reminder|expense_created)",
      "groupId": "UUID",
      "groupName": "string",
      "message": "string",
      "read": "boolean",
      "createdAt": "ISO 8601 timestamp"
    }
  ],
  "total": "number",
  "unreadCount": "number"
}

Error Responses:
- 401: Invalid or missing token
```

#### **2.9.2 Mark Notification as Read**
```
PATCH /api/notifications/{notificationId}

Purpose: Mark a notification as read

Headers: 
  Authorization: "Bearer {JWT token}"

Request Body:
{
  "read": true
}

Response Body (200 OK):
{
  "notificationId": "UUID",
  "read": true,
  "updatedAt": "ISO 8601 timestamp"
}

Error Responses:
- 401: Invalid or missing token
- 404: Notification not found
```

---

### 2.10 API Response Standards

#### **Success Response Format**
```json
{
  "status": "success",
  "data": { /* endpoint-specific data */ },
  "timestamp": "ISO 8601 timestamp"
}
```

#### **Error Response Format**
```json
{
  "status": "error",
  "code": "error_code (e.g., INVALID_REQUEST, UNAUTHORIZED, NOT_FOUND)",
  "message": "Human-readable error message",
  "details": { /* optional, context-specific details */ },
  "timestamp": "ISO 8601 timestamp"
}
```

#### **HTTP Status Codes**
- 200 OK - Successful GET/PATCH
- 201 Created - Successful POST (resource created)
- 204 No Content - Successful DELETE
- 400 Bad Request - Invalid input data
- 401 Unauthorized - Missing or invalid authentication
- 403 Forbidden - Authenticated but not authorized for resource
- 404 Not Found - Resource does not exist
- 409 Conflict - Resource conflict (duplicate email, already member, etc.)
- 500 Internal Server Error - Server error

---

## 3. Database Schema

### 3.1 Complete Schema Design

#### **Table 1: Users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_users_email (email),
  INDEX idx_users_created_at (created_at)
);
```

**Purpose**: Store user accounts  
**Key Fields**:
- `id`: Unique identifier
- `email`: Unique user identifier for login
- `password_hash`: Bcrypt or Argon2 hashed password
- `name`: User's display name
- `created_at`: Account creation timestamp
- `updated_at`: Last profile update

**Relationships**:
- Referenced by: Groups (admin_id), Group_Members (user_id), Expenses (created_by), Expense_Splits (user_id), Payments (payer_id), Payment_History (user_id)

---

#### **Table 2: Groups**
```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_groups_admin_id (admin_id),
  INDEX idx_groups_created_at (created_at)
);
```

**Purpose**: Store expense groups  
**Key Fields**:
- `id`: Group identifier
- `name`: Group display name
- `description`: Optional group description
- `admin_id`: User who created/manages the group
- `created_at`: Group creation timestamp
- `updated_at`: Last update timestamp

**Relationships**:
- Foreign Key: admin_id → users(id)
- Referenced by: Group_Members (group_id), Expenses (group_id)

---

#### **Table 3: Group_Members**
```sql
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role ENUM('admin', 'member') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(group_id, user_id),
  INDEX idx_group_members_group_id (group_id),
  INDEX idx_group_members_user_id (user_id)
);
```

**Purpose**: Track group membership and roles  
**Key Fields**:
- `id`: Record identifier
- `group_id`: Which group
- `user_id`: Which user
- `role`: Permission level (admin or member)
- `joined_at`: When user joined group

**Relationships**:
- Foreign Keys: group_id → groups(id), user_id → users(id)
- Constraint: Each user can join a group only once (UNIQUE)

---

#### **Table 4: Expenses**
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_expenses_group_id (group_id),
  INDEX idx_expenses_created_by (created_by),
  INDEX idx_expenses_created_at (created_at)
);
```

**Purpose**: Store shared expenses  
**Key Fields**:
- `id`: Expense identifier
- `group_id`: Which group owns this expense
- `description`: What the expense is for
- `amount`: Total amount in decimal (supports currency)
- `created_by`: User who recorded the expense
- `created_at`: When expense was recorded

**Relationships**:
- Foreign Keys: group_id → groups(id), created_by → users(id)
- Referenced by: Expense_Splits (expense_id), Payments (expense_id)

---

#### **Table 5: Expense_Splits**
```sql
CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_amount DECIMAL(12, 2) NOT NULL CHECK (assigned_amount > 0),
  
  UNIQUE(expense_id, user_id),
  INDEX idx_expense_splits_expense_id (expense_id),
  INDEX idx_expense_splits_user_id (user_id)
);
```

**Purpose**: Define individual shares of each expense  
**Key Fields**:
- `id`: Split record identifier
- `expense_id`: Which expense
- `user_id`: Which user owes this split
- `assigned_amount`: How much this user owes for this expense

**Relationships**:
- Foreign Keys: expense_id → expenses(id), user_id → users(id)
- Constraint: Each user gets only one split per expense (UNIQUE)
- Referenced by: Payments (expense_id, user_id connection)

---

#### **Table 6: Payments**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES expense_splits(user_id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  status ENUM('pending', 'completed') DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(expense_id, user_id),
  INDEX idx_payments_expense_id (expense_id),
  INDEX idx_payments_user_id (user_id),
  INDEX idx_payments_status (status),
  INDEX idx_payments_created_at (created_at)
);
```

**Purpose**: Track payment settlement status  
**Key Fields**:
- `id`: Payment record identifier
- `expense_id`: Which expense this payment settles
- `user_id`: Who is making the payment
- `amount`: Amount being paid
- `status`: 'pending' or 'completed'
- `paid_at`: Timestamp when marked as completed
- `created_at`: When payment record was created
- `updated_at`: Last status update

**Relationships**:
- Foreign Keys: expense_id → expenses(id), user_id → users(id)
- Referenced by: Payment_History (payment_id)

---

#### **Table 7: Payment_History**
```sql
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  status ENUM('pending', 'completed', 'overdue') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  
  INDEX idx_payment_history_user_id (user_id),
  INDEX idx_payment_history_group_id (group_id),
  INDEX idx_payment_history_status (status),
  INDEX idx_payment_history_created_at (created_at)
);
```

**Purpose**: Historical record of payment behavior for reliability tracking  
**Key Fields**:
- `id`: History record identifier
- `user_id`: Which user's payment
- `group_id`: In which group
- `payment_id`: Reference to payment record
- `status`: Current payment status
- `created_at`: When tracked
- `completed_at`: When payment was completed

**Relationships**:
- Foreign Keys: user_id → users(id), group_id → groups(id), payment_id → payments(id)
- **Note**: Denormalized for faster reliability indicator calculations

---

#### **Table 8: Notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'overdue_alert', 'payment_reminder', 'expense_created'
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_notifications_user_id (user_id),
  INDEX idx_notifications_group_id (group_id),
  INDEX idx_notifications_read (read),
  INDEX idx_notifications_created_at (created_at)
);
```

**Purpose**: Store notifications for users  
**Key Fields**:
- `id`: Notification identifier
- `user_id`: Recipient user
- `group_id`: Related group
- `type`: Notification category
- `message`: Human-readable message
- `read`: Read status
- `created_at`: Notification timestamp

**Relationships**:
- Foreign Keys: user_id → users(id), group_id → groups(id)

---

### 3.2 Data Relationships Diagram

```
Users (1) ──────(many)─────────► Group_Members (many) ──────(1)─── Groups
                                     │
                                     │ (admin)
                                     └──────────────► Groups
                                     
Users (1) ──────(many)─────────► Expenses (many) ──────(1)─────► Groups
                    (created_by)

Expenses (1) ──────(many)─────────► Expense_Splits (many) ──────(1)─── Users
                                     (assigned shares)
                                     
Expenses (1) ──────(many)─────────► Payments (many) ──────(1)─────► Users
                                     (settlement status)
                                     
Payments (1) ──────(many)─────────► Payment_History (many)
                                     (for auditing)
                                     
Users (1) ──────(many)─────────► Notifications (many) ──────(1)─── Groups
```

---

### 3.3 Query Patterns for Common Operations

#### **Calculate User's Balance in a Group**
```sql
-- Positive = owes, Negative = owed
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
```

#### **Get Outstanding Balances**
```sql
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
```

#### **Get Member Reliability Indicator**
```sql
SELECT 
  COUNT(*) as total_payments,
  SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN p.status = 'pending' AND (NOW() - e.created_at) > INTERVAL '7 days' THEN 1 ELSE 0 END) as overdue
FROM payments p
JOIN expenses e ON p.expense_id = e.id
WHERE p.user_id = $userId
AND e.group_id = $groupId;
```

---

## 4. Module Breakdown

### 4.1 Backend Modules (Node.js + Express)

#### **Module 1: Authentication Module**
**Responsibilities**:
- User registration with email validation
- User login with password verification
- JWT token generation and validation
- Token refresh (if implemented)
- Request authentication middleware

**Key Services**:
- `AuthService`: Register, login, token management
- `PasswordService`: Hash and verify passwords (Bcrypt/Argon2)
- `JWTService`: Generate and validate JWT tokens

**Database Interactions**:
- Read/Write: Users table

**Dependencies**:
- bcryptjs or argon2 library
- jsonwebtoken library
- Express middleware

---

#### **Module 2: User Management Module**
**Responsibilities**:
- Get user profile
- Update user profile
- User data retrieval for frontend

**Key Services**:
- `UserService`: Get, update user records
- `UserValidator`: Validate user input

**Database Interactions**:
- Read/Write: Users table

**Dependencies**:
- Authentication Module (verify JWT)

---

#### **Module 3: Group Management Module**
**Responsibilities**:
- Create groups
- List user's groups
- Get group details
- Update group information
- Delete groups
- Enforce role-based access (admin only)

**Key Services**:
- `GroupService`: Create, read, update, delete groups
- `GroupAccessControl`: Check user permissions per group
- `GroupValidator`: Validate group input

**Database Interactions**:
- Read/Write: Groups, Group_Members tables

**Dependencies**:
- Authentication Module
- User Management Module

---

#### **Module 4: Member Management Module**
**Responsibilities**:
- Add members to groups
- Remove members from groups
- List group members with balances
- Track member roles
- Manage member invitations

**Key Services**:
- `MemberService`: Add, remove, list members
- `RoleService`: Manage admin/member roles
- `MemberValidator`: Validate member operations

**Database Interactions**:
- Read/Write: Group_Members, Users tables

**Dependencies**:
- Group Management Module
- Authentication Module

---

#### **Module 5: Expense Management Module**
**Responsibilities**:
- Create expenses with automatic split calculation
- Retrieve expenses (list and detail)
- Handle equal and manual splits
- Validate expense data
- Calculate shares per member

**Key Services**:
- `ExpenseService`: Create, read expenses
- `SplitCalculator`: Calculate equal or manual splits
- `ExpenseValidator`: Validate expense input

**Database Interactions**:
- Read/Write: Expenses, Expense_Splits tables
- Read: Group_Members table (for member validation)

**Dependencies**:
- Group Management Module
- Member Management Module
- Authentication Module

---

#### **Module 6: Balance Tracking Module**
**Responsibilities**:
- Real-time balance calculation per user per group
- Aggregate balance summaries
- Track who owes/receives what
- Provide balance snapshots

**Key Services**:
- `BalanceService`: Calculate balances
- `BalanceAggregator`: Aggregate group-wide balances
- `BalanceCache`: Cache calculations (optional optimization)

**Database Interactions**:
- Read: Expenses, Expense_Splits, Payments tables

**Dependencies**:
- Expense Management Module
- Payment Settlement Module

---

#### **Module 7: Payment Settlement Module**
**Responsibilities**:
- Mark payments as completed
- Update payment status
- Track payment timestamps
- Ensure data integrity for settlements

**Key Services**:
- `PaymentService`: Update payment status
- `PaymentValidator`: Validate payment updates
- `SettlementService`: Calculate settlement completions

**Database Interactions**:
- Read/Write: Payments table
- Write: Payment_History table (audit trail)

**Dependencies**:
- Expense Management Module
- Balance Tracking Module
- Authentication Module

---

#### **Module 8: Accountability & Reporting Module**
**Responsibilities**:
- Calculate reliability indicators
- Track payment history
- Identify overdue payments
- Generate accountability reports

**Key Services**:
- `ReliabilityService`: Calculate reliability indicator (Reliable|At Risk|Unreliable)
- `HistoryService`: Retrieve and format payment history
- `OverdueService`: Identify and list overdue payments
- `ReportGenerator`: Create summary reports

**Database Interactions**:
- Read: Payment_History, Payments, Expenses tables

**Dependencies**:
- Payment Settlement Module
- Balance Tracking Module

---

#### **Module 9: Notification Module**
**Responsibilities**:
- Create and store notifications
- Retrieve user notifications
- Mark notifications as read
- Generate notification messages

**Key Services**:
- `NotificationService`: Create, read, update notifications
- `NotificationGenerator`: Generate notification messages
- `NotificationQueue`: Queue notifications for delivery (future)

**Database Interactions**:
- Read/Write: Notifications table

**Dependencies**:
- All other modules (for generating notification triggers)

---

#### **Module 10: Middleware & Utilities**
**Responsibilities**:
- JWT authentication middleware
- Error handling middleware
- Request validation middleware
- Logging middleware
- CORS configuration

**Key Components**:
- `AuthMiddleware`: Verify JWT on protected routes
- `ErrorHandler`: Standardize error responses
- `RequestValidator`: Validate request schemas
- `Logger`: Log requests and errors
- `Utilities`: Common helper functions

---

### 4.2 Frontend Modules (React + Redux)

#### **Module 1: Authentication Module**
**Responsibilities**:
- Signup/Login forms and pages
- JWT token storage and retrieval
- Protected route guards
- Logout functionality
- Authentication state management

**Key Components**:
- `SignupPage`: User registration form
- `LoginPage`: User login form
- `ProtectedRoute`: Route guard component
- `AuthGuard`: Check authentication status

**Redux Store**:
- `authSlice`: {token, user, isAuthenticated, loading, error}

**Dependencies**:
- Redux
- React Router
- API Client

---

#### **Module 2: Navigation & Layout Module**
**Responsibilities**:
- Main navigation bar
- Sidebar navigation
- Layout structure
- Header and footer

**Key Components**:
- `Header`: Top navigation
- `Sidebar`: Side navigation menu
- `MainLayout`: Primary layout wrapper
- `Breadcrumbs`: Navigation breadcrumbs

**Dependencies**:
- React Router
- Redux (for user info)

---

#### **Module 3: Group Management UI Module**
**Responsibilities**:
- Create group form/modal
- List user's groups
- View group details
- Edit group information
- Delete group

**Key Components**:
- `GroupsListPage`: Display user's groups
- `GroupDetailPage`: Show group info
- `CreateGroupForm`: Create new group modal
- `EditGroupForm`: Edit group details
- `GroupHeader`: Group title and info display

**Redux Store**:
- `groupsSlice`: {groups, selectedGroup, loading, error}

**Dependencies**:
- Redux
- React Router
- UI Components (Modal, Form, etc.)

---

#### **Module 4: Member Management UI Module**
**Responsibilities**:
- Display group members
- Add members to group
- Remove members from group
- Show member roles
- Display member balances

**Key Components**:
- `MembersListTable`: Display all members
- `AddMemberModal`: Form to add members
- `MemberRow`: Individual member display
- `RemoveMemberButton`: Remove member confirmation
- `MemberBalanceDisplay`: Show member's balance

**Redux Store**:
- `membersSlice`: {members, loading, error}

**Dependencies**:
- Redux
- UI Components (Table, Modal, Button)

---

#### **Module 5: Expense Management UI Module**
**Responsibilities**:
- Create expense form
- Display expense list
- Show expense details
- View split breakdown
- Handle expense filters

**Key Components**:
- `ExpenseListPage`: Display group expenses
- `ExpenseDetailPage`: Show single expense
- `CreateExpenseForm`: Form to create expense
- `ExpenseCard`: Display expense summary
- `SplitTable`: Show split breakdown

**Redux Store**:
- `expensesSlice`: {expenses, selectedExpense, loading, error}

**Dependencies**:
- Redux
- React Router
- UI Components (Form, Table, Card)

---

#### **Module 6: Payment Settlement UI Module**
**Responsibilities**:
- Display personal balance
- Display group settlement status
- Mark payment as completed
- Show payment status
- Highlight pending payments

**Key Components**:
- `PersonalBalancePage`: Show user's balance in group
- `SettlementStatusPage`: Group payment summary
- `BalanceCard`: Display balance information
- `PaymentStatusBadge`: Show payment status
- `MarkPaidButton`: Button to complete payment

**Redux Store**:
- `paymentSlice`: {balances, settlements, loading, error}

**Dependencies**:
- Redux
- UI Components (Card, Badge, Button)

---

#### **Module 7: Accountability & Dashboard Module**
**Responsibilities**:
- Display dashboard overview
- Show payment history
- Display reliability indicators
- Highlight overdue payments
- Generate summary reports

**Key Components**:
- `DashboardPage`: Main dashboard
- `BalanceSummary`: Quick balance overview
- `OverdueAlerts`: Display overdue payments
- `ReliabilityBadge`: Show reliability indicator
- `PaymentHistoryTable`: Payment history list

**Redux Store**:
- `dashboardSlice`: {summary, overdue, reliability, loading}

**Dependencies**:
- Redux
- Data visualization libraries (optional for charts)

---

#### **Module 8: Notifications UI Module**
**Responsibilities**:
- Display notification bell/count
- Show notification list
- Mark notifications as read
- Notification types handling

**Key Components**:
- `NotificationBell`: Bell icon with count
- `NotificationCenter`: Notification list page/modal
- `NotificationItem`: Individual notification display
- `NotificationBadge`: Unread count badge

**Redux Store**:
- `notificationsSlice`: {notifications, unreadCount, loading}

**Dependencies**:
- Redux
- UI Components (Badge, List, Modal)

---

#### **Module 9: Common UI Components Module**
**Responsibilities**:
- Reusable UI components
- Form inputs and validation
- Tables and data displays
- Modals and dialogs
- Buttons and icons

**Key Components**:
- `Form`, `Input`, `Select`, `Textarea`
- `Table`, `TableRow`, `TableCell`
- `Modal`, `Dialog`, `Alert`
- `Button`, `Icon`, `Badge`, `Card`
- `Spinner`, `Toast`, `Skeleton`

**Dependencies**:
- Tailwind CSS
- Icons library

---

#### **Module 10: API Client & State Management**
**Responsibilities**:
- HTTP client configuration
- API call functions
- Redux store setup
- Middleware configuration
- State selectors

**Key Components**:
- `apiClient`: Axios instance with interceptors
- `apiSlices`: Redux slices for different domains
- `store.ts`: Redux store configuration
- `thunks`: Async Redux actions
- `selectors.ts`: Memoized state selectors

**Dependencies**:
- Axios
- Redux Toolkit
- Redux

---

## 5. Authentication Strategy

### 5.1 Authentication Method: JWT (JSON Web Tokens)

**Choice Rationale**:
- Stateless authentication (no session server storage needed)
- Scalable for future distributed systems
- Standard practice for REST APIs
- Simple to implement with Node.js and React
- Works well for SPAs

---

### 5.2 Authentication Flow

#### **User Registration Flow**
```
1. User enters email, password, name
2. Frontend validates inputs
3. Frontend POST /api/auth/signup with credentials
4. Backend receives request:
   - Validate email format (unique check)
   - Validate password strength (min 8 chars)
   - Hash password with Bcrypt (10 rounds)
5. Backend creates user record in database
6. Backend generates JWT token:
   - Payload: {userId, email, iat, exp}
   - Secret: Environment variable
   - Expiration: 24 hours (configurable)
7. Backend returns token + user data
8. Frontend stores token in localStorage
9. Frontend sets Authorization header for future requests
10. Frontend redirects to dashboard
```

#### **User Login Flow**
```
1. User enters email and password
2. Frontend validates inputs
3. Frontend POST /api/auth/login with credentials
4. Backend receives request:
   - Query database for user by email
   - If not found → return 401 Unauthorized
   - Compare submitted password with stored hash
   - If mismatch → return 401 Unauthorized
5. Backend generates JWT token (same as signup)
6. Backend returns token + user data
7. Frontend stores token in localStorage
8. Frontend sets Authorization header
9. Frontend redirects to dashboard
```

#### **Protected Request Flow**
```
1. Frontend makes request to protected endpoint
2. Frontend includes Authorization header:
   Authorization: Bearer {JWT_token}
3. Backend receives request:
   - Extract token from Authorization header
   - Middleware: Verify token signature using secret
   - Middleware: Check token expiration (exp claim)
   - If invalid → return 401 Unauthorized
   - If valid → Extract userId from payload
   - Attach userId to request object
4. Route handler processes request with userId context
5. Return response
```

#### **Token Refresh Flow (Optional - Not in MVP)**
```
Will be implemented in future version:
- Issue two tokens: access (short-lived, 1 hour)
- Issue two tokens: refresh (long-lived, 7 days)
- Client uses refresh token to get new access token
- Improves security and user experience
```

---

### 5.3 JWT Token Structure

```javascript
// Header (encoded in base64)
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload (encoded in base64)
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "iat": 1616161616,        // issued at
  "exp": 1616248016         // expires at (24 hours)
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

---

### 5.4 Security Rules & Best Practices

#### **Storage Security**
- ✅ Store JWT in `localStorage` (simpler for MVP)
- ⚠️ Alternative: `httpOnly` cookies (more secure, not MVP)
- ❌ Never store in plain session storage
- Rule: Include token in Authorization header for all API calls

#### **Token Transmission**
- ✅ Only send over HTTPS (enforced in production)
- ✅ Include in `Authorization: Bearer {token}` header
- ❌ Never send in URL query parameters
- ❌ Never send in cookies unless httpOnly

#### **Password Security**
- ✅ Hash passwords with Bcrypt (cost factor ≥ 10) or Argon2
- ✅ Minimum 8 characters (enforced)
- ✅ No password validation on frontend (allow any special chars)
- ⚠️ Not in MVP: Require email verification before login

#### **Authorization Rules**
- ✅ Users can only access groups they're members of
- ✅ Only group admins can add/remove members
- ✅ Only group admins can update/delete group
- ✅ Only group admins can access settlement reports
- ✅ Users can mark only their own payments as completed
- ✅ Members can view other members' payment history in same group
- ⚠️ Not in MVP: Admin audit logs for compliance

#### **Token Validation**
- ✅ Verify token signature on every protected request
- ✅ Check token expiration
- ✅ Extract and attach userId to request context
- ✅ Return 401 for invalid/expired tokens
- ⚠️ Not in MVP: Token blacklist for logout (sessions end on browser close)

#### **CORS Configuration**
- ✅ Only allow requests from frontend domain(s)
- ✅ Send credentials (for cookies, if applicable)
- ✅ Allow required headers (Authorization, Content-Type)
- ✅ Preflight requests for non-simple methods

---

### 5.5 Session Management

**MVP Approach (Stateless)**:
- Token expires after 24 hours
- No server-side session storage
- Logout = clear localStorage on frontend
- No "remember me" functionality in MVP
- User session ends when browser closes or token expires

**Future Enhancement**:
- Implement refresh tokens for extended sessions
- Optional: Remember me with auto-refresh
- Optional: Session management UI

---

### 5.6 Error Handling

```
Invalid Token:
- Return: 401 Unauthorized
- Message: "Invalid or expired token"
- Action: Frontend clears localStorage and redirects to login

Missing Token:
- Return: 401 Unauthorized
- Message: "Authorization header missing"
- Action: Frontend redirects to login

Expired Token:
- Return: 401 Unauthorized
- Message: "Token has expired"
- Action: Frontend clears localStorage and redirects to login

Insufficient Permissions:
- Return: 403 Forbidden
- Message: "You do not have permission to access this resource"
- Action: Frontend shows error message
```

---

## 6. MVP Scope Definition

### 6.1 MVP Feature Checklist

#### **✅ INCLUDED IN MVP**

**Authentication & User Management**
- [x] User signup with email/password
- [x] User login
- [x] Get user profile
- [x] JWT-based authentication

**Group Management**
- [x] Create groups
- [x] List user's groups
- [x] Get group details
- [x] Update group info (admin only)
- [x] Delete group (admin only)

**Member Management**
- [x] Add members to group (admin only)
- [x] Remove members from group (admin only)
- [x] List group members with current balances
- [x] Admin and Member roles

**Expense Management**
- [x] Create shared expenses
- [x] List expenses per group
- [x] Equal split calculation (automatic)
- [x] Manual split option (custom assignment)
- [x] View expense details with split breakdown

**Payment Settlement**
- [x] Mark payments as completed
- [x] View personal balance (owes/receives)
- [x] View group settlement status
- [x] Track payment status per member

**Accountability & Tracking**
- [x] Payment history per member
- [x] Reliability indicator (basic: Reliable/At Risk/Unreliable)
- [x] Overdue balance highlighting (configurable days threshold)
- [x] Member balance summaries

**Dashboard & Reporting**
- [x] Group expense dashboard
- [x] Member balances overview
- [x] Overdue alerts summary
- [x] Recent expenses list

**Notifications (Basic)**
- [x] In-app notification list
- [x] Notification types: overdue_alert, payment_reminder, expense_created
- [x] Mark notifications as read
- [x] Unread notification count

---

#### **❌ NOT IN MVP**

**Expense Management**
- [ ] Edit existing expenses
- [ ] Delete expenses
- [ ] Expense categories/tags
- [ ] Expense comments/notes
- [ ] Split by percentage (only amount)
- [ ] Recurring expenses

**Payment Settlement**
- [ ] Settle all balances in one action
- [ ] Payment plan generation
- [ ] Direct payment processing (Stripe, PayPal, etc.)
- [ ] Payment receipts/invoices

**Advanced Accountability**
- [ ] ML-based reliability prediction
- [ ] Automated penalty/reputation system
- [ ] Behavioral analytics

**Notifications (Advanced)**
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Scheduled reminders
- [ ] Push notifications
- [ ] Notification settings/preferences

**Platform & Integration**
- [ ] Mobile app (iOS/Android)
- [ ] Real-time updates (WebSocket)
- [ ] API for third-party integrations
- [ ] Multi-currency support
- [ ] Export reports (PDF, CSV)

**Admin & Compliance**
- [ ] Admin audit logs
- [ ] Data retention policies
- [ ] GDPR compliance features
- [ ] Two-factor authentication
- [ ] Account recovery

---

### 6.2 MVP Implementation Priority

**Phase 1: Core Foundation** (Weeks 1-2)
1. User authentication (signup/login)
2. Group CRUD operations
3. Member management
4. Database schema setup

**Phase 2: Expense Tracking** (Weeks 3-4)
1. Create expenses with automatic splits
2. Expense listing and details
3. Balance calculations

**Phase 3: Settlement & Accountability** (Weeks 5-6)
1. Payment settlement marking
2. Balance tracking per member
3. Payment history
4. Reliability indicators

**Phase 4: Dashboard & UI Polish** (Weeks 7-8)
1. Group dashboard
2. Member overview
3. Notification system
4. Frontend polish

---

### 6.3 Database Tables in MVP

All 8 tables included:
- [x] users
- [x] groups
- [x] group_members
- [x] expenses
- [x] expense_splits
- [x] payments
- [x] payment_history
- [x] notifications

---

### 6.4 API Endpoints in MVP

**Total: 30 core endpoints**

- Authentication: 2 (signup, login)
- User: 2 (get profile, update profile)
- Groups: 5 (create, list, get, update, delete)
- Members: 3 (add, remove, list)
- Expenses: 3 (create, list, get details)
- Payments: 3 (mark completed, get balance, get settlement status)
- Accountability: 3 (get history, get overdue, get reliability)
- Dashboard: 1 (get complete dashboard)
- Notifications: 2 (list, mark as read)

---

### 6.5 MVP Success Criteria

**Technical**:
- [x] All core APIs implemented and tested
- [x] Database schema complete with relationships
- [x] Authentication working securely
- [x] Balance calculations 100% accurate
- [x] Frontend responsive and intuitive

**Functional**:
- [x] Users can create and manage groups
- [x] Expenses split correctly (equal and manual)
- [x] Balances tracked accurately
- [x] Payments marked and tracked
- [x] Reliability indicators calculated

**Performance**:
- [x] Dashboard loads in < 2 seconds
- [x] Balance calculations in < 500ms
- [x] No data inconsistencies

**User Experience**:
- [x] Intuitive navigation
- [x] Clear balance display
- [x] Easy payment marking
- [x] Mobile responsive

---

## 7. System Design Sign-Off

**Document Status**: ✅ Implementation-Ready  
**Version**: 1.0  
**Alignment Check**:
- ✅ All PRD requirements mapped to system components
- ✅ No invented features beyond PRD scope
- ✅ MVP-first architecture (future features excluded)
- ✅ Full alignment between Frontend, Backend, Database
- ✅ Clear module responsibilities and dependencies

**Ready for Development**:
1. ✅ Backend development team → API Implementation
2. ✅ Frontend development team → UI Implementation  
3. ✅ Database team → Schema setup and optimization
4. ✅ QA team → Test specification creation

**Handoff Artifacts**:
- API Design Specification (Section 2)
- Database Schema (Section 3)
- Module Breakdown (Section 4)
- Authentication Strategy (Section 5)
- MVP Scope & Checklist (Section 6)

**Next Phase**: Development sprints based on MVP priority (Section 6.2)

---

**End of System Design Document**
