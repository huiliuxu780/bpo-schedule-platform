# Downstream Roster Request Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build IM302 as one local, role-facing loop: downstream users create roster handling intents from the formal roster, schedulers see and locate those intents in the draft workbench, then use the existing revision-and-republish flow to resolve them.

**Architecture:** Add a local persisted `RosterRequestIntent` slice beside roster draft/published persistence, expose narrow local API routes, and reuse existing frontend workbench surfaces. The request intent is not an approval object and does not submit to a production workflow; it is a local queue item that links a formal roster cell to scheduler revision work.

**Tech Stack:** FastAPI local routes, SQLAlchemy local SQLite persistence, Python unittest, Next.js/React frontend, existing Node structure tests, existing `bash scripts/check.sh` gate.

---

### Task 1: Backend Persistence And Service

**Files:**
- Modify: `backend/app/roster_persistence.py`
- Modify: `backend/app/roster_service.py`
- Test: `backend/tests/test_roster_service.py`

- [ ] Write failing backend service tests for creating, listing, and resolving a downstream roster request intent.
- [ ] Run `.venv/bin/python -m unittest backend.tests.test_roster_service` and confirm the new tests fail because request-intent methods/entities do not exist.
- [ ] Add `RosterRequestIntentRecord` plus a `roster_request_intents` table with stable IDs, scope/month fields, employee/date/cell linkage, action type, requester role, note, status, created/resolved timestamps, and linked revision version ID.
- [ ] Add repository methods to create an intent, list open intents by month/scope, and mark an intent resolved by a scheduler revision.
- [ ] Add service methods that validate the linked current published roster cell exists before creating an intent and resolve an intent only with a revision version ID.
- [ ] Re-run the backend service tests and confirm they pass.

### Task 2: Local API Routes

**Files:**
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_roster_publish_api.py`

- [ ] Write failing API tests for `POST /api/v1/roster-requests`, `GET /api/v1/roster-requests`, and `POST /api/v1/roster-requests/{request_id}/resolve`.
- [ ] Run `.venv/bin/python -m unittest backend.tests.test_roster_publish_api` and confirm the route assertions fail.
- [ ] Add the three local API routes with dictionary responses matching existing roster API style.
- [ ] Keep request validation narrow: action type must be `leave`, `swap`, `exception_fix`, or `site_adjustment`; status values are local request-intent states only.
- [ ] Re-run the API tests and confirm they pass.

### Task 3: Frontend Request Creation And Scheduler Queue

**Files:**
- Modify: `lib/published-roster-view.ts`
- Modify: `components/published-roster-viewer.tsx`
- Modify: `components/roster-draft-workbench.tsx`
- Test: `scripts/tests/published-roster-view-model.test.mjs`
- Test: `scripts/tests/published-roster-viewer-structure.test.mjs`
- Test: `scripts/tests/roster-draft-workbench-structure.test.mjs`

- [ ] Write failing Node tests that expect published-roster detail actions to expose a local request-intent creation shell and the scheduler workbench to expose a downstream request queue.
- [ ] Run `node --test scripts/tests/published-roster-view-model.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` and confirm the new assertions fail.
- [ ] Add frontend request-intent state and API-client calls without creating approval, permission, notification, export, or batch behavior.
- [ ] Let the scheduler queue locate the matching employee/date context and surface the existing create-revision path rather than auto-editing the roster.
- [ ] Re-run the Node tests and `npm run typecheck`.

### Task 4: Traceability, Browser Acceptance, Final Gate

**Files:**
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `docs/registry/DECISION_INDEX.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`

- [ ] Add R970 / US890 / IM302 trace entries after implementation behavior is proven.
- [ ] Browser-smoke the loop on local backend/frontend: publish or read an existing current roster, create a request intent from `/published-roster?month=2026-08`, verify it appears in `/roster-drafts?month=2026-08`, locate it to the relevant date/person, create revision/re publish using the existing flow, and resolve the intent.
- [ ] Run `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`.
- [ ] Update trace with final verification evidence and run `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` again before commit.
