from datetime import datetime, timedelta

from backend.app.actual_log_persistence import ActualLogPersistenceRepository
from backend.app.comparison_persistence import ComparisonPersistenceRepository
from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.models import (
    ComparisonCalculationRequest,
    ComparisonRunDetail,
    ComparisonRunRequest,
    ForecastScheduleComparisonResultInput,
    PersonnelScheduleDetailRecord,
    PersonnelScheduleIntervalRecord,
    ScheduleActualComparisonResultInput,
)
from backend.app.personnel_schedule_persistence import (
    PersonnelSchedulePersistenceRepository,
)


def calculate_comparison_run(
    request: ComparisonCalculationRequest,
    *,
    comparison_repository: ComparisonPersistenceRepository,
    forecast_repository: ForecastPersistenceRepository,
    schedule_repository: PersonnelSchedulePersistenceRepository,
    actual_repository: ActualLogPersistenceRepository,
) -> ComparisonRunDetail:
    if request.comparison_type == "forecast_vs_schedule":
        return _calculate_forecast_vs_schedule(
            request,
            comparison_repository=comparison_repository,
            forecast_repository=forecast_repository,
            schedule_repository=schedule_repository,
        )
    return _calculate_schedule_vs_actual(
        request,
        comparison_repository=comparison_repository,
        schedule_repository=schedule_repository,
        actual_repository=actual_repository,
    )


def _calculate_forecast_vs_schedule(
    request: ComparisonCalculationRequest,
    *,
    comparison_repository: ComparisonPersistenceRepository,
    forecast_repository: ForecastPersistenceRepository,
    schedule_repository: PersonnelSchedulePersistenceRepository,
) -> ComparisonRunDetail:
    if request.forecast_version_id is None:
        raise ValueError("forecast_vs_schedule requires forecast_version_id")
    if request.schedule_version_id is None:
        raise ValueError("forecast_vs_schedule requires schedule_version_id")

    forecast = forecast_repository.get_forecast_version(request.forecast_version_id)
    if forecast is None:
        raise ValueError(f"forecast_version_id {request.forecast_version_id} does not exist")
    schedule = schedule_repository.get_schedule_version(request.schedule_version_id)
    if schedule is None:
        raise ValueError(f"schedule_version_id {request.schedule_version_id} does not exist")

    details_by_id = {detail.schedule_detail_id: detail for detail in schedule.details}
    schedule_buckets: dict[
        tuple[str, str, str, str, str, str],
        list[PersonnelScheduleIntervalRecord],
    ] = {}
    for interval in schedule.intervals:
        detail = details_by_id[interval.schedule_detail_id]
        key = (
            interval.interval_date,
            interval.interval_start,
            interval.interval_end,
            detail.workplace_id,
            detail.project_id,
            detail.skill_id,
        )
        schedule_buckets.setdefault(key, []).append(interval)

    results: list[ForecastScheduleComparisonResultInput] = []
    for interval in forecast.intervals:
        if not _within_business_dates(
            interval.forecast_date,
            request.business_date_from,
            request.business_date_to,
        ):
            continue
        key = (
            interval.forecast_date,
            interval.interval_start,
            interval.interval_end,
            interval.workplace_id,
            interval.project_id,
            interval.skill_id,
        )
        scheduled_intervals = schedule_buckets.get(key, [])
        scheduled_agents = len(scheduled_intervals)
        gap_agents = interval.required_agents - scheduled_agents
        results.append(
            ForecastScheduleComparisonResultInput(
                forecast_interval_id=interval.forecast_interval_id,
                schedule_detail_id=(
                    scheduled_intervals[0].schedule_detail_id
                    if len(scheduled_intervals) == 1
                    else None
                ),
                business_date=interval.forecast_date,
                workplace_id=interval.workplace_id,
                project_id=interval.project_id,
                skill_id=interval.skill_id,
                interval_start=interval.interval_start,
                interval_end=interval.interval_end,
                forecast_agents=interval.required_agents,
                scheduled_agents=scheduled_agents,
                gap_agents=gap_agents,
                result_status=_forecast_schedule_status(gap_agents),
            )
        )

    return comparison_repository.create_comparison_run(
        ComparisonRunRequest(
            run_id=request.run_id,
            comparison_type="forecast_vs_schedule",
            forecast_version_id=request.forecast_version_id,
            schedule_version_id=request.schedule_version_id,
            business_date_from=request.business_date_from,
            business_date_to=request.business_date_to,
            status="completed",
            forecast_schedule_results=results,
        )
    )


def _calculate_schedule_vs_actual(
    request: ComparisonCalculationRequest,
    *,
    comparison_repository: ComparisonPersistenceRepository,
    schedule_repository: PersonnelSchedulePersistenceRepository,
    actual_repository: ActualLogPersistenceRepository,
) -> ComparisonRunDetail:
    if request.schedule_version_id is None:
        raise ValueError("schedule_vs_actual requires schedule_version_id")
    if request.actual_import_version_id is None:
        raise ValueError("schedule_vs_actual requires actual_import_version_id")

    schedule = schedule_repository.get_schedule_version(request.schedule_version_id)
    if schedule is None:
        raise ValueError(f"schedule_version_id {request.schedule_version_id} does not exist")

    actual_intervals = actual_repository.get_status_intervals(
        request.actual_import_version_id
    )
    actual_by_key = {
        (
            interval.employee_id,
            interval.business_date,
            interval.interval_start,
            interval.interval_end,
        ): interval
        for interval in actual_intervals
    }
    details_by_id: dict[str, PersonnelScheduleDetailRecord] = {
        detail.schedule_detail_id: detail for detail in schedule.details
    }

    results: list[ScheduleActualComparisonResultInput] = []
    for interval in schedule.intervals:
        if not _within_business_dates(
            interval.interval_date,
            request.business_date_from,
            request.business_date_to,
        ):
            continue
        scheduled_minutes = _minutes_between(
            interval.interval_start,
            interval.interval_end,
        )
        actual = actual_by_key.get(
            (
                interval.employee_id,
                interval.interval_date,
                interval.interval_start,
                interval.interval_end,
            )
        )
        actual_productive_minutes = (
            scheduled_minutes if actual is not None and actual.is_productive else 0
        )
        late_minutes = max(scheduled_minutes - actual_productive_minutes, 0)
        detail = details_by_id[interval.schedule_detail_id]
        results.append(
            ScheduleActualComparisonResultInput(
                schedule_detail_id=detail.schedule_detail_id,
                actual_status_interval_row_id=(
                    actual.interval_row_id if actual is not None else None
                ),
                business_date=interval.interval_date,
                employee_id=interval.employee_id,
                interval_start=interval.interval_start,
                interval_end=interval.interval_end,
                scheduled_minutes=scheduled_minutes,
                actual_productive_minutes=actual_productive_minutes,
                late_minutes=late_minutes,
                result_status="matched" if late_minutes == 0 else "late",
            )
        )

    return comparison_repository.create_comparison_run(
        ComparisonRunRequest(
            run_id=request.run_id,
            comparison_type="schedule_vs_actual",
            schedule_version_id=request.schedule_version_id,
            actual_import_version_id=request.actual_import_version_id,
            business_date_from=request.business_date_from,
            business_date_to=request.business_date_to,
            status="completed",
            schedule_actual_results=results,
        )
    )


def _forecast_schedule_status(gap_agents: int) -> str:
    if gap_agents > 0:
        return "gap"
    if gap_agents < 0:
        return "surplus"
    return "matched"


def _within_business_dates(
    business_date: str,
    business_date_from: str,
    business_date_to: str,
) -> bool:
    return business_date_from <= business_date <= business_date_to


def _minutes_between(start_time: str, end_time: str) -> int:
    start = _parse_time(start_time)
    end = _parse_time(end_time)
    return int((end - start).total_seconds() // 60)


def _parse_time(value: str) -> datetime:
    if value == "24:00":
        return datetime.strptime("00:00", "%H:%M") + timedelta(days=1)
    return datetime.strptime(value, "%H:%M")
