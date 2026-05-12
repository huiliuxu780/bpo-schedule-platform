# Project State

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness.

For current execution context, default next step, active queue, active tasks, and blockers, read:

- `docs/current/PROJECT_CONTEXT.md`
- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`
- `docs/current/BLOCKERS.md`

This file is now long-term project state only. It must not maintain the ready queue or a running list of completed stories.

## Active Scope

The project contains:

- A PM-confirmed shadcn/ui-style BPO WFM dashboard scaffold.
- Local scheduling-plan MVP verticals backed by local FastAPI seed/process-memory contracts and frontend fallback contracts.
- No Database MVP Mode.
- Local detail drilldowns for scheduling risks and unavailability impact.
- Display-only TanStack Table parity slices across the current schedule-plan, demand-plan, shift-detail, risk, and unavailability views.
- A documentation-first Lightweight Harness with current/registry state governance.

The project does not contain:

- Real external API integration.
- Database persistence or production persistence setup.
- Authentication or production permission boundaries.
- Real Excel import or real CORN integration.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code finalization, formulas, settlement rules, or charge factors.

## No Database MVP Mode

PM confirmed on 2026-05-12 that the project should not connect a database before the local MVP feature chain is developed and verified, because there is currently no database environment.

Allowed local MVP data modes:

- Local FastAPI endpoints backed by seed data or process memory.
- Frontend API-client fallback data that matches the same contract.
- Read-only or draft-only local verification flows.
- Documentation and audit records that keep database work out of scope.

Hard stop until a later PM-confirmed Gate:

- Database connection setup.
- ORM models, repositories, or adapters.
- Migration files.
- Schema implementation as engineering work.
- Production persistence configuration.
- Real external data-source integration.

## State Governance Direction

The project now uses a current/registry/archive state model:

- `docs/current/**` is the default execution state.
- `docs/registry/**` is the lookup layer.
- Legacy and future archive files are historical sources, not execution queues.

Detailed rules live in `docs/quality/STATE_MANAGEMENT.md`.

Current invariants:

- Story Runner starts from `docs/current/STORY_QUEUE.yaml`.
- Active task scope comes from `docs/current/ACTIVE_TASKS.yaml`.
- `docs/registry/TRACE_INDEX.yaml` stores IDs, paths, and relationships only; it must not store status.
- Archive files are not executable.
- The main Worker is the single writer for `docs/current/**` and `docs/registry/**`.
- `scripts/check-state.sh` validates state consistency and is warning-only during the initial rollout.
- `bash scripts/check.sh` runs `check-state` and its regression tests so state drift is visible in the standard verification path without self-locking ordinary tasks.
- `H024/US065` completed the first real current-queue smoke task: a ready story and matching active task passed strict state checks before execution, then current returned to an empty active queue after completion.
- `H025/US066` added state-check coverage that rejects done history in current story/task files, keeping current limited to ready, in-progress, and blocked work.
- `H026/US067` changed standard verification to strict state checks by default, with explicit `BPO_STATE_CHECK_MODE=repair-scope` and `BPO_STATE_CHECK_MODE=warning` overrides for repair and diagnostics.
- `H027/US068` extended state checks to validate `TRACE_INDEX.yaml` current file paths and reduce duplicate registry path output.

## Product Direction

Near-term product work should remain inside the no-database local MVP boundary.

Recommended order after state governance:

1. Seed the next ready story in current state before execution.
2. Continue frontend/local-contract work only when it avoids database, real integrations, auth, permissions, approval, export, batch, production formulas, settlement rules, and charge factors.
3. Add table parity only in small display-only slices unless PM confirms a broader component-interaction Gate.

## Frontend Direction

Future frontend work is constrained to a professional shadcn/ui-based B2B SaaS admin console for BPO Workforce Management / BPO 人力计划与履约管理平台.

The frontend baseline is shadcn/ui v4 dashboard examples, dashboard-01 block, New York style, semantic theme tokens, dark/light theme behavior, and the project frontend rules in `docs/quality/FRONTEND_RULES.md`.

This direction is a rule for confirmed frontend tasks; it does not authorize new frontend implementation, dependency installation, package changes, mock data, or business code outside a confirmed Gate.

## Lightweight Harness Direction

The Harness flow is:

```txt
raw requirement -> user story -> current story queue -> active task -> Gate Plan -> branch -> scoped execution -> state check -> final check -> traceability/audit -> local commit -> Done Report -> PM push decision when applicable
```

Key documents:

- `AGENTS.md`
- `docs/quality/STATE_MANAGEMENT.md`
- `docs/quality/GATE_REGISTRY.md`
- `docs/quality/GIT_BRANCH_WORKFLOW.md`
- `docs/harness/lightweight-harness.md`
- `docs/quality/FRONTEND_RULES.md`
- `docs/quality/DONE_REPORT_TEMPLATE.md`

## Runtime Environment

The project uses Node.js 22 for frontend development and delivery verification. `scripts/check.sh` and `npm run dev` use guarded runtime paths to avoid the local Node.js 24 native addon issue previously observed with Next.js/lightningcss on macOS.

The project uses Python 3.12 for backend development and verification. `scripts/verify-backend-runtime.sh` validates the backend interpreter and required modules.

Runtime files:

- `.nvmrc`
- `.node-version`
- `.python-version`
- `docs/dev/setup.md`
- `scripts/verify-frontend-native-runtime.mjs`
- `scripts/verify-backend-runtime.sh`

## Archive Boundary

The previous project workspace is archived outside this clean root:

`/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-lab/`

That archive is reference material only. Do not import from it, wire it into build/lint/check flows, or copy large modules into active source without a confirmed migration task.
