import csv
from datetime import datetime, timedelta, timezone
from io import StringIO

from backend.app.models import (
    CsvImportPreviewRequest,
    CsvImportPreviewResponse,
    DemandPlanRow,
    DemandForecastCsvImportRequest,
    AnomalyRuleContract,
    ComparisonSourceContract,
    FulfillmentComparisonContractResponse,
    ImportBatchFailureRow,
    ImportBatchResult,
    ImportBatchVersionRecord,
    LoginLogCsvImportRequest,
    MasterDataCsvImportRequest,
    MasterDataImportedRecord,
    MasterDataEntityContract,
    MasterDataImportContractResponse,
    IntervalExpansionContract,
    PersonnelScheduleCsvImportRequest,
    PersonnelScheduleImportContractResponse,
    ScheduleRiskLevel,
    ScheduleRiskRow,
    SchedulePlanDetail,
    SchedulePlanDraftRequest,
    SchedulePlanInterval,
    SchedulePlanSummary,
    SchedulePlanStatus,
    ShiftDetailRow,
    StatusLogCsvImportRequest,
    UnavailabilityRow,
    UnavailabilityStatus,
)
from backend.app.seed_data import SCHEDULE_PLANS

DEMAND_FORECAST_IMPORT_REQUIRED_FIELDS = [
    "business_date",
    "workplace_id",
    "project_id",
    "interval_start",
    "interval_end",
    "forecast_agents",
]

PERSONNEL_SCHEDULE_IMPORT_REQUIRED_FIELDS = [
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
]

LOGIN_LOG_IMPORT_REQUIRED_FIELDS = [
    "login_log_id",
    "employee_id",
    "business_date",
    "login_at",
    "logout_at",
    "workplace_id",
    "project_id",
    "source_system",
]

STATUS_LOG_IMPORT_REQUIRED_FIELDS = [
    "status_log_id",
    "employee_id",
    "business_date",
    "status_type",
    "start_at",
    "end_at",
    "workplace_id",
    "project_id",
    "source_system",
]

MASTER_DATA_IMPORT_REQUIRED_FIELDS = [
    "employee_id",
    "workplace_id",
    "supplier_id",
    "project_id",
    "skill_group",
    "effective_from",
]

CSV_IMPORT_OPTIONAL_FIELDS = {
    "master_data": ["employee_name", "supplier_name", "effective_to", "status"],
    "personnel_schedule": ["source_system", "note"],
    "demand_forecast": ["skill_group", "grade", "source_system"],
    "login_log": ["device_id", "timezone"],
    "status_log": ["timezone", "source_status_code"],
}

CSV_IMPORT_REQUIRED_FIELDS = {
    "master_data": MASTER_DATA_IMPORT_REQUIRED_FIELDS,
    "personnel_schedule": PERSONNEL_SCHEDULE_IMPORT_REQUIRED_FIELDS,
    "demand_forecast": DEMAND_FORECAST_IMPORT_REQUIRED_FIELDS,
    "login_log": LOGIN_LOG_IMPORT_REQUIRED_FIELDS,
    "status_log": STATUS_LOG_IMPORT_REQUIRED_FIELDS,
}

CSV_IMPORT_PENDING_VALIDATION_FIELDS = {
    "master_data": MASTER_DATA_IMPORT_REQUIRED_FIELDS,
    "personnel_schedule": ["employee_id", "shift_type_id", "start_at", "end_at", "status"],
    "demand_forecast": ["interval_start", "interval_end", "forecast_agents"],
    "login_log": ["employee_id", "login_at", "logout_at", "source_system"],
    "status_log": ["employee_id", "status_type", "start_at", "end_at", "source_system"],
}

IMPORT_BATCH_RESULTS: dict[str, ImportBatchResult] = {}
MASTER_DATA_IMPORTED_RECORDS: list[MasterDataImportedRecord] = []


def preview_csv_import(request: CsvImportPreviewRequest) -> CsvImportPreviewResponse:
    reader = csv.reader(StringIO(request.csv_content.strip()))
    records = [row for row in reader if any(cell.strip() for cell in row)]
    detected_fields = [field.strip() for field in records[0]] if records else []
    data_rows = records[1:] if records else []
    required_fields = CSV_IMPORT_REQUIRED_FIELDS[request.import_type]
    optional_fields = CSV_IMPORT_OPTIONAL_FIELDS[request.import_type]
    known_fields = set(required_fields + optional_fields)
    detected_field_set = set(detected_fields)
    mapped_fields = [field for field in detected_fields if field in known_fields]
    missing_required_fields = [
        field for field in required_fields if field not in detected_field_set
    ]
    warning_fields = [field for field in detected_fields if field not in known_fields]
    pending_validation_fields = [
        field
        for field in CSV_IMPORT_PENDING_VALIDATION_FIELDS[request.import_type]
        if field in detected_field_set
    ]

    return CsvImportPreviewResponse(
        file_name=request.file_name,
        import_type=request.import_type,
        total_rows=len(data_rows),
        detected_fields=detected_fields,
        required_fields=required_fields,
        mapped_fields=mapped_fields,
        missing_required_fields=missing_required_fields,
        warning_fields=warning_fields,
        pending_validation_fields=pending_validation_fields,
    )


def build_import_version_records(
    *,
    batch_id: str,
    entity: str,
    file_name: str,
    uploaded_at: str,
    successful_rows: list[dict[str, str]],
) -> tuple[str | None, str | None, list[ImportBatchVersionRecord]]:
    business_dates = sorted(
        {
            (row.get("business_date") or "").strip()
            for row in successful_rows
            if (row.get("business_date") or "").strip()
        }
    )
    business_date_start = business_dates[0] if business_dates else None
    business_date_end = business_dates[-1] if business_dates else None

    if not successful_rows:
        return business_date_start, business_date_end, []

    return (
        business_date_start,
        business_date_end,
        [
            ImportBatchVersionRecord(
                version_id=batch_id.replace("BATCH-", "VER-", 1),
                entity=entity,
                batch_id=batch_id,
                source_file=file_name,
                row_count=len(successful_rows),
                business_date_start=business_date_start,
                business_date_end=business_date_end,
                created_at=uploaded_at,
            )
        ],
    )

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

FULFILLMENT_COMPARISON_CONTRACT = FulfillmentComparisonContractResponse(
    version="production-mvp-v1",
    sources=[
        ComparisonSourceContract(
            source="demand_forecast",
            grain="0.5h interval",
            fields=[
                "forecast_id",
                "forecast_version_id",
                "business_date",
                "workplace_id",
                "project_id",
                "interval_start",
                "interval_end",
                "forecast_agents",
                "skill_group",
                "skill_level",
            ],
            required_fields=[
                "forecast_id",
                "forecast_version_id",
                "business_date",
                "workplace_id",
                "project_id",
                "interval_start",
                "interval_end",
                "forecast_agents",
            ],
        ),
        ComparisonSourceContract(
            source="personnel_schedule",
            grain="person shift detail and generated 0.5h interval",
            fields=[
                "schedule_detail_id",
                "schedule_version_id",
                "employee_id",
                "business_date",
                "workplace_id",
                "project_id",
                "interval_start",
                "interval_end",
                "scheduled_agents",
                "employee_ids",
            ],
            required_fields=[
                "schedule_detail_id",
                "schedule_version_id",
                "employee_id",
                "business_date",
                "workplace_id",
                "project_id",
                "interval_start",
                "interval_end",
            ],
        ),
        ComparisonSourceContract(
            source="login_log",
            grain="employee login session",
            fields=[
                "login_event_id",
                "employee_id",
                "external_employee_id",
                "login_at",
                "logout_at",
                "workplace_id",
                "project_id",
            ],
            required_fields=[
                "login_event_id",
                "employee_id",
                "login_at",
                "workplace_id",
                "project_id",
            ],
        ),
        ComparisonSourceContract(
            source="status_log",
            grain="employee status interval",
            fields=[
                "status_event_id",
                "employee_id",
                "status_type",
                "status_start_at",
                "status_end_at",
                "workplace_id",
                "project_id",
                "counts_as_productive",
            ],
            required_fields=[
                "status_event_id",
                "employee_id",
                "status_type",
                "status_start_at",
                "status_end_at",
            ],
        ),
    ],
    comparison_keys=[
        "business_date",
        "workplace_id",
        "project_id",
        "interval_start",
        "interval_end",
    ],
    person_level_keys=[
        "employee_id",
        "business_date",
        "schedule_detail_id",
        "login_event_id",
        "status_event_id",
    ],
    status_dictionary_fields=[
        "status_type",
        "counts_as_productive",
        "productive_category",
    ],
    anomaly_rules=[
        AnomalyRuleContract(
            code="forecast_shortage",
            compares=["demand_forecast", "interval_schedule"],
            condition="forecast_agents > scheduled_agents",
            review_owner="排班运营",
        ),
        AnomalyRuleContract(
            code="forecast_overstaffed",
            compares=["demand_forecast", "interval_schedule"],
            condition="scheduled_agents > forecast_agents",
            review_owner="排班运营",
        ),
        AnomalyRuleContract(
            code="no_login",
            compares=["personnel_schedule", "login_log"],
            condition="scheduled employee has no login session",
            review_owner="现场主管",
        ),
        AnomalyRuleContract(
            code="late_login",
            compares=["personnel_schedule", "login_log"],
            condition="login_at > scheduled start_at",
            review_owner="现场主管",
        ),
        AnomalyRuleContract(
            code="early_logout",
            compares=["personnel_schedule", "login_log"],
            condition="logout_at < scheduled end_at",
            review_owner="现场主管",
        ),
        AnomalyRuleContract(
            code="unscheduled_login",
            compares=["login_log", "personnel_schedule"],
            condition="login session has no matching personnel schedule",
            review_owner="现场主管",
        ),
        AnomalyRuleContract(
            code="non_productive_status",
            compares=["personnel_schedule", "status_log"],
            condition="scheduled interval is covered by non-productive status",
            review_owner="运营负责人",
        ),
    ],
    review_fields=[
        "anomaly_id",
        "anomaly_code",
        "review_result",
        "root_cause",
        "reviewer",
        "reviewed_at",
        "review_note",
    ],
)


def import_master_data_csv(
    request: MasterDataCsvImportRequest,
) -> ImportBatchResult:
    uploaded_at = datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds")
    batch_id = f"BATCH-MD-{uploaded_at[:10].replace('-', '')}-{len(IMPORT_BATCH_RESULTS) + 1:03d}"
    failure_rows: list[ImportBatchFailureRow] = []
    successful_rows: list[dict[str, str]] = []
    success_rows = 0

    reader = csv.DictReader(StringIO(request.csv_content.strip()))
    rows = list(reader) if reader.fieldnames else []
    missing_headers = [
        field
        for field in MASTER_DATA_IMPORT_REQUIRED_FIELDS
        if field not in (reader.fieldnames or [])
    ]

    if missing_headers:
        failure_rows.append(
            ImportBatchFailureRow(
                batch_id=batch_id,
                entity="master_data",
                failed_row_number=1,
                field_name=",".join(missing_headers),
                error_code="missing_required_header",
                error_message="缺少主数据导入必填表头",
                raw_value="",
            )
        )
    else:
        for row_index, row in enumerate(rows, start=2):
            row_failures = validate_master_data_row(batch_id, row_index, row)

            if row_failures:
                failure_rows.extend(row_failures)
            else:
                success_rows += 1
                successful_rows.append(row)

    error_codes = sorted({failure.error_code for failure in failure_rows})
    failed_rows = len({failure.failed_row_number for failure in failure_rows})
    business_date_start, business_date_end, version_records = build_import_version_records(
        batch_id=batch_id,
        entity="master_data",
        file_name=request.file_name,
        uploaded_at=uploaded_at,
        successful_rows=successful_rows,
    )
    result = ImportBatchResult(
        batch_id=batch_id,
        entity="master_data",
        file_name=request.file_name,
        uploaded_by=request.uploaded_by,
        uploaded_at=uploaded_at,
        status="completed" if failed_rows == 0 else "completed_with_errors",
        total_rows=len(rows),
        success_rows=success_rows,
        failed_rows=failed_rows,
        warning_rows=0,
        business_date_start=business_date_start,
        business_date_end=business_date_end,
        error_codes=error_codes,
        failure_rows=failure_rows,
        version_records=version_records,
    )
    IMPORT_BATCH_RESULTS[batch_id] = result

    if version_records:
        MASTER_DATA_IMPORTED_RECORDS[:0] = [
            build_master_data_imported_record(row, batch_id, version_records[0].version_id)
            for row in successful_rows
        ]

    return result


def validate_master_data_row(
    batch_id: str,
    row_index: int,
    row: dict[str, str],
) -> list[ImportBatchFailureRow]:
    failures: list[ImportBatchFailureRow] = []

    for field in MASTER_DATA_IMPORT_REQUIRED_FIELDS:
        raw_value = (row.get(field) or "").strip()
        if not raw_value:
            failures.append(
                ImportBatchFailureRow(
                    batch_id=batch_id,
                    entity="master_data",
                    failed_row_number=row_index,
                    field_name=field,
                    error_code="missing_required_field",
                    error_message="主数据导入必填字段为空",
                    raw_value=raw_value,
                )
            )

    return failures


def build_master_data_imported_record(
    row: dict[str, str],
    batch_id: str,
    version_id: str,
) -> MasterDataImportedRecord:
    return MasterDataImportedRecord(
        employee_id=(row.get("employee_id") or "").strip(),
        employee_name=(row.get("employee_name") or "").strip() or "未命名坐席",
        supplier_id=(row.get("supplier_id") or "").strip(),
        supplier_name=(row.get("supplier_name") or "").strip() or (row.get("supplier_id") or "").strip(),
        workplace_id=(row.get("workplace_id") or "").strip(),
        workplace_name=(row.get("workplace_name") or "").strip() or (row.get("workplace_id") or "").strip(),
        project_id=(row.get("project_id") or "").strip(),
        project_name=(row.get("project_name") or "").strip() or (row.get("project_id") or "").strip(),
        skill_group=(row.get("skill_group") or "").strip(),
        skill_level=(row.get("skill_level") or "").strip() or "待确认",
        effective_from=(row.get("effective_from") or "").strip(),
        effective_to=(row.get("effective_to") or "").strip() or "未设置",
        status=(row.get("status") or "").strip() or "active",
        source_batch_id=batch_id,
        source_version_id=version_id,
        reference_status="ready",
    )


def list_master_data_imported_records() -> list[MasterDataImportedRecord]:
    return MASTER_DATA_IMPORTED_RECORDS


def import_demand_forecast_csv(
    request: DemandForecastCsvImportRequest,
) -> ImportBatchResult:
    uploaded_at = datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds")
    batch_id = f"BATCH-DF-{uploaded_at[:10].replace('-', '')}-{len(IMPORT_BATCH_RESULTS) + 1:03d}"
    failure_rows: list[ImportBatchFailureRow] = []
    successful_rows: list[dict[str, str]] = []
    success_rows = 0

    reader = csv.DictReader(StringIO(request.csv_content.strip()))
    rows = list(reader) if reader.fieldnames else []
    missing_headers = [
        field
        for field in DEMAND_FORECAST_IMPORT_REQUIRED_FIELDS
        if field not in (reader.fieldnames or [])
    ]

    if missing_headers:
        failure_rows.append(
            ImportBatchFailureRow(
                batch_id=batch_id,
                entity="demand_forecast",
                failed_row_number=1,
                field_name=",".join(missing_headers),
                error_code="missing_required_header",
                error_message="缺少需求预测导入必填表头",
                raw_value="",
            )
        )
    else:
        for row_index, row in enumerate(rows, start=2):
            row_failures = validate_demand_forecast_row(batch_id, row_index, row)

            if row_failures:
                failure_rows.extend(row_failures)
            else:
                success_rows += 1
                successful_rows.append(row)

    error_codes = sorted({failure.error_code for failure in failure_rows})
    failed_rows = len({failure.failed_row_number for failure in failure_rows})
    total_rows = len(rows)
    status = "completed" if failed_rows == 0 else "completed_with_errors"
    business_date_start, business_date_end, version_records = build_import_version_records(
        batch_id=batch_id,
        entity="demand_forecast",
        file_name=request.file_name,
        uploaded_at=uploaded_at,
        successful_rows=successful_rows,
    )
    result = ImportBatchResult(
        batch_id=batch_id,
        entity="demand_forecast",
        file_name=request.file_name,
        uploaded_by=request.uploaded_by,
        uploaded_at=uploaded_at,
        status=status,
        total_rows=total_rows,
        success_rows=success_rows,
        failed_rows=failed_rows,
        warning_rows=0,
        business_date_start=business_date_start,
        business_date_end=business_date_end,
        error_codes=error_codes,
        failure_rows=failure_rows,
        version_records=version_records,
    )
    IMPORT_BATCH_RESULTS[batch_id] = result

    return result


def validate_demand_forecast_row(
    batch_id: str,
    row_index: int,
    row: dict[str, str],
) -> list[ImportBatchFailureRow]:
    failures: list[ImportBatchFailureRow] = []

    for field in DEMAND_FORECAST_IMPORT_REQUIRED_FIELDS:
        raw_value = (row.get(field) or "").strip()
        if not raw_value:
            failures.append(
                ImportBatchFailureRow(
                    batch_id=batch_id,
                    entity="demand_forecast",
                    failed_row_number=row_index,
                    field_name=field,
                    error_code="missing_required_field",
                    error_message="需求预测导入必填字段为空",
                    raw_value=raw_value,
                )
            )

    forecast_value = (row.get("forecast_agents") or "").strip()
    if forecast_value:
        try:
            forecast_agents = int(forecast_value)
        except ValueError:
            failures.append(
                ImportBatchFailureRow(
                    batch_id=batch_id,
                    entity="demand_forecast",
                    failed_row_number=row_index,
                    field_name="forecast_agents",
                    error_code="invalid_number",
                    error_message="预测人数必须是非负整数",
                    raw_value=forecast_value,
                )
            )
        else:
            if forecast_agents < 0:
                failures.append(
                    ImportBatchFailureRow(
                        batch_id=batch_id,
                        entity="demand_forecast",
                        failed_row_number=row_index,
                        field_name="forecast_agents",
                        error_code="invalid_number",
                        error_message="预测人数必须是非负整数",
                        raw_value=forecast_value,
                    )
                )

    return failures


def import_personnel_schedule_csv(
    request: PersonnelScheduleCsvImportRequest,
) -> ImportBatchResult:
    uploaded_at = datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds")
    batch_id = f"BATCH-PS-{uploaded_at[:10].replace('-', '')}-{len(IMPORT_BATCH_RESULTS) + 1:03d}"
    failure_rows: list[ImportBatchFailureRow] = []
    successful_rows: list[dict[str, str]] = []
    success_rows = 0

    reader = csv.DictReader(StringIO(request.csv_content.strip()))
    rows = list(reader) if reader.fieldnames else []
    missing_headers = [
        field
        for field in PERSONNEL_SCHEDULE_IMPORT_REQUIRED_FIELDS
        if field not in (reader.fieldnames or [])
    ]

    if missing_headers:
        failure_rows.append(
            ImportBatchFailureRow(
                batch_id=batch_id,
                entity="personnel_schedule",
                failed_row_number=1,
                field_name=",".join(missing_headers),
                error_code="missing_required_header",
                error_message="缺少人员级排班导入必填表头",
                raw_value="",
            )
        )
    else:
        for row_index, row in enumerate(rows, start=2):
            row_failures = validate_personnel_schedule_row(batch_id, row_index, row)

            if row_failures:
                failure_rows.extend(row_failures)
            else:
                success_rows += 1
                successful_rows.append(row)

    error_codes = sorted({failure.error_code for failure in failure_rows})
    failed_rows = len({failure.failed_row_number for failure in failure_rows})
    business_date_start, business_date_end, version_records = build_import_version_records(
        batch_id=batch_id,
        entity="personnel_schedule",
        file_name=request.file_name,
        uploaded_at=uploaded_at,
        successful_rows=successful_rows,
    )
    result = ImportBatchResult(
        batch_id=batch_id,
        entity="personnel_schedule",
        file_name=request.file_name,
        uploaded_by=request.uploaded_by,
        uploaded_at=uploaded_at,
        status="completed" if failed_rows == 0 else "completed_with_errors",
        total_rows=len(rows),
        success_rows=success_rows,
        failed_rows=failed_rows,
        warning_rows=0,
        business_date_start=business_date_start,
        business_date_end=business_date_end,
        error_codes=error_codes,
        failure_rows=failure_rows,
        version_records=version_records,
    )
    IMPORT_BATCH_RESULTS[batch_id] = result

    return result


def validate_personnel_schedule_row(
    batch_id: str,
    row_index: int,
    row: dict[str, str],
) -> list[ImportBatchFailureRow]:
    failures: list[ImportBatchFailureRow] = []

    for field in PERSONNEL_SCHEDULE_IMPORT_REQUIRED_FIELDS:
        raw_value = (row.get(field) or "").strip()
        if not raw_value:
            failures.append(
                ImportBatchFailureRow(
                    batch_id=batch_id,
                    entity="personnel_schedule",
                    failed_row_number=row_index,
                    field_name=field,
                    error_code="missing_required_field",
                    error_message="人员级排班导入必填字段为空",
                    raw_value=raw_value,
                )
            )

    start_value = (row.get("start_at") or "").strip()
    end_value = (row.get("end_at") or "").strip()
    if start_value and end_value:
        try:
            start_time = datetime.strptime(start_value, "%H:%M").time()
            end_time = datetime.strptime(end_value, "%H:%M").time()
        except ValueError:
            failures.append(
                ImportBatchFailureRow(
                    batch_id=batch_id,
                    entity="personnel_schedule",
                    failed_row_number=row_index,
                    field_name="end_at",
                    error_code="invalid_time_range",
                    error_message="排班开始和结束时间必须使用 HH:MM 格式",
                    raw_value=end_value,
                )
            )
        else:
            if start_time >= end_time:
                failures.append(
                    ImportBatchFailureRow(
                        batch_id=batch_id,
                        entity="personnel_schedule",
                        failed_row_number=row_index,
                        field_name="end_at",
                        error_code="invalid_time_range",
                        error_message="排班结束时间必须晚于开始时间",
                        raw_value=end_value,
                    )
                )

    return failures


def import_login_log_csv(request: LoginLogCsvImportRequest) -> ImportBatchResult:
    uploaded_at = datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds")
    batch_id = f"BATCH-LL-{uploaded_at[:10].replace('-', '')}-{len(IMPORT_BATCH_RESULTS) + 1:03d}"
    failure_rows: list[ImportBatchFailureRow] = []
    successful_rows: list[dict[str, str]] = []
    success_rows = 0

    reader = csv.DictReader(StringIO(request.csv_content.strip()))
    rows = list(reader) if reader.fieldnames else []
    missing_headers = [
        field
        for field in LOGIN_LOG_IMPORT_REQUIRED_FIELDS
        if field not in (reader.fieldnames or [])
    ]

    if missing_headers:
        failure_rows.append(
            ImportBatchFailureRow(
                batch_id=batch_id,
                entity="login_log",
                failed_row_number=1,
                field_name=",".join(missing_headers),
                error_code="missing_required_header",
                error_message="缺少登录日志导入必填表头",
                raw_value="",
            )
        )
    else:
        for row_index, row in enumerate(rows, start=2):
            row_failures = validate_login_log_row(batch_id, row_index, row)

            if row_failures:
                failure_rows.extend(row_failures)
            else:
                success_rows += 1
                successful_rows.append(row)

    error_codes = sorted({failure.error_code for failure in failure_rows})
    failed_rows = len({failure.failed_row_number for failure in failure_rows})
    business_date_start, business_date_end, version_records = build_import_version_records(
        batch_id=batch_id,
        entity="login_log",
        file_name=request.file_name,
        uploaded_at=uploaded_at,
        successful_rows=successful_rows,
    )
    result = ImportBatchResult(
        batch_id=batch_id,
        entity="login_log",
        file_name=request.file_name,
        uploaded_by=request.uploaded_by,
        uploaded_at=uploaded_at,
        status="completed" if failed_rows == 0 else "completed_with_errors",
        total_rows=len(rows),
        success_rows=success_rows,
        failed_rows=failed_rows,
        warning_rows=0,
        business_date_start=business_date_start,
        business_date_end=business_date_end,
        error_codes=error_codes,
        failure_rows=failure_rows,
        version_records=version_records,
    )
    IMPORT_BATCH_RESULTS[batch_id] = result

    return result


def validate_login_log_row(
    batch_id: str,
    row_index: int,
    row: dict[str, str],
) -> list[ImportBatchFailureRow]:
    failures: list[ImportBatchFailureRow] = []

    for field in LOGIN_LOG_IMPORT_REQUIRED_FIELDS:
        raw_value = (row.get(field) or "").strip()
        if not raw_value:
            failures.append(
                ImportBatchFailureRow(
                    batch_id=batch_id,
                    entity="login_log",
                    failed_row_number=row_index,
                    field_name=field,
                    error_code="missing_required_field",
                    error_message="登录日志导入必填字段为空",
                    raw_value=raw_value,
                )
            )

    login_value = (row.get("login_at") or "").strip()
    logout_value = (row.get("logout_at") or "").strip()
    if login_value and logout_value:
        try:
            login_at = datetime.fromisoformat(login_value)
            logout_at = datetime.fromisoformat(logout_value)
        except ValueError:
            failures.append(
                ImportBatchFailureRow(
                    batch_id=batch_id,
                    entity="login_log",
                    failed_row_number=row_index,
                    field_name="logout_at",
                    error_code="invalid_time_range",
                    error_message="登录和登出时间必须使用 ISO 时间格式",
                    raw_value=logout_value,
                )
            )
        else:
            if login_at >= logout_at:
                failures.append(
                    ImportBatchFailureRow(
                        batch_id=batch_id,
                        entity="login_log",
                        failed_row_number=row_index,
                        field_name="logout_at",
                        error_code="invalid_time_range",
                        error_message="登出时间必须晚于登录时间",
                        raw_value=logout_value,
                    )
                )

    return failures


def import_status_log_csv(request: StatusLogCsvImportRequest) -> ImportBatchResult:
    uploaded_at = datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds")
    batch_id = f"BATCH-SL-{uploaded_at[:10].replace('-', '')}-{len(IMPORT_BATCH_RESULTS) + 1:03d}"
    failure_rows: list[ImportBatchFailureRow] = []
    successful_rows: list[dict[str, str]] = []
    success_rows = 0

    reader = csv.DictReader(StringIO(request.csv_content.strip()))
    rows = list(reader) if reader.fieldnames else []
    missing_headers = [
        field
        for field in STATUS_LOG_IMPORT_REQUIRED_FIELDS
        if field not in (reader.fieldnames or [])
    ]

    if missing_headers:
        failure_rows.append(
            ImportBatchFailureRow(
                batch_id=batch_id,
                entity="status_log",
                failed_row_number=1,
                field_name=",".join(missing_headers),
                error_code="missing_required_header",
                error_message="缺少状态日志导入必填表头",
                raw_value="",
            )
        )
    else:
        for row_index, row in enumerate(rows, start=2):
            row_failures = validate_status_log_row(batch_id, row_index, row)

            if row_failures:
                failure_rows.extend(row_failures)
            else:
                success_rows += 1
                successful_rows.append(row)

    error_codes = sorted({failure.error_code for failure in failure_rows})
    failed_rows = len({failure.failed_row_number for failure in failure_rows})
    business_date_start, business_date_end, version_records = build_import_version_records(
        batch_id=batch_id,
        entity="status_log",
        file_name=request.file_name,
        uploaded_at=uploaded_at,
        successful_rows=successful_rows,
    )
    result = ImportBatchResult(
        batch_id=batch_id,
        entity="status_log",
        file_name=request.file_name,
        uploaded_by=request.uploaded_by,
        uploaded_at=uploaded_at,
        status="completed" if failed_rows == 0 else "completed_with_errors",
        total_rows=len(rows),
        success_rows=success_rows,
        failed_rows=failed_rows,
        warning_rows=0,
        business_date_start=business_date_start,
        business_date_end=business_date_end,
        error_codes=error_codes,
        failure_rows=failure_rows,
        version_records=version_records,
    )
    IMPORT_BATCH_RESULTS[batch_id] = result

    return result


def validate_status_log_row(
    batch_id: str,
    row_index: int,
    row: dict[str, str],
) -> list[ImportBatchFailureRow]:
    failures: list[ImportBatchFailureRow] = []

    for field in STATUS_LOG_IMPORT_REQUIRED_FIELDS:
        raw_value = (row.get(field) or "").strip()
        if not raw_value:
            failures.append(
                ImportBatchFailureRow(
                    batch_id=batch_id,
                    entity="status_log",
                    failed_row_number=row_index,
                    field_name=field,
                    error_code="missing_required_field",
                    error_message="状态日志导入必填字段为空",
                    raw_value=raw_value,
                )
            )

    start_value = (row.get("start_at") or "").strip()
    end_value = (row.get("end_at") or "").strip()
    if start_value and end_value:
        try:
            start_at = datetime.fromisoformat(start_value)
            end_at = datetime.fromisoformat(end_value)
        except ValueError:
            failures.append(
                ImportBatchFailureRow(
                    batch_id=batch_id,
                    entity="status_log",
                    failed_row_number=row_index,
                    field_name="end_at",
                    error_code="invalid_time_range",
                    error_message="状态开始和结束时间必须使用 ISO 时间格式",
                    raw_value=end_value,
                )
            )
        else:
            if start_at >= end_at:
                failures.append(
                    ImportBatchFailureRow(
                        batch_id=batch_id,
                        entity="status_log",
                        failed_row_number=row_index,
                        field_name="end_at",
                        error_code="invalid_time_range",
                        error_message="状态结束时间必须晚于开始时间",
                        raw_value=end_value,
                    )
                )

    return failures


def get_import_batch_result(batch_id: str) -> ImportBatchResult | None:
    return IMPORT_BATCH_RESULTS.get(batch_id)


def list_process_import_batches() -> list[ImportBatchResult]:
    return sorted(
        IMPORT_BATCH_RESULTS.values(),
        key=lambda batch: (batch.uploaded_at, batch.batch_id),
        reverse=True,
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


def get_fulfillment_comparison_contract() -> FulfillmentComparisonContractResponse:
    return FULFILLMENT_COMPARISON_CONTRACT


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
