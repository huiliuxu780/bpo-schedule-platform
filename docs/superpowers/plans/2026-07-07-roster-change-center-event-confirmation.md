# Roster Change Center Event Confirmation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/roster-change-governance` into an event-first 班表变更中心 where a scheduler can review pending post-publish employee shift changes, open a detail drawer, confirm one event, and persist an internal note.

**Architecture:** Keep the existing IM304 runtime diff as the derivation foundation, but convert the API response and UI view model from version-first `timeline/diff_rows` to event-first `change_events/grouped_by_employee`. Add a local `roster_change_confirmations` persistence table keyed by a deterministic `change_event_id`; confirmation is scheduler-only handling evidence, not approval, permission, notification, export, or batch.

**Tech Stack:** FastAPI local routes, SQLAlchemy/Alembic local persistence, Python `unittest`, Next.js App Router, React client component, existing shadcn/ui primitives, Node structure tests, `bash scripts/check.sh`.

---

## Scope And Files

Allowed implementation files:

- `backend/app/roster_persistence.py`
- `backend/app/roster_service.py`
- `backend/app/main.py`
- `backend/migrations/versions/20260707_0014_roster_change_confirmations.py`
- `backend/tests/test_roster_service.py`
- `backend/tests/test_roster_publish_api.py`
- `app/roster-change-governance/page.tsx`
- `components/roster-change-governance-workbench.tsx`
- `components/app-sidebar.tsx`
- `scripts/tests/roster-change-governance-structure.test.mjs`
- Traceability docs listed in the active IM305 task

Forbidden unless a later Gate explicitly expands scope:

- New dependencies or package/lockfile changes
- Auth, permissions, approval workflow, notification, export, batch operations
- Real external integrations, Excel import/upload, forecasting model, standard-capacity model, automatic scheduling
- Production status-code decisions, formulas, settlement, charge factors
- Rebuilding unrelated roster draft, published roster, dashboard, or schedule-plan pages
- Adding bulk confirmation

## Data Contract

Event-first response shape:

```json
{
  "scope": {
    "business_month": "2026-08",
    "project_id": "BOSCH-CS",
    "workplace_id": "SHANGHAI",
    "team_id": "G1"
  },
  "visibility": "scheduler",
  "summary": {
    "pending_count": 1,
    "confirmed_count": 0,
    "affected_employee_count": 1,
    "linked_issue_count": 1
  },
  "change_events": [
    {
      "change_event_id": "ROSTER-202608-REV-1:CELL-001",
      "employee_id": "EMP-001",
      "employee_name": "EMP-001",
      "team_id": "G1",
      "business_date": "2026-08-01",
      "weekday": "Sat",
      "change_type": "modified",
      "source_category": "申请/异常",
      "source_summary": "请假 REQ-001",
      "before": {
        "assignment_kind": "shift",
        "shift_code": "A5",
        "interval_start_at": "2026-08-01T09:00",
        "interval_end_at": "2026-08-01T14:30"
      },
      "after": {
        "assignment_kind": "rest",
        "shift_code": null,
        "interval_start_at": null,
        "interval_end_at": null
      },
      "linked_issues": [
        {
          "request_id": "REQ-001",
          "action_type": "leave",
          "requester_role": "frontline",
          "requester_id": "EMP-001",
          "resolved_at": "2026-08-01T09:10",
          "scheduler_resolution_note": "已按请假登记完成修订，8 月 1 日上午改为休息。"
        }
      ],
      "confirmation": {
        "status": "pending",
        "confirmed_at": null,
        "confirmed_by": null,
        "internal_confirmation_note": null
      }
    }
  ],
  "grouped_by_employee": [
    {
      "employee_id": "EMP-001",
      "employee_name": "EMP-001",
      "pending_count": 1,
      "confirmed_count": 0,
      "events": ["ROSTER-202608-REV-1:CELL-001"]
    }
  ],
  "selected_event": null
}
```

Confirmation route:

```http
POST /api/v1/roster-change-governance/events/{change_event_id}/confirm
Content-Type: application/json

{
  "business_month": "2026-08",
  "project_id": "BOSCH-CS",
  "workplace_id": "SHANGHAI",
  "team_id": "G1",
  "actor_id": "scheduler-1",
  "confirmed_at": "2026-08-01T10:00",
  "internal_confirmation_note": "已核对正式班表和下游问题，现场无需再处理。"
}
```

## Task 1: Backend Event Model And Confirmation Persistence

**Files:**

- Modify: `backend/app/roster_persistence.py`
- Create: `backend/migrations/versions/20260707_0014_roster_change_confirmations.py`
- Modify: `backend/app/roster_service.py`
- Test: `backend/tests/test_roster_service.py`

- [ ] **Step 1: Write failing service test for event-first response and confirmation**

Add assertions to `RosterServiceTest.test_change_governance_derives_revision_diff_and_linked_issue` or create a sibling test named `test_change_center_returns_event_rows_and_persists_confirmation`.

```python
change_center = service.get_roster_change_governance(
    business_month="2026-08",
    project_id="BOSCH-CS",
    workplace_id="SHANGHAI",
    team_id="G1",
    visibility="scheduler",
)
self.assertEqual(change_center["summary"]["pending_count"], 1)
self.assertEqual(change_center["summary"]["confirmed_count"], 0)
self.assertEqual(len(change_center["change_events"]), 1)
event = change_center["change_events"][0]
self.assertEqual(event["change_event_id"], "ROSTER-202608-REV-1:CELL-001")
self.assertEqual(event["employee_id"], "EMP-001")
self.assertEqual(event["business_date"], "2026-08-01")
self.assertEqual(event["change_type"], "modified")
self.assertEqual(event["source_category"], "申请/异常")
self.assertEqual(event["confirmation"]["status"], "pending")
self.assertNotIn("source_cell_id", event)

confirmed = service.confirm_roster_change_event(
    event["change_event_id"],
    business_month="2026-08",
    project_id="BOSCH-CS",
    workplace_id="SHANGHAI",
    team_id="G1",
    actor_id="scheduler-1",
    confirmed_at="2026-08-01T10:00",
    internal_confirmation_note="已核对正式班表和下游问题，现场无需再处理。",
)
self.assertEqual(confirmed["confirmation"]["status"], "confirmed")
self.assertEqual(
    confirmed["confirmation"]["internal_confirmation_note"],
    "已核对正式班表和下游问题，现场无需再处理。",
)

after_confirm = service.get_roster_change_governance(
    business_month="2026-08",
    project_id="BOSCH-CS",
    workplace_id="SHANGHAI",
    team_id="G1",
    visibility="scheduler",
)
self.assertEqual(after_confirm["summary"]["pending_count"], 0)
self.assertEqual(after_confirm["summary"]["confirmed_count"], 1)
self.assertEqual(after_confirm["change_events"][0]["confirmation"]["status"], "confirmed")
```

- [ ] **Step 2: Run focused backend test and verify red**

Run:

```bash
.venv/bin/python -m unittest backend.tests.test_roster_service.RosterServiceTest.test_change_center_returns_event_rows_and_persists_confirmation -v
```

Expected: fail because `change_events`, `summary`, and `confirm_roster_change_event` do not exist yet.

- [ ] **Step 3: Add persistence record and SQLAlchemy entity**

In `backend/app/roster_persistence.py`, add:

```python
@dataclass(frozen=True)
class RosterChangeConfirmationRecord:
    change_event_id: str
    business_month: str
    project_id: str | None
    workplace_id: str | None
    team_id: str | None
    confirmed_by: str
    confirmed_at: str
    internal_confirmation_note: str
```

Add entity near `RosterRequestIntentEntity`:

```python
class RosterChangeConfirmationEntity(Base):
    __tablename__ = "roster_change_confirmations"

    change_event_id: Mapped[str] = mapped_column(String(240), primary_key=True)
    business_month: Mapped[str] = mapped_column(String(7), nullable=False, index=True)
    project_id: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    workplace_id: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    team_id: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    confirmed_by: Mapped[str] = mapped_column(String(120), nullable=False)
    confirmed_at: Mapped[str] = mapped_column(String(40), nullable=False)
    internal_confirmation_note: Mapped[str] = mapped_column(String(1000), nullable=False)
```

Add repository helpers:

```python
def save_change_confirmation(
    self,
    confirmation: RosterChangeConfirmationRecord,
) -> RosterChangeConfirmationRecord:
    with self.session_factory.begin() as session:
        entity = session.get(RosterChangeConfirmationEntity, confirmation.change_event_id)
        if entity is None:
            session.add(_change_confirmation_entity(confirmation))
        else:
            entity.business_month = confirmation.business_month
            entity.project_id = _scope_value(confirmation.project_id)
            entity.workplace_id = _scope_value(confirmation.workplace_id)
            entity.team_id = _scope_value(confirmation.team_id)
            entity.confirmed_by = confirmation.confirmed_by
            entity.confirmed_at = confirmation.confirmed_at
            entity.internal_confirmation_note = confirmation.internal_confirmation_note
    saved = self.get_change_confirmation(confirmation.change_event_id)
    if saved is None:
        raise RuntimeError("roster change confirmation could not be read back")
    return saved

def get_change_confirmation(
    self,
    change_event_id: str,
) -> RosterChangeConfirmationRecord | None:
    with self.session_factory() as session:
        entity = session.get(RosterChangeConfirmationEntity, change_event_id)
        return _change_confirmation_record(entity) if entity is not None else None

def list_change_confirmations(
    self,
    *,
    business_month: str,
    project_id: str | None,
    workplace_id: str | None,
    team_id: str | None,
) -> list[RosterChangeConfirmationRecord]:
    with self.session_factory() as session:
        rows = list(
            session.scalars(
                select(RosterChangeConfirmationEntity)
                .where(
                    RosterChangeConfirmationEntity.business_month == business_month,
                    RosterChangeConfirmationEntity.project_id == _scope_value(project_id),
                    RosterChangeConfirmationEntity.workplace_id == _scope_value(workplace_id),
                    RosterChangeConfirmationEntity.team_id == _scope_value(team_id),
                )
                .order_by(RosterChangeConfirmationEntity.confirmed_at)
            )
        )
    return [_change_confirmation_record(row) for row in rows]
```

Add mappers:

```python
def _change_confirmation_entity(
    confirmation: RosterChangeConfirmationRecord,
) -> RosterChangeConfirmationEntity:
    return RosterChangeConfirmationEntity(
        change_event_id=confirmation.change_event_id,
        business_month=confirmation.business_month,
        project_id=_scope_value(confirmation.project_id),
        workplace_id=_scope_value(confirmation.workplace_id),
        team_id=_scope_value(confirmation.team_id),
        confirmed_by=confirmation.confirmed_by,
        confirmed_at=confirmation.confirmed_at,
        internal_confirmation_note=confirmation.internal_confirmation_note,
    )

def _change_confirmation_record(
    entity: RosterChangeConfirmationEntity,
) -> RosterChangeConfirmationRecord:
    return RosterChangeConfirmationRecord(
        change_event_id=entity.change_event_id,
        business_month=entity.business_month,
        project_id=entity.project_id or None,
        workplace_id=entity.workplace_id or None,
        team_id=entity.team_id or None,
        confirmed_by=entity.confirmed_by,
        confirmed_at=entity.confirmed_at,
        internal_confirmation_note=entity.internal_confirmation_note,
    )
```

- [ ] **Step 4: Add Alembic migration**

Create `backend/migrations/versions/20260707_0014_roster_change_confirmations.py`:

```python
"""create roster change confirmation table

Revision ID: 20260707_0014
Revises: 20260707_0013
Create Date: 2026-07-07
"""

from alembic import op
import sqlalchemy as sa


revision = "20260707_0014"
down_revision = "20260707_0013"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "roster_change_confirmations",
        sa.Column("change_event_id", sa.String(length=240), primary_key=True),
        sa.Column("business_month", sa.String(length=7), nullable=False),
        sa.Column("project_id", sa.String(length=120), nullable=False, server_default=""),
        sa.Column("workplace_id", sa.String(length=120), nullable=False, server_default=""),
        sa.Column("team_id", sa.String(length=120), nullable=False, server_default=""),
        sa.Column("confirmed_by", sa.String(length=120), nullable=False),
        sa.Column("confirmed_at", sa.String(length=40), nullable=False),
        sa.Column("internal_confirmation_note", sa.String(length=1000), nullable=False),
    )
    op.create_index(
        "ix_roster_change_confirmations_business_month",
        "roster_change_confirmations",
        ["business_month"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_roster_change_confirmations_business_month",
        table_name="roster_change_confirmations",
    )
    op.drop_table("roster_change_confirmations")
```

- [ ] **Step 5: Convert service output to event-first**

In `backend/app/roster_service.py`, keep `_change_governance_diff_rows` as a private derivation helper if useful, but make `get_roster_change_governance` return `summary`, `change_events`, `grouped_by_employee`, and `selected_event`.

Add confirmation lookup:

```python
confirmations = {
    item.change_event_id: item
    for item in self.repository.list_change_confirmations(
        business_month=business_month,
        project_id=project_id,
        workplace_id=workplace_id,
        team_id=team_id,
    )
}
```

For every derived diff row, emit an event:

```python
event = {
    "change_event_id": row["diff_id"],
    "employee_id": row["employee_id"],
    "employee_name": row["employee_id"],
    "team_id": team_id,
    "business_date": row["business_date"],
    "weekday": _weekday_label(row["business_date"]),
    "change_type": _change_event_type(row["before"], row["after"]),
    "source_category": _change_source_category(row["linked_issues"], row["after"]),
    "source_summary": _change_source_summary(row["linked_issues"], row["after"]),
    "before": row["before"],
    "after": row["after"],
    "linked_issues": row["linked_issues"],
    "confirmation": _change_confirmation_snapshot(confirmations.get(row["diff_id"])),
}
```

Add helpers:

```python
def _weekday_label(business_date: str) -> str:
    parsed = datetime.fromisoformat(business_date)
    return parsed.strftime("%a")

def _change_event_type(before: dict[str, Any], after: dict[str, Any]) -> str:
    if before["assignment_kind"] == "unassigned" and after["assignment_kind"] != "unassigned":
        return "added"
    if before["assignment_kind"] != "unassigned" and after["assignment_kind"] == "unassigned":
        return "removed"
    if before["assignment_kind"] == "rest" and after["assignment_kind"] == "shift":
        return "restored"
    return "modified"

def _change_source_category(
    linked_issues: list[dict[str, Any]],
    after: dict[str, Any],
) -> str:
    if linked_issues:
        return "申请/异常"
    if after.get("manually_adjusted"):
        return "排班师手工调整"
    return "系统派生修正"

def _change_source_summary(
    linked_issues: list[dict[str, Any]],
    after: dict[str, Any],
) -> str:
    if linked_issues:
        issue = linked_issues[0]
        return f"{issue['action_type']} {issue['request_id']}"
    if after.get("manually_adjusted"):
        return "排班师手工调整"
    return "系统派生修正"

def _change_confirmation_snapshot(
    confirmation: RosterChangeConfirmationRecord | None,
) -> dict[str, Any]:
    if confirmation is None:
        return {
            "status": "pending",
            "confirmed_at": None,
            "confirmed_by": None,
            "internal_confirmation_note": None,
        }
    return {
        "status": "confirmed",
        "confirmed_at": confirmation.confirmed_at,
        "confirmed_by": confirmation.confirmed_by,
        "internal_confirmation_note": confirmation.internal_confirmation_note,
    }
```

- [ ] **Step 6: Add service confirmation method**

```python
def confirm_roster_change_event(
    self,
    change_event_id: str,
    *,
    business_month: str,
    project_id: str | None,
    workplace_id: str | None,
    team_id: str | None,
    actor_id: str,
    confirmed_at: str,
    internal_confirmation_note: str,
) -> dict[str, Any]:
    if not internal_confirmation_note.strip():
        raise ValueError("internal confirmation note is required")
    current = self.get_roster_change_governance(
        business_month=business_month,
        project_id=project_id,
        workplace_id=workplace_id,
        team_id=team_id,
        visibility="scheduler",
    )
    matching = next(
        (
            item
            for item in current["change_events"]
            if item["change_event_id"] == change_event_id
        ),
        None,
    )
    if matching is None:
        raise ValueError(f"roster change event does not exist: {change_event_id}")
    saved = self.repository.save_change_confirmation(
        RosterChangeConfirmationRecord(
            change_event_id=change_event_id,
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
            confirmed_by=actor_id,
            confirmed_at=confirmed_at,
            internal_confirmation_note=internal_confirmation_note.strip(),
        )
    )
    return matching | {"confirmation": _change_confirmation_snapshot(saved)}
```

- [ ] **Step 7: Run backend tests**

Run:

```bash
.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_publish_api -v
```

Expected: pass after API task is implemented; before API task, service tests pass and API tests may still fail if response assertions changed.

## Task 2: API Route And Contract Tests

**Files:**

- Modify: `backend/app/main.py`
- Test: `backend/tests/test_roster_publish_api.py`

- [ ] **Step 1: Write failing API assertions**

Update `test_roster_change_governance_api_returns_revision_diff_and_linked_issue` so it expects event-first fields:

```python
self.assertEqual(response["summary"]["pending_count"], 1)
self.assertEqual(response["summary"]["confirmed_count"], 0)
self.assertEqual(response["change_events"][0]["change_event_id"], "ROSTER-2026-08-REV-1:CELL-001")
self.assertEqual(response["change_events"][0]["source_category"], "申请/异常")
self.assertEqual(response["change_events"][0]["confirmation"]["status"], "pending")
self.assertNotIn("diff_rows", response)
self.assertNotIn("timeline", response)
```

Add a direct call test for the confirm route function:

```python
confirmed = confirm_roster_change_event(
    "ROSTER-2026-08-REV-1:CELL-001",
    {
        "business_month": "2026-08",
        "project_id": "BOSCH-CS",
        "workplace_id": "SHANGHAI",
        "team_id": "G1",
        "actor_id": "scheduler-1",
        "confirmed_at": "2026-08-01T10:00",
        "internal_confirmation_note": "已核对正式班表和下游问题，现场无需再处理。",
    },
)
self.assertEqual(confirmed["confirmation"]["status"], "confirmed")
```

- [ ] **Step 2: Run focused API test and verify red**

Run:

```bash
.venv/bin/python -m unittest backend.tests.test_roster_publish_api.RosterPublishApiTest.test_roster_change_governance_api_returns_revision_diff_and_linked_issue -v
```

Expected: fail until route returns event-first shape.

- [ ] **Step 3: Add confirm route**

In `backend/app/main.py`, add:

```python
@app.post("/api/v1/roster-change-governance/events/{change_event_id}/confirm")
def confirm_roster_change_event(
    change_event_id: str,
    payload: dict[str, Any],
) -> dict[str, Any]:
    service = _get_roster_service()
    try:
        return service.confirm_roster_change_event(
            change_event_id,
            business_month=str(payload.get("business_month") or ""),
            project_id=payload.get("project_id"),
            workplace_id=payload.get("workplace_id"),
            team_id=payload.get("team_id"),
            actor_id=str(payload.get("actor_id") or ""),
            confirmed_at=str(payload.get("confirmed_at") or ""),
            internal_confirmation_note=str(payload.get("internal_confirmation_note") or ""),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail={
                "error": {
                    "code": "ROSTER_CHANGE_CONFIRM_BLOCKED",
                    "message": str(exc),
                }
            },
        ) from exc
```

Confirm `Any` is imported in `backend/app/main.py`; if not, add `from typing import Any`.

- [ ] **Step 4: Run backend API tests**

Run:

```bash
.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_publish_api -v
```

Expected: pass.

## Task 3: Event-First Page And Drawer UI

**Files:**

- Modify: `app/roster-change-governance/page.tsx`
- Modify: `components/roster-change-governance-workbench.tsx`
- Modify: `components/app-sidebar.tsx`
- Test: `scripts/tests/roster-change-governance-structure.test.mjs`

- [ ] **Step 1: Write failing structure test**

Replace old structure assertions with:

```js
assert.ok(content.includes("班表变更中心"))
assert.ok(content.includes('data-slot="roster-change-center-shell"'))
assert.ok(content.includes('data-slot="roster-change-event-list"'))
assert.ok(content.includes('data-slot="roster-change-detail-drawer"'))
assert.ok(content.includes("待处理"))
assert.ok(content.includes("全部变更"))
assert.ok(content.includes("按员工"))
assert.ok(content.includes("确认变更"))
assert.ok(content.includes("internal_confirmation_note"))
assert.ok(!content.includes("版本时间线"))
assert.ok(!content.includes("人员-日期差异"))
assert.ok(!content.includes("source_cell_id："))
assert.ok(!content.includes('data-slot="roster-change-timeline"'))
```

Update navigation assertion:

```js
assert.ok(content.includes("/roster-change-governance"))
assert.ok(content.includes("班表变更中心"))
assert.ok(!content.includes("正式班表变更治理"))
```

- [ ] **Step 2: Run frontend structure test and verify red**

Run:

```bash
node --test scripts/tests/roster-change-governance-structure.test.mjs
```

Expected: fail on old version-first slots/copy.

- [ ] **Step 3: Update page title and breadcrumb**

In `app/roster-change-governance/page.tsx`, replace:

```tsx
<AppShell
  title="正式班表变更治理"
  breadcrumbItems={[{ label: "正式班表变更治理" }]}
>
```

with:

```tsx
<AppShell
  title="班表变更中心"
  breadcrumbItems={[{ label: "班表变更中心" }]}
>
```

- [ ] **Step 4: Replace workbench state and data types**

In `components/roster-change-governance-workbench.tsx`, replace timeline/diff types with:

```tsx
type RosterChangeConfirmation = {
  status: "pending" | "confirmed"
  confirmed_at?: string | null
  confirmed_by?: string | null
  internal_confirmation_note?: string | null
}

type RosterChangeEvent = {
  change_event_id: string
  employee_id: string
  employee_name: string
  team_id?: string | null
  business_date: string
  weekday: string
  change_type: string
  source_category: string
  source_summary: string
  before: RosterChangeCellSnapshot
  after: RosterChangeCellSnapshot
  linked_issues: RosterChangeLinkedIssue[]
  confirmation: RosterChangeConfirmation
}

type RosterChangeEmployeeGroup = {
  employee_id: string
  employee_name: string
  pending_count: number
  confirmed_count: number
  events: string[]
}

type RosterChangeCenterResponse = {
  summary: {
    pending_count: number
    confirmed_count: number
    affected_employee_count: number
    linked_issue_count: number
  }
  change_events: RosterChangeEvent[]
  grouped_by_employee: RosterChangeEmployeeGroup[]
  selected_event?: RosterChangeEvent | null
}
```

- [ ] **Step 5: Build the event-first layout**

Use these stable slots:

```tsx
<section data-slot="roster-change-center-shell" className="flex min-h-0 flex-1 flex-col">
  <div className="border-b bg-background px-4 py-3">
    <div className="text-sm font-semibold">班表变更中心</div>
  </div>
  <div className="grid grid-cols-4 gap-2 border-b bg-background p-3">
    <Metric label="待处理变更" value={payload?.summary.pending_count ?? 0} />
    <Metric label="已确认变更" value={payload?.summary.confirmed_count ?? 0} />
    <Metric label="影响员工" value={payload?.summary.affected_employee_count ?? 0} />
    <Metric label="关联申请/异常" value={payload?.summary.linked_issue_count ?? 0} />
  </div>
  <div className="flex items-center gap-2 border-b bg-background px-3 py-2">
    {(["pending", "all", "employee"] as const).map((nextView) => (
      <Button key={nextView} type="button" variant={view === nextView ? "default" : "outline"} size="sm" onClick={() => setView(nextView)}>
        {viewLabel[nextView]}
      </Button>
    ))}
  </div>
  <div data-slot="roster-change-event-list" className="min-h-0 flex-1 overflow-auto p-3">
    {visibleEvents.map((event) => (
      <button key={event.change_event_id} type="button" className="w-full rounded-md border bg-card p-3 text-left" onClick={() => setSelectedEventId(event.change_event_id)}>
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">{event.employee_name} / {event.business_date}</span>
          <Badge variant={event.confirmation.status === "pending" ? "default" : "secondary"}>
            {event.confirmation.status === "pending" ? "待处理" : "已确认"}
          </Badge>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {formatSnapshot(event.before)} -> {formatSnapshot(event.after)}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">{event.source_category} / {event.source_summary}</div>
      </button>
    ))}
  </div>
  {selectedEvent ? (
    <EventDetailDrawer event={selectedEvent} model={model} onClose={() => setSelectedEventId(null)} onConfirmed={refreshPayload} />
  ) : null}
</section>
```

The drawer can be a fixed right panel with `data-slot="roster-change-detail-drawer"`; use existing `Button`, `Badge`, `Separator`, and plain `textarea`.

- [ ] **Step 6: Add confirmation submit**

Inside the drawer component:

```tsx
const [note, setNote] = React.useState("")
const [submitting, setSubmitting] = React.useState(false)

async function confirmEvent() {
  if (!note.trim()) {
    return
  }
  setSubmitting(true)
  await fetch(
    buildRosterApiUrl(`/api/v1/roster-change-governance/events/${encodeURIComponent(event.change_event_id)}/confirm`),
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        business_month: model.targetMonth,
        project_id: model.project.projectId,
        workplace_id: model.project.workplaceName,
        team_id: fixedTeamId,
        actor_id: "scheduler-1",
        confirmed_at: new Date().toISOString(),
        internal_confirmation_note: note.trim(),
      }),
    }
  )
  setSubmitting(false)
  onConfirmed()
}
```

Visible copy must not say approval, permission, notification, export, batch, or source cell.

- [ ] **Step 7: Run frontend checks**

Run:

```bash
node --test scripts/tests/roster-change-governance-structure.test.mjs
npm run typecheck
```

Expected: both pass.

## Task 4: Browser Smoke And Traceability Closeout

**Files:**

- Modify traceability docs listed in active IM305
- No product code changes unless smoke finds a defect inside IM305 scope

- [ ] **Step 1: Run focused backend/frontend checks**

Run:

```bash
.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_publish_api -v
node --test scripts/tests/roster-change-governance-structure.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs
npm run typecheck
git diff --check
bash scripts/check-state.sh --strict
```

Expected: pass.

- [ ] **Step 2: Browser smoke**

Use local backend/frontend runtime and seed the same IM304 scenario. Verify:

- `/roster-change-governance?month=2026-08` page title is 班表变更中心.
- Default tab is 待处理.
- The main row reads as employee/date/shift change, not version/diff.
- Clicking a row opens the right drawer.
- Drawer shows before/after, source category, linked issue, confirmation note field, and 确认变更.
- Submitting a note removes the event from 待处理 and keeps it in 全部变更 as 已确认.
- Normal UI does not show `source_cell_id`, `version_id`, `revision`, `diff_rows`, `timeline`, 审批, 导出, 批量.

- [ ] **Step 3: Update traceability**

Update:

- `docs/task-log.md`
- `docs/audit-report.md`
- `docs/dev/branch-log.md`
- `docs/current/PROJECT_CONTEXT.md`
- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`

Record business result first, then verification result.

- [ ] **Step 4: Run final gate**

Run:

```bash
BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh
```

Expected: pass with strict state check, Node tests, shadcn convention check, lint, typecheck, Next build, backend tests, and project Harness check.

- [ ] **Step 5: Commit**

```bash
git add backend/app/roster_persistence.py backend/app/roster_service.py backend/app/main.py backend/migrations/versions/20260707_0014_roster_change_confirmations.py backend/tests/test_roster_service.py backend/tests/test_roster_publish_api.py app/roster-change-governance/page.tsx components/roster-change-governance-workbench.tsx components/app-sidebar.tsx scripts/tests/roster-change-governance-structure.test.mjs docs/current/PROJECT_CONTEXT.md docs/current/STORY_QUEUE.yaml docs/current/ACTIVE_TASKS.yaml docs/task-log.md docs/audit-report.md docs/dev/branch-log.md
git commit -m "feat: rebuild roster change center workflow"
```

## Self-Review

- Spec coverage: event-first list, pending/all/by-employee tabs, drawer detail, single-event confirmation, internal note, and no internal IDs are each covered by Tasks 1-4.
- Scope boundary: local confirmation persistence is included because PM explicitly allowed it; approval, permissions, notification, export, batch, forecasting, standard-capacity, Excel, and automatic scheduling remain excluded.
- Type consistency: backend uses `change_event_id`, `change_events`, `grouped_by_employee`, and `confirmation`; frontend uses the same field names.
- Verification path: focused backend tests, structure tests, typecheck, browser smoke, state check, diff check, and final `check.sh`.
