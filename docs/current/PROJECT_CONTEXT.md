# Current Project Context

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness + controlled database Gate + import center API vertical.

## Active Boundary

The project has entered a PM-confirmed database Gate. Database work may continue only through small, confirmed tasks. Implemented database slices cover local import batches, master data, personnel schedules, demand forecasts, login/status logs, comparison results, review closure records, import-center CSV upload/readiness/apply routes, persisted comparison/review queries, and related read-only frontend workbench flows.

The active product boundary remains local MVP and operator-facing workflow scaffolding. Permissions, approval, export, batch operations, external integrations, automatic scheduling, production formulas, settlement rules, and charge factors remain out of scope unless a new task explicitly confirms them.

## Current Queue

No executable story is currently queued. IM248 completed the medium-sized Scheduling Plan Lifecycle Closure block and should not be split into smaller follow-up IMs unless a new product block is confirmed.

IM240 completed the PM-confirmed review-case live runtime smoke on the current branch using an isolated `.local/im240-runtime-smoke.db` runtime artifact. The smoke used backend `127.0.0.1:8000` and frontend `127.0.0.1:3002` because the existing `3000` BPO Next dev process was stale and unresponsive. It did not add product features or modify business UI/backend implementation beyond acceptance traceability.

IM241 completed the review-case write-action runtime smoke using `BPO_DATABASE_URL` and an isolated `.local/im241-review-case-action-smoke.db` database. It did not add new product behavior, implementation code, schema/migration, dependencies, permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors.

IM242 completed the review-case form-click E2E feasibility decision. Current `qa` scope will not add Playwright or other browser automation dependencies; the remaining server-action submit glue is treated as low risk and should be covered by IM241 HTTP smoke plus PM manual browser walkthrough if PM wants final human acceptance evidence.

IM243 completed the PM-confirmed manual browser walkthrough for that remaining glue. It used `BPO_DATABASE_URL` and isolated `.local/im243-review-case-form-click-smoke.db`, ran only local backend/frontend runtimes, and recorded evidence without changing product UI, backend implementation, scripts, dependencies, or package/lockfiles.

## Recent State Summary

- The current integration branch combines the compact Harness state-governance pass with the review-case processing-path branch so future work can start from one baseline.
- The latest product work added operator-facing review-case processing paths without exposing Codex/Gate/PM acceptance language in product pages.
- IM240 has live-smoked the review-case list/detail, four processing-stage filters, and three URL feedback states against the IM239 stage matrix seed. IM241 extended that evidence to the existing evidence/conclusion/closure write endpoints without changing implementation code.
- IM242 decided not to automate form-click E2E inside the current `qa` gate because the repo has no Playwright infrastructure and adding one would require a separate dependency Gate.
- IM243 completed the final manual browser path for the three review-case write forms: evidence, conclusion, and closure.
- IM244 completed a documentation-only QA closeout so the review-case acceptance block can be handed off without overstating production readiness.
- IM245 completed the PR readiness decision: split review into three stacked PRs before continuing with new product development on top of the branch.
- IM246 completed the comparison-run review-case loop: explicit related-case counts, open-first/high-risk ordering, strengthened review tab expression, and expanded model coverage, without adding backend APIs, persistence, dependencies, permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors.
- IM247 completed review-case source tracing to original import batches using existing source_trace version fields and existing import-center batch route helpers.
- IM248 completed the local MVP schedule plan lifecycle: backend lifecycle endpoints, frontend detail-page actions, feedback handling, and focused coverage for `draft -> review_ready -> published`.
- Harness state optimization is now the active maintenance concern: current context must stay compact, default reads must use the current layer, and history must be queried on demand through registry/legacy references.

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

- Real external data sources or integrations.
- Database QA closeout or additional persistence unless a matching task is active.
- Unconfirmed new dependencies or package/lockfile changes.
- Authentication or permission boundaries.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code, formula, settlement-rule, or charge-factor changes.
- Destructive or ambiguous Git/file operations.
- Failed final verification.

## Current Recommendation

Recommended next medium-sized candidates are: (1) schedule risk confirmation/resolution plus unavailability active/resolved handling, because it continues the WFM fulfillment loop after plan publication, (2) dashboard real-data linkage to the schedule lifecycle and risk/unavailability summaries, after the lifecycle data is stable, or (3) runtime visual acceptance for the schedule lifecycle if PM wants browser evidence before widening scope. Do not claim production readiness, add runtime automation, install E2E dependencies, or expand into permissions, approval, export, batch operations, formulas, settlement rules, or charge factors unless a new task is defined.
