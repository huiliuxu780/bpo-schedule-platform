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
