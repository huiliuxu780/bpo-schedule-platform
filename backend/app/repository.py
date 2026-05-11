from datetime import datetime, timedelta, timezone

from backend.app.models import (
    SchedulePlanDetail,
    SchedulePlanDraftRequest,
    SchedulePlanInterval,
    SchedulePlanSummary,
    SchedulePlanStatus,
    ShiftDetailRow,
)
from backend.app.seed_data import SCHEDULE_PLANS


def _coverage_rate(scheduled_agents: int, forecast_agents: int) -> float:
    if forecast_agents == 0:
        return 1.0
    return round(scheduled_agents / forecast_agents, 3)


def _now_iso() -> str:
    return datetime.now(timezone(timedelta(hours=8))).replace(microsecond=0).isoformat()


def _draft_id(plan_date: str) -> str:
    date_part = plan_date.replace("-", "")
    draft_count = sum(
        1 for plan in SCHEDULE_PLANS if plan.summary.id.startswith(f"draft-{date_part}-")
    )
    return f"draft-{date_part}-{draft_count + 1:03d}"


def _build_intervals(request: SchedulePlanDraftRequest) -> list[SchedulePlanInterval]:
    return [
        SchedulePlanInterval(
            interval_start=item.interval_start,
            interval_end=item.interval_end,
            forecast_agents=item.forecast_agents,
            scheduled_agents=item.scheduled_agents,
            gap_agents=max(item.forecast_agents - item.scheduled_agents, 0),
            coverage_rate=_coverage_rate(item.scheduled_agents, item.forecast_agents),
            note=item.note,
        )
        for item in request.intervals
    ]


def _build_detail(
    plan_id: str,
    request: SchedulePlanDraftRequest,
    updated_at: str | None = None,
) -> SchedulePlanDetail:
    intervals = _build_intervals(request)
    forecast_agents = sum(item.forecast_agents for item in intervals)
    scheduled_agents = sum(item.scheduled_agents for item in intervals)
    return SchedulePlanDetail(
        summary=SchedulePlanSummary(
            id=plan_id,
            plan_date=request.plan_date,
            project_name=request.project_name,
            site_name=request.site_name,
            version=request.version,
            status="draft",
            forecast_agents=forecast_agents,
            scheduled_agents=scheduled_agents,
            gap_agents=max(forecast_agents - scheduled_agents, 0),
            coverage_rate=_coverage_rate(scheduled_agents, forecast_agents),
            updated_at=updated_at or _now_iso(),
        ),
        intervals=intervals,
    )


def _matches_query(summary: SchedulePlanSummary, query: str) -> bool:
    normalized = query.strip().lower()
    if not normalized:
        return True

    searchable_text = " ".join(
        [
            summary.id,
            summary.plan_date,
            summary.project_name,
            summary.site_name,
            summary.version,
            summary.status,
        ]
    ).lower()

    return normalized in searchable_text


def _matches_shift_query(row: ShiftDetailRow, query: str) -> bool:
    normalized = query.strip().lower()
    if not normalized:
        return True

    searchable_text = " ".join(
        [
            row.plan_id,
            row.plan_date,
            row.project_name,
            row.site_name,
            row.version,
            row.status,
            row.interval_start,
            row.interval_end,
            row.note,
        ]
    ).lower()

    return normalized in searchable_text


def list_plan_summaries(
    status: SchedulePlanStatus | None = None,
    query: str | None = None,
) -> list[SchedulePlanSummary]:
    summaries = [plan.summary for plan in SCHEDULE_PLANS]

    if status is not None:
        summaries = [summary for summary in summaries if summary.status == status]

    if query is not None:
        summaries = [summary for summary in summaries if _matches_query(summary, query)]

    return summaries


def list_shift_detail_rows(
    status: SchedulePlanStatus | None = None,
    query: str | None = None,
) -> list[ShiftDetailRow]:
    rows = [
        ShiftDetailRow(
            plan_id=plan.summary.id,
            plan_date=plan.summary.plan_date,
            project_name=plan.summary.project_name,
            site_name=plan.summary.site_name,
            version=plan.summary.version,
            status=plan.summary.status,
            interval_start=interval.interval_start,
            interval_end=interval.interval_end,
            forecast_agents=interval.forecast_agents,
            scheduled_agents=interval.scheduled_agents,
            gap_agents=interval.gap_agents,
            coverage_rate=interval.coverage_rate,
            note=interval.note,
        )
        for plan in SCHEDULE_PLANS
        for interval in plan.intervals
    ]

    if status is not None:
        rows = [row for row in rows if row.status == status]

    if query is not None:
        rows = [row for row in rows if _matches_shift_query(row, query)]

    return rows


def find_plan_detail(plan_id: str) -> SchedulePlanDetail | None:
    for plan in SCHEDULE_PLANS:
        if plan.summary.id == plan_id:
            return plan
    return None


def create_plan_draft(request: SchedulePlanDraftRequest) -> SchedulePlanDetail:
    draft = _build_detail(_draft_id(request.plan_date), request)
    SCHEDULE_PLANS.append(draft)
    return draft


def update_plan_draft(
    plan_id: str,
    request: SchedulePlanDraftRequest,
) -> SchedulePlanDetail | None:
    for index, plan in enumerate(SCHEDULE_PLANS):
        if plan.summary.id != plan_id:
            continue

        if plan.summary.status != "draft":
            return None

        updated = _build_detail(plan_id, request)
        SCHEDULE_PLANS[index] = updated
        return updated

    return None
