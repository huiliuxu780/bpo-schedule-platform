from backend.app.actual_log_persistence import ActualLogPersistenceRepository
from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    ImportBatchApplicationSummary,
    ImportBatchPersistenceDetail,
)
from backend.app.personnel_schedule_persistence import PersonnelSchedulePersistenceRepository


def build_import_application_summary(
    detail: ImportBatchPersistenceDetail,
    *,
    master_data_repository: MasterDataPersistenceRepository,
    schedule_repository: PersonnelSchedulePersistenceRepository,
    forecast_repository: ForecastPersistenceRepository,
    actual_repository: ActualLogPersistenceRepository,
) -> ImportBatchApplicationSummary:
    file_type = detail.batch.file_type
    if file_type == "master_data":
        applied = master_data_repository.has_snapshot_batch(detail.batch.batch_id)
        return ImportBatchApplicationSummary(
            batch_id=detail.batch.batch_id,
            file_type=file_type,
            application_status="applied" if applied else "not_applied",
            application_target="master_data_snapshot",
            import_version_id=_find_version(detail, file_type),
            applied_record_count=detail.batch.success_rows if applied else 0,
        )

    if file_type == "personnel_schedule":
        version_id = _find_version(detail, file_type)
        applied = (
            schedule_repository.has_schedule_import_version(version_id)
            if version_id is not None
            else False
        )
        schedule_detail = (
            schedule_repository.get_schedule_version(f"{detail.batch.batch_id}::schedule")
            if applied
            else None
        )
        return ImportBatchApplicationSummary(
            batch_id=detail.batch.batch_id,
            file_type=file_type,
            application_status="applied" if applied else "not_applied",
            application_target="personnel_schedule_version",
            import_version_id=version_id,
            applied_record_count=len(schedule_detail.details) if schedule_detail else 0,
        )

    if file_type == "demand_forecast":
        version_id = _find_version(detail, file_type)
        applied = (
            forecast_repository.has_forecast_import_version(version_id)
            if version_id is not None
            else False
        )
        forecast_detail = (
            forecast_repository.get_forecast_version(f"{detail.batch.batch_id}::forecast")
            if applied
            else None
        )
        return ImportBatchApplicationSummary(
            batch_id=detail.batch.batch_id,
            file_type=file_type,
            application_status="applied" if applied else "not_applied",
            application_target="forecast_version",
            import_version_id=version_id,
            applied_record_count=len(forecast_detail.intervals) if forecast_detail else 0,
        )

    version_id = _find_version(detail, file_type)
    applied = (
        actual_repository.has_actual_import_version(version_id, file_type=file_type)
        if version_id is not None
        else False
    )
    if file_type == "login_log":
        applied_record_count = (
            len(actual_repository.get_login_events(version_id))
            if applied and version_id is not None
            else 0
        )
    else:
        applied_record_count = (
            len(actual_repository.get_status_intervals(version_id))
            if applied and version_id is not None
            else 0
        )

    return ImportBatchApplicationSummary(
        batch_id=detail.batch.batch_id,
        file_type=file_type,
        application_status="applied" if applied else "not_applied",
        application_target="actual_log_import",
        import_version_id=version_id,
        applied_record_count=applied_record_count,
    )


def _find_version(
    detail: ImportBatchPersistenceDetail,
    version_type: str,
) -> str | None:
    for version in detail.versions:
        if version.version_type == version_type:
            return version.version_id
    return None
