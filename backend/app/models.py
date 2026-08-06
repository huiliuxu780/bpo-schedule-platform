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
ImportApplicationStatus = Literal["not_applied", "applied"]
ImportReadinessStatus = Literal["ready", "blocked"]
MasterDataStatus = Literal["active", "frozen", "inactive"]
MasterDataEmployeeType = Literal["internal", "outsourced"]
MasterDataSkillCategory = Literal["online", "hotline", "ticket"]
MasterDataEmployeeMaintenanceAction = Literal["create", "edit", "freeze", "effective_period"]
MasterDataEmployeeSkillMaintenanceAction = Literal["replace"]
MasterDataEmployeeMaintenanceStatus = Literal[
    "created",
    "updated",
    "frozen",
    "effective_period_updated",
]
MasterDataReferenceType = Literal["suppliers", "workplaces", "projects", "skills"]
MasterDataReferenceMaintenanceAction = Literal["create", "edit", "freeze", "effective_period"]
MasterDataOrganizationMaintenanceAction = Literal["create", "edit", "freeze"]
MasterDataBindingMaintenanceAction = Literal["create", "edit", "effective_period"]
MasterDataWorkplaceServiceTeamType = Literal["internal", "supplier"]
MasterDataWorkplaceServiceTeamMaintenanceAction = Literal["create", "edit", "freeze"]
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


class ImportBatchRowCorrectionRequest(BaseModel):
    row_number: int = Field(ge=1)
    standard_fields: dict[str, Any] = Field(min_length=1)


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


class ImportBatchListRow(BaseModel):
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
    version_count: int = Field(ge=0)
    application_status: ImportApplicationStatus
    application_target: str
    import_version_id: str | None = None
    applied_record_count: int = Field(ge=0)


class ImportBatchListResponse(BaseModel):
    items: list[ImportBatchListRow]


class ImportFieldMappingTemplateCreateRequest(BaseModel):
    template_id: str
    template_name: str
    file_type: ImportFileType
    field_mapping: dict[str, str] = Field(min_length=1)
    created_by: str


class ImportFieldMappingTemplateUpdateRequest(BaseModel):
    template_name: str
    field_mapping: dict[str, str] = Field(min_length=1)


class ImportFieldMappingTemplateRecord(BaseModel):
    template_id: str
    template_name: str
    file_type: ImportFileType
    field_mapping: dict[str, str]
    created_by: str
    created_at: str
    is_active: bool


class ImportFieldMappingTemplateListResponse(BaseModel):
    items: list[ImportFieldMappingTemplateRecord]


class ImportBatchApplicationSummary(BaseModel):
    batch_id: str
    file_type: ImportFileType
    application_status: ImportApplicationStatus
    application_target: str
    import_version_id: str | None = None
    applied_record_count: int = Field(ge=0)


class ImportApplyReadinessBlocker(BaseModel):
    code: str
    message: str


class ImportApplyReadinessRowBlocker(BaseModel):
    row_number: int = Field(ge=1)
    code: str
    field_name: str | None = None
    message: str


class ImportApplyReadinessResponse(BaseModel):
    batch_id: str
    file_type: ImportFileType
    readiness_status: ImportReadinessStatus
    blockers: list[ImportApplyReadinessBlocker]
    row_blockers: list[ImportApplyReadinessRowBlocker] = Field(default_factory=list)
    total_rows: int = Field(ge=0)
    success_rows: int = Field(ge=0)
    failed_rows: int = Field(ge=0)
    warning_rows: int = Field(ge=0)
    version_count: int = Field(ge=0)
    application_status: ImportApplicationStatus
    application_target: str
    import_version_id: str | None = None
    applied_record_count: int = Field(ge=0)


class MasterDataReferenceInput(BaseModel):
    reference_id: str
    reference_name: str
    status: MasterDataStatus
    effective_from: str
    effective_to: str
    skill_category: MasterDataSkillCategory | None = None


class MasterDataReferenceRecord(BaseModel):
    reference_id: str
    reference_name: str
    status: MasterDataStatus
    effective_from: str
    effective_to: str
    batch_id: str
    skill_category: MasterDataSkillCategory | None = None


class MasterDataReferenceListResponse(BaseModel):
    items: list[MasterDataReferenceRecord]


class MasterDataOrganizationInput(BaseModel):
    organization_id: str
    organization_name: str
    organization_level: int = Field(ge=1)
    parent_organization_id: str | None = None
    status: MasterDataStatus
    effective_from: str
    effective_to: str


class MasterDataOrganizationRecord(BaseModel):
    organization_id: str
    organization_name: str
    organization_level: int = Field(ge=1)
    parent_organization_id: str | None = None
    status: MasterDataStatus
    effective_from: str
    effective_to: str
    batch_id: str
    organization_path: str


class MasterDataOrganizationMaintenanceRequest(BaseModel):
    action: MasterDataOrganizationMaintenanceAction
    source_batch_id: str
    organization_name: str | None = None
    organization_level: int | None = Field(default=None, ge=1)
    parent_organization_id: str | None = None
    status: MasterDataStatus | None = None
    effective_from: str | None = None
    effective_to: str | None = None


class MasterDataOrganizationMaintenanceResponse(BaseModel):
    organization_id: str
    action_status: MasterDataEmployeeMaintenanceStatus
    organization: MasterDataOrganizationRecord


class MasterDataReferenceMaintenanceRequest(BaseModel):
    action: MasterDataReferenceMaintenanceAction
    source_batch_id: str
    reference_name: str | None = None
    skill_category: MasterDataSkillCategory | None = None
    status: MasterDataStatus | None = None
    effective_from: str | None = None
    effective_to: str | None = None


class MasterDataReferenceMaintenanceResponse(BaseModel):
    reference_type: MasterDataReferenceType
    reference_id: str
    action_status: MasterDataEmployeeMaintenanceStatus
    reference: MasterDataReferenceRecord


class EmployeeMasterDataInput(BaseModel):
    employee_id: str
    employee_name: str
    status: MasterDataStatus
    employee_type: MasterDataEmployeeType = "internal"
    organization_id: str | None = None
    workplace_id: str | None = None
    effective_from: str
    effective_to: str


class MasterDataEmployeeRecord(BaseModel):
    employee_id: str
    employee_name: str
    status: MasterDataStatus
    employee_type: MasterDataEmployeeType = "internal"
    organization_id: str | None = None
    workplace_id: str | None = None
    effective_from: str
    effective_to: str
    batch_id: str
    night_shift_allowed: bool = True
    cross_day_allowed: bool = True
    unavailable_dates: list[str] = Field(default_factory=list)


class MasterDataEmployeeMaintenanceRequest(BaseModel):
    action: MasterDataEmployeeMaintenanceAction
    source_batch_id: str
    employee_name: str | None = None
    status: MasterDataStatus | None = None
    employee_type: MasterDataEmployeeType | None = None
    organization_id: str | None = None
    workplace_id: str | None = None
    effective_from: str | None = None
    effective_to: str | None = None


class MasterDataEmployeeMaintenanceResponse(BaseModel):
    employee_id: str
    action_status: MasterDataEmployeeMaintenanceStatus
    employee: MasterDataEmployeeRecord


class EmployeeBindingInput(BaseModel):
    binding_id: str
    employee_id: str
    supplier_id: str
    workplace_id: str
    project_id: str
    skill_id: str
    effective_from: str
    effective_to: str


class EmployeeSkillInput(BaseModel):
    employee_id: str
    skill_id: str
    effective_from: str
    effective_to: str


class EmployeeSkillRecord(BaseModel):
    employee_id: str
    skill_id: str
    skill_name: str
    skill_category: MasterDataSkillCategory | None = None
    effective_from: str
    effective_to: str
    batch_id: str


class MasterDataEmployeeSkillMaintenanceRequest(BaseModel):
    action: MasterDataEmployeeSkillMaintenanceAction
    source_batch_id: str
    skill_ids: list[str] = Field(min_length=1)
    effective_from: str
    effective_to: str


class MasterDataEmployeeSkillMaintenanceResponse(BaseModel):
    employee_id: str
    action_status: Literal["replaced"]
    skills: list[EmployeeSkillRecord]


class MasterDataEmployeeListRow(MasterDataEmployeeRecord):
    organization_path: str | None = None
    workplace_name: str | None = None
    skills: list[EmployeeSkillRecord] = Field(default_factory=list)


class MasterDataEmployeeListResponse(BaseModel):
    items: list[MasterDataEmployeeListRow]


class MasterDataOrganizationListResponse(BaseModel):
    items: list[MasterDataOrganizationRecord]


class MasterDataSnapshotRequest(BaseModel):
    batch_id: str
    suppliers: list[MasterDataReferenceInput] = Field(default_factory=list)
    workplaces: list[MasterDataReferenceInput] = Field(default_factory=list)
    projects: list[MasterDataReferenceInput] = Field(default_factory=list)
    skills: list[MasterDataReferenceInput] = Field(default_factory=list)
    organizations: list[MasterDataOrganizationInput] = Field(default_factory=list)
    employees: list[EmployeeMasterDataInput] = Field(default_factory=list)
    employee_skills: list[EmployeeSkillInput] = Field(default_factory=list)
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


class MasterDataBindingListResponse(BaseModel):
    items: list[EmployeeBindingRecord]


class MasterDataBindingMaintenanceRequest(BaseModel):
    action: MasterDataBindingMaintenanceAction
    source_batch_id: str
    employee_id: str | None = None
    supplier_id: str | None = None
    workplace_id: str | None = None
    project_id: str | None = None
    skill_id: str | None = None
    effective_from: str | None = None
    effective_to: str | None = None


class MasterDataBindingMaintenanceResponse(BaseModel):
    binding_id: str
    action_status: Literal["created", "updated", "effective_period_updated"]
    binding: EmployeeBindingRecord


class MasterDataWorkplaceServiceTeamInput(BaseModel):
    service_team_id: str
    workplace_id: str
    team_type: MasterDataWorkplaceServiceTeamType
    team_name: str
    organization_id: str | None = None
    supplier_id: str | None = None
    status: MasterDataStatus
    effective_from: str
    effective_to: str


class MasterDataWorkplaceServiceTeamRecord(MasterDataWorkplaceServiceTeamInput):
    batch_id: str


class MasterDataWorkplaceServiceTeamListResponse(BaseModel):
    items: list[MasterDataWorkplaceServiceTeamRecord]


class MasterDataWorkplaceServiceTeamMaintenanceRequest(BaseModel):
    action: MasterDataWorkplaceServiceTeamMaintenanceAction
    source_batch_id: str
    workplace_id: str | None = None
    team_type: MasterDataWorkplaceServiceTeamType | None = None
    team_name: str | None = None
    organization_id: str | None = None
    supplier_id: str | None = None
    status: MasterDataStatus | None = None
    effective_from: str | None = None
    effective_to: str | None = None


class MasterDataWorkplaceServiceTeamMaintenanceResponse(BaseModel):
    service_team_id: str
    action_status: Literal["created", "updated", "frozen"]
    service_team: MasterDataWorkplaceServiceTeamRecord


class MasterDataImportApplyResponse(BaseModel):
    batch_id: str
    applied_status: Literal["applied", "already_applied"]
    suppliers: int = Field(ge=0)
    workplaces: int = Field(ge=0)
    projects: int = Field(ge=0)
    skills: int = Field(ge=0)
    organizations: int = Field(ge=0)
    employees: int = Field(ge=0)
    employee_skills: int = Field(ge=0)
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


class PersonnelScheduleProductionDetail(BaseModel):
    batch: ImportBatchRecord
    version: PersonnelScheduleVersionRecord
    details: list[PersonnelScheduleDetailRecord]
    intervals: list[PersonnelScheduleIntervalRecord]


class PersonnelScheduleImportApplyResponse(BaseModel):
    batch_id: str
    schedule_version_id: str
    applied_status: Literal["applied", "already_applied"]
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


class DemandForecastProductionDetail(BaseModel):
    batch: ImportBatchRecord
    version: ForecastVersionRecord
    intervals: list[ForecastIntervalRecord]
    changes: list[ForecastVersionChangeRecord]


class ForecastImportApplyResponse(BaseModel):
    batch_id: str
    forecast_version_id: str
    applied_status: Literal["applied", "already_applied"]
    intervals: int = Field(ge=0)
    total_required_agents: int = Field(ge=0)
    skipped_rows: int = Field(ge=0)


class ActualLogImportApplyResponse(BaseModel):
    batch_id: str
    file_type: str
    applied_status: Literal["applied", "already_applied"]
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


class ReviewCaseSourceResultRecord(BaseModel):
    source_result_type: ReviewSourceResultType
    result_id: int
    run_id: str
    business_date: str
    interval_start: str
    interval_end: str
    result_status: str
    workplace_id: str | None = None
    project_id: str | None = None
    skill_id: str | None = None
    employee_id: str | None = None
    forecast_version_id: str | None = None
    schedule_version_id: str | None = None
    actual_import_version_id: str | None = None
    forecast_interval_id: str | None = None
    schedule_detail_id: str | None = None
    actual_status_interval_row_id: int | None = None
    forecast_agents: int | None = None
    scheduled_agents: int | None = None
    gap_agents: int | None = None
    scheduled_minutes: int | None = None
    actual_productive_minutes: int | None = None
    late_minutes: int | None = None


class ReviewCaseSourceTraceVersionRecord(BaseModel):
    version_role: Literal["forecast", "schedule", "actual"]
    business_version_id: str
    import_version_id: str | None = None
    import_version_type: ImportFileType | None = None
    batch_id: str | None = None
    file_name: str | None = None
    business_date_from: str | None = None
    business_date_to: str | None = None


class ReviewCaseSourceTraceRecord(BaseModel):
    run: ComparisonRunRecord
    versions: list[ReviewCaseSourceTraceVersionRecord]


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
    source_result: ReviewCaseSourceResultRecord | None = None
    source_trace: ReviewCaseSourceTraceRecord | None = None
    evidence: list[ReviewEvidenceRecord]
    conclusions: list[ReviewConclusionRecord]
    closure: ReviewClosureRecord | None = None


class ReviewCaseListResponse(BaseModel):
    items: list[ReviewCaseRecord]


SchedulePeriodStatus = Literal["draft", "published"]
ShiftActivityType = Literal["work", "rest", "meal", "training"]
RuleCategory = Literal["scheduling", "attendance", "publish"]
RuleScopeType = Literal["global", "dept", "team"]


class SchedulePeriodWeek(BaseModel):
    week_id: str
    label: str
    date_from: str
    date_to: str


class SchedulePeriodRecord(BaseModel):
    period_id: str
    month: str
    status: SchedulePeriodStatus
    date_from: str
    date_to: str
    version: int = Field(ge=0)
    weeks: list[SchedulePeriodWeek] = Field(default_factory=list)


class SchedulePeriodListResponse(BaseModel):
    items: list[SchedulePeriodRecord]


class SchedulePeriodCreateRequest(BaseModel):
    month: str
    source_batch_id: str


class MatrixSegment(BaseModel):
    shift_code: str | None = None
    activity_type: ShiftActivityType = "work"
    start_time: str
    end_time: str
    crosses_day: bool = False
    skill_id: str | None = None
    allocation_ratio: float = Field(default=1.0, ge=0.0)
    # None 表示未配置，计算与发布快照均回退内置默认 1.0
    skill_coefficient: float | None = Field(default=None, ge=0.0)
    activity_coverage: float = Field(default=1.0, ge=0.0)


class ScheduleMatrixCell(BaseModel):
    employee_id: str
    schedule_date: str
    locked: bool = False
    segments: list[MatrixSegment] = Field(default_factory=list)


class ScheduleMatrixResponse(BaseModel):
    period_id: str
    version: int
    date_from: str
    date_to: str
    week: SchedulePeriodWeek | None = None
    employees: list[str] = Field(default_factory=list)
    cells: list[ScheduleMatrixCell] = Field(default_factory=list)
    total: int = Field(ge=0)
    next_cursor: str | None = None


class MatrixCellChange(BaseModel):
    employee_id: str
    schedule_date: str
    segments: list[MatrixSegment] = Field(default_factory=list)


class MatrixCellTarget(BaseModel):
    employee_id: str
    schedule_date: str


class MatrixCopyOperation(BaseModel):
    source_employee_id: str
    source_date: str
    targets: list[MatrixCellTarget] = Field(default_factory=list)


class MatrixLockOperation(BaseModel):
    employee_id: str
    schedule_date: str
    locked: bool = True


class ScheduleMatrixBatchUpdateRequest(BaseModel):
    base_version: int = Field(ge=0)
    changes: list[MatrixCellChange] = Field(default_factory=list)
    copies: list[MatrixCopyOperation] = Field(default_factory=list)
    clears: list[MatrixCellTarget] = Field(default_factory=list)
    locks: list[MatrixLockOperation] = Field(default_factory=list)


class ScheduleMatrixConflict(BaseModel):
    employee_id: str
    schedule_date: str
    reason: str


class CoverageDeltaRow(BaseModel):
    date: str
    interval_start: str
    planned_headcount: float
    gap: float
    coverage_rate: float | None = None


class ScheduleMatrixBatchUpdateResponse(BaseModel):
    version: int
    accepted: int = Field(ge=0)
    conflicts: list[ScheduleMatrixConflict] = Field(default_factory=list)
    coverage_delta: list[CoverageDeltaRow] = Field(default_factory=list)


class CoverageRecalculateRequest(BaseModel):
    date_from: str
    date_to: str


class CoverageIntervalRow(BaseModel):
    date: str
    interval_start: str
    demand_headcount: float
    planned_headcount: float
    gap: float
    coverage_rate: float | None = None
    # 一期标准人力口径字段预留：数值先与物理人数口径保持一致
    std_demand_headcount: float
    std_planned_headcount: float
    std_gap: float
    std_coverage_rate: float | None = None


class CoverageRecalculateResponse(BaseModel):
    period_id: str
    date_from: str
    date_to: str
    intervals: list[CoverageIntervalRow] = Field(default_factory=list)


class ScheduleValidateRequest(BaseModel):
    org_scope: str = "*"
    date_from: str
    date_to: str


class ScheduleValidationIssue(BaseModel):
    employee_id: str
    schedule_date: str
    segment_index: int | None = None
    rule_code: str
    message: str


class ScheduleValidateResponse(BaseModel):
    errors: list[ScheduleValidationIssue] = Field(default_factory=list)
    warnings: list[ScheduleValidationIssue] = Field(default_factory=list)


class SchedulePublishRequest(BaseModel):
    org_scope: str = "*"
    date_from: str
    date_to: str
    note: str | None = None


class SchedulePublishResponse(BaseModel):
    publication_id: str
    version_id: str
    published_at: str


class SkillCoefficientSnapshotRecord(BaseModel):
    employee_id: str
    skill_id: str
    coefficient: float
    default_source: str


class SchedulePeriodVersionRecord(BaseModel):
    version_id: str
    publication_id: str
    published_at: str
    org_scope: str
    date_from: str
    date_to: str
    note: str | None = None
    cell_count: int = Field(ge=0)


class SchedulePeriodVersionListResponse(BaseModel):
    items: list[SchedulePeriodVersionRecord] = Field(default_factory=list)


class ScheduleVersionCellDiff(BaseModel):
    employee_id: str
    schedule_date: str
    before: list[MatrixSegment] | None = None
    after: list[MatrixSegment] | None = None


class ScheduleVersionDiffResponse(BaseModel):
    version_id: str
    compared_from_version_id: str | None = None
    changed_cells: list[ScheduleVersionCellDiff] = Field(default_factory=list)


class ShiftActivitySegment(BaseModel):
    activity_type: ShiftActivityType
    start_time: str
    end_time: str


class ShiftDefinitionCreateRequest(BaseModel):
    shift_code: str
    shift_name: str
    effective_from: str
    effective_to: str
    segments: list[ShiftActivitySegment] = Field(default_factory=list)
    is_cross_day: bool = False
    # 夜班归属开始上班日期（CORN WFM V2.0 13.2）
    night_attribution: Literal["start_date"] = "start_date"


class ShiftDefinitionRecord(BaseModel):
    shift_definition_id: str
    shift_code: str
    version_number: int = Field(ge=1)
    shift_name: str
    effective_from: str
    effective_to: str
    segments: list[ShiftActivitySegment] = Field(default_factory=list)
    is_cross_day: bool
    night_attribution: str = "start_date"
    status: Literal["active", "archived"] = "active"
    created_at: str


class ShiftDefinitionListResponse(BaseModel):
    items: list[ShiftDefinitionRecord] = Field(default_factory=list)


class RuleConfigRecord(BaseModel):
    rule_id: str
    category: RuleCategory
    scope_type: RuleScopeType
    scope_id: str | None = None
    fields: dict[str, float | bool | str] = Field(default_factory=dict)
    effective_from: str
    effective_to: str
    default_source: str
    updated_at: str


class RuleConfigListResponse(BaseModel):
    category: RuleCategory
    items: list[RuleConfigRecord] = Field(default_factory=list)


class RuleConfigPutRequest(BaseModel):
    scope_type: RuleScopeType = "global"
    scope_id: str | None = None
    fields: dict[str, float | bool | str] = Field(default_factory=dict)
    effective_from: str = "1970-01-01"
    effective_to: str = "9999-12-31"


class StatusMappingRecord(BaseModel):
    status: str
    sub_status: str
    status_cd: str
    activity_code: str
    activity_name: str
    counts_attendance: bool = False
    counts_valid_hours: bool = False
    counts_production_hours: bool = False
    counts_coverage: bool = False
    counts_rest: bool = False
    counts_punctuality: bool = False


class StatusMappingListResponse(BaseModel):
    items: list[StatusMappingRecord] = Field(default_factory=list)


class StatusMappingPutRequest(BaseModel):
    items: list[StatusMappingRecord] = Field(default_factory=list)


class EmployeeRestrictionsUpdateRequest(BaseModel):
    night_shift_allowed: bool | None = None
    cross_day_allowed: bool | None = None
    unavailable_dates: list[str] | None = None


class EmployeeRestrictionsRecord(BaseModel):
    employee_id: str
    night_shift_allowed: bool
    cross_day_allowed: bool
    unavailable_dates: list[str] = Field(default_factory=list)
