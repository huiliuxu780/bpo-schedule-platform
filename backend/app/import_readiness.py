from backend.app.models import (
    ImportApplyReadinessBlocker,
    ImportApplyReadinessResponse,
    ImportBatchApplicationSummary,
    ImportBatchPersistenceDetail,
)


def build_import_apply_readiness(
    detail: ImportBatchPersistenceDetail,
    application_summary: ImportBatchApplicationSummary,
) -> ImportApplyReadinessResponse:
    blockers: list[ImportApplyReadinessBlocker] = []
    if detail.batch.failed_rows > 0:
        blockers.append(
            ImportApplyReadinessBlocker(
                code="IMPORT_FAILED_ROWS_PRESENT",
                message="导入批次仍存在失败行，需先修正失败行。",
            )
        )
    if detail.batch.success_rows == 0:
        blockers.append(
            ImportApplyReadinessBlocker(
                code="IMPORT_NO_SUCCESS_ROWS",
                message="导入批次没有可应用的成功行。",
            )
        )
    if not detail.versions:
        blockers.append(
            ImportApplyReadinessBlocker(
                code="IMPORT_VERSION_MISSING",
                message="导入批次缺少可追溯的导入版本。",
            )
        )
    if application_summary.application_status == "applied":
        blockers.append(
            ImportApplyReadinessBlocker(
                code="IMPORT_BATCH_ALREADY_APPLIED",
                message="导入批次已经应用，无需重复应用。",
            )
        )

    return ImportApplyReadinessResponse(
        batch_id=detail.batch.batch_id,
        file_type=detail.batch.file_type,
        readiness_status="blocked" if blockers else "ready",
        blockers=blockers,
        total_rows=detail.batch.total_rows,
        success_rows=detail.batch.success_rows,
        failed_rows=detail.batch.failed_rows,
        warning_rows=detail.batch.warning_rows,
        version_count=len(detail.versions),
        application_status=application_summary.application_status,
        application_target=application_summary.application_target,
        import_version_id=application_summary.import_version_id,
        applied_record_count=application_summary.applied_record_count,
    )
