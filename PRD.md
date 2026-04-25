# Product Requirements Document (PRD)
## Smart Expense Splitter for Groups (with Real Accountability)

**Document Version**: 1.0  
**Date**: April 2026  
**Status**: For Development Planning  

---

## 1. Problem Statement

### Current Challenge
Groups—including friends, roommates, travelers, and small teams—frequently share expenses but struggle with:
- **Unclear financial tracking**: Confusion about who owes what
- **Payment delays**: Forgotten or delayed payments causing friction
- **Lack of accountability**: No visibility into payment behavior patterns
- **Conflict generation**: Unresolved balances leading to disputes

### Unique Value Proposition
Unlike basic bill-splitting tools, Smart Expense Splitter adds **accountability and transparency** through:
- Real-time balance tracking
- Payment history per user
- Reliability indicators based on payment consistency
- Gentle reminders for unsettled balances

### Goals
- Simplify group expense management
- Provide clear, fair tracking of shared costs
- Encourage timely payments through visibility
- Reduce conflicts caused by unclear finances

---

## 2. Target Users & User Personas

### 2.1 Primary User Groups

**1. Social Groups**
- Friends organizing galas, outings, and social events
- Roommates sharing rent and household bills
- Travel groups (e.g., "Baguio Trip")

**2. Small Teams / Informal Groups**
- School group projects
- Small business teams
- Event organizers

### 2.2 User Personas

**Persona 1: Social Planner ("Alex")**
- Frequently organizes group outings and trips
- Needs quick expense recording and settling
- Primary concern: Everyone pays fairly and on time
- Pain point: Tracking multiple payments across group members

**Persona 2: Roommate Manager ("Jordan")**
- Manages shared household expenses with 2-4 roommates
- Recurring, predictable expenses (rent, utilities)
- Pain point: Forgotten payments and unclear splits
- Concern: Long-term fairness and consistency

**Persona 3: Group Admin ("Casey")**
- Organizes and leads groups (events, teams, projects)
- Needs oversight of all financial activity
- Pain point: Verifying completion of payments
- Concern: Member accountability and compliance

---

## 3. User Flows

### 3.1 Primary User Journey

```
1. User Authentication
   → Sign up / Log in to account

2. Group Creation
   → Create new group (e.g., "Baguio Trip")
   → Set group name and optional description
   → Automatically assigned as Admin

3. Member Management
   → Add members to group by email/ID
   → Members receive invitation and join

4. Expense Recording
   → Create shared expense (e.g., Hotel ₱4,000)
   → Select payment method (equal split or manual assignment)
   → Specify involved members
   → System calculates individual shares

5. Balance Visibility
   → Each member views personal balance (owes / to receive)
   → See group summary of all members' balances

6. Payment Settlement
   → Members mark payments as completed
   → System updates balances automatically
   → Balance becomes zero when settled

7. Accountability Monitoring
   → View payment history per member
   → Check reliability indicator
   → Receive/send reminders for overdue balances
```

### 3.2 Admin-Specific Flow

```
1. Dashboard Access
   → View complete group expense history
   → Monitor all member balances
   → Track settlement status

2. Oversight
   → Highlight overdue balances
   → Verify payment claims
   → Send reminders to non-compliant members
```

---

## 4. Feature Breakdown

### 4.1 User Features (Core Functionality)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Create and Join Groups** | Users create new expense groups or join existing ones via invitation | Core |
| **Add Shared Expenses** | Record expenses with description, amount, and date | Core |
| **Split Expenses** | Automatic equal splits or manual assignment of amounts per member | Core |
| **View Personal Balance** | Display owed amounts vs. amounts to receive | Core |
| **Mark Payments as Completed** | Record when payments have been settled | Core |

### 4.2 Group Features (Visibility & Tracking)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Group Expense Dashboard** | Centralized view of all group expenses and transactions | Core |
| **Expense History Tracking** | Complete log of all recorded expenses over time | Core |
| **Member Balance Summary** | Quick overview of each member's current financial status | Core |
| **Settlement Tracking** | Status of who paid and who hasn't paid | Core |

### 4.3 Accountability Features (Unique Differentiator)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Payment History per User** | Detailed record of each user's payment patterns | Core |
| **Reliability Indicator** | Metric based on payment consistency (e.g., "Reliable", "At Risk") | Core |
| **Overdue Balance Highlighting** | Visual emphasis on unpaid balances past due date | Core |
| **Gentle Reminders** | Notifications for unsettled payments | Core |

### 4.4 System Features (Backend & Admin)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Role-Based Access** | Group Member vs. Admin roles per group | Core |
| **Secure Authentication** | User login/signup with security measures | Core |
| **Real-Time Updates** | Live synchronization of balance changes across group members | Future |
| **Data Consistency** | Transactional integrity for shared transactions | Core |

---

## 5. System Modules

### 5.1 Module Architecture

#### **Module 1: Authentication & User Management**
- User registration and login
- Session management
- Password security
- User profile management

#### **Module 2: Group Management**
- Create/edit/delete groups
- Member invitation and acceptance
- Role assignment (Admin/Member per group)
- Member removal from groups

#### **Module 3: Expense Management**
- Create expenses
- Define split logic (equal/manual)
- Record expense details (amount, description, date, participants)
- Calculate individual shares automatically
- Update expense records

#### **Module 4: Balance Tracking**
- Real-time calculation of balances per user
- Store transaction history
- Calculate cumulative owes/receivables
- Display balance summaries

#### **Module 5: Payment Settlement**
- Record payment confirmations
- Update balances upon settlement
- Maintain payment history
- Track payment timestamps

#### **Module 6: Accountability & Reporting**
- Calculate reliability indicators per user
- Identify overdue balances
- Generate payment history reports
- Store reminder status

#### **Module 7: Notifications & Reminders**
- Send reminder notifications
- Schedule automated reminders (for future enhancement)
- Notification tracking

### 5.2 Data Entities

- **Users**: id, name, email, password_hash, created_at
- **Groups**: id, name, description, admin_id, created_at
- **Group Members**: group_id, user_id, role (Admin/Member), joined_at
- **Expenses**: id, group_id, description, amount, created_by, created_at
- **Expense Splits**: id, expense_id, user_id, assigned_amount
- **Payments**: id, expense_id, payer_id, amount, paid_at, status
- **Payment History**: Records for reliability calculation

---

## 6. Non-Functional Requirements

### 6.1 Performance & Scalability
- Dashboard load time: < 2 seconds
- Balance calculations: < 500ms response time
- Support initial user base without performance degradation
- Not specified in brief: Future scaling parameters for enterprise users

### 6.2 Security & Privacy
- Secure authentication (encrypted passwords, secure session handling)
- Role-based access control per group
- Data isolation between groups
- Not specified in brief: Encryption in transit/at rest, data retention policy

### 6.3 Reliability & Availability
- Data consistency for shared transactions
- Transaction integrity for expense settlements
- Not specified in brief: Uptime SLA, backup/recovery procedures

### 6.4 Usability & UX
- Intuitive interface for non-technical users
- Clear balance and payment status visualization
- Mobile-responsive design (implied by React Tailwind stack)
- Not specified in brief: Accessibility standards (WCAG compliance)

### 6.5 Technology Constraints
- **Frontend**: React, Tailwind, React Router, Redux
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Language**: TypeScript throughout
- Not specified in brief: API versioning, documentation standards

---

## 7. MVP Scope vs Future Scope

### 7.1 MVP (Minimum Viable Product)

**Core Features Included:**
- ✅ User authentication (signup/login)
- ✅ Create and manage groups
- ✅ Add group members
- ✅ Record shared expenses
- ✅ Split expenses equally
- ✅ View personal and group balances
- ✅ Mark payments as completed
- ✅ Track payment status per member
- ✅ View group expense dashboard
- ✅ Role-based access (Admin/Member)
- ✅ Payment history per user
- ✅ Overdue balance highlighting

**Not in MVP:**
- Manual expense splits (equal split only in MVP)
- Advanced reliability indicators (simplified version)
- Automated reminder system
- Real-time updates

### 7.2 Post-MVP / Future Enhancements

| Feature | Rationale |
|---------|-----------|
| **Manual Expense Splits** | Allow custom percentage or amount distribution |
| **Advanced Reliability Indicators** | ML-based prediction of payment behavior |
| **Automated Reminder System** | Scheduled notifications for overdue balances |
| **Real-Time Updates** | Live synchronization across all users |
| **Mobile App** | iOS/Android native applications |
| **Export/Reports** | Generate settlement reports in PDF/CSV |
| **Integration with Payment Platforms** | Stripe, GCash, or PayPal for direct payment processing |
| **Analytics Dashboard** | Spending trends, group financial insights |
| **Expense Categories** | Tag and filter expenses by type |
| **Recurring Expenses** | Automatic splits for predictable bills |
| **Multi-Currency Support** | Handle expenses in different currencies |
| **API for Third Parties** | Allow integration with other apps |

---

## 8. Success Criteria

### Quantitative Metrics
- Users can create and manage group expenses within < 2 minutes
- Balance accuracy: 100% for all calculations
- Expense tracking completeness: No lost or unaccounted transactions
- Settlement confirmation: Clear visibility of payment status

### Qualitative Metrics
- Clear visibility of who owes and who paid (subjective user satisfaction)
- Reduced confusion in group payments (user feedback/surveys)
- Positive user experience (NPS score, user retention)
- Member accountability reinforced through transparency

### Business Metrics (Not specified in brief)
- User adoption rate target
- Group creation frequency
- Payment settlement completion rate
- User retention/churn rate

---

## 9. Out of Scope

The following are **explicitly out of scope** for the Smart Expense Splitter and will not be addressed in this project:

- Payment processing integration (direct payments)
- Cryptocurrency or alternative currencies (MVP)
- AI-driven spending predictions
- Mobile app development (MVP)
- Integration with external accounting systems
- Audit compliance or regulatory features

---

## 10. Assumptions & Dependencies

### Assumptions
- Users have consistent internet access
- Groups are informal (no enterprise compliance required)
- Expenses are recorded post-transaction (not real-time authorization)
- User trust in group dynamics is sufficient (no fraud prevention detailed)

### Dependencies
- **Tech Stack**: PostgreSQL, Node.js, React must be available
- **Hosting**: Infrastructure for API and database hosting required
- **User Base**: Initial user recruitment and onboarding
- **Not specified in brief**: Third-party services (email, SMS for reminders)

---

## 11. Open Questions & Clarifications Needed

| Question | Current Status |
|----------|---------|
| What constitutes "overdue"? (configurable deadline?) | Not specified in brief |
| How is "Reliability Indicator" calculated? (exact algorithm?) | Not specified in brief |
| Is there an audit log for admin actions? | Not specified in brief |
| Notification delivery method? (in-app, email, SMS?) | Not specified in brief |
| Maximum group size or member limits? | Not specified in brief |
| Data retention policy after group dissolution? | Not specified in brief |

---

## 12. Sign-Off

**Document Prepared By**: Senior Product Manager (via AI)  
**Ready for**: Engineering Kickoff, Design Phase, Development Planning  
**Next Steps**:
1. Stakeholder review and feedback
2. Clarify open questions with project sponsor
3. Technical architecture design by engineering team
4. UI/UX design phase kickoff
5. Development sprint planning

---

**End of PRD**
