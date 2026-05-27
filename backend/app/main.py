from fastapi import FastAPI, HTTPException

from backend.app.models import (
    CsvImportPreviewRequest,
    CsvImportPreviewResponse,
    DemandPlanListResponse,
    DemandForecastCsvImportRequest,
    FulfillmentComparisonContractResponse,
    ImportBatchListResponse,
    ImportBatchResult,
    LoginLogCsvImportRequest,
    MasterDataCsvImportRequest,
    MasterDataImportedRecordListResponse,
    MasterDataImportContractResponse,
    PersonnelScheduleCsvImportRequest,
    PersonnelScheduleImportContractResponse,
    ScheduleRiskListResponse,
    SchedulePlanDetail,
    SchedulePlanDraftRequest,
    SchedulePlanListResponse,
    SchedulePlanStatus,
    ShiftDetailListResponse,
    StatusLogCsvImportRequest,
    UnavailabilityListResponse,
    UnavailabilityStatus,
)
from backend.app.repository import (
    create_plan_draft,
    get_fulfillment_comparison_contract,
    get_import_batch_result as find_import_batch_result,
    get_master_data_import_contract,
    get_personnel_schedule_import_contract,
    find_plan_detail,
    import_demand_forecast_csv as create_demand_forecast_import_batch,
    import_login_log_csv as create_login_log_import_batch,
    import_master_data_csv as create_master_data_import_batch,
    import_personnel_schedule_csv as create_personnel_schedule_import_batch,
    preview_csv_import as create_csv_import_preview,
    import_status_log_csv as create_status_log_import_batch,
    list_demand_plan_rows,
    list_master_data_imported_records as find_master_data_imported_records,
    list_process_import_batches,
    list_schedule_risk_rows,
    list_shift_detail_rows,
    list_plan_summaries,
    list_unavailability_rows,
    update_plan_draft,
)

app = FastAPI(
    title="BPO Schedule Platform API",
    version="0.1.0",
    description="Read-only MVP API for BPO WFM schedule plans.",
)


@app.get("/api/v1/schedule-plans", response_model=SchedulePlanListResponse)
def list_schedule_plans(
    status: SchedulePlanStatus | None = None,
    query: str | None = None,
) -> SchedulePlanListResponse:
    return SchedulePlanListResponse(
        items=list_plan_summaries(status=status, query=query)
    )


@app.get("/api/v1/demand-plans", response_model=DemandPlanListResponse)
def list_demand_plans(query: str | None = None) -> DemandPlanListResponse:
    return DemandPlanListResponse(items=list_demand_plan_rows(query=query))


@app.post("/api/v1/import-batches/master-data", response_model=ImportBatchResult)
def import_master_data_csv(request: MasterDataCsvImportRequest) -> ImportBatchResult:
    return create_master_data_import_batch(request)


@app.post("/api/v1/import-batches/demand-forecast", response_model=ImportBatchResult)
def import_demand_forecast_csv(
    request: DemandForecastCsvImportRequest,
) -> ImportBatchResult:
    return create_demand_forecast_import_batch(request)


@app.post("/api/v1/import-batches/personnel-schedule", response_model=ImportBatchResult)
def import_personnel_schedule_csv(
    request: PersonnelScheduleCsvImportRequest,
) -> ImportBatchResult:
    return create_personnel_schedule_import_batch(request)


@app.post("/api/v1/import-batches/login-log", response_model=ImportBatchResult)
def import_login_log_csv(request: LoginLogCsvImportRequest) -> ImportBatchResult:
    return create_login_log_import_batch(request)


@app.post("/api/v1/import-batches/status-log", response_model=ImportBatchResult)
def import_status_log_csv(request: StatusLogCsvImportRequest) -> ImportBatchResult:
    return create_status_log_import_batch(request)


@app.post("/api/v1/import-batches/preview", response_model=CsvImportPreviewResponse)
def preview_csv_import(request: CsvImportPreviewRequest) -> CsvImportPreviewResponse:
    return create_csv_import_preview(request)


@app.get("/api/v1/import-batches", response_model=ImportBatchListResponse)
def list_import_batches() -> ImportBatchListResponse:
    return ImportBatchListResponse(items=list_process_import_batches())


@app.get(
    "/api/v1/master-data/imported-records",
    response_model=MasterDataImportedRecordListResponse,
)
def list_imported_master_data_records() -> MasterDataImportedRecordListResponse:
    return MasterDataImportedRecordListResponse(
        items=find_master_data_imported_records()
    )


@app.get("/api/v1/import-batches/{batch_id}", response_model=ImportBatchResult)
def get_import_batch_result(batch_id: str) -> ImportBatchResult:
    result = find_import_batch_result(batch_id)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "IMPORT_BATCH_NOT_FOUND",
                    "message": "导入批次不存在",
                }
            },
        )
    return result


@app.get(
    "/api/v1/master-data/import-contract",
    response_model=MasterDataImportContractResponse,
)
def list_master_data_import_contract() -> MasterDataImportContractResponse:
    return get_master_data_import_contract()


@app.get(
    "/api/v1/personnel-schedules/import-contract",
    response_model=PersonnelScheduleImportContractResponse,
)
def list_personnel_schedule_import_contract() -> PersonnelScheduleImportContractResponse:
    return get_personnel_schedule_import_contract()


@app.get(
    "/api/v1/fulfillment-comparison/contract",
    response_model=FulfillmentComparisonContractResponse,
)
def list_fulfillment_comparison_contract() -> FulfillmentComparisonContractResponse:
    return get_fulfillment_comparison_contract()


@app.get("/api/v1/shift-details", response_model=ShiftDetailListResponse)
def list_shift_details(
    status: SchedulePlanStatus | None = None,
    query: str | None = None,
) -> ShiftDetailListResponse:
    return ShiftDetailListResponse(
        items=list_shift_detail_rows(status=status, query=query)
    )


@app.get("/api/v1/schedule-risks", response_model=ScheduleRiskListResponse)
def list_schedule_risks(query: str | None = None) -> ScheduleRiskListResponse:
    return ScheduleRiskListResponse(items=list_schedule_risk_rows(query=query))


@app.get("/api/v1/unavailability", response_model=UnavailabilityListResponse)
def list_unavailability(
    status: UnavailabilityStatus | None = None,
    query: str | None = None,
) -> UnavailabilityListResponse:
    return UnavailabilityListResponse(
        items=list_unavailability_rows(status=status, query=query)
    )


@app.get("/api/v1/schedule-plans/{plan_id}", response_model=SchedulePlanDetail)
def get_schedule_plan(plan_id: str) -> SchedulePlanDetail:
    plan = find_plan_detail(plan_id)
    if plan is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "SCHEDULE_PLAN_NOT_FOUND",
                    "message": "排班计划不存在",
                }
            },
        )
    return plan


@app.post("/api/v1/schedule-plans/drafts", response_model=SchedulePlanDetail)
def create_schedule_plan_draft(
    request: SchedulePlanDraftRequest,
) -> SchedulePlanDetail:
    return create_plan_draft(request)


@app.put("/api/v1/schedule-plans/{plan_id}/draft", response_model=SchedulePlanDetail)
def update_schedule_plan_draft(
    plan_id: str,
    request: SchedulePlanDraftRequest,
) -> SchedulePlanDetail:
    existing = find_plan_detail(plan_id)
    if existing is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "SCHEDULE_PLAN_NOT_FOUND",
                    "message": "排班计划不存在",
                }
            },
        )

    updated = update_plan_draft(plan_id, request)
    if updated is None:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "SCHEDULE_PLAN_NOT_EDITABLE",
                    "message": "只有草稿排班计划允许更新",
                }
            },
        )

    return updated
