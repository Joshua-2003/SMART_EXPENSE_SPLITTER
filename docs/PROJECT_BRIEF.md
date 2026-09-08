#Project Name:
Smart Expense Splitter for Groups (with Real Accountability)

You are a Senior Product Manager + System Analyst.

#Objective:
Define a complete system plan for this web application.

🧾 Overview

Smart Expense Splitter for Groups is a web-based application designed to simplify how groups manage shared expenses while adding accountability and transparency.

Unlike basic bill-splitting tools, this system not only divides expenses but also tracks payment behavior, highlights outstanding balances, and introduces a simple accountability system to encourage timely payments among group members.

It is designed for friends, roommates, travelers, and small teams who frequently share costs and need a clear, fair, and trackable way to manage group spending.

🎯 Objectives

Provide an easy and organized way to split group expenses
Track who owes what in real time
Improve accountability among group members
Reduce conflicts caused by unclear or forgotten payments
Visualize group financial activity in a simple dashboard

👥 Target Users

1. Social Groups
    Friends (gala, outings, trips)
    Roommates sharing rent or bills
    Barkada travel groups
2. Small Teams / Informal Groups
    School group projects
    Small business teams
    Event organizers

⚙️ Core Features

    🔹 User Features
        Create and join groups
        Add shared expenses
        Split expenses equally or manually assign amounts
        View personal balance (owes / to receive)
        Mark payments as completed

    🔹 Group Features
        Group expense dashboard
        Expense history tracking
        Member balance summary
        Settlement tracking (who paid and who hasn’t)

    🔹 Accountability Features (Unique Part)
        Payment history per user
        “Reliability indicator” (based on payment consistency)
        Highlight overdue balances
        Gentle reminders for unsettled payments


    🔹 System Features
        Role-based access (Group Member / Admin per group)
        Secure authentication
        Real-time updates (optional future enhancement)
        Data consistency for shared transactions

🔄 Workflow Overview
    A user creates a group (e.g., “Baguio Trip”)
    Members are added to the group
    A shared expense is created (e.g., Hotel ₱4,000)
    The system automatically splits or custom assigns shares
    Each member sees their balance
    Members mark payments when settled
    System updates balances and accountability status

🧱 Tech Stack
    TypeScript

    Frontend
        React (UI, dashboards, user interaction)
        Tailwind
        React Router
        Redux
    Backend
        Node JS with Express (API, business logic, authentication)
    ORM:
        Drizzle
    Database
        PostgreSQL (relational data for users, groups, expenses, and payments)


📊 Success Criteria
    Users can easily create and manage group expenses
    Accurate balance tracking per user
    Clear visibility of who owes and who paid
    Reduced confusion in group payments
    Positive user experience in managing shared finances📊 Success Criteria
    Users can easily create and manage group expenses
    Accurate balance tracking per user
    Clear visibility of who owes and who paid
    Reduced confusion in group payments
    Positive user experience in managing shared finances