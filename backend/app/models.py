from typing import Literal

from pydantic import BaseModel, Field


SchedulePlanStatus = Literal["draft", "review_ready", "published"]
DemandPlanStatus = Literal["imported", "mapped"]
ImportBatchStatus = Literal["completed", "completed_with_errors", "failed", "pending_review"]
UnavailabilityStatus = Literal["active", "resolved"]
ScheduleRiskLevel = Literal["high", "medium", "low"]
MasterDataEntity = Literal[
    "agent",
    "workplace",
    "supplier",
    "project",
    "agent_binding",
    "shift_type",
]
ComparisonSource = Literal[
    "demand_forecast",
    "personnel_schedule",
    "login_log",
    "status_log",
]
CsvImportType = Literal[
    "master_data",
    "personnel_schedule",
    "demand_forecast",
    "login_log",
    "status_log",
]


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
    skill_group: str
    skill_level: str
    forecast_agents: int = Field(ge=0)
    forecast_version: str
    source: str
    source_batch_id: str | None = None
    source_version_id: str | None = None
    status: DemandPlanStatus


class DemandPlanListResponse(BaseModel):
    items: list[DemandPlanRow]


class DemandForecastVersionChangeRecord(BaseModel):
    change_id: str
    change_type: str
    business_date: str
    workplace_id: str
    project_id: str
    skill_group: str
    skill_level: str
    interval_start: str
    interval_end: str
    previous_forecast_agents: int | None = Field(default=None, ge=0)
    new_forecast_agents: int = Field(ge=0)
    previous_source_batch_id: str | None = None
    new_source_batch_id: str
    previous_version_id: str | None = None
    new_version_id: str
    changed_at: str


class DemandForecastVersionChangeListResponse(BaseModel):
    items: list[DemandForecastVersionChangeRecord]


class DemandScheduleAlignmentRecord(BaseModel):
    alignment_id: str
    demand_id: str
    business_date: str
    workplace_id: str
    project_id: str
    skill_group: str
    skill_level: str
    interval_start: str
    interval_end: str
    forecast_agents: int = Field(ge=0)
    scheduled_agents: int = Field(ge=0)
    shortage_agents: int = Field(ge=0)
    overstaffed_agents: int = Field(ge=0)
    alignment_status: str
    demand_source_batch_id: str
    demand_version_id: str
    schedule_version_ids: list[str]
    schedule_source_batch_ids: list[str]
    schedule_detail_ids: list[str]
    employee_ids: list[str]


class DemandScheduleAlignmentListResponse(BaseModel):
    items: list[DemandScheduleAlignmentRecord]


class DemandForecastCsvImportRequest(BaseModel):
    file_name: str
    uploaded_by: str
    csv_content: str


class MasterDataCsvImportRequest(BaseModel):
    file_name: str
    uploaded_by: str
    csv_content: str


class PersonnelScheduleCsvImportRequest(BaseModel):
    file_name: str
    uploaded_by: str
    csv_content: str


class LoginLogCsvImportRequest(BaseModel):
    file_name: str
    uploaded_by: str
    csv_content: str


class StatusLogCsvImportRequest(BaseModel):
    file_name: str
    uploaded_by: str
    csv_content: str


class CsvImportPreviewRequest(BaseModel):
    file_name: str
    import_type: CsvImportType
    csv_content: str


class CsvImportPreviewResponse(BaseModel):
    file_name: str
    import_type: CsvImportType
    total_rows: int = Field(ge=0)
    detected_fields: list[str]
    required_fields: list[str]
    mapped_fields: list[str]
    missing_required_fields: list[str]
    warning_fields: list[str]
    pending_validation_fields: list[str]


class ImportBatchFailureRow(BaseModel):
    batch_id: str
    entity: str
    failed_row_number: int = Field(ge=1)
    field_name: str
    error_code: str
    error_message: str
    raw_value: str


class ImportBatchVersionRecord(BaseModel):
    version_id: str
    entity: str
    batch_id: str
    source_file: str
    row_count: int = Field(ge=0)
    business_date_start: str | None = None
    business_date_end: str | None = None
    created_at: str


class ImportBatchResult(BaseModel):
    batch_id: str
    entity: str
    file_name: str
    uploaded_by: str
    uploaded_at: str
    status: ImportBatchStatus
    total_rows: int = Field(ge=0)
    success_rows: int = Field(ge=0)
    failed_rows: int = Field(ge=0)
    warning_rows: int = Field(ge=0)
    business_date_start: str | None = None
    business_date_end: str | None = None
    error_codes: list[str]
    failure_rows: list[ImportBatchFailureRow]
    version_records: list[ImportBatchVersionRecord] = []


class ImportBatchListResponse(BaseModel):
    items: list[ImportBatchResult]


class MasterDataImportedRecord(BaseModel):
    employee_id: str
    employee_name: str
    supplier_id: str
    supplier_name: str
    workplace_id: str
    workplace_name: str
    project_id: str
    project_name: str
    skill_group: str
    skill_level: str
    effective_from: str
    effective_to: str
    status: str
    source_batch_id: str
    source_version_id: str
    reference_status: str


class MasterDataImportedRecordListResponse(BaseModel):
    items: list[MasterDataImportedRecord]


class MasterDataRecordUpsertRequest(BaseModel):
    employee_id: str
    employee_name: str
    supplier_id: str
    supplier_name: str
    workplace_id: str
    workplace_name: str
    project_id: str
    project_name: str
    skill_group: str
    skill_level: str = "待确认"
    effective_from: str
    effective_to: str = "未设置"
    status: str = "active"


class MasterDataReferenceCheckRequest(BaseModel):
    employee_id: str
    business_date: str
    workplace_id: str
    supplier_id: str
    project_id: str


class MasterDataReferenceCheckResult(BaseModel):
    employee_id: str
    reference_status: str
    error_code: str | None = None
    error_message: str | None = None
    quality_issue_id: str | None = None


class PersonnelScheduleImportedRecord(BaseModel):
    schedule_detail_id: str
    schedule_version_id: str
    employee_id: str
    employee_name: str
    business_date: str
    workplace_id: str
    workplace_name: str
    supplier_id: str
    supplier_name: str
    project_id: str
    project_name: str
    shift_type_id: str
    shift_type_name: str
    shift_type_reference_status: str
    start_at: str
    end_at: str
    skill_group: str
    skill_level: str
    status: str
    source_batch_id: str
    source_version_id: str


class PersonnelScheduleImportedRecordListResponse(BaseModel):
    items: list[PersonnelScheduleImportedRecord]


class PersonnelScheduleIntervalRecord(BaseModel):
    interval_schedule_id: str
    schedule_version_id: str
    business_date: str
    workplace_id: str
    project_id: str
    skill_group: str
    skill_level: str
    interval_start: str
    interval_end: str
    scheduled_agents: int = Field(ge=0)
    employee_ids: list[str]
    schedule_detail_ids: list[str]
    source_batch_id: str
    source_version_id: str
    trace_status: str


class PersonnelScheduleIntervalRecordListResponse(BaseModel):
    items: list[PersonnelScheduleIntervalRecord]


class MasterDataEntityContract(BaseModel):
    entity: MasterDataEntity
    primary_key: list[str]
    fields: list[str]
    required_fields: list[str]
    foreign_keys: list[str] = []
    validation_rules: list[str]


class MasterDataImportContractResponse(BaseModel):
    version: str
    entities: list[MasterDataEntityContract]
    batch_fields: list[str]
    failure_row_fields: list[str]
    quality_error_codes: list[str]


class IntervalExpansionContract(BaseModel):
    source_entity: str
    target_entity: str
    interval_minutes: int = Field(gt=0)
    group_by: list[str]
    target_fields: list[str]
    traceability_fields: list[str]


class PersonnelScheduleImportContractResponse(BaseModel):
    version: str
    entity: str
    primary_key: list[str]
    fields: list[str]
    required_fields: list[str]
    generated_fields: list[str]
    validation_rules: list[str]
    expansion: IntervalExpansionContract


class ComparisonSourceContract(BaseModel):
    source: ComparisonSource
    fields: list[str]
    required_fields: list[str]
    grain: str


class AnomalyRuleContract(BaseModel):
    code: str
    compares: list[str]
    condition: str
    review_owner: str


class FulfillmentComparisonContractResponse(BaseModel):
    version: str
    sources: list[ComparisonSourceContract]
    comparison_keys: list[str]
    person_level_keys: list[str]
    status_dictionary_fields: list[str]
    anomaly_rules: list[AnomalyRuleContract]
    review_fields: list[str]


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
