import json

from fastapi import Body, FastAPI, HTTPException, Query

from backend.app.actual_log_import import apply_actual_log_import_batch
from backend.app.actual_log_persistence import ActualLogPersistenceRepository
from backend.app.comparison_calculation import calculate_comparison_run
from backend.app.comparison_persistence import ComparisonPersistenceRepository
from backend.app.forecast_import import apply_forecast_import_batch
from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.import_application_summary import build_import_application_summary
from backend.app.import_mapping_persistence import (
    get_import_mapping_persistence_repository,
)
from backend.app.import_upload import build_import_batch_from_csv
from backend.app.import_persistence import get_import_persistence_repository
from backend.app.master_data_import import apply_master_data_import_batch
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.personnel_schedule_import import apply_personnel_schedule_import_batch
from backend.app.personnel_schedule_persistence import PersonnelSchedulePersistenceRepository
from backend.app.review_closure import write_review_closure
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.app.models import (
    ActualLogImportApplyResponse,
    ComparisonCalculationRequest,
    ComparisonRunDetail,
    ComparisonRunListResponse,
    ComparisonRunStatus,
    ComparisonType,
    DemandPlanListResponse,
    ForecastImportApplyResponse,
    ImportBatchApplicationSummary,
    ImportBatchCreateRequest,
    ImportFileType,
    ImportApplicationStatus,
    ImportBatchListResponse,
    ImportBatchListRow,
    ImportBatchPersistenceDetail,
    ImportBatchRowCorrectionRequest,
    ImportFieldMappingTemplateCreateRequest,
    ImportFieldMappingTemplateListResponse,
    ImportFieldMappingTemplateRecord,
    ImportProcessingStatus,
    MasterDataImportApplyResponse,
    PersonnelScheduleImportApplyResponse,
    ReviewCaseDetail,
    ReviewCaseListResponse,
    ReviewClosureWriteRequest,
    ReviewSourceResultType,
    ScheduleRiskListResponse,
    SchedulePlanDetail,
    SchedulePlanDraftRequest,
    SchedulePlanListResponse,
    SchedulePlanStatus,
    ShiftDetailListResponse,
    UnavailabilityListResponse,
    UnavailabilityStatus,
)
from backend.app.repository import (
    create_plan_draft,
    find_plan_detail,
    list_demand_plan_rows,
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


@app.post("/api/v1/import-batches/persisted", response_model=ImportBatchPersistenceDetail)
def create_persisted_import_batch(
    request: ImportBatchCreateRequest,
) -> ImportBatchPersistenceDetail:
    try:
        return get_import_persistence_repository().create_import_batch(request)
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "IMPORT_BATCH_ALREADY_EXISTS",
                    "message": str(exc),
                }
            },
        ) from exc


@app.get("/api/v1/import-batches", response_model=ImportBatchListResponse)
def list_import_batches(
    file_type: ImportFileType | None = None,
    processing_status: ImportProcessingStatus | None = None,
    uploaded_by: str | None = None,
    application_status: ImportApplicationStatus | None = None,
) -> ImportBatchListResponse:
    import_repository = get_import_persistence_repository()
    details = import_repository.list_import_batches(
        file_type=file_type,
        processing_status=processing_status,
        uploaded_by=uploaded_by,
    )
    master_data_repository = MasterDataPersistenceRepository()
    schedule_repository = PersonnelSchedulePersistenceRepository()
    forecast_repository = ForecastPersistenceRepository()
    actual_repository = ActualLogPersistenceRepository()

    rows: list[ImportBatchListRow] = []
    for detail in details:
        summary = build_import_application_summary(
            detail,
            master_data_repository=master_data_repository,
            schedule_repository=schedule_repository,
            forecast_repository=forecast_repository,
            actual_repository=actual_repository,
        )
        if (
            application_status is not None
            and summary.application_status != application_status
        ):
            continue
        batch = detail.batch
        rows.append(
            ImportBatchListRow(
                batch_id=batch.batch_id,
                file_name=batch.file_name,
                file_type=batch.file_type,
                uploaded_by=batch.uploaded_by,
                uploaded_at=batch.uploaded_at,
                business_date_from=batch.business_date_from,
                business_date_to=batch.business_date_to,
                processing_status=batch.processing_status,
                total_rows=batch.total_rows,
                success_rows=batch.success_rows,
                failed_rows=batch.failed_rows,
                warning_rows=batch.warning_rows,
                version_count=len(detail.versions),
                application_status=summary.application_status,
                application_target=summary.application_target,
                import_version_id=summary.import_version_id,
                applied_record_count=summary.applied_record_count,
            )
        )
    return ImportBatchListResponse(items=rows)


@app.get(
    "/api/v1/import-batches/persisted/{batch_id}",
    response_model=ImportBatchPersistenceDetail,
)
def get_persisted_import_batch(batch_id: str) -> ImportBatchPersistenceDetail:
    batch = get_import_persistence_repository().get_import_batch(batch_id)
    if batch is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "IMPORT_BATCH_NOT_FOUND",
                    "message": "导入批次不存在",
                }
            },
        )
    return batch


@app.post(
    "/api/v1/import-batches/{batch_id}/rows/{row_number}/correct",
    response_model=ImportBatchPersistenceDetail,
)
def correct_import_batch_failed_row(
    batch_id: str,
    row_number: int,
    request: ImportBatchRowCorrectionRequest,
) -> ImportBatchPersistenceDetail:
    try:
        return get_import_persistence_repository().correct_failed_row(
            batch_id,
            ImportBatchRowCorrectionRequest(
                row_number=row_number,
                standard_fields=request.standard_fields,
            ),
        )
    except ValueError as exc:
        message = str(exc)
        if "batch does not exist" in message:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {
                        "code": "IMPORT_BATCH_NOT_FOUND",
                        "message": "导入批次不存在",
                    }
                },
            ) from exc
        if "row does not exist" in message:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {
                        "code": "IMPORT_ROW_NOT_FOUND",
                        "message": "导入行不存在",
                    }
                },
            ) from exc
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "IMPORT_ROW_CORRECTION_INVALID",
                    "message": message,
                }
            },
        ) from exc


@app.get(
    "/api/v1/import-batches/{batch_id}/application-summary",
    response_model=ImportBatchApplicationSummary,
)
def get_import_application_summary(batch_id: str) -> ImportBatchApplicationSummary:
    batch = get_import_persistence_repository().get_import_batch(batch_id)
    if batch is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "IMPORT_BATCH_NOT_FOUND",
                    "message": "导入批次不存在",
                }
            },
        )

    return build_import_application_summary(
        batch,
        master_data_repository=MasterDataPersistenceRepository(),
        schedule_repository=PersonnelSchedulePersistenceRepository(),
        forecast_repository=ForecastPersistenceRepository(),
        actual_repository=ActualLogPersistenceRepository(),
    )


@app.post(
    "/api/v1/import-field-mapping-templates",
    response_model=ImportFieldMappingTemplateRecord,
)
def create_import_field_mapping_template(
    request: ImportFieldMappingTemplateCreateRequest,
) -> ImportFieldMappingTemplateRecord:
    try:
        return get_import_mapping_persistence_repository().create_field_mapping_template(
            request
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "IMPORT_FIELD_MAPPING_TEMPLATE_ALREADY_EXISTS",
                    "message": str(exc),
                }
            },
        ) from exc


@app.get(
    "/api/v1/import-field-mapping-templates",
    response_model=ImportFieldMappingTemplateListResponse,
)
def list_import_field_mapping_templates(
    file_type: ImportFileType | None = None,
) -> ImportFieldMappingTemplateListResponse:
    return ImportFieldMappingTemplateListResponse(
        items=get_import_mapping_persistence_repository().list_field_mapping_templates(
            file_type=file_type
        )
    )


@app.get(
    "/api/v1/import-field-mapping-templates/{template_id}",
    response_model=ImportFieldMappingTemplateRecord,
)
def get_import_field_mapping_template(
    template_id: str,
) -> ImportFieldMappingTemplateRecord:
    template = get_import_mapping_persistence_repository().get_field_mapping_template(
        template_id
    )
    if template is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "IMPORT_FIELD_MAPPING_TEMPLATE_NOT_FOUND",
                    "message": "字段映射模板不存在",
                }
            },
        )
    return template


@app.post("/api/v1/import-batches/upload-csv", response_model=ImportBatchPersistenceDetail)
def upload_import_batch_csv(
    batch_id: str,
    file_name: str,
    file_type: ImportFileType,
    uploaded_by: str,
    business_date_from: str,
    business_date_to: str,
    field_mapping: str | None = Query(
        default='{"source_key":"source_key"}',
        description="JSON object mapping CSV source columns to standard fields.",
    ),
    version_id: str | None = None,
    template_id: str | None = None,
    csv_body: str = Body(media_type="text/csv"),
) -> ImportBatchPersistenceDetail:
    parsed_mapping = _resolve_upload_field_mapping(
        field_mapping=field_mapping,
        template_id=template_id,
        file_type=file_type,
    )

    try:
        request = build_import_batch_from_csv(
            batch_id=batch_id,
            file_name=file_name,
            file_type=file_type,
            uploaded_by=uploaded_by,
            business_date_from=business_date_from,
            business_date_to=business_date_to,
            csv_text=csv_body,
            field_mapping=parsed_mapping,
            version_id=version_id,
        )
        return get_import_persistence_repository().create_import_batch(request)
    except ValueError as exc:
        message = str(exc)
        code = (
            "IMPORT_BATCH_ALREADY_EXISTS"
            if "already exists" in message
            else "IMPORT_CSV_UPLOAD_INVALID"
        )
        raise HTTPException(
            status_code=409 if code == "IMPORT_BATCH_ALREADY_EXISTS" else 400,
            detail={
                "error": {
                    "code": code,
                    "message": message,
                }
            },
        ) from exc


def _resolve_upload_field_mapping(
    *,
    field_mapping: str | None,
    template_id: str | None,
    file_type: ImportFileType,
) -> dict[str, str]:
    if template_id is not None:
        template = (
            get_import_mapping_persistence_repository().get_field_mapping_template(
                template_id
            )
        )
        if template is None:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {
                        "code": "IMPORT_FIELD_MAPPING_TEMPLATE_NOT_FOUND",
                        "message": "字段映射模板不存在",
                    }
                },
            )
        if template.file_type != file_type:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": {
                        "code": "IMPORT_FIELD_MAPPING_TEMPLATE_FILE_TYPE_MISMATCH",
                        "message": "字段映射模板类型与导入文件类型不一致",
                    }
                },
            )
        return dict(template.field_mapping)

    try:
        parsed_mapping = json.loads(field_mapping or "{}")
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "IMPORT_FIELD_MAPPING_INVALID",
                    "message": "字段映射必须是 JSON object",
                }
            },
        ) from exc

    if not isinstance(parsed_mapping, dict):
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "IMPORT_FIELD_MAPPING_INVALID",
                    "message": "字段映射必须是 JSON object",
                }
            },
        )
    return {str(key): str(value) for key, value in parsed_mapping.items()}


@app.post(
    "/api/v1/import-batches/{batch_id}/apply-master-data",
    response_model=MasterDataImportApplyResponse,
)
def apply_master_data_import(batch_id: str) -> MasterDataImportApplyResponse:
    batch = get_import_persistence_repository().get_import_batch(batch_id)
    if batch is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "IMPORT_BATCH_NOT_FOUND",
                    "message": "导入批次不存在",
                }
            },
        )

    try:
        summary = apply_master_data_import_batch(
            batch,
            MasterDataPersistenceRepository(),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "MASTER_DATA_IMPORT_INVALID",
                    "message": str(exc),
                }
            },
        ) from exc

    return MasterDataImportApplyResponse(**summary)


@app.post(
    "/api/v1/import-batches/{batch_id}/apply-personnel-schedule",
    response_model=PersonnelScheduleImportApplyResponse,
)
def apply_personnel_schedule_import(batch_id: str) -> PersonnelScheduleImportApplyResponse:
    batch = get_import_persistence_repository().get_import_batch(batch_id)
    if batch is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "IMPORT_BATCH_NOT_FOUND",
                    "message": "导入批次不存在",
                }
            },
        )

    try:
        summary = apply_personnel_schedule_import_batch(
            batch,
            PersonnelSchedulePersistenceRepository(),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "PERSONNEL_SCHEDULE_IMPORT_INVALID",
                    "message": str(exc),
                }
            },
        ) from exc

    return PersonnelScheduleImportApplyResponse(**summary)


@app.post(
    "/api/v1/import-batches/{batch_id}/apply-forecast",
    response_model=ForecastImportApplyResponse,
)
def apply_forecast_import(
    batch_id: str,
    compared_from_version_id: str | None = None,
    change_reason: str | None = None,
) -> ForecastImportApplyResponse:
    batch = get_import_persistence_repository().get_import_batch(batch_id)
    if batch is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "IMPORT_BATCH_NOT_FOUND",
                    "message": "导入批次不存在",
                }
            },
        )

    try:
        summary = apply_forecast_import_batch(
            batch,
            ForecastPersistenceRepository(),
            compared_from_version_id=compared_from_version_id,
            change_reason=change_reason,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "FORECAST_IMPORT_INVALID",
                    "message": str(exc),
                }
            },
        ) from exc

    return ForecastImportApplyResponse(**summary)


@app.post(
    "/api/v1/import-batches/{batch_id}/apply-actual-logs",
    response_model=ActualLogImportApplyResponse,
)
def apply_actual_log_import(batch_id: str) -> ActualLogImportApplyResponse:
    batch = get_import_persistence_repository().get_import_batch(batch_id)
    if batch is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "IMPORT_BATCH_NOT_FOUND",
                    "message": "导入批次不存在",
                }
            },
        )

    try:
        summary = apply_actual_log_import_batch(
            batch,
            ActualLogPersistenceRepository(),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "ACTUAL_LOG_IMPORT_INVALID",
                    "message": str(exc),
                }
            },
        ) from exc

    return ActualLogImportApplyResponse(**summary)


@app.post(
    "/api/v1/comparison-runs/calculate",
    response_model=ComparisonRunDetail,
)
def calculate_comparison_run_api(
    request: ComparisonCalculationRequest,
) -> ComparisonRunDetail:
    comparison_repository = ComparisonPersistenceRepository()
    existing = comparison_repository.get_comparison_run(request.run_id)
    if existing is not None:
        return existing

    try:
        return calculate_comparison_run(
            request,
            comparison_repository=comparison_repository,
            forecast_repository=ForecastPersistenceRepository(),
            schedule_repository=PersonnelSchedulePersistenceRepository(),
            actual_repository=ActualLogPersistenceRepository(),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "COMPARISON_CALCULATION_INVALID",
                    "message": str(exc),
                }
            },
        ) from exc


@app.get(
    "/api/v1/comparison-runs",
    response_model=ComparisonRunListResponse,
)
def list_comparison_runs_api(
    comparison_type: ComparisonType | None = None,
    status: ComparisonRunStatus | None = None,
    business_date: str | None = None,
) -> ComparisonRunListResponse:
    return ComparisonRunListResponse(
        items=ComparisonPersistenceRepository().list_comparison_runs(
            comparison_type=comparison_type,
            status=status,
            business_date=business_date,
        )
    )


@app.get(
    "/api/v1/comparison-runs/{run_id}",
    response_model=ComparisonRunDetail,
)
def get_comparison_run_api(run_id: str) -> ComparisonRunDetail:
    detail = ComparisonPersistenceRepository().get_comparison_run(run_id)
    if detail is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "COMPARISON_RUN_NOT_FOUND",
                    "message": "对比计算结果不存在",
                }
            },
        )
    return detail


@app.post(
    "/api/v1/review-cases/write-closure",
    response_model=ReviewCaseDetail,
)
def write_review_closure_api(
    request: ReviewClosureWriteRequest,
) -> ReviewCaseDetail:
    try:
        return write_review_closure(request, ReviewPersistenceRepository())
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "REVIEW_CLOSURE_INVALID",
                    "message": str(exc),
                }
            },
        ) from exc


@app.get(
    "/api/v1/review-cases",
    response_model=ReviewCaseListResponse,
)
def list_review_cases_api(
    business_date: str | None = None,
    owner_id: str | None = None,
    status: str | None = None,
    severity: str | None = None,
    source_result_type: ReviewSourceResultType | None = None,
) -> ReviewCaseListResponse:
    return ReviewCaseListResponse(
        items=ReviewPersistenceRepository().list_review_cases(
            business_date=business_date,
            owner_id=owner_id,
            status=status,
            severity=severity,
            source_result_type=source_result_type,
        )
    )


@app.get(
    "/api/v1/review-cases/{case_id}",
    response_model=ReviewCaseDetail,
)
def get_review_case_api(case_id: str) -> ReviewCaseDetail:
    detail = ReviewPersistenceRepository().get_review_case(case_id)
    if detail is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "REVIEW_CASE_NOT_FOUND",
                    "message": "复核记录不存在",
                }
            },
        )
    return detail


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
