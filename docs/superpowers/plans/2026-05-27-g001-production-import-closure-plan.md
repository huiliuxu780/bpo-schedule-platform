# G001 Production Import Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a no-database production-prototype loop from real CSV upload through import batches, master-data reference validation, personnel scheduling, demand forecast alignment, login/status processing, and fulfillment comparison.

**Architecture:** Keep the first implementation local and auditable: browser upload forms and FastAPI/process-memory contracts feed import batch records, validation errors, local versions, and existing fulfillment views. Database, ORM, migrations, real external integrations, auth, approval, export, batch operation, production formulas, settlement rules, and charge factors remain outside this plan.

**Tech Stack:** Next.js app routes and server actions, existing shadcn-style UI, local TypeScript models, FastAPI local process-memory endpoints, Node tests, Python unittest, Harness state checks.

---

## Scope

This plan decomposes `G001 - 生产雏形真实导入与履约对比闭环` into a long-running execution chain. The first executable wave is seeded into `docs/current/STORY_QUEUE.yaml` and `docs/current/ACTIVE_TASKS.yaml`; later forecast and login/status waves stay in backlog as blocked until the import, master-data, and personnel-schedule foundations pass.

## Execution Waves

### Wave 1: Import Center Foundation

- [ ] `F403`: implement CSV upload parsing and field mapping preview.
- [ ] `F404`: implement batch record, row validation, failed rows, and local version metadata.
- [ ] `Q118`: verify upload, mapping, batch, failure-row, version, copy-boundary, and no-database constraints.

### Wave 2: Master Data Foundation

- [ ] `F405`: import employees, workplaces, suppliers, projects, skills, and bindings into local process memory.
- [ ] `F406`: add master-data local maintenance states, effective dates, freeze/unfreeze semantics, and reference validation.
- [ ] `Q119`: verify master-data import, maintenance, reference validation, and quality issue creation.

### Wave 3: Personnel Schedule Foundation

- [ ] `F407`: import personnel-level schedules with shift type references and schedule versions.
- [ ] `F408`: expand personnel schedules into 0.5h interval summaries and preserve drillback links.
- [ ] `Q120`: verify schedule import, versioning, 0.5h expansion, and fulfillment-calendar linkage.

### Wave 4: Demand Forecast Foundation

- [ ] `F409`: import demand forecasts by business date, workplace, project, interval, skill group, and skill level.
- [ ] `F410`: generate forecast versions and change tracking.
- [ ] `F411`: align demand forecast with schedule intervals and surface shortage/overstaffed candidates.
- [ ] `Q121`: verify forecast import, versioning, alignment, and comparison readiness.

### Wave 5: Login And Status Processing

- [ ] `F412`: import login/logout logs with business-date and timezone normalization.
- [ ] `F413`: import status intervals with fixed status dictionary validation.
- [ ] `F414`: split login/status intervals into 0.5h buckets and detect gaps, overlaps, and unknown states.
- [ ] `F415`: compare personnel schedule with login/status facts and generate local fulfillment anomalies.
- [ ] `Q122`: verify login/status import, interval slicing, anomaly detection, and person timeline integration.

## Hard Boundaries

- [ ] Do not add database persistence, ORM, migrations, schema files, or production persistence configuration.
- [ ] Do not connect real CORN, HR, WFM, Excel, or third-party integrations.
- [ ] Do not add dependencies or modify package/lockfiles without a separate PM-confirmed Gate.
- [ ] Do not add auth, permission, supplier isolation, approval, export, batch operation, automatic scheduling, settlement, charge-factor, or production formula behavior.
- [ ] Keep every wave traceable through raw requirements, user stories, backlog, current queue, audit report, task log, branch log, and commits.

## Verification Baseline

Every executable wave must run:

- [ ] `node --test` for the touched local TypeScript models and page/source contracts.
- [ ] Python unittest when backend process-memory endpoints are touched.
- [ ] Browser smoke for changed visible upload, mapping, import, master-data, schedule, forecast, login/status, or fulfillment routes.
- [ ] `bash scripts/check-state.sh --strict`.
- [ ] `git diff --check`.
- [ ] Final `bash scripts/check.sh` after traceability updates.
