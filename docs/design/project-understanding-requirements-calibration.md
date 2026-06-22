# Project Understanding Requirements Calibration

## Conclusion

The 2026-06-14 project understanding document remains useful as a product baseline, not as current implementation truth or an executable backlog.

Use it for BPO WFM positioning, domain language, user roles, target information architecture, and broad demand mapping. Do not use its "current status" or P0/P1 lists directly without checking current Harness state, recent commits, and Gate constraints.

## Source

- Source document: `/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-project-understanding-and-requirements.md`
- Source date: 2026-06-14
- Calibration date: 2026-06-17
- Current source of truth: `docs/current/**`, `docs/PROJECT_STATE.md`, task backlog entries, branch logs, and verified commits.

## Still Valid Product Baseline

- The core product remains a BPO Workforce Management platform for demand, scheduling, coverage risk, unavailability, imports, comparison, and review.
- The primary roles remain WFM scheduler, site supervisor, data administrator, master-data administrator, and operations manager.
- The five-domain map still works: operating dashboard, planning and scheduling, data quality, log data, and master data.
- Dashboard should stay an operating overview surface. Real investigation and action should live in downstream workspaces.
- The target IA remains useful as a map, but visible navigation must still follow current PM-confirmed IA and route ownership.

## Stale Or Changed Status

- Dashboard is no longer just an unexamined static prototype. IM209-IM213 clarified that it is an overview surface, not an exception-handling workspace.
- Error/loading coverage is no longer zero. Global error recovery and several route loading states have been added after the source document.
- Data-quality, comparison-run, review-case, and import-batch result trace work has moved beyond the source snapshot.
- Several long-stack detail pages have been reorganized into tabbed workspaces after the source snapshot.
- Shared empty state, shared header/action-placement rules, and table abstractions have progressed after the source snapshot.
- Navigation completeness cannot mean "add every historical route to the sidebar"; later PM-confirmed IA cleanup intentionally removed or hid some legacy entries.

## Still Requires New Gate

- Authentication and permissions.
- Approval workflows.
- Export and batch-operation capabilities.
- Automatic scheduling or intelligent scheduling suggestions.
- Production status-code finalization, formulas, settlement rules, and charge factors.
- Real external integrations.
- Broad database/schema/persistence changes outside an active confirmed database-persistence task.

## Recommended Next Seed Options

1. Review-case workspace calibration: verify which review-case actions are already usable and which remaining actions need a write-capability Gate.
2. Comparison-run workspace calibration: compare current result-review detail pages against the source document's result-review expectations.
3. Planning and scheduling gap calibration: re-check draft status flow, schedule-risk list ownership, and unavailability state changes before choosing an implementation slice.

## Operating Rule

Before any future development from the 2026-06-14 document, convert the chosen item into a fresh raw requirement, user story, active task, allowed-files list, forbidden-files list, and stop conditions. The source document can justify why the work matters; it cannot authorize implementation by itself.
