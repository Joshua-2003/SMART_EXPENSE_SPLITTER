# Smart Expense Splitter Backend

## Project Overview

This directory contains the backend foundation for Smart Expense Splitter, a group expense tracking application. It is prepared for future REST API development using Node.js, Express, TypeScript, Supabase PostgreSQL, and Drizzle ORM.

The intended request flow is:

```text
HTTP Request -> Routes -> Controllers -> Services -> Repositories -> Drizzle ORM -> Supabase PostgreSQL
```

The current phase intentionally does not implement API endpoints, controllers, services, repositories, authentication, CRUD operations, or business logic.

## Prerequisites

- Node.js latest LTS
- npm
- Git
- A Supabase account

## Supabase Manual Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Wait for database initialization to finish.
3. Open **Project Settings -> Database**.
4. Copy the PostgreSQL connection string.
5. Replace the password placeholder in the copied connection string.
6. Open **Project Settings -> API**.
7. Copy the Project URL.
8. Copy the Anon Key.
9. Create a `.env` file by copying `.env.example`.
10. Paste the database URL, Project URL, Anon Key, and a strong JWT secret into `.env`.

The backend uses `DATABASE_URL` for Drizzle and PostgreSQL. `SUPABASE_URL` and `SUPABASE_ANON_KEY` are reserved for future integrations. Supabase Auth and Storage are not configured in this phase.

## Installation

From this directory, install dependencies:

```bash
npm install
```

Copy the environment template and fill in its values:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

## Generate Drizzle Files

```bash
npm run db:generate
```

This compares the Drizzle schema in `src/models/schema.ts` with the generated migration state and creates SQL migration files in `drizzle/`. Review generated migrations before applying them.

## Push Schema to Supabase

```bash
npm run db:push
```

This pushes the current Drizzle schema to the configured Supabase PostgreSQL database and creates or updates the database tables. Use a reviewable migration workflow for production changes.

## Run Development Server

```bash
npm run dev
```

Expected output:

```text
Server running on http://localhost:4000
```

The port can be changed with the `PORT` environment variable. The frontend Vite dev server runs on port 3000 and proxies `/api` requests to this backend. The server currently exposes no API routes.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server with `tsx` watch mode |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled production build |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run Drizzle migrations |
| `npm run db:push` | Push the schema to Supabase |
| `npm run db:studio` | Open Drizzle Studio |

## Project Structure

```text
backend/
├── src/
│   ├── config/          Environment and CORS configuration
│   ├── controllers/     Placeholder for HTTP request handlers
│   ├── db/              Shared PostgreSQL and Drizzle client
│   ├── middlewares/     Placeholder for Express middleware
│   ├── models/          Drizzle tables, relations, and inferred types
│   ├── repositories/    Placeholder for database access modules
│   ├── routes/           Router entry point; no routes registered yet
│   ├── services/        Placeholder for business logic modules
│   ├── types/            Placeholder for shared application types
│   ├── utils/            Placeholder for shared utilities
│   ├── app.ts            Express application configuration
│   └── server.ts         HTTP server entry point
├── drizzle.config.ts    Drizzle Kit configuration
├── package.json          Dependencies and scripts
├── tsconfig.json         Strict NodeNext TypeScript configuration
├── .env.example          Required environment variable template
└── README.md             Backend setup and development guide
```

## Database Schema

The Drizzle model includes the eight tables defined by `docs/DATABASE_SCHEMA.sql`: users, groups, group members, expenses, expense splits, payments, payment history, and notifications. Database column names remain snake_case while TypeScript properties use camelCase. Foreign keys, uniqueness rules, checks, and declared indexes are represented in `src/models/schema.ts`.

The source SQL also contains two views and one index expression that uses a subquery. The table model is ready for Drizzle migrations; the subquery-based index is not emitted because PostgreSQL does not permit subqueries in index expressions. The views remain available through the source SQL until they are introduced as explicitly managed database views.

## Next Development Phase

The next backend implementation phase can add routes, controllers, services, repositories, business logic, and API endpoints on top of this foundation without restructuring the project. Authentication and authorization should be added only as part of that implementation phase.