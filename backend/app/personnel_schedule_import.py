from typing import Any

from backend.app.models import (
    ImportBatchPersistenceDetail,
    ImportBatchRowResultRecord,
    ImportBatchVersionRecord,
    PersonnelScheduleDetailInput,
    PersonnelScheduleVersionRequest,
    ShiftTypeInput,
)
from backend.app.personnel_schedule_persistence import PersonnelSchedulePersistenceRepository


def apply_personnel_schedule_import_batch(
    detail: ImportBatchPersistenceDetail,
    repository: PersonnelSchedulePersistenceRepository,
    *,
    schedule_version_id: str | None = None,
    import_version_id: str | None = None,
) -> dict[str, int | str]:
    if detail.batch.file_type != "personnel_schedule":
        raise ValueError(
            f"batch {detail.batch.batch_id} file_type must be personnel_schedule, "
            f"got {detail.batch.file_type}"
        )

    selected_version = _select_import_version(detail, import_version_id)
    request = PersonnelScheduleVersionRequest(
        schedule_version_id=schedule_version_id
        or f"{detail.batch.batch_id}::schedule",
        import_version_id=import_version_id
        or _required_personnel_schedule_import_version(detail).version_id,
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
    )
    skipped_rows = 0

    for row in detail.rows:
        if row.row_status != "success":
            skipped_rows += 1
            continue
        _append_success_row(request, row)

    applied_status = (
        "already_applied"
        if repository.has_schedule_import_version(request.import_version_id)
        else "applied"
    )
    if applied_status == "applied":
        repository.create_schedule_version(request)

    return {
        "batch_id": detail.batch.batch_id,
        "schedule_version_id": request.schedule_version_id,
        "applied_status": applied_status,
        "shift_types": len(request.shift_types),
        "details": len(request.details),
        "skipped_rows": skipped_rows,
    }


def _append_success_row(
    request: PersonnelScheduleVersionRequest,
    row: ImportBatchRowResultRecord,
) -> None:
    fields = _standard_fields(row)
    record_type = _required_value(fields, row.row_number, "record_type")

    if record_type == "shift_type":
        request.shift_types.append(
            ShiftTypeInput(
                shift_type_id=_required_value(fields, row.row_number, "shift_type_id"),
                shift_type_name=_required_value(
                    fields,
                    row.row_number,
                    "shift_type_name",
                ),
                status=_required_value(fields, row.row_number, "status"),
                start_time=_required_value(fields, row.row_number, "start_time"),
                end_time=_required_value(fields, row.row_number, "end_time"),
                effective_from=_required_value(fields, row.row_number, "effective_from"),
                effective_to=_required_value(fields, row.row_number, "effective_to"),
            )
        )
        return

    if record_type == "schedule_detail":
        employee_id = _required_value(fields, row.row_number, "employee_id")
        schedule_date = _required_value(fields, row.row_number, "schedule_date")
        start_time = _required_value(fields, row.row_number, "start_time")
        request.details.append(
            PersonnelScheduleDetailInput(
                schedule_detail_id=_optional_value(fields, "schedule_detail_id")
                or f"{employee_id}|{schedule_date}|{start_time}",
                employee_id=employee_id,
                workplace_id=_required_value(fields, row.row_number, "workplace_id"),
                project_id=_required_value(fields, row.row_number, "project_id"),
                skill_id=_required_value(fields, row.row_number, "skill_id"),
                shift_type_id=_required_value(fields, row.row_number, "shift_type_id"),
                schedule_date=schedule_date,
                start_time=start_time,
                end_time=_required_value(fields, row.row_number, "end_time"),
            )
        )
        return

    raise ValueError(
        f"row_number={row.row_number} has unknown record_type: {record_type}"
    )


def _select_import_version(
    detail: ImportBatchPersistenceDetail,
    import_version_id: str | None,
) -> ImportBatchVersionRecord | None:
    if import_version_id is None:
        return _required_personnel_schedule_import_version(detail)
    for version in detail.versions:
        if version.version_id == import_version_id:
            return version
    return None


def _required_personnel_schedule_import_version(
    detail: ImportBatchPersistenceDetail,
) -> ImportBatchVersionRecord:
    for version in detail.versions:
        if version.version_type == "personnel_schedule":
            return version
    raise ValueError(
        f"batch {detail.batch.batch_id} missing personnel_schedule import version"
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


def _optional_value(fields: dict[str, Any], field_name: str) -> str | None:
    value = fields.get(field_name)
    if value is not None and str(value).strip():
        return str(value).strip()
    return None
