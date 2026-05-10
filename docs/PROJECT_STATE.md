# Project State

## Current Stage

Clean Harness initialization.

## Active Scope

The clean project contains only minimal Harness documents and scripts. It does not contain active business code, frontend pages, backend services, mock datasets, package dependencies, or legacy source code.

## Lab Archive

The previous working project was archived as:

`/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-lab/`

That archive is read-only reference material for future audits or explicitly approved migration planning.

## Current Rules

- No business implementation without a confirmed task.
- No dependency installation without PM confirmation.
- No package or lockfile changes without PM confirmation.
- No real API, backend, database, or production integration by default.
- Every task must pass `bash scripts/check.sh`.

## Frontend Direction

Future frontend work is constrained to a professional shadcn/ui-based B2B SaaS admin console for BPO Workforce Management / BPO 人力计划与履约管理平台.

The frontend baseline is shadcn/ui v4 dashboard examples, dashboard-01 block, New York style, and the shadcn dark / light theme system. This direction is recorded as a rule only; it does not authorize frontend implementation, dependency installation, package changes, mock data, or business code during clean Harness initialization.
