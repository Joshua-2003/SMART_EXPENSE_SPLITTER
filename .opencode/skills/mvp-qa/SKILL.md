---
name: mvp-qa
description: 'Execute and verify Smart Expense Splitter backlog stories across Phases 1-7. Use for scoped implementation, acceptance testing, regression checks, API and UI validation, and commit/push safety reviews.'
argument-hint: '[backlog ID, phase, module, or release gate]'
user-invocable: true
disable-model-invocation: false
---

# Smart Expense Backlog

## Purpose

Run a repeatable, evidence-based execution and QA pass for one Smart Expense Splitter backlog story at a time. The project documentation is the source of truth; the current code and database are the implementation under test. The backlog now includes MVP work in Phases 1-4, production hardening in Phase 5, operational readiness in Phase 6, and advanced capabilities in Phase 7.

Use the [backlog checklist](./references/mvp-qa-checklist.md) for the test matrix and the [report template](./references/qa-report-template.md) for the final result. Use the commit/push gate below before recommending a commit or push.

## When to Use

- Implement or verify one backlog item before marking it Done.
- Run any backlog item from Phases 1-7 by ID, phase, or module.
- Regression-test a completed MVP module after related changes.
- Check an API endpoint against `docs/API_CONTRACT.json`.
- Check a user flow against `docs/PRD.md` and `docs/SYSTEM_DESIGN.md`.
- Assess whether an MVP area is ready for release.
- Decide whether the current worktree is safe to commit and push.

## Source Of Truth

Read these files before testing, in this order:

1. `docs/PRD.md` for product behavior and MVP scope.
2. `docs/SYSTEM_DESIGN.md` for architecture, flows, and endpoint intent.
3. `docs/DATABASE_SCHEMA.sql` for persistence rules and constraints.
4. `docs/API_CONTRACT.json` for request, response, auth, and error contracts.
5. `docs/PROJECT_BRIEF.md` for user-facing goals and success criteria.
6. `docs/BACKLOG.md` for the backlog item's acceptance criteria, dependencies, and status.

When sources disagree, report the conflict and follow the documented ordering in `docs/BACKLOG.md` for backlog acceptance decisions. Do not invent behavior to make a test pass.

## Procedure

### 1. Select the scope

- Resolve the requested backlog ID, module, or MVP flow.
- Locate its acceptance criteria, dependencies, API references, database references, and UI references in `docs/BACKLOG.md`.
- Include dependency smoke checks when the target flow depends on earlier modules.
- Exclude features explicitly marked optional, future, or `NOT_IN_MVP` unless the selected story is in Phase 7 or the user explicitly requests future-scope work.
- Never combine multiple backlog IDs in one implementation change. A phase review may inspect several stories, but implementation and status changes remain story-scoped.

### 2. Check dependencies and worktree state

- Read the selected story and all dependencies in `docs/BACKLOG.md`.
- Confirm dependencies are `Done` or report the dependency as `BLOCKED`.
- Inspect `git status --short` and the diff before editing. Preserve unrelated user changes.
- Identify generated files, build output, local environment files, and untracked artifacts before deciding what belongs in the change.

### 3. Build a traceability matrix

For every acceptance criterion, record:

- Expected behavior.
- Source document and endpoint/table/component reference.
- Implementation location.
- Verification method.
- Result: `PASS`, `FAIL`, `BLOCKED`, or `NOT APPLICABLE`.
- Evidence, including command output, response shape, or a reproducible step.

Treat a criterion as `PASS` only when observed behavior and the documented contract agree. Code inspection alone is not sufficient for behavior that can be executed.

### 4. Run cheap static checks first

From the relevant project directory, run the smallest applicable checks:

- Backend: `npm run build`
- Frontend: `npm run lint` and the available type/build check
- Database stories: migration/schema validation and seed checks using the repository scripts
- Phase 6 security stories: dependency audit, secret scan, and relevant configuration checks
- If both layers are touched, run both.
- Inspect the relevant route, controller, service, repository, schema, frontend service, and UI component.

Do not treat a successful typecheck as proof of functional correctness.

### 5. Run API smoke checks

Use a configured test database and environment. Never print secrets in the report.

- Start the backend with `npm run dev` or use the existing running server.
- Authenticate using a test account or seeded account.
- Exercise the happy path from the contract.
- Exercise authentication, validation, not-found, forbidden, pagination, filtering, and ownership cases required by the backlog item.
- Confirm HTTP status, top-level envelope, required fields, field types, timestamps, and error shape.
- For mutation flows, verify the persisted state with a follow-up GET or a database query when appropriate.

For notifications specifically, verify `GET /api/notifications` defaults, `limit`, `offset`, `read=true`, `read=false`, `unreadCount`, and `PATCH /api/notifications/{notificationId}`. Confirm a user cannot update another user's notification and invalid UUIDs/not-found IDs produce the documented failure.

### 6. Run frontend smoke checks

- Start the frontend with `npm run dev`.
- Verify the target route loads without console or network errors.
- Exercise the primary user flow and its loading, empty, error, and success states.
- Confirm rendered labels and actions match the documented behavior.
- For notification UI, verify the notification list, unread count, mark-read action, and refresh behavior against the API when integration is enabled. Clearly report when the UI uses mock or fallback data.

Use browser automation or manual steps available in the workspace. Do not claim a visual check was performed without observing the rendered page.

### 7. Review data integrity and security

Check that:

- Authenticated endpoints reject missing or invalid bearer tokens.
- Users can access only their own data and permitted group data.
- Input validation matches API and database constraints.
- Mutations preserve related records and read/settlement state.
- Secrets, password hashes, and internal database details are absent from responses and logs.
- No test data or temporary files are committed.

### 8. Run the commit and push safety gate

Do not commit or push automatically. Report `SAFE TO COMMIT`, `SAFE TO PUSH`, or `NOT SAFE` with evidence.

#### Commit gate

A commit is safe only when:

- The diff is limited to the selected backlog story and required documentation/status updates.
- No unrelated user changes were overwritten or staged.
- Acceptance criteria are passing or explicitly documented as residual risk.
- Relevant backend, frontend, database, and test checks pass.
- No secrets, credentials, tokens, `.env` files, build output, debug dumps, or temporary files are staged.
- Database changes include a reviewable migration and preserve rollback/compatibility expectations.
- API and UI contracts remain consistent with the source docs.
- The backlog status is changed to `Done` only after implementation and validation pass.

#### Push gate

A push is safe only when the commit gate passes and additionally:

- The target branch and remote are known; never push to an unexpected branch.
- The worktree is clean except for the intended commit and there is no unresolved merge/rebase state.
- The branch is up to date or the required integration strategy is documented.
- CI-equivalent checks pass locally, or missing CI checks are explicitly reported.
- No destructive migration, production database operation, force push, or credential-dependent action is required without explicit approval.
- The user has explicitly requested the push. Otherwise provide the command and recommendation only.

If any gate fails, do not claim the change is safe. List the exact blocker and the smallest corrective action.

### 9. Report and disposition

Use the report template. List failures first, ordered by severity, with file or endpoint references and reproduction steps. Separate `FAIL` from `BLOCKED`; a missing database, environment variable, or server is a blocker, not a passing result.

Only recommend changing a backlog status to `Done` when all applicable acceptance criteria pass and no release-blocking defect remains. When the user asks to implement a backlog story, update its status and revision history only after validation. Never hide failures by changing status. Do not commit or push unless the user explicitly asks.

## Completion Criteria

The backlog pass is complete when the report contains:

- Scope and source documents used.
- Acceptance criteria traceability.
- Static-check results.
- API and UI evidence where applicable.
- Security and data-integrity observations.
- Failures, blockers, residual risks, and a clear release recommendation.
- Worktree scope and staged-file review.
- Commit safety result and push safety result.
- Exact commands still required before commit or push, if blocked.
