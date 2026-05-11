from backend.app.models import SchedulePlanDetail, SchedulePlanInterval, SchedulePlanSummary


def _coverage_rate(scheduled_agents: int, forecast_agents: int) -> float:
    if forecast_agents == 0:
        return 1.0
    return round(scheduled_agents / forecast_agents, 3)


def _interval(
    interval_start: str,
    interval_end: str,
    forecast_agents: int,
    scheduled_agents: int,
    note: str,
) -> SchedulePlanInterval:
    gap_agents = max(forecast_agents - scheduled_agents, 0)
    return SchedulePlanInterval(
        interval_start=interval_start,
        interval_end=interval_end,
        forecast_agents=forecast_agents,
        scheduled_agents=scheduled_agents,
        gap_agents=gap_agents,
        coverage_rate=_coverage_rate(scheduled_agents, forecast_agents),
        note=note,
    )


def _summary(
    plan_id: str,
    plan_date: str,
    project_name: str,
    site_name: str,
    version: str,
    status: str,
    updated_at: str,
    intervals: list[SchedulePlanInterval],
) -> SchedulePlanSummary:
    forecast_agents = sum(item.forecast_agents for item in intervals)
    scheduled_agents = sum(item.scheduled_agents for item in intervals)
    gap_agents = max(forecast_agents - scheduled_agents, 0)
    return SchedulePlanSummary(
        id=plan_id,
        plan_date=plan_date,
        project_name=project_name,
        site_name=site_name,
        version=version,
        status=status,
        forecast_agents=forecast_agents,
        scheduled_agents=scheduled_agents,
        gap_agents=gap_agents,
        coverage_rate=_coverage_rate(scheduled_agents, forecast_agents),
        updated_at=updated_at,
    )


def _build_plan(
    plan_id: str,
    plan_date: str,
    project_name: str,
    site_name: str,
    version: str,
    status: str,
    updated_at: str,
    staffing: list[tuple[str, str, int, int, str]],
) -> SchedulePlanDetail:
    intervals = [
        _interval(start, end, forecast_agents, scheduled_agents, note)
        for start, end, forecast_agents, scheduled_agents, note in staffing
    ]
    return SchedulePlanDetail(
        summary=_summary(
            plan_id=plan_id,
            plan_date=plan_date,
            project_name=project_name,
            site_name=site_name,
            version=version,
            status=status,
            updated_at=updated_at,
            intervals=intervals,
        ),
        intervals=intervals,
    )


SCHEDULE_PLANS = [
    _build_plan(
        plan_id="plan-20260511-shanghai-bosch-v1",
        plan_date="2026-05-11",
        project_name="博西客服",
        site_name="上海职场",
        version="v1",
        status="review_ready",
        updated_at="2026-05-11T09:30:00+08:00",
        staffing=[
            ("09:00", "09:30", 16, 15, "早高峰轻微缺口"),
            ("09:30", "10:00", 18, 17, "预测需求上升"),
            ("10:00", "10:30", 18, 18, "覆盖正常"),
            ("10:30", "11:00", 17, 16, "需复核临时请假"),
            ("11:00", "11:30", 16, 16, "覆盖正常"),
            ("11:30", "12:00", 15, 14, "午前缺口"),
            ("12:00", "12:30", 12, 12, "覆盖正常"),
            ("12:30", "13:00", 12, 13, "冗余可调剂"),
        ],
    ),
    _build_plan(
        plan_id="plan-20260511-suzhou-bosch-v1",
        plan_date="2026-05-11",
        project_name="博西客服",
        site_name="苏州职场",
        version="v1",
        status="draft",
        updated_at="2026-05-11T08:45:00+08:00",
        staffing=[
            ("09:00", "09:30", 14, 13, "草稿待补齐"),
            ("09:30", "10:00", 14, 14, "覆盖正常"),
            ("10:00", "10:30", 15, 13, "培训占用导致缺口"),
            ("10:30", "11:00", 15, 14, "需调剂"),
            ("11:00", "11:30", 13, 13, "覆盖正常"),
            ("11:30", "12:00", 13, 12, "午间缺口"),
            ("12:00", "12:30", 10, 10, "覆盖正常"),
            ("12:30", "13:00", 10, 10, "覆盖正常"),
        ],
    ),
    _build_plan(
        plan_id="plan-20260512-shanghai-bosch-v2",
        plan_date="2026-05-12",
        project_name="博西客服",
        site_name="上海职场",
        version="v2",
        status="published",
        updated_at="2026-05-11T18:20:00+08:00",
        staffing=[
            ("09:00", "09:30", 15, 15, "已发布"),
            ("09:30", "10:00", 17, 17, "已发布"),
            ("10:00", "10:30", 18, 18, "已发布"),
            ("10:30", "11:00", 18, 17, "发布后仍有小缺口"),
            ("11:00", "11:30", 16, 16, "已发布"),
            ("11:30", "12:00", 14, 14, "已发布"),
            ("12:00", "12:30", 11, 11, "已发布"),
            ("12:30", "13:00", 11, 11, "已发布"),
        ],
    ),
]
