# Current Project Context

```yaml
current_summary:
  queue_state: active
  active_batch_id: BATCH-DEMAND-PLAN-SCHEDULE-CTA-001
  in_progress_task: F108
  ready_tasks: [Q035]
```

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness.

## Active Boundary

The project is in No Database MVP Mode. Product work may continue only through confirmed local frontend stories, local FastAPI seed/process-memory contracts, and verification tasks. The project must not connect or prepare a production database before PM confirms a later database Gate and provides an environment.

## Default Next Step

The active product batch is `US142 / F108 / Q035` on branch `codex/f073-review-checklist-h032`. It targets the remaining demand-plan to schedule-plan CTA gap: the demand-plans page still uses a bare `/schedule-plans` entry, so the current demand query is lost before users move into the schedule-plans review chain.

The latest completed product batch is `US141 / F106-F107 / Q034` on branch `codex/f073-review-checklist-h032`. It closes the remaining risk-workbench CTA context gap that still affected the schedule-plans review chain: the top-level `不可用管理` action on the risk workbench no longer uses a bare route, and the default back-link fallback now stays inside the risk workbench instead of routing to the wrong page when no upstream source is present.

The latest completed product batch before that is `US140 / F104-F105 / Q033` on branch `codex/f073-review-checklist-h032`. It closes the remaining schedule-plans summary CTA context gap: the local MVP flow summary on the schedule-plans page no longer uses hardcoded cross-page links and now preserves `schedule-plans-list`, `query`, and `status` where the CTA continues the current review chain.

The latest completed product batch before that is `US139 / F102-F103 / Q032` on branch `codex/f073-review-checklist-h032`. It closes the remaining schedule-plan risk-entry context gap: when a user enters the risk workbench from the schedule-plans risk summary card or the embedded risk preview table, the destination and continuation actions now preserve `schedule-plans-list`, `query`, and `status` instead of dropping into a generic risk route.

The latest completed product batch before that is `US138 / F100-F101 / Q031` on branch `codex/f073-review-checklist-h032`. It closes the remaining schedule-plan list-origin review gap: when a user enters risk, shift, or unavailability from a plan-list row, the destination page now preserves the filtered list as the return target instead of treating the route like a plan-detail origin.

The latest completed product batch is `US137 / F098-F099 / Q030` on branch `codex/f073-review-checklist-h032`. It closes the remaining schedule-plan list detail-link gap: when a user clicks `查看` from the plan list, the detail page now preserves the current list filter and source-page context instead of dropping into a bare detail route.

The latest completed product batch is `US136 / F096-F097 / Q029` on branch `codex/f073-review-checklist-h032`. It closes the remaining draft success-feedback gap: after local draft create/save redirects to plan detail, the page now shows whether the draft was newly created or updated instead of only changing routes.

The latest completed product batch is `US130 / F085 / Q023` on branch `codex/f073-review-checklist-h032`. It closes the remaining scoped plan-link gap inside the unavailability impact shift table so row-level plan actions preserve the same review source and scope instead of dropping back to a bare plan detail route.

The latest completed product batch before that is `US129 / F083-F084 / Q022` on branch `codex/f073-review-checklist-h032`. It closes the remaining plan-origin row-action gap: row-level actions inside plan detail and shift detail now preserve `schedule-plans` review context instead of falling back to broad list routes or raw hrefs.

The latest completed product batch before that is `US128 / F080-F082 / Q021` on branch `codex/f073-review-checklist-h032`. It closes the remaining `schedule-plans` source-page gap: when review drilldown starts from plan detail, shift/risk/unavailability pages now carry that source through and return to the current plan detail instead of falling back to broad list pages.

The latest completed product batch before that is `US127 / F077-F079 / Q020` on branch `codex/f073-review-checklist-h032`. It keeps scoped detail navigation coherent across risk, plan, and unavailability review drilldown: detail links now preserve scope and source-page context, and the detail-page back links plus related-plan links no longer drop back to full lists.

The latest completed product batch before that was `US124 / F073-F076 / Q019` on branch `codex/f073-review-checklist-h032`. It replaced the duplicated right-side `复核任务` blocks across risk/plan/shift/unavailability pages with one shared local review checklist rail that carries summary metrics, current step, next step, scoped actions, and stable back links.

The latest completed governance task is `US126/H034` on branch `codex/f073-review-checklist-h032`. It closes the remaining product closeout self-lock: same-commit closeout transitions now pass both strict state checks and commit-message validation, so a verified frontend batch can return current to empty and still commit with its active task id.

The latest completed governance task was `US123/H032` on branch `codex/h032-traceability-closeout-guard`. It narrowed the remaining traceability closeout gap: after a task is verified and current returns to empty, a branch-log-only commit-SHA backfill can now pass strict staged state checks without reopening current.

The last completed product chain was `US116/F069 -> US119/F072`, followed by `US120/Q018`, on branch `codex/f060-risk-workbench`. This batch continued the same no-database risk/unavailability review vertical by extending wide-screen right-side review rails to the detail pages so plan, risk, and unavailability detail views keep the same review posture as the list/workbench pages.

The H024 current-queue smoke task proved that a ready story plus matching active task can pass strict state checks before execution; after completion, current queue returned to empty so done history does not accumulate here.

The H025 invariant pass added strict checks and regression tests that reject `status: done` inside current story/task files.

The H026 rollout changed `bash scripts/check.sh` to use strict state checks by default. State Repair Mode can run `BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh`; temporary warning-only diagnostics can run `BPO_STATE_CHECK_MODE=warning bash scripts/check.sh`.

The H027 registry pass added strict validation for `TRACE_INDEX.yaml` current file paths and de-duplicated registry path output.

The H028 plan-boundary pass made Codex Plan a temporary projection only. Harness current and registry files remain the state source.

The F030-F031/Q012 product pass proved the current/active state model can drive a frontend table parity chain and return current to empty after completion.

The F032-F040/Q013 product pass proved the same model can run a 10-task frontend chain and return current to empty after completion.

The F041-F059/Q014 product pass proved the same model can run a 20-task frontend chain and return current to empty after completion.

## Current Execution Rules

- Read current files by default, not historical archive files.
- Treat `docs/current/**` as the execution queue source.
- Treat `docs/registry/**` as lookup indexes only.
- Do not execute from archive files.
- Keep subagents read-only for `docs/current/**` and `docs/registry/**`; the main Worker is the single writer.
- Keep old large files as historical sources during the transition.
- Run `bash scripts/check-state.sh` for state changes.
- `bash scripts/check.sh` runs strict state checks by default.
- Run `bash scripts/check.sh` before reporting a task complete.

## Current Stop Conditions

- New dependencies or package/lockfile changes.
- Real external data sources or integrations.
- Database connection setup, ORM, migrations, schema implementation, or production persistence config.
- Authentication or permission boundaries.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code, formula, settlement-rule, or charge-factor changes.
- Destructive or ambiguous Git/file operations.
- Failed final verification.

## Current Recommendation

The active product batch is `US142 / F108 / Q035` on branch `codex/f073-review-checklist-h032`. It keeps the same no-database planning chain coherent by making the demand-plans handoff into schedule-plans preserve the current query context before the user enters the schedule review flow.
