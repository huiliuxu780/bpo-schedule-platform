from backend.app.models import (
    ImportApplyReadinessBlocker,
    ImportApplyReadinessRowBlocker,
    ImportApplyReadinessResponse,
    ImportBatchApplicationSummary,
    ImportBatchPersistenceDetail,
    ImportBatchRowResultRecord,
    ImportFileType,
)


REFERENCE_RECORD_TYPES = {"supplier", "workplace", "project", "skill"}
REFERENCE_REQUIRED_FIELDS = [
    "record_type",
    "reference_id",
    "reference_name",
    "status",
    "effective_from",
    "effective_to",
]
MASTER_DATA_REQUIRED_FIELDS: dict[str, list[str]] = {
    "organization": [
        "record_type",
        "organization_id",
        "organization_name",
        "organization_level",
        "status",
        "effective_from",
        "effective_to",
    ],
    "employee": [
        "record_type",
        "employee_id",
        "employee_name",
        "status",
        "effective_from",
        "effective_to",
    ],
    "employee_skill": [
        "record_type",
        "employee_id",
        "skill_id",
        "effective_from",
        "effective_to",
    ],
    "binding": [
        "record_type",
        "binding_id",
        "employee_id",
        "supplier_id",
        "workplace_id",
        "project_id",
        "skill_id",
        "effective_from",
        "effective_to",
    ],
}
PERSONNEL_SCHEDULE_REQUIRED_FIELDS: dict[str, list[str]] = {
    "shift_type": [
        "record_type",
        "shift_type_id",
        "shift_type_name",
        "status",
        "start_time",
        "end_time",
        "effective_from",
        "effective_to",
    ],
    "schedule_detail": [
        "record_type",
        "employee_id",
        "workplace_id",
        "project_id",
        "skill_id",
        "shift_type_id",
        "schedule_date",
        "start_time",
        "end_time",
    ],
}
DEMAND_FORECAST_REQUIRED_FIELDS = [
    "forecast_date",
    "interval_start",
    "interval_end",
    "workplace_id",
    "project_id",
    "skill_id",
    "demand_level",
    "required_agents",
]
LOGIN_LOG_REQUIRED_FIELDS = ["employee_id", "event_type", "event_at", "timezone"]
STATUS_LOG_REQUIRED_FIELDS: dict[str, list[str]] = {
    "status_dictionary": [
        "record_type",
        "external_status_code",
        "normalized_status",
        "category",
        "is_productive",
    ],
    "status_interval": [
        "record_type",
        "employee_id",
        "external_status_code",
        "start_at",
        "end_at",
        "timezone",
    ],
}


def build_import_apply_readiness(
    detail: ImportBatchPersistenceDetail,
    application_summary: ImportBatchApplicationSummary,
) -> ImportApplyReadinessResponse:
    blockers: list[ImportApplyReadinessBlocker] = []
    row_blockers = _validate_success_rows(detail)
    if detail.batch.failed_rows > 0:
        blockers.append(
            ImportApplyReadinessBlocker(
                code="IMPORT_FAILED_ROWS_PRESENT",
                message="导入批次仍存在失败行，需先修正失败行。",
            )
        )
    if detail.batch.success_rows == 0:
        blockers.append(
            ImportApplyReadinessBlocker(
                code="IMPORT_NO_SUCCESS_ROWS",
                message="导入批次没有可应用的成功行。",
            )
        )
    if not detail.versions:
        blockers.append(
            ImportApplyReadinessBlocker(
                code="IMPORT_VERSION_MISSING",
                message="导入批次缺少可追溯的导入版本。",
            )
        )
    if application_summary.application_status == "applied":
        blockers.append(
            ImportApplyReadinessBlocker(
                code="IMPORT_BATCH_ALREADY_APPLIED",
                message="导入批次已经应用，无需重复应用。",
            )
        )
    if row_blockers:
        blockers.append(
            ImportApplyReadinessBlocker(
                code="IMPORT_ROW_PRECHECK_FAILED",
                message="导入批次存在成功行字段缺口，需先修正后再应用。",
            )
        )

    return ImportApplyReadinessResponse(
        batch_id=detail.batch.batch_id,
        file_type=detail.batch.file_type,
        readiness_status="blocked" if blockers else "ready",
        blockers=blockers,
        row_blockers=row_blockers,
        total_rows=detail.batch.total_rows,
        success_rows=detail.batch.success_rows,
        failed_rows=detail.batch.failed_rows,
        warning_rows=detail.batch.warning_rows,
        version_count=len(detail.versions),
        application_status=application_summary.application_status,
        application_target=application_summary.application_target,
        import_version_id=application_summary.import_version_id,
        applied_record_count=application_summary.applied_record_count,
    )


def _validate_success_rows(
    detail: ImportBatchPersistenceDetail,
) -> list[ImportApplyReadinessRowBlocker]:
    row_blockers: list[ImportApplyReadinessRowBlocker] = []
    for row in detail.rows:
        if row.row_status != "success":
            continue
        standard_fields = row.raw_data.get("standard_fields")
        if not isinstance(standard_fields, dict):
            row_blockers.append(
                ImportApplyReadinessRowBlocker(
                    row_number=row.row_number,
                    code="IMPORT_ROW_STANDARD_FIELDS_MISSING",
                    field_name="standard_fields",
                    message=f"第 {row.row_number} 行缺少 standard_fields。",
                )
            )
            continue
        unknown_record_type = _unknown_record_type(
            detail.batch.file_type,
            standard_fields,
        )
        if unknown_record_type is not None:
            row_blockers.append(
                ImportApplyReadinessRowBlocker(
                    row_number=row.row_number,
                    code="IMPORT_ROW_RECORD_TYPE_UNKNOWN",
                    field_name="record_type",
                    message=(
                        f"第 {row.row_number} 行存在未知 record_type "
                        f"{unknown_record_type}。"
                    ),
                )
            )
            continue
        required_fields = _required_fields_for_row(detail.batch.file_type, row)
        for field_name in required_fields:
            if _is_blank(standard_fields.get(field_name)):
                row_blockers.append(
                    ImportApplyReadinessRowBlocker(
                        row_number=row.row_number,
                        code="IMPORT_ROW_FIELD_MISSING",
                        field_name=field_name,
                        message=f"第 {row.row_number} 行缺少必填字段 {field_name}。",
                    )
                )
    return row_blockers


def _required_fields_for_row(
    file_type: ImportFileType,
    row: ImportBatchRowResultRecord,
) -> list[str]:
    standard_fields = row.raw_data.get("standard_fields")
    if not isinstance(standard_fields, dict):
        return []

    if file_type == "master_data":
        return _record_type_fields(
            standard_fields,
            record_field_map=MASTER_DATA_REQUIRED_FIELDS,
            reference_record_types=REFERENCE_RECORD_TYPES,
            reference_fields=REFERENCE_REQUIRED_FIELDS,
        )
    if file_type == "personnel_schedule":
        return _record_type_fields(
            standard_fields,
            record_field_map=PERSONNEL_SCHEDULE_REQUIRED_FIELDS,
        )
    if file_type == "demand_forecast":
        return DEMAND_FORECAST_REQUIRED_FIELDS
    if file_type == "login_log":
        return LOGIN_LOG_REQUIRED_FIELDS
    if file_type == "status_log":
        return _record_type_fields(
            standard_fields,
            record_field_map=STATUS_LOG_REQUIRED_FIELDS,
        )
    return []


def _record_type_fields(
    standard_fields: dict,
    *,
    record_field_map: dict[str, list[str]],
    reference_record_types: set[str] | None = None,
    reference_fields: list[str] | None = None,
) -> list[str]:
    record_type = standard_fields.get("record_type")
    if _is_blank(record_type):
        return ["record_type"]
    record_type_value = str(record_type)
    if reference_record_types and record_type_value in reference_record_types:
        return reference_fields or ["record_type"]
    if record_type_value in record_field_map:
        return record_field_map[record_type_value]
    return []


def _unknown_record_type(
    file_type: ImportFileType,
    standard_fields: dict,
) -> str | None:
    if file_type == "master_data":
        allowed_record_types = REFERENCE_RECORD_TYPES | set(MASTER_DATA_REQUIRED_FIELDS)
    elif file_type == "personnel_schedule":
        allowed_record_types = set(PERSONNEL_SCHEDULE_REQUIRED_FIELDS)
    elif file_type == "status_log":
        allowed_record_types = set(STATUS_LOG_REQUIRED_FIELDS)
    else:
        return None

    record_type = standard_fields.get("record_type")
    if _is_blank(record_type):
        return None
    record_type_value = str(record_type)
    if record_type_value not in allowed_record_types:
        return record_type_value
    return None


def _is_blank(value: object) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    return False
