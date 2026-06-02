from backend.app.comparison_persistence import ComparisonPersistenceRepository
from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    ComparisonRunRequest,
    EmployeeBindingInput,
    EmployeeMasterDataInput,
    ForecastIntervalInput,
    ForecastScheduleComparisonResultInput,
    ForecastVersionRequest,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    MasterDataReferenceInput,
    MasterDataSnapshotRequest,
    PersonnelScheduleDetailInput,
    PersonnelScheduleVersionRequest,
    ReviewCaseCreateRequest,
    ReviewCaseDetail,
    ReviewClosureWriteRequest,
    ReviewConclusionInput,
    ReviewEvidenceInput,
    ShiftTypeInput,
)
from backend.app.personnel_schedule_persistence import (
    PersonnelSchedulePersistenceRepository,
)
from backend.app.review_closure import write_review_closure
from backend.app.review_persistence import ReviewPersistenceRepository

DEMO_CASE_ID = "CASE-QUERY-001"
DEMO_RUN_ID = "RUN-DEMO-FS-20260511"


def seed_review_case_demo(database_url: str | None = None) -> ReviewCaseDetail:
    repository = ReviewPersistenceRepository(database_url)
    repository.init_schema()
    existing = repository.get_review_case(DEMO_CASE_ID)
    if existing is not None:
        return existing

    source_result_id = _ensure_forecast_schedule_result(database_url)
    return write_review_closure(
        ReviewClosureWriteRequest(
            case=ReviewCaseCreateRequest(
                case_id=DEMO_CASE_ID,
                source_result_type="forecast_schedule",
                source_result_id=source_result_id,
                business_date="2026-05-11",
                owner_id="supervisor-01",
                severity="high",
                status="open",
            ),
            evidence=[
                ReviewEvidenceInput(
                    evidence_id="EVD-QUERY-001",
                    case_id=DEMO_CASE_ID,
                    evidence_type="note",
                    evidence_uri="local://review/CASE-QUERY-001/note",
                    submitted_by="supervisor-01",
                    note="复核说明",
                )
            ],
            conclusions=[
                ReviewConclusionInput(
                    conclusion_id="CON-QUERY-001",
                    case_id=DEMO_CASE_ID,
                    conclusion_type="confirmed_gap",
                    risk_level="high",
                    conclusion_text="确认预测与排班缺口。",
                    decided_by="ops-lead-01",
                )
            ],
        ),
        repository,
    )


def _ensure_forecast_schedule_result(database_url: str | None) -> int:
    comparison_repository = ComparisonPersistenceRepository(database_url)
    comparison_repository.init_schema()
    existing = comparison_repository.get_comparison_run(DEMO_RUN_ID)
    if existing is not None and existing.forecast_schedule_results:
        return existing.forecast_schedule_results[0].result_id

    _seed_import_versions(database_url)
    _seed_master_data(database_url)
    _seed_forecast_version(database_url)
    _seed_schedule_version(database_url)
    detail = comparison_repository.create_comparison_run(
        ComparisonRunRequest(
            run_id=DEMO_RUN_ID,
            comparison_type="forecast_vs_schedule",
            forecast_version_id="FC-DEMO-20260511-V1",
            schedule_version_id="SCH-DEMO-20260511-V1",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            status="completed",
            forecast_schedule_results=[
                ForecastScheduleComparisonResultInput(
                    forecast_interval_id="FC-DEMO-INT-001",
                    schedule_detail_id="DETAIL-DEMO-A-1001-20260511",
                    business_date="2026-05-11",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    interval_start="09:00",
                    interval_end="09:30",
                    forecast_agents=3,
                    scheduled_agents=1,
                    gap_agents=2,
                    result_status="gap",
                )
            ],
        )
    )
    return detail.forecast_schedule_results[0].result_id


def _seed_import_versions(database_url: str | None) -> None:
    repository = ImportPersistenceRepository(database_url)
    repository.init_schema()
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id="BATCH-DEMO-REVIEW-20260511",
            file_name="review-demo-sources.csv",
            file_type="master_data",
            uploaded_by="数据管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="REVIEW-DEMO",
                    raw_data={"scope": "review-demo"},
                )
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-DEMO-FC-20260511",
                    version_type="demand_forecast",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                ),
                ImportBatchVersionInput(
                    version_id="IMPORT-DEMO-SCH-20260511",
                    version_type="personnel_schedule",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                ),
            ],
        )
    )


def _seed_master_data(database_url: str | None) -> None:
    repository = MasterDataPersistenceRepository(database_url)
    repository.init_schema()
    repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id="BATCH-DEMO-REVIEW-20260511",
            suppliers=[
                MasterDataReferenceInput(
                    reference_id="SUP-A",
                    reference_name="供应商 A",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            workplaces=[
                MasterDataReferenceInput(
                    reference_id="SH-01",
                    reference_name="上海职场",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            projects=[
                MasterDataReferenceInput(
                    reference_id="BOSCH-CS",
                    reference_name="博西客服",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            skills=[
                MasterDataReferenceInput(
                    reference_id="L1-CN",
                    reference_name="中文一线",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            employees=[
                EmployeeMasterDataInput(
                    employee_id="A-1001",
                    employee_name="张三",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            bindings=[
                EmployeeBindingInput(
                    binding_id="BIND-DEMO-A-1001",
                    employee_id="A-1001",
                    supplier_id="SUP-A",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
        )
    )


def _seed_forecast_version(database_url: str | None) -> None:
    repository = ForecastPersistenceRepository(database_url)
    repository.init_schema()
    repository.create_forecast_version(
        ForecastVersionRequest(
            forecast_version_id="FC-DEMO-20260511-V1",
            import_version_id="IMPORT-DEMO-FC-20260511",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            intervals=[
                ForecastIntervalInput(
                    forecast_interval_id="FC-DEMO-INT-001",
                    forecast_date="2026-05-11",
                    interval_start="09:00",
                    interval_end="09:30",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    demand_level="L1",
                    required_agents=3,
                )
            ],
        )
    )


def _seed_schedule_version(database_url: str | None) -> None:
    repository = PersonnelSchedulePersistenceRepository(database_url)
    repository.init_schema()
    repository.create_schedule_version(
        PersonnelScheduleVersionRequest(
            schedule_version_id="SCH-DEMO-20260511-V1",
            import_version_id="IMPORT-DEMO-SCH-20260511",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            shift_types=[
                ShiftTypeInput(
                    shift_type_id="MORNING-DEMO",
                    shift_type_name="早班",
                    status="active",
                    start_time="09:00",
                    end_time="10:00",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            details=[
                PersonnelScheduleDetailInput(
                    schedule_detail_id="DETAIL-DEMO-A-1001-20260511",
                    employee_id="A-1001",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    shift_type_id="MORNING-DEMO",
                    schedule_date="2026-05-11",
                    start_time="09:00",
                    end_time="10:00",
                )
            ],
        )
    )


def main() -> None:
    detail = seed_review_case_demo()
    print(detail.model_dump_json())


if __name__ == "__main__":
    main()
