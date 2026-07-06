import json
from dataclasses import replace
from threading import Lock
from typing import Any

from fastapi import Body, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

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
from backend.app.import_persistence import database_url_from_env
from backend.app.import_readiness import build_import_apply_readiness
from backend.app.import_upload import build_import_batch_from_csv
from backend.app.import_persistence import get_import_persistence_repository
from backend.app.master_data_import import apply_master_data_import_batch
from backend.app.master_data_maintenance import (
    maintain_employee,
    maintain_employee_binding,
    maintain_employee_skills,
    maintain_organization,
    maintain_reference,
    maintain_workplace_service_team,
)
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.personnel_schedule_import import apply_personnel_schedule_import_batch
from backend.app.personnel_schedule_persistence import PersonnelSchedulePersistenceRepository
from backend.app.review_closure import write_review_closure
from backend.app.review_conclusion import write_review_conclusion
from backend.app.review_evidence import write_review_evidence
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.app.roster_drafts import (
    AssignmentKind,
    EmployeeRosterSnapshot,
    RosterAssignment,
    RosterValidationContext,
    RosterVersion,
    RosterVersionStatus,
)
from backend.app.roster_persistence import (
    RosterPersistenceRepository,
    RosterVersionDetail,
)
from backend.app.roster_service import RosterService
from backend.app.models import (
    ActualLogImportApplyResponse,
    ComparisonCalculationRequest,
    ComparisonRunDetail,
    ComparisonRunListResponse,
    ComparisonRunStatus,
    ComparisonType,
    DemandForecastProductionDetail,
    DemandPlanListResponse,
    ForecastImportApplyResponse,
    ImportBatchApplicationSummary,
    ImportBatchCreateRequest,
    ImportFileType,
    ImportApplicationStatus,
    ImportApplyReadinessResponse,
    ImportBatchListResponse,
    ImportBatchListRow,
    ImportBatchPersistenceDetail,
    ImportBatchRowCorrectionRequest,
    ImportFieldMappingTemplateCreateRequest,
    ImportFieldMappingTemplateListResponse,
    ImportFieldMappingTemplateRecord,
    ImportFieldMappingTemplateUpdateRequest,
    ImportProcessingStatus,
    MasterDataBindingListResponse,
    MasterDataBindingMaintenanceRequest,
    MasterDataBindingMaintenanceResponse,
    MasterDataEmployeeListResponse,
    MasterDataEmployeeSkillMaintenanceRequest,
    MasterDataEmployeeSkillMaintenanceResponse,
    MasterDataEmployeeMaintenanceRequest,
    MasterDataEmployeeMaintenanceResponse,
    MasterDataImportApplyResponse,
    MasterDataOrganizationListResponse,
    MasterDataOrganizationMaintenanceRequest,
    MasterDataOrganizationMaintenanceResponse,
    MasterDataReferenceListResponse,
    MasterDataReferenceMaintenanceRequest,
    MasterDataReferenceMaintenanceResponse,
    MasterDataReferenceType,
    MasterDataWorkplaceServiceTeamListResponse,
    MasterDataWorkplaceServiceTeamMaintenanceRequest,
    MasterDataWorkplaceServiceTeamMaintenanceResponse,
    PersonnelScheduleImportApplyResponse,
    PersonnelScheduleProductionDetail,
    ReviewCaseDetail,
    ReviewCaseListResponse,
    ReviewClosureWriteRequest,
    ReviewConclusionInput,
    ReviewEvidenceInput,
    ReviewSourceResultType,
    ScheduleRiskListResponse,
    ScheduleRiskRow,
    SchedulePlanDetail,
    SchedulePlanDraftRequest,
    SchedulePlanListResponse,
    SchedulePlanStatus,
    ShiftDetailListResponse,
    UnavailabilityListResponse,
    UnavailabilityRow,
    UnavailabilityStatus,
)
from backend.app.repository import (
    create_plan_draft,
    find_plan_detail,
    find_schedule_risk,
    list_demand_plan_rows,
    list_schedule_risk_rows,
    list_shift_detail_rows,
    list_plan_summaries,
    list_unavailability_rows,
    resolve_unavailability,
    transition_plan_status,
    transition_schedule_risk_status,
    update_plan_draft,
)

app = FastAPI(
    title="BPO Schedule Platform API",
    version="0.1.0",
    description="Local API for BPO WFM schedule plans.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:3005",
    ],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["content-type"],
)

_roster_service_lock = Lock()
_roster_services_by_database_url: dict[str, RosterService] = {}


def _get_roster_service() -> RosterService:
    database_url = database_url_from_env()
    with _roster_service_lock:
        service = _roster_services_by_database_url.get(database_url)
        if service is None:
            repository = RosterPersistenceRepository(database_url)
            repository.init_schema()
            service = RosterService(repository)
            _roster_services_by_database_url[database_url] = service
        return service


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


@app.get("/api/v1/roster-drafts/current-published")
def get_current_roster_published_snapshot(
    business_month: str,
    project_id: str | None = None,
    workplace_id: str | None = None,
    team_id: str | None = None,
) -> dict[str, Any]:
    service = _get_roster_service()
    detail = service.get_current_published(
        business_month=business_month,
        project_id=project_id,
        workplace_id=workplace_id,
        team_id=team_id,
    )
    if detail is None:
        return {
            "status": "missing",
            "published": None,
            "snapshot": None,
            "cells": [],
        }
    return _roster_detail_response(detail)


@app.post("/api/v1/roster-drafts/publish")
def publish_roster_draft(request: dict[str, Any] = Body(...)) -> dict[str, Any]:
    service = _get_roster_service()
    version_id = str(request["version_id"])
    actor_id = str(request.get("actor_id") or "scheduler")
    occurred_at = str(request.get("occurred_at") or request.get("now"))
    if not occurred_at:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "ROSTER_PUBLISH_TIME_REQUIRED",
                    "message": "发布时间不能为空",
                }
            },
        )

    lock = service.acquire_edit_lock(version_id, actor_id=actor_id, now=occurred_at)
    if lock.read_only:
        raise _roster_lock_exception(lock.message)

    existing_detail = service.repository.get_version(version_id)
    version = (
        replace(existing_detail.version, status=RosterVersionStatus.DRAFT)
        if existing_detail is not None
        else RosterVersion(
            roster_version_id=version_id,
            business_month=str(request["business_month"]),
            status=RosterVersionStatus.DRAFT,
            version_type=str(request.get("version_type") or "primary"),
            project_id=request.get("project_id"),
            workplace_id=request.get("workplace_id"),
            team_id=request.get("team_id"),
        )
    )
    cells = _roster_assignments_from_request(request)
    context = _roster_validation_context_from_request(request)
    service.save_draft(version, cells, actor_id=actor_id, occurred_at=occurred_at)
    validation = service.validate_publish(version_id, context)
    if validation.hard_errors:
        raise HTTPException(
            status_code=422,
            detail={
                "error": {
                    "code": "ROSTER_PUBLISH_BLOCKED",
                    "message": "班表存在硬错误，不能发布",
                    "hard_errors": [_roster_issue_response(item) for item in validation.hard_errors],
                }
            },
        )

    service.schedule_publish(
        version_id,
        actor_id=actor_id,
        occurred_at=occurred_at,
        effective_at=occurred_at,
        context=context,
        baseline_version_id=version.parent_version_id or version.supersedes_version_id,
    )
    service.activate_due_published(now=occurred_at, actor_id="system")
    service.release_edit_lock(version_id, actor_id=actor_id, now=occurred_at)
    current = service.get_current_published(
        business_month=version.business_month,
        project_id=version.project_id,
        workplace_id=version.workplace_id,
        team_id=version.team_id,
    )
    if current is None:
        raise HTTPException(
            status_code=500,
            detail={
                "error": {
                    "code": "ROSTER_PUBLISH_READBACK_FAILED",
                    "message": "发布后班表快照读取失败",
                }
            },
        )
    return _roster_detail_response(current)


@app.get("/api/v1/roster-drafts/active-draft")
def get_active_roster_revision_draft(
    business_month: str,
    project_id: str | None = None,
    workplace_id: str | None = None,
    team_id: str | None = None,
) -> dict[str, Any]:
    service = _get_roster_service()
    detail = service.get_active_draft(
        business_month=business_month,
        project_id=project_id,
        workplace_id=workplace_id,
        team_id=team_id,
    )
    if detail is None:
        return {
            "status": "missing",
            "version": None,
            "published": None,
            "snapshot": None,
            "cells": [],
        }
    return _roster_detail_response(detail)


@app.post("/api/v1/roster-drafts/revisions/create")
def create_roster_revision_draft(request: dict[str, Any] = Body(...)) -> dict[str, Any]:
    service = _get_roster_service()
    actor_id = str(request.get("actor_id") or "scheduler")
    occurred_at_value = request.get("occurred_at") or request.get("now")
    if not occurred_at_value:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "ROSTER_REVISION_TIME_REQUIRED",
                    "message": "修订创建时间不能为空",
                }
            },
        )
    occurred_at = str(occurred_at_value)
    current = service.get_current_published(
        business_month=str(request["business_month"]),
        project_id=request.get("project_id"),
        workplace_id=request.get("workplace_id"),
        team_id=request.get("team_id"),
    )
    if current is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "ROSTER_CURRENT_PUBLISHED_NOT_FOUND",
                    "message": "当前正式班表不存在，不能创建修订草稿",
                }
            },
        )
    new_version_id = str(
        request.get("revision_version_id")
        or _default_revision_version_id(current.version.roster_version_id, occurred_at)
    )
    try:
        service.create_revision(
            current.version.roster_version_id,
            new_version_id=new_version_id,
            actor_id=actor_id,
            occurred_at=occurred_at,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "ROSTER_REVISION_CREATE_BLOCKED",
                    "message": str(exc),
                }
            },
        ) from exc
    detail = service.repository.get_version(new_version_id)
    if detail is None:
        raise HTTPException(
            status_code=500,
            detail={
                "error": {
                    "code": "ROSTER_REVISION_READBACK_FAILED",
                    "message": "修订草稿创建后读取失败",
                }
            },
        )
    return _roster_detail_response(detail)


@app.post("/api/v1/roster-drafts/locks/acquire")
def acquire_roster_draft_lock(request: dict[str, Any] = Body(...)) -> dict[str, Any]:
    service = _get_roster_service()
    result = service.acquire_edit_lock(
        str(request["version_id"]),
        actor_id=str(request["actor_id"]),
        now=str(request["now"]),
    )
    return _roster_lock_response(result)


@app.post("/api/v1/roster-drafts/locks/release")
def release_roster_draft_lock(request: dict[str, Any] = Body(...)) -> dict[str, Any]:
    service = _get_roster_service()
    result = service.release_edit_lock(
        str(request["version_id"]),
        actor_id=str(request["actor_id"]),
        now=str(request["now"]),
    )
    if result.read_only:
        raise _roster_lock_exception(result.message)
    return _roster_lock_response(result)


def _roster_assignments_from_request(request: dict[str, Any]) -> list[RosterAssignment]:
    cells = request.get("cells") or []
    assignments: list[RosterAssignment] = []
    for index, cell in enumerate(cells, start=1):
        assignment_kind = AssignmentKind(cell.get("assignment_kind") or "shift")
        assignments.append(
            RosterAssignment(
                assignment_id=str(cell.get("assignment_id") or cell.get("cell_id")),
                roster_cell_id=str(cell.get("cell_id") or cell.get("assignment_id")),
                employee_id=str(cell["employee_id"]),
                business_date=str(cell["business_date"]),
                sequence=int(cell.get("sequence") or index),
                assignment_kind=assignment_kind,
                project_id=str(cell.get("project_id") or request.get("project_id") or ""),
                workplace_id=cell.get("workplace_id") or request.get("workplace_id"),
                team_id=str(cell.get("team_id") or request.get("team_id") or ""),
                shift_code=cell.get("shift_code"),
                annotation_code=cell.get("annotation_code"),
                interval_start_at=cell.get("interval_start_at"),
                interval_end_at=cell.get("interval_end_at"),
                source_cell_id=cell.get("source_cell_id"),
                manually_adjusted=bool(cell.get("manually_adjusted")),
            )
        )
    return assignments


def _roster_validation_context_from_request(
    request: dict[str, Any],
) -> RosterValidationContext:
    employees = {
        str(employee["employee_id"]): EmployeeRosterSnapshot(
            employee_id=str(employee["employee_id"]),
            active=bool(employee.get("active", True)),
            project_id=str(employee.get("project_id") or request.get("project_id") or ""),
            workplace_id=employee.get("workplace_id") or request.get("workplace_id"),
            team_id=str(employee.get("team_id") or request.get("team_id") or ""),
            status=str(employee.get("status") or "active"),
        )
        for employee in request.get("employees", [])
    }
    return RosterValidationContext(
        employees=employees,
        valid_shift_codes={str(item) for item in request.get("valid_shift_codes", [])},
        required_coverage_slots={
            str(item) for item in request.get("required_coverage_slots", [])
        },
    )


def _roster_detail_response(detail: RosterVersionDetail) -> dict[str, Any]:
    version = detail.version
    snapshot = detail.published_snapshot
    version_payload = _roster_version_response(version)
    return {
        "status": version.status.value,
        "version": version_payload,
        "published": version_payload,
        "snapshot": (
            {
                "shift_counts": snapshot.shift_counts,
                "arranged_coverage": snapshot.arranged_coverage,
                "hard_errors": snapshot.hard_errors,
                "soft_risks": snapshot.soft_risks,
                "diff_summary": snapshot.diff_summary,
                "created_at": snapshot.created_at,
            }
            if snapshot is not None
            else None
        ),
        "cells": [_roster_cell_response(cell) for cell in detail.cells],
    }


def _roster_version_response(version: RosterVersion) -> dict[str, Any]:
    return {
        "version_id": version.roster_version_id,
        "business_month": version.business_month,
        "status": version.status.value,
        "project_id": version.project_id,
        "workplace_id": version.workplace_id,
        "team_id": version.team_id,
        "activated_at": version.activated_at,
        "parent_version_id": version.parent_version_id,
        "supersedes_version_id": version.supersedes_version_id,
    }


def _roster_cell_response(cell: RosterAssignment) -> dict[str, Any]:
    return {
        "cell_id": cell.roster_cell_id,
        "assignment_id": cell.assignment_id,
        "employee_id": cell.employee_id,
        "business_date": cell.business_date,
        "sequence": cell.sequence,
        "assignment_kind": cell.assignment_kind.value,
        "project_id": cell.project_id,
        "workplace_id": cell.workplace_id,
        "team_id": cell.team_id,
        "shift_code": cell.shift_code,
        "annotation_code": cell.annotation_code,
        "interval_start_at": cell.interval_start_at,
        "interval_end_at": cell.interval_end_at,
        "source_cell_id": cell.source_cell_id,
        "manually_adjusted": cell.manually_adjusted,
    }


def _roster_lock_response(result: Any) -> dict[str, Any]:
    return {
        "acquired": result.acquired,
        "read_only": result.read_only,
        "message": result.message,
        "lock": (
            {
                "version_id": result.lock.roster_version_id,
                "actor_id": result.lock.actor_id,
                "acquired_at": result.lock.acquired_at,
                "expires_at": result.lock.expires_at,
            }
            if result.lock is not None
            else None
        ),
    }


def _roster_issue_response(issue: Any) -> dict[str, Any]:
    return {
        "code": issue.code.value,
        "assignment_id": issue.assignment_id,
        "message": issue.message,
    }


def _roster_lock_exception(message: str) -> HTTPException:
    return HTTPException(
        status_code=409,
        detail={
            "error": {
                "code": "ROSTER_DRAFT_LOCKED",
                "message": message,
            }
        },
    )


def _default_revision_version_id(current_version_id: str, occurred_at: str) -> str:
    suffix = (
        occurred_at.replace(":", "")
        .replace("-", "")
        .replace("T", "")
        .replace("+", "")
        .replace(".", "")
    )
    return f"{current_version_id}-REV-{suffix}"


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


@app.get(
    "/api/v1/import-batches/{batch_id}/apply-readiness",
    response_model=ImportApplyReadinessResponse,
)
def get_import_apply_readiness(batch_id: str) -> ImportApplyReadinessResponse:
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

    application_summary = build_import_application_summary(
        batch,
        master_data_repository=MasterDataPersistenceRepository(),
        schedule_repository=PersonnelSchedulePersistenceRepository(),
        forecast_repository=ForecastPersistenceRepository(),
        actual_repository=ActualLogPersistenceRepository(),
    )
    return build_import_apply_readiness(batch, application_summary)


def _raise_if_import_apply_not_ready(
    batch: ImportBatchPersistenceDetail,
    application_summary: ImportBatchApplicationSummary,
) -> None:
    readiness = build_import_apply_readiness(batch, application_summary)
    blocking_codes = [
        blocker.code
        for blocker in readiness.blockers
        if blocker.code != "IMPORT_BATCH_ALREADY_APPLIED"
    ]
    if not blocking_codes:
        return

    raise HTTPException(
        status_code=400,
        detail={
            "error": {
                "code": "IMPORT_APPLY_NOT_READY",
                "message": "导入批次未满足应用条件，需先处理就绪校验阻塞项。",
                "readiness": readiness.model_dump(),
            }
        },
    )


def _personnel_schedule_import_version_id(batch: ImportBatchPersistenceDetail) -> str:
    for version in batch.versions:
        if version.version_type == "personnel_schedule":
            return version.version_id

    raise HTTPException(
        status_code=404,
        detail={
            "error": {
                "code": "PERSONNEL_SCHEDULE_IMPORT_VERSION_NOT_FOUND",
                "message": "导入批次缺少人员排班版本",
            }
        },
    )


def _demand_forecast_import_version_id(batch: ImportBatchPersistenceDetail) -> str:
    for version in batch.versions:
        if version.version_type == "demand_forecast":
            return version.version_id

    raise HTTPException(
        status_code=404,
        detail={
            "error": {
                "code": "DEMAND_FORECAST_IMPORT_VERSION_NOT_FOUND",
                "message": "导入批次缺少需求预测版本",
            }
        },
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


@app.patch(
    "/api/v1/import-field-mapping-templates/{template_id}",
    response_model=ImportFieldMappingTemplateRecord,
)
def update_import_field_mapping_template(
    template_id: str,
    request: ImportFieldMappingTemplateUpdateRequest,
) -> ImportFieldMappingTemplateRecord:
    try:
        return get_import_mapping_persistence_repository().update_field_mapping_template(
            template_id,
            request,
        )
    except ValueError as exc:
        raise _field_mapping_template_not_found(exc)


@app.post(
    "/api/v1/import-field-mapping-templates/{template_id}/deactivate",
    response_model=ImportFieldMappingTemplateRecord,
)
def deactivate_import_field_mapping_template(
    template_id: str,
) -> ImportFieldMappingTemplateRecord:
    try:
        return (
            get_import_mapping_persistence_repository()
            .deactivate_field_mapping_template(template_id)
        )
    except ValueError as exc:
        raise _field_mapping_template_not_found(exc)


def _field_mapping_template_not_found(exc: ValueError) -> HTTPException:
    return HTTPException(
        status_code=404,
        detail={
            "error": {
                "code": "IMPORT_FIELD_MAPPING_TEMPLATE_NOT_FOUND",
                "message": "字段映射模板不存在",
            }
        },
    )


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

    master_data_repository = MasterDataPersistenceRepository()
    application_summary = build_import_application_summary(
        batch,
        master_data_repository=master_data_repository,
        schedule_repository=PersonnelSchedulePersistenceRepository(),
        forecast_repository=ForecastPersistenceRepository(),
        actual_repository=ActualLogPersistenceRepository(),
    )
    _raise_if_import_apply_not_ready(batch, application_summary)

    try:
        summary = apply_master_data_import_batch(
            batch,
            master_data_repository,
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
    "/api/v1/master-data/employees/{employee_id}/maintenance",
    response_model=MasterDataEmployeeMaintenanceResponse,
)
def maintain_master_data_employee(
    employee_id: str,
    request: MasterDataEmployeeMaintenanceRequest,
) -> MasterDataEmployeeMaintenanceResponse:
    try:
        return maintain_employee(
            employee_id,
            request,
            MasterDataPersistenceRepository(),
        )
    except ValueError as exc:
        raise _master_data_maintenance_http_error(exc) from exc


@app.post(
    "/api/v1/master-data/employees/{employee_id}/skills/maintenance",
    response_model=MasterDataEmployeeSkillMaintenanceResponse,
)
def maintain_master_data_employee_skills(
    employee_id: str,
    request: MasterDataEmployeeSkillMaintenanceRequest,
) -> MasterDataEmployeeSkillMaintenanceResponse:
    try:
        return maintain_employee_skills(
            employee_id,
            request,
            MasterDataPersistenceRepository(),
        )
    except ValueError as exc:
        raise _master_data_maintenance_http_error(exc) from exc


@app.get(
    "/api/v1/master-data/employees",
    response_model=MasterDataEmployeeListResponse,
)
def list_master_data_employees() -> MasterDataEmployeeListResponse:
    repository = MasterDataPersistenceRepository()
    return MasterDataEmployeeListResponse(items=repository.list_employees())


@app.get(
    "/api/v1/master-data/bindings",
    response_model=MasterDataBindingListResponse,
)
def list_master_data_bindings() -> MasterDataBindingListResponse:
    repository = MasterDataPersistenceRepository()
    return MasterDataBindingListResponse(items=repository.list_employee_bindings())


@app.get(
    "/api/v1/master-data/organizations",
    response_model=MasterDataOrganizationListResponse,
)
def list_master_data_organizations() -> MasterDataOrganizationListResponse:
    repository = MasterDataPersistenceRepository()
    return MasterDataOrganizationListResponse(items=repository.list_organizations())


@app.get(
    "/api/v1/master-data/workplace-service-teams",
    response_model=MasterDataWorkplaceServiceTeamListResponse,
)
def list_master_data_workplace_service_teams(
    workplace_id: str | None = Query(default=None),
) -> MasterDataWorkplaceServiceTeamListResponse:
    repository = MasterDataPersistenceRepository()
    return MasterDataWorkplaceServiceTeamListResponse(
        items=repository.list_workplace_service_teams(workplace_id=workplace_id)
    )


@app.post(
    "/api/v1/master-data/organizations/{organization_id}/maintenance",
    response_model=MasterDataOrganizationMaintenanceResponse,
)
def maintain_master_data_organization(
    organization_id: str,
    request: MasterDataOrganizationMaintenanceRequest,
) -> MasterDataOrganizationMaintenanceResponse:
    try:
        return maintain_organization(
            organization_id,
            request,
            MasterDataPersistenceRepository(),
        )
    except ValueError as exc:
        raise _master_data_maintenance_http_error(exc) from exc


@app.post(
    "/api/v1/master-data/bindings/{binding_id}/maintenance",
    response_model=MasterDataBindingMaintenanceResponse,
)
def maintain_master_data_binding(
    binding_id: str,
    request: MasterDataBindingMaintenanceRequest,
) -> MasterDataBindingMaintenanceResponse:
    try:
        return maintain_employee_binding(
            binding_id,
            request,
            MasterDataPersistenceRepository(),
        )
    except ValueError as exc:
        raise _master_data_maintenance_http_error(exc) from exc


@app.post(
    "/api/v1/master-data/workplace-service-teams/{service_team_id}/maintenance",
    response_model=MasterDataWorkplaceServiceTeamMaintenanceResponse,
)
def maintain_master_data_workplace_service_team(
    service_team_id: str,
    request: MasterDataWorkplaceServiceTeamMaintenanceRequest,
) -> MasterDataWorkplaceServiceTeamMaintenanceResponse:
    try:
        return maintain_workplace_service_team(
            service_team_id,
            request,
            MasterDataPersistenceRepository(),
        )
    except ValueError as exc:
        raise _master_data_maintenance_http_error(exc) from exc


@app.get(
    "/api/v1/master-data/{reference_type}",
    response_model=MasterDataReferenceListResponse,
)
def list_master_data_references(
    reference_type: MasterDataReferenceType,
) -> MasterDataReferenceListResponse:
    repository = MasterDataPersistenceRepository()
    return MasterDataReferenceListResponse(
        items=repository.list_references(reference_type)
    )


@app.post(
    "/api/v1/master-data/{reference_type}/{reference_id}/maintenance",
    response_model=MasterDataReferenceMaintenanceResponse,
)
def maintain_master_data_reference(
    reference_type: MasterDataReferenceType,
    reference_id: str,
    request: MasterDataReferenceMaintenanceRequest,
) -> MasterDataReferenceMaintenanceResponse:
    try:
        return maintain_reference(
            reference_type,
            reference_id,
            request,
            MasterDataPersistenceRepository(),
        )
    except ValueError as exc:
        raise _master_data_maintenance_http_error(exc) from exc


def _master_data_maintenance_http_error(exc: ValueError) -> HTTPException:
    message = str(exc)
    code = _master_data_maintenance_error_code(message)
    status_code = (
        404
        if code in {
            "EMPLOYEE_NOT_FOUND",
            "SOURCE_BATCH_NOT_FOUND",
            "REFERENCE_NOT_FOUND",
            "BINDING_NOT_FOUND",
            "ORGANIZATION_NOT_FOUND",
            "SERVICE_TEAM_NOT_FOUND",
        }
        else 400
    )
    return HTTPException(
        status_code=status_code,
        detail={
            "error": {
                "code": code,
                "message": message,
            }
        },
    )


def _master_data_maintenance_error_code(message: str) -> str:
    code = message.split(":", maxsplit=1)[0]
    if code in {
        "SOURCE_BATCH_NOT_FOUND",
        "EMPLOYEE_NOT_FOUND",
        "EMPLOYEE_ALREADY_EXISTS",
        "REFERENCE_NOT_FOUND",
        "REFERENCE_ALREADY_EXISTS",
        "ORGANIZATION_NOT_FOUND",
        "ORGANIZATION_ALREADY_EXISTS",
        "SERVICE_TEAM_NOT_FOUND",
        "SERVICE_TEAM_ALREADY_EXISTS",
        "SERVICE_TEAM_WRITE_FAILED",
        "SUPPLIER_NOT_ALLOWED_FOR_INTERNAL_SERVICE_TEAM",
        "ORGANIZATION_NOT_ALLOWED_FOR_SUPPLIER_SERVICE_TEAM",
        "BINDING_NOT_FOUND",
        "BINDING_ALREADY_EXISTS",
        "MISSING_REQUIRED_FIELD",
        "INVALID_EFFECTIVE_PERIOD",
        "EMPLOYEE_WRITE_FAILED",
        "REFERENCE_WRITE_FAILED",
        "ORGANIZATION_WRITE_FAILED",
        "BINDING_WRITE_FAILED",
    }:
        return code
    if any(
        message.startswith(field_name)
        for field_name in (
            "employee_id ",
            "supplier_id ",
            "workplace_id ",
            "organization_id ",
            "project_id ",
            "skill_id ",
        )
    ):
        return "MASTER_DATA_REFERENCE_INVALID"
    return "MASTER_DATA_MAINTENANCE_INVALID"


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

    schedule_repository = PersonnelSchedulePersistenceRepository()
    application_summary = build_import_application_summary(
        batch,
        master_data_repository=MasterDataPersistenceRepository(),
        schedule_repository=schedule_repository,
        forecast_repository=ForecastPersistenceRepository(),
        actual_repository=ActualLogPersistenceRepository(),
    )
    _raise_if_import_apply_not_ready(batch, application_summary)

    try:
        summary = apply_personnel_schedule_import_batch(
            batch,
            schedule_repository,
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


@app.get(
    "/api/v1/personnel-schedule/production/{batch_id}",
    response_model=PersonnelScheduleProductionDetail,
)
def get_personnel_schedule_production_detail(
    batch_id: str,
) -> PersonnelScheduleProductionDetail:
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
    if batch.batch.file_type != "personnel_schedule":
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "PERSONNEL_SCHEDULE_BATCH_INVALID",
                    "message": "导入批次不是人员排班类型",
                }
            },
        )

    schedule_detail = (
        PersonnelSchedulePersistenceRepository()
        .get_schedule_version_by_import_version(
            _personnel_schedule_import_version_id(batch)
        )
    )
    if schedule_detail is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "PERSONNEL_SCHEDULE_VERSION_NOT_FOUND",
                    "message": "人员排班业务版本尚未应用",
                }
            },
        )

    return PersonnelScheduleProductionDetail(
        batch=batch.batch,
        version=schedule_detail.version,
        details=schedule_detail.details,
        intervals=schedule_detail.intervals,
    )


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

    forecast_repository = ForecastPersistenceRepository()
    application_summary = build_import_application_summary(
        batch,
        master_data_repository=MasterDataPersistenceRepository(),
        schedule_repository=PersonnelSchedulePersistenceRepository(),
        forecast_repository=forecast_repository,
        actual_repository=ActualLogPersistenceRepository(),
    )
    _raise_if_import_apply_not_ready(batch, application_summary)

    try:
        summary = apply_forecast_import_batch(
            batch,
            forecast_repository,
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


@app.get(
    "/api/v1/demand-forecast/production/{batch_id}",
    response_model=DemandForecastProductionDetail,
)
def get_demand_forecast_production_detail(
    batch_id: str,
) -> DemandForecastProductionDetail:
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
    if batch.batch.file_type != "demand_forecast":
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "DEMAND_FORECAST_BATCH_INVALID",
                    "message": "导入批次不是需求预测类型",
                }
            },
        )

    forecast_detail = ForecastPersistenceRepository().get_forecast_version_by_import_version(
        _demand_forecast_import_version_id(batch)
    )
    if forecast_detail is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "DEMAND_FORECAST_VERSION_NOT_FOUND",
                    "message": "需求预测业务版本尚未应用",
                }
            },
        )

    return DemandForecastProductionDetail(
        batch=batch.batch,
        version=forecast_detail.version,
        intervals=forecast_detail.intervals,
        changes=forecast_detail.changes,
    )


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

    actual_repository = ActualLogPersistenceRepository()
    application_summary = build_import_application_summary(
        batch,
        master_data_repository=MasterDataPersistenceRepository(),
        schedule_repository=PersonnelSchedulePersistenceRepository(),
        forecast_repository=ForecastPersistenceRepository(),
        actual_repository=actual_repository,
    )
    _raise_if_import_apply_not_ready(batch, application_summary)

    try:
        summary = apply_actual_log_import_batch(
            batch,
            actual_repository,
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
    "/api/v1/review-cases/{case_id}/evidence",
    response_model=ReviewCaseDetail,
)
def write_review_evidence_api(
    case_id: str,
    request: ReviewEvidenceInput,
) -> ReviewCaseDetail:
    try:
        return write_review_evidence(
            case_id,
            request,
            ReviewPersistenceRepository(),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "REVIEW_EVIDENCE_INVALID",
                    "message": str(exc),
                }
            },
        ) from exc


@app.post(
    "/api/v1/review-cases/{case_id}/conclusion",
    response_model=ReviewCaseDetail,
)
def write_review_conclusion_api(
    case_id: str,
    request: ReviewConclusionInput,
) -> ReviewCaseDetail:
    try:
        return write_review_conclusion(
            case_id,
            request,
            ReviewPersistenceRepository(),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "REVIEW_CONCLUSION_INVALID",
                    "message": str(exc),
                }
            },
        ) from exc


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


@app.post(
    "/api/v1/schedule-plans/{plan_id}/submit-review",
    response_model=SchedulePlanDetail,
)
def submit_schedule_plan_for_review(plan_id: str) -> SchedulePlanDetail:
    if find_plan_detail(plan_id) is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "SCHEDULE_PLAN_NOT_FOUND",
                    "message": "排班计划不存在",
                }
            },
        )

    try:
        updated = transition_plan_status(plan_id, "draft", "review_ready")
    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "SCHEDULE_PLAN_NOT_FOUND",
                    "message": "排班计划不存在",
                }
            },
        ) from exc

    if updated is None:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "SCHEDULE_PLAN_INVALID_TRANSITION",
                    "message": "当前排班计划状态不允许该流转",
                }
            },
        )

    return updated


@app.post(
    "/api/v1/schedule-plans/{plan_id}/publish",
    response_model=SchedulePlanDetail,
)
def publish_schedule_plan(plan_id: str) -> SchedulePlanDetail:
    if find_plan_detail(plan_id) is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "SCHEDULE_PLAN_NOT_FOUND",
                    "message": "排班计划不存在",
                }
            },
        )

    try:
        updated = transition_plan_status(plan_id, "review_ready", "published")
    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "SCHEDULE_PLAN_NOT_FOUND",
                    "message": "排班计划不存在",
                }
            },
        ) from exc

    if updated is None:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "SCHEDULE_PLAN_INVALID_TRANSITION",
                    "message": "当前排班计划状态不允许该流转",
                }
            },
        )

    return updated


@app.post(
    "/api/v1/schedule-risks/{risk_id}/confirm",
    response_model=ScheduleRiskRow,
)
def confirm_schedule_risk(risk_id: str) -> ScheduleRiskRow:
    if find_schedule_risk(risk_id) is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "SCHEDULE_RISK_NOT_FOUND",
                    "message": "排班风险不存在",
                }
            },
        )

    try:
        updated = transition_schedule_risk_status(risk_id, "confirmed")
    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "SCHEDULE_RISK_NOT_FOUND",
                    "message": "排班风险不存在",
                }
            },
        ) from exc

    if updated is None:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "SCHEDULE_RISK_INVALID_TRANSITION",
                    "message": "当前风险状态不允许该操作",
                }
            },
        )

    return updated


@app.post(
    "/api/v1/schedule-risks/{risk_id}/resolve",
    response_model=ScheduleRiskRow,
)
def resolve_schedule_risk(risk_id: str) -> ScheduleRiskRow:
    if find_schedule_risk(risk_id) is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "SCHEDULE_RISK_NOT_FOUND",
                    "message": "排班风险不存在",
                }
            },
        )

    try:
        updated = transition_schedule_risk_status(risk_id, "resolved")
    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "SCHEDULE_RISK_NOT_FOUND",
                    "message": "排班风险不存在",
                }
            },
        ) from exc

    if updated is None:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "SCHEDULE_RISK_INVALID_TRANSITION",
                    "message": "当前风险状态不允许该操作",
                }
            },
        )

    return updated


@app.post(
    "/api/v1/unavailability/{unavailability_id}/resolve",
    response_model=UnavailabilityRow,
)
def resolve_unavailability_api(unavailability_id: str) -> UnavailabilityRow:
    try:
        updated = resolve_unavailability(unavailability_id)
    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "UNAVAILABILITY_NOT_FOUND",
                    "message": "不可用记录不存在",
                }
            },
        ) from exc

    if updated is None:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "UNAVAILABILITY_INVALID_TRANSITION",
                    "message": "当前不可用记录状态不允许该操作",
                }
            },
        )

    return updated
