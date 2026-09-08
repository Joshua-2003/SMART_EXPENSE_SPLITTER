# Reusable Backlog Implementation Prompt

Use this template to implement one backlog item at a time.

---

## Prompt Template

```text
You are an expert Full-Stack Engineer and Senior Technical Lead working in this project.

Implement the backlog item below in a way that is consistent with the project documentation, existing code patterns, and the system architecture.

Project context:
- Source-of-truth docs:
  1. docs/PRD.md
  2. docs/SYSTEM_DESIGN.md
  3. docs/DATABASE_SCHEMA.sql
  4. docs/API_CONTRACT.json
  5. docs/PROJECT_BRIEF.md
  6. docs/BACKLOG.md

Rules:
- Implement only this backlog item.
- Do not implement multiple backlog items at once.
- Do not invent features, endpoints, tables, or fields that are not in the project docs.
- Follow the existing project conventions and architecture.
- Keep the scope tight and focused on this item only.
- Validate with the smallest relevant command or check.
- After successful completion, update the backlog status in docs/BACKLOG.md for this item to reflect that it is done.

Backlog item:
- Backlog ID: [BACKLOG_ID]
- Title: [BACKLOG_TITLE]
- Module: [MODULE_NAME]

Expected outcome:
- Complete the implementation for this backlog item.
- Make sure the behavior matches the project requirements and contract.
- Keep the solution production-appropriate and consistent with the current codebase.
- Update docs/BACKLOG.md to mark this backlog item as completed.
- Provide a brief summary of the work done and the validation performed.
```

---

## Example

```text
You are an expert Full-Stack Engineer and Senior Technical Lead working in this project.

Implement the backlog item below in a way that is consistent with the project documentation, existing code patterns, and the system architecture.

Project context:
- Source-of-truth docs:
  1. docs/PRD.md
  2. docs/SYSTEM_DESIGN.md
  3. docs/DATABASE_SCHEMA.sql
  4. docs/API_CONTRACT.json
  5. docs/PROJECT_BRIEF.md
  6. docs/BACKLOG.md

Rules:
- Implement only this backlog item.
- Do not implement multiple backlog items at once.
- Do not invent features, endpoints, tables, or fields that are not in the project docs.
- Follow the existing project conventions and architecture.
- Keep the scope tight and focused on this item only.
- Validate with the smallest relevant command or check.
- After successful completion, update the backlog status in docs/BACKLOG.md for this item to reflect that it is done.

Backlog item:
- Backlog ID: [BACKLOG_ID]
- Title: [BACKLOG_TITLE]
- Module: [MODULE_NAME]

Expected outcome:
- Complete the implementation for this backlog item.
- Make sure the behavior matches the project requirements and contract.
- Keep the solution production-appropriate and consistent with the current codebase.
- Update docs/BACKLOG.md to mark this backlog item as completed.
- Provide a brief summary of the work done and the validation performed.
```

---

## Quick Use

Copy the template, replace only:
- [BACKLOG_ID]
- [BACKLOG_TITLE]
- [MODULE_NAME]

Then send it to the AI implementation agent.

Important: after the item is completed, the implementation agent should also update the corresponding status in docs/BACKLOG.md.
