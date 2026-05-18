from datetime import datetime, timedelta, timezone

from backend.app.models import (
    DemandPlanRow,
    MasterDataEntityContract,
    MasterDataImportContractResponse,
    IntervalExpansionContract,
    PersonnelScheduleImportContractResponse,
    ScheduleRiskLevel,
    ScheduleRiskRow,
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

MASTER_DATA_IMPORT_CONTRACT = MasterDataImportContractResponse(
    version="production-mvp-v1",
    entities=[
        MasterDataEntityContract(
            entity="agent",
            primary_key=["employee_id"],
            fields=[
                "employee_id",
                "external_employee_id",
                "employee_name",
                "supplier_id",
                "workplace_id",
                "project_id",
                "skill_group",
                "skill_level",
                "status",
                "effective_from",
                "effective_to",
            ],
            required_fields=[
                "employee_id",
                "employee_name",
                "supplier_id",
                "workplace_id",
                "project_id",
                "status",
            ],
            foreign_keys=["supplier_id", "workplace_id", "project_id"],
            validation_rules=[
                "missing_required_field",
                "duplicate_primary_key",
                "unknown_foreign_key",
                "invalid_effective_range",
            ],
        ),
        MasterDataEntityContract(
            entity="workplace",
            primary_key=["workplace_id"],
            fields=["workplace_id", "workplace_name", "city", "timezone", "status"],
            required_fields=["workplace_id", "workplace_name", "timezone", "status"],
            validation_rules=[
                "missing_required_field",
                "duplicate_primary_key",
                "invalid_timezone",
            ],
        ),
        MasterDataEntityContract(
            entity="supplier",
            primary_key=["supplier_id"],
            fields=["supplier_id", "supplier_name", "status", "effective_from", "effective_to"],
            required_fields=["supplier_id", "supplier_name", "status"],
            validation_rules=[
                "missing_required_field",
                "duplicate_primary_key",
                "invalid_effective_range",
            ],
        ),
        MasterDataEntityContract(
            entity="project",
            primary_key=["project_id"],
            fields=["project_id", "project_name", "status", "effective_from", "effective_to"],
            required_fields=["project_id", "project_name", "status"],
            validation_rules=[
                "missing_required_field",
                "duplicate_primary_key",
                "invalid_effective_range",
            ],
        ),
        MasterDataEntityContract(
            entity="agent_binding",
            primary_key=["binding_id"],
            fields=[
                "binding_id",
                "employee_id",
                "supplier_id",
                "workplace_id",
                "project_id",
                "skill_group",
                "skill_level",
                "effective_from",
                "effective_to",
                "status",
            ],
            required_fields=[
                "binding_id",
                "employee_id",
                "supplier_id",
                "workplace_id",
                "project_id",
                "effective_from",
                "status",
            ],
            foreign_keys=["employee_id", "supplier_id", "workplace_id", "project_id"],
            validation_rules=[
                "missing_required_field",
                "duplicate_primary_key",
                "unknown_foreign_key",
                "overlapping_effective_range",
                "invalid_effective_range",
            ],
        ),
        MasterDataEntityContract(
            entity="shift_type",
            primary_key=["shift_type_id"],
            fields=[
                "shift_type_id",
                "shift_type_name",
                "start_time",
                "end_time",
                "break_windows",
                "meal_windows",
                "counts_as_scheduled",
                "status",
            ],
            required_fields=[
                "shift_type_id",
                "shift_type_name",
                "start_time",
                "end_time",
                "counts_as_scheduled",
                "status",
            ],
            validation_rules=[
                "missing_required_field",
                "duplicate_primary_key",
                "invalid_time_range",
                "invalid_boolean_value",
            ],
        ),
    ],
    batch_fields=[
        "batch_id",
        "file_name",
        "entity",
        "uploaded_by",
        "uploaded_at",
        "business_date_from",
        "business_date_to",
        "status",
        "total_rows",
        "success_rows",
        "failed_rows",
        "warning_rows",
        "version",
    ],
    failure_row_fields=[
        "batch_id",
        "entity",
        "failed_row_number",
        "field_name",
        "error_code",
        "error_message",
        "raw_value",
    ],
    quality_error_codes=[
        "missing_required_field",
        "duplicate_primary_key",
        "unknown_foreign_key",
        "invalid_effective_range",
        "overlapping_effective_range",
        "invalid_time_range",
        "invalid_timezone",
        "invalid_boolean_value",
    ],
)

PERSONNEL_SCHEDULE_IMPORT_CONTRACT = PersonnelScheduleImportContractResponse(
    version="production-mvp-v1",
    entity="personnel_schedule",
    primary_key=["schedule_detail_id"],
    fields=[
        "schedule_detail_id",
        "schedule_version_id",
        "employee_id",
        "schedule_date",
        "business_date",
        "workplace_id",
        "supplier_id",
        "project_id",
        "skill_group",
        "skill_level",
        "shift_type_id",
        "start_at",
        "end_at",
        "break_windows",
        "meal_windows",
        "status",
    ],
    required_fields=[
        "schedule_detail_id",
        "schedule_version_id",
        "employee_id",
        "business_date",
        "workplace_id",
        "supplier_id",
        "project_id",
        "shift_type_id",
        "start_at",
        "end_at",
        "status",
    ],
    generated_fields=["expanded_interval_ids"],
    validation_rules=[
        "missing_required_field",
        "duplicate_primary_key",
        "unknown_employee_id",
        "unknown_shift_type_id",
        "invalid_time_range",
        "cross_day_without_business_date",
        "break_or_meal_outside_shift",
    ],
    expansion=IntervalExpansionContract(
        source_entity="personnel_schedule",
        target_entity="interval_schedule",
        interval_minutes=30,
        group_by=[
            "schedule_version_id",
            "business_date",
            "workplace_id",
            "project_id",
            "skill_group",
            "skill_level",
            "interval_start",
            "interval_end",
        ],
        target_fields=[
            "interval_schedule_id",
            "schedule_version_id",
            "business_date",
            "workplace_id",
            "project_id",
            "interval_start",
            "interval_end",
            "scheduled_agents",
            "employee_ids",
            "generated_from",
        ],
        traceability_fields=[
            "schedule_detail_id",
            "expanded_interval_ids",
            "generated_from",
        ],
    ),
)


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


def get_master_data_import_contract() -> MasterDataImportContractResponse:
    return MASTER_DATA_IMPORT_CONTRACT


def get_personnel_schedule_import_contract() -> PersonnelScheduleImportContractResponse:
    return PERSONNEL_SCHEDULE_IMPORT_CONTRACT


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
            rows.append(
                ScheduleRiskRow(
                    risk_id=f"risk-{plan.summary.id}-{interval.interval_start}",
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
