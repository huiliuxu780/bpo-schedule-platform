# Formal Roster Change Center Product Contract

## Product Positioning

- Capability name: 班表变更中心.
- Primary role: 排班师.
- Secondary consumers: 小组长 and 一线 only read scoped final change outcomes later; they do not consume the scheduler internal confirmation note in this slice.
- Product job: after a formal roster has been published, show which employee shift events changed, who is affected, where the change came from, whether the scheduler has confirmed it, and the audit trail behind it.
- This replaces the IM304 v1 screen shape where the user had to start from a version timeline and raw source-cell diff.

## Research Baseline

Mature scheduling products generally separate operational change handling from compliance audit reporting:

- Deputy schedule consent audit records CREATE / MODIFY / DELETE, before/after shift values, change actor, and employee response.
- Deputy shift audit focuses on disputes and compliance: when, what, and by whom a shift changed.
- When I Work shift history centers on one shift's update time, update reason, updated fields, updater, and previous values.
- UKG schedule post audit uses the last schedule post as the baseline and emphasizes changes that disrupt the employee schedule.
- 7shifts activity log records schedule publish, republish, clear, and shift-pool actions through searchable activity logs.
- Restaurant365 schedule change audit explicitly lists changes that happened after an employee schedule was published, including manager edits and employee-driven swaps, claims, or offers.

Implication for this product: the page must start from post-publish employee shift change events, not from internal version IDs.

## Confirmed Decisions

- Page direction: 班表变更中心, operations-first.
- Main row unit: one employee + one date + one shift change event.
- Default grouping: 待处理 / 全部变更 / 按员工.
- Pending rule: any post-publish change that affects an employee shift enters 待处理 until the scheduler confirms it.
- Close rule: scheduler confirms one event at a time and may add an internal handling note.
- Source categories:
  - 申请/异常
  - 排班师手工调整
  - 系统派生修正
- Internal note visibility: scheduler-only in this slice.
- Detail behavior: click a row to open a right drawer; no fixed always-visible detail panel.

## Non-goals

- No approval workflow.
- No auth or permission engine.
- No notification, export, batch operation, or bulk confirmation.
- No forecasting model, standard capacity model, automatic scheduling, Excel import, or real external integration.
- No production formulas, settlement rules, charge factors, or final production status-code decisions.
- No user-facing exposure of `revision`, `source_cell_id`, `roster_cell_id`, raw version IDs, or engineering diff concepts.

## Page Structure

### Header

The header should be compact and operational:

- Month / project / workplace / team scope.
- Current formal roster baseline.
- Last published or republished time when available.
- Summary metrics:
  - 待处理变更
  - 已确认变更
  - 影响员工
  - 关联申请/异常

Avoid explanatory marketing copy. The page should not spend first-screen space explaining how scheduling works.

### Primary Tabs

- 待处理: default tab. Shows unconfirmed post-publish change events.
- 全部变更: audit-style list of confirmed and pending events.
- 按员工: groups events by employee for follow-up and downstream readback.

The first screen should make the scheduler's next work obvious. It should not default to an audit report table.

### Event List

Each row represents one change event:

- Employee name and team.
- Date and weekday.
- Before shift code/time.
- After shift code/time.
- Change type: added, modified, removed, or restored.
- Source category.
- Source summary: linked issue/request if available; otherwise manual or derived source.
- Status: 待处理 or 已确认.
- Changed at / changed by when available.

Row copy must be business-facing. Internal IDs belong in tests, logs, or backend responses, not in the visible list.

### Detail Drawer

Open only after selecting a row. The drawer includes:

- Before/after shift comparison.
- Employee/date/team context.
- Source chain:
  - linked downstream issue/request when present
  - scheduler revision or manual adjustment context when present
  - system-derived correction context when present
- Scheduler action:
  - confirm this change
  - internal handling note
- Audit metadata:
  - changed at
  - changed by if available
  - publish/re-publish baseline if available

The drawer is for handling and audit detail. It should not become a second full page squeezed into the side.

## Data And Backend Contract Direction

The existing IM304 runtime diff can remain a backend foundation, but the product view model should be event-first:

- `change_event_id`: stable event identifier derived from version/change scope or persisted acknowledgement record.
- `employee_id`, `employee_name`, `team_name`.
- `date`, `weekday`.
- `before_shift`, `after_shift`.
- `change_type`.
- `source_category`.
- `source_summary`.
- `linked_issue_id` and linked issue status when present.
- `confirmation_status`: `pending` or `confirmed`.
- `confirmed_at`, `confirmed_by`, `internal_confirmation_note` when confirmed.

The confirmed single-event acknowledgement and internal note likely require local DB-backed persistence in the next implementation Gate. That is still not approval, permission, notification, export, or batch capability, but it must be called out as an explicit allowed file/scope item before coding.

## UX Rules To Retire

These IM304 v1 assumptions are obsolete as product direction:

- Version timeline as the primary page structure.
- Raw diff rows as the main business object.
- Fixed three-column layout with always-visible detail.
- Visible `source_cell_id`, `version_id`, or revision terminology in business UI.
- Page naming centered on abstract "governance" instead of concrete change handling.

These backend concepts can remain implementation details if they are useful for deriving event rows.

## Acceptance Criteria

- The default page answers: which post-publish employee shift changes still need scheduler confirmation?
- A scheduler can open one event, compare before/after shift values, see source context, confirm it, and leave an internal note.
- Confirmed events leave 待处理 and remain visible in 全部变更.
- 按员工 can show the same events grouped by affected employee.
- No approval, notification, export, batch, permission, forecasting, standard-capacity, Excel, or automatic-scheduling feature appears in the UI.
- No internal engineering IDs or diff terminology is visible in normal business UI.

## Recommended Next Implementation Gate

Next task should be one role-facing closed loop, not a narrow visual patch:

- Rename/reframe `/roster-change-governance` into a scheduler-facing 班表变更中心.
- Convert the backend/frontend view model from version-first to event-first.
- Add local single-event confirmation and internal note persistence if PM confirms that persistence scope.
- Keep audit readback in the same page through 全部变更 and detail drawer.
- Replace fixed detail columns with on-demand drawer.
- Update tests and browser smoke around the event-first workflow.

Do not start this implementation until the PM confirms the local confirmation persistence boundary.
