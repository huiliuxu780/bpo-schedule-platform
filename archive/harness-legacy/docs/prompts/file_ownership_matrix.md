# Subagent File Ownership Matrix

## Purpose

This matrix defines default file ownership for future subagent work. A confirmed Gate Plan may override it, but only with explicit allowed files and forbidden files.

## Ownership

| Role | Default Write Scope | Default Read Scope | Notes |
| --- | --- | --- | --- |
| Main Worker | Confirmed task scope | Entire project except restricted archive material | Owns integration, verification, logs, Done Report |
| PM Agent | `docs/raw-requirements.md`, `docs/user-stories.md` | `AGENTS.md`, `docs/PROJECT_STATE.md`, `tasks/backlog.yaml`, `docs/decision-log.md` | No implementation code |
| UI/UX Agent | Design docs only unless Gate allows code | Frontend files, shadcn rules, user stories | Uses `shadcn` skill for component selection |
| Frontend Agent | `app/**`, `components/**`, `hooks/**`, `lib/**`, `public/**` only when Gate allows | Harness docs, frontend files, UI/UX plans | Must use `shadcn` skill for shadcn work |
| Backend Agent | `backend/**` only when Gate allows | Harness docs, API contracts, user stories | Backend does not exist yet; no writes by default |
| QA Agent | Test docs or `tests/**` only when Gate allows | Requirements, stories, implementation summaries | May use `shadcn` as UI acceptance reference |
| Doc Agent | `docs/**`, `tasks/backlog.yaml` when Gate allows | Entire Harness docs | Must not turn unconfirmed assumptions into facts |
| Implementer | Dispatch packet `allowed_files` only | Dispatch packet `input_files` | No staging, commits, dependency install, or out-of-scope cleanup |
| Spec Reviewer | Read-only | Diff, Gate Plan, requirements, user stories | Must not modify files |
| Code Quality Reviewer | Read-only | Diff, changed files, project rules | Must use `shadcn` skill for frontend shadcn reviews |

## Conflict Rules

- Two write-capable subagents must not receive overlapping `allowed_files`.
- Shared files such as `docs/dev/branch-log.md`, `docs/audit-report.md`, `tasks/backlog.yaml`, `app/layout.tsx`, `app/globals.css`, and `components.json` should normally be owned by the Main Worker.
- If a subagent discovers it needs a file outside `allowed_files`, it must return `BLOCKED`.
- Reviewers are read-only even if they find issues.
- The Main Worker resolves conflicts and performs final integration.

## Current Frontend Scaffold Notes

F001 currently owns the static dashboard scaffold. Future frontend tasks may build on it only after a confirmed Gate links the task to raw requirements and user stories.

No subagent may introduce backend services, real APIs, real CORN integration, database work, authentication, permissions, exports, approval flows, batch operations, or settlement formulas without a dedicated confirmed Gate.
