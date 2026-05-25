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


class DemandForecastCsvImportRequest(BaseModel):
    file_name: str
    uploaded_by: str
    csv_content: str


class PersonnelScheduleCsvImportRequest(BaseModel):
    file_name: str
    uploaded_by: str
    csv_content: str


class ImportBatchFailureRow(BaseModel):
    batch_id: str
    entity: str
    failed_row_number: int = Field(ge=1)
    field_name: str
    error_code: str
    error_message: str
    raw_value: str


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
    error_codes: list[str]
    failure_rows: list[ImportBatchFailureRow]


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
