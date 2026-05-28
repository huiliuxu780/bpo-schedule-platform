import json

from fastapi import Body, FastAPI, HTTPException, Query

from backend.app.import_upload import build_import_batch_from_csv
from backend.app.import_persistence import get_import_persistence_repository
from backend.app.master_data_import import apply_master_data_import_batch
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.personnel_schedule_import import apply_personnel_schedule_import_batch
from backend.app.personnel_schedule_persistence import PersonnelSchedulePersistenceRepository
from backend.app.models import (
    DemandPlanListResponse,
    ImportBatchCreateRequest,
    ImportFileType,
    ImportBatchPersistenceDetail,
    MasterDataImportApplyResponse,
    PersonnelScheduleImportApplyResponse,
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


@app.post("/api/v1/import-batches/upload-csv", response_model=ImportBatchPersistenceDetail)
def upload_import_batch_csv(
    batch_id: str,
    file_name: str,
    file_type: ImportFileType,
    uploaded_by: str,
    business_date_from: str,
    business_date_to: str,
    field_mapping: str = Query(
        default='{"source_key":"source_key"}',
        description="JSON object mapping CSV source columns to standard fields.",
    ),
    version_id: str | None = None,
    csv_body: str = Body(media_type="text/csv"),
) -> ImportBatchPersistenceDetail:
    try:
        parsed_mapping = json.loads(field_mapping)
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

    try:
        request = build_import_batch_from_csv(
            batch_id=batch_id,
            file_name=file_name,
            file_type=file_type,
            uploaded_by=uploaded_by,
            business_date_from=business_date_from,
            business_date_to=business_date_to,
            csv_text=csv_body,
            field_mapping={str(key): str(value) for key, value in parsed_mapping.items()},
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
