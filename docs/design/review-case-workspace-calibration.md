# Review Case Workspace Calibration

Date: 2026-06-17
Task: IM214

## Conclusion

The review-case workspace is already a real downstream exception-handling workspace, not a blank future module and not a dashboard table extension.

The current implementation supports review-case triage, case detail review, evidence and conclusion handling, controlled closure, owner-based continuation, and submit feedback. The next product work should therefore avoid rebuilding the same surface. It should either validate the current flow with acceptance smoke coverage, clean up visible copy or empty states where PM finds friction, or move to the next real downstream workspace such as comparison-run calibration.

This workspace is still a controlled local review workflow. It must not be treated as production approval, permission, export, bulk operation, external evidence integration, automatic scheduling, formula, settlement, or charge-factor capability without a new Gate.

## Current Capabilities

### List Workspace

`/data-quality/review-cases` already works as the review-case triage surface.

Current responsibility:

- filter by business date, owner, status, severity, source result type, processing stage, and keyword
- show review-case totals, open cases, high-risk open cases, and owner count
- derive processing stage from existing case detail snapshots
- expose owner x processing-stage workload context
- link users from list rows and owner pending entries into case detail continuation

Product interpretation:

- this page owns queue triage and workload scanning
- it should not own evidence editing, closure decisions, approval, export, or batch operations
- dashboard anomaly rows should only link here or to detail when a future stable review-case ID or query contract is confirmed

### Detail Workspace

`/data-quality/review-cases/[caseId]` already works as the case-level workspace.

Current responsibility:

- organize case detail into tabs for overview, source context, evidence and conclusion records, actions, owner context, and processing explanation
- show source result context and source trace to comparison runs, versions, and import batches
- show evidence records, conclusion records, optional closure state, and processing timeline
- show same-owner context and pending navigation for continuation

Product interpretation:

- this page owns one-case review context
- it is the correct home for case evidence, conclusion, and closure state
- it should not become a generic approval center, permission console, export screen, or external evidence hub without a separate product Gate

### Controlled Actions

The existing action deck already supports the core local review loop for existing cases.

Current responsibility:

- missing evidence: guide the user to supplement evidence first
- missing conclusion: guide the user to supplement review conclusion next
- ready to close: expose controlled closure only after evidence and conclusion exist
- closed: block further evidence, conclusion, and closure writes
- failed submit: reopen the relevant action target with retry guidance
- successful submit: keep the user on the current case when another action is still needed, or hand off to the next same-owner pending case after closure

Product interpretation:

- this is sufficient for a local controlled review workflow
- it does not imply real production approval, permission enforcement, reopen, reassignment, escalation, SLA, notification, export, or bulk closure

## Still Requires A New Gate

Do not implement these inside the review-case workspace without a new confirmed task:

- role-based permissions and reviewer assignment rules
- approval workflow, approval status, or approval audit
- reopen, reassign, escalate, SLA, notification, or task inbox semantics
- bulk closure, batch operations, export, or downloadable review packages
- external evidence service, document upload service, or real third-party integration
- new route or query contracts from dashboard rows without stable downstream IDs
- production status codes, automatic scheduling, formulas, settlement rules, supplier contracts, minimum staffing, or charge factors

## Product Design Judgment

The current workspace has enough shape to be treated as an operational exception surface:

- list page for triage
- detail page for evidence and decision context
- action deck for controlled local handling
- owner continuation for queue flow

The main risk is not missing UI volume. The main risk is semantic overreach: making the workspace look like it owns production approval, team workload governance, export, permissions, or batch operations before those contracts exist.

## Recommended Next Slices

1. Review-case acceptance smoke
   - Verify seeded cases cover missing evidence, missing conclusion, ready to close, closed, failed submit retry, and closure handoff.
   - Product value: confirms the current workspace is usable before adding more capability.

2. Review-case visible copy and empty-state cleanup
   - Only if PM finds confusion in actual walkthrough.
   - Product value: improves operator confidence without changing workflow contracts.

3. Comparison-run workspace calibration
   - Calibrate the evidence/result context next, because review cases depend on comparison-run source trace.
   - Product value: strengthens the upstream evidence chain before expanding any write capability.

## Non-Goals For IM214

This slice does not modify UI code, routes, data fetching, backend behavior, database schema, dependencies, package files, permissions, approval, export, batch operations, automatic scheduling, production formulas, settlement rules, supplier contracts, minimum staffing, or charge factors.
