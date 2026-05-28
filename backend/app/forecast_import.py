from typing import Any

from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.models import (
    ForecastIntervalInput,
    ForecastVersionRequest,
    ImportBatchPersistenceDetail,
    ImportBatchRowResultRecord,
    ImportBatchVersionRecord,
)


def apply_forecast_import_batch(
    detail: ImportBatchPersistenceDetail,
    repository: ForecastPersistenceRepository,
    *,
    forecast_version_id: str | None = None,
    import_version_id: str | None = None,
    compared_from_version_id: str | None = None,
    change_reason: str | None = None,
) -> dict[str, int | str]:
    if detail.batch.file_type != "demand_forecast":
        raise ValueError(
            f"batch {detail.batch.batch_id} file_type must be demand_forecast, "
            f"got {detail.batch.file_type}"
        )

    selected_version = _select_import_version(detail, import_version_id)
    request = ForecastVersionRequest(
        forecast_version_id=forecast_version_id
        or f"{detail.batch.batch_id}::forecast",
        import_version_id=import_version_id
        or _required_demand_forecast_import_version(detail).version_id,
        business_date_from=(
            selected_version.business_date_from
            if selected_version is not None
            else detail.batch.business_date_from
        ),
        business_date_to=(
            selected_version.business_date_to
            if selected_version is not None
            else detail.batch.business_date_to
        ),
        compared_from_version_id=compared_from_version_id,
        change_reason=change_reason,
    )
    skipped_rows = 0

    for row in detail.rows:
        if row.row_status != "success":
            skipped_rows += 1
            continue
        request.intervals.append(_forecast_interval_from_row(row))

    applied_status = (
        "already_applied"
        if repository.has_forecast_import_version(request.import_version_id)
        else "applied"
    )
    if applied_status == "applied":
        repository.create_forecast_version(request)

    return {
        "batch_id": detail.batch.batch_id,
        "forecast_version_id": request.forecast_version_id,
        "applied_status": applied_status,
        "intervals": len(request.intervals),
        "total_required_agents": sum(
            interval.required_agents for interval in request.intervals
        ),
        "skipped_rows": skipped_rows,
    }


def _forecast_interval_from_row(
    row: ImportBatchRowResultRecord,
) -> ForecastIntervalInput:
    fields = _standard_fields(row)
    forecast_date = _required_value(fields, row.row_number, "forecast_date")
    interval_start = _required_value(fields, row.row_number, "interval_start")
    workplace_id = _required_value(fields, row.row_number, "workplace_id")
    project_id = _required_value(fields, row.row_number, "project_id")
    skill_id = _required_value(fields, row.row_number, "skill_id")

    return ForecastIntervalInput(
        forecast_interval_id=_optional_value(fields, "forecast_interval_id")
        or f"{workplace_id}|{project_id}|{skill_id}|{forecast_date}|{interval_start}",
        forecast_date=forecast_date,
        interval_start=interval_start,
        interval_end=_required_value(fields, row.row_number, "interval_end"),
        workplace_id=workplace_id,
        project_id=project_id,
        skill_id=skill_id,
        demand_level=_required_value(fields, row.row_number, "demand_level"),
        required_agents=_required_int(fields, row.row_number, "required_agents"),
    )


def _select_import_version(
    detail: ImportBatchPersistenceDetail,
    import_version_id: str | None,
) -> ImportBatchVersionRecord | None:
    if import_version_id is None:
        return _required_demand_forecast_import_version(detail)
    for version in detail.versions:
        if version.version_id == import_version_id:
            return version
    return None


def _required_demand_forecast_import_version(
    detail: ImportBatchPersistenceDetail,
) -> ImportBatchVersionRecord:
    for version in detail.versions:
        if version.version_type == "demand_forecast":
            return version
    raise ValueError(
        f"batch {detail.batch.batch_id} missing demand_forecast import version"
    )


def _standard_fields(row: ImportBatchRowResultRecord) -> dict[str, Any]:
    fields = row.raw_data.get("standard_fields")
    if not isinstance(fields, dict):
        raise ValueError(f"row_number={row.row_number} missing standard_fields")
    return fields


def _required_value(
    fields: dict[str, Any],
    row_number: int,
    field_name: str,
) -> str:
    value = fields.get(field_name)
    if value is not None and str(value).strip():
        return str(value).strip()
    raise ValueError(f"row_number={row_number} missing required field: {field_name}")


def _required_int(
    fields: dict[str, Any],
    row_number: int,
    field_name: str,
) -> int:
    raw_value = _required_value(fields, row_number, field_name)
    try:
        value = int(raw_value)
    except (TypeError, ValueError) as exc:
        raise ValueError(
            f"row_number={row_number} invalid integer field: {field_name}"
        ) from exc
    if value < 0:
        raise ValueError(
            f"row_number={row_number} invalid integer field: {field_name}"
        )
    return value


def _optional_value(fields: dict[str, Any], field_name: str) -> str | None:
    value = fields.get(field_name)
    if value is not None and str(value).strip():
        return str(value).strip()
    return None
