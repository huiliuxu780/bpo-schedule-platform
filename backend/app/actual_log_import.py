from typing import Any

from backend.app.actual_log_persistence import ActualLogPersistenceRepository
from backend.app.models import (
    ActualLoginEventInput,
    ActualStatusDictionaryInput,
    ActualStatusIntervalImportRequest,
    ActualStatusIntervalInput,
    ImportBatchPersistenceDetail,
    ImportBatchRowResultRecord,
    ImportBatchVersionRecord,
)


ACTUAL_LOG_FILE_TYPES = {"login_log", "status_log"}


def apply_actual_log_import_batch(
    detail: ImportBatchPersistenceDetail,
    repository: ActualLogPersistenceRepository,
    *,
    import_version_id: str | None = None,
) -> dict[str, int | str]:
    if detail.batch.file_type not in ACTUAL_LOG_FILE_TYPES:
        raise ValueError(
            f"batch {detail.batch.batch_id} file_type must be login_log or status_log, "
            f"got {detail.batch.file_type}"
        )

    selected_version = _select_import_version(detail, import_version_id)
    skipped_rows = 0
    login_events: list[ActualLoginEventInput] = []
    dictionary_entries: list[ActualStatusDictionaryInput] = []
    status_intervals: list[ActualStatusIntervalInput] = []

    for row in detail.rows:
        if row.row_status != "success":
            skipped_rows += 1
            continue
        if detail.batch.file_type == "login_log":
            login_events.append(_login_event(row, selected_version.version_id))
        else:
            _append_status_row(
                row,
                dictionary_entries=dictionary_entries,
                status_intervals=status_intervals,
            )

    applied_status = (
        "already_applied"
        if repository.has_actual_import_version(
            selected_version.version_id,
            file_type=detail.batch.file_type,
        )
        else "applied"
    )
    if applied_status == "applied":
        if login_events:
            repository.create_login_events(login_events)
        if dictionary_entries:
            repository.upsert_status_dictionary(dictionary_entries)
        if status_intervals:
            repository.create_status_intervals(
                ActualStatusIntervalImportRequest(
                    import_version_id=selected_version.version_id,
                    intervals=status_intervals,
                )
            )

    return {
        "batch_id": detail.batch.batch_id,
        "file_type": detail.batch.file_type,
        "applied_status": applied_status,
        "login_events": len(login_events),
        "status_dictionary_entries": len(dictionary_entries),
        "status_intervals": len(status_intervals),
        "skipped_rows": skipped_rows,
    }


def _login_event(
    row: ImportBatchRowResultRecord,
    import_version_id: str,
) -> ActualLoginEventInput:
    fields = _standard_fields(row)
    return ActualLoginEventInput(
        event_id=_optional_value(fields, "event_id")
        or row.source_key
        or f"row-{row.row_number}",
        import_version_id=import_version_id,
        employee_id=_required_value(fields, row.row_number, "employee_id"),
        event_type=_required_value(fields, row.row_number, "event_type"),
        event_at=_required_value(fields, row.row_number, "event_at"),
        timezone=_required_value(fields, row.row_number, "timezone"),
    )


def _append_status_row(
    row: ImportBatchRowResultRecord,
    *,
    dictionary_entries: list[ActualStatusDictionaryInput],
    status_intervals: list[ActualStatusIntervalInput],
) -> None:
    fields = _standard_fields(row)
    record_type = _required_value(fields, row.row_number, "record_type")

    if record_type == "status_dictionary":
        dictionary_entries.append(
            ActualStatusDictionaryInput(
                external_status_code=_required_value(
                    fields,
                    row.row_number,
                    "external_status_code",
                ),
                normalized_status=_required_value(
                    fields,
                    row.row_number,
                    "normalized_status",
                ),
                category=_required_value(fields, row.row_number, "category"),
                is_productive=_required_bool(
                    fields,
                    row.row_number,
                    "is_productive",
                ),
            )
        )
        return

    if record_type == "status_interval":
        status_intervals.append(
            ActualStatusIntervalInput(
                interval_id=_optional_value(fields, "interval_id")
                or row.source_key
                or f"row-{row.row_number}",
                employee_id=_required_value(fields, row.row_number, "employee_id"),
                external_status_code=_required_value(
                    fields,
                    row.row_number,
                    "external_status_code",
                ),
                start_at=_required_value(fields, row.row_number, "start_at"),
                end_at=_required_value(fields, row.row_number, "end_at"),
                timezone=_required_value(fields, row.row_number, "timezone"),
            )
        )
        return

    raise ValueError(
        f"row_number={row.row_number} has unknown record_type: {record_type}"
    )


def _select_import_version(
    detail: ImportBatchPersistenceDetail,
    import_version_id: str | None,
) -> ImportBatchVersionRecord:
    if import_version_id is not None:
        for version in detail.versions:
            if version.version_id == import_version_id:
                return version
        raise ValueError(f"import_version_id {import_version_id} does not exist")

    for version in detail.versions:
        if version.version_type == detail.batch.file_type:
            return version
    raise ValueError(
        f"batch {detail.batch.batch_id} missing {detail.batch.file_type} import version"
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


def _required_bool(
    fields: dict[str, Any],
    row_number: int,
    field_name: str,
) -> bool:
    value = _required_value(fields, row_number, field_name).lower()
    if value in {"true", "1", "yes", "y"}:
        return True
    if value in {"false", "0", "no", "n"}:
        return False
    raise ValueError(f"row_number={row_number} has invalid boolean: {field_name}")
