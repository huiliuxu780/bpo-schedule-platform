from datetime import datetime, timedelta, timezone

from backend.app.models import (
    DemandPlanRow,
    ScheduleRiskLevel,
    ScheduleRiskRow,
    ScheduleRiskStatus,
    SchedulePlanDetail,
    SchedulePlanDraftRequest,
    SchedulePlanInterval,
    SchedulePlanSummary,
    SchedulePlanStatus,
    ShiftDetailRow,
    UnavailabilityRow,
    UnavailabilityStatus,
)
from backend.app.seed_data import SCHEDULE_PLANS

SCHEDULE_RISK_STATUS: dict[str, ScheduleRiskStatus] = {}

UNAVAILABILITY_ROWS = [
    UnavailabilityRow(
        unavailability_id="unavail-20260511-001",
        staff_name="张敏",
        team_name="一线客服 A 组",
        project_name="博西客服",
        site_name="上海职场",
        unavailable_date="2026-05-11",
        start_time="09:30",
        end_time="10:30",
        reason="临时请假",
        status="active",
        affected_intervals=2,
        note="需补 2 个 0.5h 时段",
    ),
    UnavailabilityRow(
        unavailability_id="unavail-20260511-002",
        staff_name="李想",
        team_name="一线客服 B 组",
        project_name="博西客服",
        site_name="苏州职场",
        unavailable_date="2026-05-11",
        start_time="10:00",
        end_time="11:00",
        reason="培训占用",
        status="active",
        affected_intervals=2,
        note="影响午前覆盖率",
    ),
    UnavailabilityRow(
        unavailability_id="unavail-20260512-001",
        staff_name="王宁",
        team_name="外包夜班组",
        project_name="博西客服",
        site_name="上海职场",
        unavailable_date="2026-05-12",
        start_time="12:00",
        end_time="13:00",
        reason="不可用申请",
        status="resolved",
        affected_intervals=2,
        note="已调整排班",
    ),
]


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


def _matches_demand_query(row: DemandPlanRow, query: str) -> bool:
    normalized = query.strip().lower()
    if not normalized:
        return True

    searchable_text = " ".join(
        [
            row.demand_id,
            row.plan_date,
            row.project_name,
            row.site_name,
            row.interval_start,
            row.interval_end,
            row.source,
            row.status,
        ]
    ).lower()

    return normalized in searchable_text


def _matches_unavailability_query(row: UnavailabilityRow, query: str) -> bool:
    normalized = query.strip().lower()
    if not normalized:
        return True

    searchable_text = " ".join(
        [
            row.unavailability_id,
            row.staff_name,
            row.team_name,
            row.project_name,
            row.site_name,
            row.unavailable_date,
            row.start_time,
            row.end_time,
            row.reason,
            row.status,
            row.note,
        ]
    ).lower()

    return normalized in searchable_text


def _overlaps(
    interval_start: str,
    interval_end: str,
    unavailable_start: str,
    unavailable_end: str,
) -> bool:
    return interval_start < unavailable_end and unavailable_start < interval_end


def _risk_level(gap_agents: int, affected_unavailability: int) -> ScheduleRiskLevel:
    if gap_agents > 0 and affected_unavailability > 0:
        return "high"

    if gap_agents > 0:
        return "medium"

    return "low"


def _risk_reason(
    gap_agents: int,
    affected_unavailability: int,
    note: str,
) -> str:
    if gap_agents > 0 and affected_unavailability > 0:
        return f"缺口 {gap_agents} 人，且存在 {affected_unavailability} 条生效中不可用记录"

    if gap_agents > 0:
        return f"排班缺口 {gap_agents} 人"

    return f"{affected_unavailability} 条生效中不可用记录影响该时段"


def _risk_recommendation(
    level: ScheduleRiskLevel,
    gap_agents: int,
    note: str,
) -> str:
    if level == "high":
        return "优先复核不可用记录，并从相邻冗余时段调剂"

    if gap_agents > 0:
        return "检查草稿排班覆盖，必要时补班或跨团队调剂"

    return f"关注不可用影响，暂不自动调整排班：{note}"


def _matches_schedule_risk_query(row: ScheduleRiskRow, query: str) -> bool:
    normalized = query.strip().lower()
    if not normalized:
        return True

    searchable_text = " ".join(
        [
            row.risk_id,
            row.plan_id,
            row.plan_date,
            row.project_name,
            row.site_name,
            row.interval_start,
            row.interval_end,
            row.risk_level,
            row.reason,
            row.recommendation,
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


def list_demand_plan_rows(query: str | None = None) -> list[DemandPlanRow]:
    rows = [
        DemandPlanRow(
            demand_id=f"demand-{plan.summary.plan_date}-{plan.summary.site_name}-{interval.interval_start}".replace(
                " ", "-"
            ),
            plan_date=plan.summary.plan_date,
            project_name=plan.summary.project_name,
            site_name=plan.summary.site_name,
            interval_start=interval.interval_start,
            interval_end=interval.interval_end,
            forecast_agents=interval.forecast_agents,
            source="本地预测需求",
            status="mapped",
        )
        for plan in SCHEDULE_PLANS
        for interval in plan.intervals
    ]

    if query is not None:
        rows = [row for row in rows if _matches_demand_query(row, query)]

    return rows


def list_unavailability_rows(
    status: UnavailabilityStatus | None = None,
    query: str | None = None,
) -> list[UnavailabilityRow]:
    rows = list(UNAVAILABILITY_ROWS)

    if status is not None:
        rows = [row for row in rows if row.status == status]

    if query is not None:
        rows = [row for row in rows if _matches_unavailability_query(row, query)]

    return rows


def list_schedule_risk_rows(query: str | None = None) -> list[ScheduleRiskRow]:
    rows: list[ScheduleRiskRow] = []

    for plan in SCHEDULE_PLANS:
        for interval in plan.intervals:
            active_unavailability = [
                row
                for row in UNAVAILABILITY_ROWS
                if row.status == "active"
                and row.project_name == plan.summary.project_name
                and row.site_name == plan.summary.site_name
                and row.unavailable_date == plan.summary.plan_date
                and _overlaps(
                    interval.interval_start,
                    interval.interval_end,
                    row.start_time,
                    row.end_time,
                )
            ]

            if interval.gap_agents == 0 and not active_unavailability:
                continue

            level = _risk_level(interval.gap_agents, len(active_unavailability))
            risk_id = f"risk-{plan.summary.id}-{interval.interval_start}"
            rows.append(
                ScheduleRiskRow(
                    risk_id=risk_id,
                    plan_id=plan.summary.id,
                    plan_date=plan.summary.plan_date,
                    project_name=plan.summary.project_name,
                    site_name=plan.summary.site_name,
                    interval_start=interval.interval_start,
                    interval_end=interval.interval_end,
                    risk_level=level,
                    gap_agents=interval.gap_agents,
                    affected_unavailability=len(active_unavailability),
                    reason=_risk_reason(
                        interval.gap_agents,
                        len(active_unavailability),
                        interval.note,
                    ),
                    recommendation=_risk_recommendation(
                        level,
                        interval.gap_agents,
                        interval.note,
                    ),
                    risk_status=SCHEDULE_RISK_STATUS.get(risk_id, "open"),
                )
            )

    if query is not None:
        rows = [row for row in rows if _matches_schedule_risk_query(row, query)]

    level_order: dict[ScheduleRiskLevel, int] = {"high": 0, "medium": 1, "low": 2}
    return sorted(
        rows,
        key=lambda row: (
            level_order[row.risk_level],
            row.plan_date,
            row.site_name,
            row.interval_start,
        ),
    )


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


def transition_plan_status(
    plan_id: str,
    expected_status: SchedulePlanStatus,
    next_status: SchedulePlanStatus,
) -> SchedulePlanDetail | None:
    """Transition a schedule plan from expected_status to next_status.

    Returns the updated detail on success, or None when the plan exists but
    its current status does not match expected_status.  Raises KeyError when
    the plan does not exist so the caller can distinguish 404 from 409.
    """
    for index, plan in enumerate(SCHEDULE_PLANS):
        if plan.summary.id != plan_id:
            continue

        if plan.summary.status != expected_status:
            return None

        updated = SchedulePlanDetail(
            summary=SchedulePlanSummary(
                id=plan.summary.id,
                plan_date=plan.summary.plan_date,
                project_name=plan.summary.project_name,
                site_name=plan.summary.site_name,
                version=plan.summary.version,
                status=next_status,
                forecast_agents=plan.summary.forecast_agents,
                scheduled_agents=plan.summary.scheduled_agents,
                gap_agents=plan.summary.gap_agents,
                coverage_rate=plan.summary.coverage_rate,
                updated_at=_now_iso(),
            ),
            intervals=list(plan.intervals),
        )
        SCHEDULE_PLANS[index] = updated
        return updated

    raise KeyError(plan_id)


def find_schedule_risk(risk_id: str) -> ScheduleRiskRow | None:
    for row in list_schedule_risk_rows():
        if row.risk_id == risk_id:
            return row
    return None


def transition_schedule_risk_status(
    risk_id: str,
    next_status: ScheduleRiskStatus,
) -> ScheduleRiskRow | None:
    """Transition a schedule risk from current status to next_status.

    Returns the updated risk row on success, or None when the transition is
    not allowed. Raises KeyError when the risk does not exist.
    """
    current = find_schedule_risk(risk_id)
    if current is None:
        raise KeyError(risk_id)

    # Validate transition
    if current.risk_status == "resolved":
        return None
    if current.risk_status == "confirmed" and next_status == "confirmed":
        return None

    SCHEDULE_RISK_STATUS[risk_id] = next_status
    return find_schedule_risk(risk_id)


def resolve_unavailability(unavailability_id: str) -> UnavailabilityRow | None:
    """Resolve an unavailability record.

    Returns the updated row on success, or None when the row exists but is
    already resolved. Raises KeyError when the row does not exist.
    """
    for index, row in enumerate(UNAVAILABILITY_ROWS):
        if row.unavailability_id != unavailability_id:
            continue

        if row.status == "resolved":
            return None

        updated = UnavailabilityRow(
            unavailability_id=row.unavailability_id,
            staff_name=row.staff_name,
            team_name=row.team_name,
            project_name=row.project_name,
            site_name=row.site_name,
            unavailable_date=row.unavailable_date,
            start_time=row.start_time,
            end_time=row.end_time,
            reason=row.reason,
            status="resolved",
            affected_intervals=row.affected_intervals,
            note=row.note,
        )
        UNAVAILABILITY_ROWS[index] = updated
        return updated

    raise KeyError(unavailability_id)
