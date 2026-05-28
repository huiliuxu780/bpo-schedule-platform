from typing import Any, Literal

from pydantic import BaseModel, Field


SchedulePlanStatus = Literal["draft", "review_ready", "published"]
DemandPlanStatus = Literal["imported", "mapped"]
UnavailabilityStatus = Literal["active", "resolved"]
ScheduleRiskLevel = Literal["high", "medium", "low"]
ImportFileType = Literal[
    "master_data",
    "personnel_schedule",
    "demand_forecast",
    "login_log",
    "status_log",
]
ImportRowStatus = Literal["success", "failed", "warning"]
ImportProcessingStatus = Literal["completed", "completed_with_errors"]
MasterDataStatus = Literal["active", "frozen", "inactive"]
ComparisonType = Literal["forecast_vs_schedule", "schedule_vs_actual"]
ComparisonRunStatus = Literal["completed", "failed"]
ReviewSourceResultType = Literal["forecast_schedule", "schedule_actual"]


class SchedulePlanSummary(BaseModel):
    id: str
    plan_date: str
    project_name: str
    site_name: str
    version: str
    status: SchedulePlanStatus
    forecast_agents: int = Field(ge=0)
    scheduled_agents: int = Field(ge=0)
    gap_agents: int = Field(ge=0)
    coverage_rate: float = Field(ge=0)
    updated_at: str


class SchedulePlanInterval(BaseModel):
    interval_start: str
    interval_end: str
    forecast_agents: int = Field(ge=0)
    scheduled_agents: int = Field(ge=0)
    gap_agents: int = Field(ge=0)
    coverage_rate: float = Field(ge=0)
    note: str


class SchedulePlanDetail(BaseModel):
    summary: SchedulePlanSummary
    intervals: list[SchedulePlanInterval]


class DemandPlanRow(BaseModel):
    demand_id: str
    plan_date: str
    project_name: str
    site_name: str
    interval_start: str
    interval_end: str
    forecast_agents: int = Field(ge=0)
    source: str
    status: DemandPlanStatus


class DemandPlanListResponse(BaseModel):
    items: list[DemandPlanRow]


class UnavailabilityRow(BaseModel):
    unavailability_id: str
    staff_name: str
    team_name: str
    project_name: str
    site_name: str
    unavailable_date: str
    start_time: str
    end_time: str
    reason: str
    status: UnavailabilityStatus
    affected_intervals: int = Field(ge=0)
    note: str


class UnavailabilityListResponse(BaseModel):
    items: list[UnavailabilityRow]


class ScheduleRiskRow(BaseModel):
    risk_id: str
    plan_id: str
    plan_date: str
    project_name: str
    site_name: str
    interval_start: str
    interval_end: str
    risk_level: ScheduleRiskLevel
    gap_agents: int = Field(ge=0)
    affected_unavailability: int = Field(ge=0)
    reason: str
    recommendation: str


class ScheduleRiskListResponse(BaseModel):
    items: list[ScheduleRiskRow]


class ShiftDetailRow(BaseModel):
    plan_id: str
    plan_date: str
    project_name: str
    site_name: str
    version: str
    status: SchedulePlanStatus
    interval_start: str
    interval_end: str
    forecast_agents: int = Field(ge=0)
    scheduled_agents: int = Field(ge=0)
    gap_agents: int = Field(ge=0)
    coverage_rate: float = Field(ge=0)
    note: str


class ShiftDetailListResponse(BaseModel):
    items: list[ShiftDetailRow]


class SchedulePlanIntervalInput(BaseModel):
    interval_start: str
    interval_end: str
    forecast_agents: int = Field(ge=0)
    scheduled_agents: int = Field(ge=0)
    note: str


class SchedulePlanDraftRequest(BaseModel):
    plan_date: str
    project_name: str
    site_name: str
    version: str
    intervals: list[SchedulePlanIntervalInput] = Field(min_length=1)


class SchedulePlanListResponse(BaseModel):
    items: list[SchedulePlanSummary]


class ApiError(BaseModel):
    code: str
    message: str


class ApiErrorResponse(BaseModel):
    error: ApiError


class ImportBatchRowResultInput(BaseModel):
    row_number: int = Field(ge=1)
    row_status: ImportRowStatus
    source_key: str | None = None
    error_field: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    raw_data: dict[str, Any] = Field(default_factory=dict)


class ImportBatchVersionInput(BaseModel):
    version_id: str
    version_type: ImportFileType
    business_date_from: str
    business_date_to: str


class ImportBatchCreateRequest(BaseModel):
    batch_id: str
    file_name: str
    file_type: ImportFileType
    uploaded_by: str
    business_date_from: str
    business_date_to: str
    rows: list[ImportBatchRowResultInput] = Field(min_length=1)
    versions: list[ImportBatchVersionInput] = Field(default_factory=list)


class ImportBatchRecord(BaseModel):
    batch_id: str
    file_name: str
    file_type: ImportFileType
    uploaded_by: str
    uploaded_at: str
    business_date_from: str
    business_date_to: str
    processing_status: ImportProcessingStatus
    total_rows: int = Field(ge=0)
    success_rows: int = Field(ge=0)
    failed_rows: int = Field(ge=0)
    warning_rows: int = Field(ge=0)


class ImportBatchRowResultRecord(BaseModel):
    row_id: int
    batch_id: str
    row_number: int = Field(ge=1)
    row_status: ImportRowStatus
    source_key: str | None = None
    error_field: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    raw_data: dict[str, Any] = Field(default_factory=dict)


class ImportBatchVersionRecord(BaseModel):
    version_id: str
    batch_id: str
    version_type: ImportFileType
    business_date_from: str
    business_date_to: str
    created_at: str


class ImportBatchPersistenceDetail(BaseModel):
    batch: ImportBatchRecord
    rows: list[ImportBatchRowResultRecord]
    failed_rows: list[ImportBatchRowResultRecord]
    versions: list[ImportBatchVersionRecord]


class MasterDataReferenceInput(BaseModel):
    reference_id: str
    reference_name: str
    status: MasterDataStatus
    effective_from: str
    effective_to: str


class EmployeeMasterDataInput(BaseModel):
    employee_id: str
    employee_name: str
    status: MasterDataStatus
    effective_from: str
    effective_to: str


class EmployeeBindingInput(BaseModel):
    binding_id: str
    employee_id: str
    supplier_id: str
    workplace_id: str
    project_id: str
    skill_id: str
    effective_from: str
    effective_to: str


class MasterDataSnapshotRequest(BaseModel):
    batch_id: str
    suppliers: list[MasterDataReferenceInput] = Field(default_factory=list)
    workplaces: list[MasterDataReferenceInput] = Field(default_factory=list)
    projects: list[MasterDataReferenceInput] = Field(default_factory=list)
    skills: list[MasterDataReferenceInput] = Field(default_factory=list)
    employees: list[EmployeeMasterDataInput] = Field(default_factory=list)
    bindings: list[EmployeeBindingInput] = Field(default_factory=list)


class EmployeeBindingRecord(BaseModel):
    binding_id: str
    employee_id: str
    supplier_id: str
    workplace_id: str
    project_id: str
    skill_id: str
    effective_from: str
    effective_to: str
    batch_id: str


class MasterDataImportApplyResponse(BaseModel):
    batch_id: str
    suppliers: int = Field(ge=0)
    workplaces: int = Field(ge=0)
    projects: int = Field(ge=0)
    skills: int = Field(ge=0)
    employees: int = Field(ge=0)
    bindings: int = Field(ge=0)
    skipped_rows: int = Field(ge=0)


class ShiftTypeInput(BaseModel):
    shift_type_id: str
    shift_type_name: str
    status: MasterDataStatus
    start_time: str
    end_time: str
    effective_from: str
    effective_to: str


class PersonnelScheduleDetailInput(BaseModel):
    schedule_detail_id: str
    employee_id: str
    workplace_id: str
    project_id: str
    skill_id: str
    shift_type_id: str
    schedule_date: str
    start_time: str
    end_time: str


class PersonnelScheduleVersionRequest(BaseModel):
    schedule_version_id: str
    import_version_id: str
    business_date_from: str
    business_date_to: str
    shift_types: list[ShiftTypeInput] = Field(default_factory=list)
    details: list[PersonnelScheduleDetailInput] = Field(default_factory=list)


class PersonnelScheduleVersionRecord(BaseModel):
    schedule_version_id: str
    import_version_id: str
    business_date_from: str
    business_date_to: str
    total_details: int


class PersonnelScheduleDetailRecord(BaseModel):
    schedule_detail_id: str
    schedule_version_id: str
    employee_id: str
    workplace_id: str
    project_id: str
    skill_id: str
    shift_type_id: str
    schedule_date: str
    start_time: str
    end_time: str


class PersonnelScheduleIntervalRecord(BaseModel):
    interval_id: int
    schedule_detail_id: str
    schedule_version_id: str
    employee_id: str
    interval_date: str
    interval_start: str
    interval_end: str


class PersonnelScheduleVersionDetail(BaseModel):
    version: PersonnelScheduleVersionRecord
    details: list[PersonnelScheduleDetailRecord]
    intervals: list[PersonnelScheduleIntervalRecord]


class PersonnelScheduleImportApplyResponse(BaseModel):
    batch_id: str
    schedule_version_id: str
    shift_types: int = Field(ge=0)
    details: int = Field(ge=0)
    skipped_rows: int = Field(ge=0)


class ForecastIntervalInput(BaseModel):
    forecast_interval_id: str
    forecast_date: str
    interval_start: str
    interval_end: str
    workplace_id: str
    project_id: str
    skill_id: str
    demand_level: str
    required_agents: int = Field(ge=0)


class ForecastVersionRequest(BaseModel):
    forecast_version_id: str
    import_version_id: str
    business_date_from: str
    business_date_to: str
    compared_from_version_id: str | None = None
    change_reason: str | None = None
    intervals: list[ForecastIntervalInput] = Field(default_factory=list)


class ForecastVersionRecord(BaseModel):
    forecast_version_id: str
    import_version_id: str
    business_date_from: str
    business_date_to: str
    total_intervals: int
    total_required_agents: int


class ForecastIntervalRecord(BaseModel):
    forecast_interval_id: str
    forecast_version_id: str
    forecast_date: str
    interval_start: str
    interval_end: str
    workplace_id: str
    project_id: str
    skill_id: str
    demand_level: str
    required_agents: int


class ForecastVersionChangeRecord(BaseModel):
    change_id: int
    forecast_version_id: str
    compared_from_version_id: str | None = None
    change_reason: str | None = None


class ForecastVersionDetail(BaseModel):
    version: ForecastVersionRecord
    intervals: list[ForecastIntervalRecord]
    changes: list[ForecastVersionChangeRecord]


class ForecastImportApplyResponse(BaseModel):
    batch_id: str
    forecast_version_id: str
    intervals: int = Field(ge=0)
    total_required_agents: int = Field(ge=0)
    skipped_rows: int = Field(ge=0)


class ActualLogImportApplyResponse(BaseModel):
    batch_id: str
    file_type: str
    login_events: int = Field(ge=0)
    status_dictionary_entries: int = Field(ge=0)
    status_intervals: int = Field(ge=0)
    skipped_rows: int = Field(ge=0)


ActualLoginEventType = Literal["login", "logout"]


class ActualLoginEventInput(BaseModel):
    event_id: str
    import_version_id: str
    employee_id: str
    event_type: ActualLoginEventType
    event_at: str
    timezone: str


class ActualLoginEventRecord(BaseModel):
    event_id: str
    import_version_id: str
    employee_id: str
    event_type: ActualLoginEventType
    event_at: str
    timezone: str


class ActualStatusDictionaryInput(BaseModel):
    external_status_code: str
    normalized_status: str
    category: str
    is_productive: bool


class ActualStatusDictionaryRecord(BaseModel):
    external_status_code: str
    normalized_status: str
    category: str
    is_productive: bool


class ActualStatusIntervalInput(BaseModel):
    interval_id: str
    employee_id: str
    external_status_code: str
    start_at: str
    end_at: str
    timezone: str


class ActualStatusIntervalImportRequest(BaseModel):
    import_version_id: str
    intervals: list[ActualStatusIntervalInput] = Field(default_factory=list)


class ActualStatusIntervalRecord(BaseModel):
    interval_row_id: int
    source_interval_id: str
    import_version_id: str
    employee_id: str
    business_date: str
    interval_start: str
    interval_end: str
    timezone: str
    external_status_code: str
    normalized_status: str
    category: str
    is_productive: bool


class ForecastScheduleComparisonResultInput(BaseModel):
    forecast_interval_id: str | None = None
    schedule_detail_id: str | None = None
    business_date: str
    workplace_id: str
    project_id: str
    skill_id: str
    interval_start: str
    interval_end: str
    forecast_agents: int = Field(ge=0)
    scheduled_agents: int = Field(ge=0)
    gap_agents: int
    result_status: str


class ScheduleActualComparisonResultInput(BaseModel):
    schedule_detail_id: str | None = None
    actual_status_interval_row_id: int | None = None
    business_date: str
    employee_id: str
    interval_start: str
    interval_end: str
    scheduled_minutes: int = Field(ge=0)
    actual_productive_minutes: int = Field(ge=0)
    late_minutes: int = Field(ge=0)
    result_status: str


class ComparisonRunRequest(BaseModel):
    run_id: str
    comparison_type: ComparisonType
    forecast_version_id: str | None = None
    schedule_version_id: str | None = None
    actual_import_version_id: str | None = None
    business_date_from: str
    business_date_to: str
    status: ComparisonRunStatus
    total_results: int | None = Field(default=None, ge=0)
    total_gap_agents: int | None = None
    total_late_minutes: int | None = Field(default=None, ge=0)
    forecast_schedule_results: list[ForecastScheduleComparisonResultInput] = Field(
        default_factory=list
    )
    schedule_actual_results: list[ScheduleActualComparisonResultInput] = Field(
        default_factory=list
    )


class ComparisonCalculationRequest(BaseModel):
    run_id: str
    comparison_type: ComparisonType
    forecast_version_id: str | None = None
    schedule_version_id: str | None = None
    actual_import_version_id: str | None = None
    business_date_from: str
    business_date_to: str


class ComparisonRunRecord(BaseModel):
    run_id: str
    comparison_type: ComparisonType
    forecast_version_id: str | None = None
    schedule_version_id: str | None = None
    actual_import_version_id: str | None = None
    business_date_from: str
    business_date_to: str
    status: ComparisonRunStatus
    total_results: int
    total_gap_agents: int | None = None
    total_late_minutes: int | None = None
    created_at: str


class ForecastScheduleComparisonResultRecord(BaseModel):
    result_id: int
    run_id: str
    forecast_version_id: str
    schedule_version_id: str
    forecast_interval_id: str | None = None
    schedule_detail_id: str | None = None
    business_date: str
    workplace_id: str
    project_id: str
    skill_id: str
    interval_start: str
    interval_end: str
    forecast_agents: int
    scheduled_agents: int
    gap_agents: int
    result_status: str


class ScheduleActualComparisonResultRecord(BaseModel):
    result_id: int
    run_id: str
    schedule_version_id: str
    actual_import_version_id: str
    schedule_detail_id: str | None = None
    actual_status_interval_row_id: int | None = None
    business_date: str
    employee_id: str
    interval_start: str
    interval_end: str
    scheduled_minutes: int
    actual_productive_minutes: int
    late_minutes: int
    result_status: str


class ComparisonRunDetail(BaseModel):
    run: ComparisonRunRecord
    forecast_schedule_results: list[ForecastScheduleComparisonResultRecord]
    schedule_actual_results: list[ScheduleActualComparisonResultRecord]


class ComparisonRunListResponse(BaseModel):
    items: list[ComparisonRunRecord]


class ReviewCaseCreateRequest(BaseModel):
    case_id: str
    source_result_type: ReviewSourceResultType
    source_result_id: int = Field(ge=1)
    business_date: str
    owner_id: str
    severity: str
    status: str


class ReviewCaseRecord(BaseModel):
    case_id: str
    source_result_type: ReviewSourceResultType
    source_result_id: int
    business_date: str
    owner_id: str
    severity: str
    status: str
    created_at: str


class ReviewEvidenceInput(BaseModel):
    evidence_id: str
    case_id: str
    evidence_type: str
    evidence_uri: str
    submitted_by: str
    note: str | None = None


class ReviewEvidenceRecord(BaseModel):
    evidence_id: str
    case_id: str
    evidence_type: str
    evidence_uri: str
    submitted_by: str
    submitted_at: str
    note: str | None = None


class ReviewConclusionInput(BaseModel):
    conclusion_id: str
    case_id: str
    conclusion_type: str
    risk_level: str
    conclusion_text: str
    decided_by: str


class ReviewConclusionRecord(BaseModel):
    conclusion_id: str
    case_id: str
    conclusion_type: str
    risk_level: str
    conclusion_text: str
    decided_by: str
    decided_at: str


class ReviewClosureInput(BaseModel):
    closure_id: str
    case_id: str
    closure_status: str
    closed_by: str
    closure_note: str | None = None


class ReviewClosureRecord(BaseModel):
    closure_id: str
    case_id: str
    closure_status: str
    closed_by: str
    closed_at: str
    closure_note: str | None = None


class ReviewClosureWriteRequest(BaseModel):
    case: ReviewCaseCreateRequest
    evidence: list[ReviewEvidenceInput] = Field(default_factory=list)
    conclusions: list[ReviewConclusionInput] = Field(default_factory=list)
    closure: ReviewClosureInput | None = None


class ReviewCaseDetail(BaseModel):
    case: ReviewCaseRecord
    evidence: list[ReviewEvidenceRecord]
    conclusions: list[ReviewConclusionRecord]
    closure: ReviewClosureRecord | None = None


class ReviewCaseListResponse(BaseModel):
    items: list[ReviewCaseRecord]
