import tempfile
import unittest
from pathlib import Path

from backend.app.forecast_import import apply_forecast_import_batch
from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeMasterDataInput,
    ImportBatchCreateRequest,
    ImportBatchPersistenceDetail,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    MasterDataReferenceInput,
    MasterDataSnapshotRequest,
)


class CountingForecastPersistenceRepository(ForecastPersistenceRepository):
    def __init__(self, database_url: str | None = None):
        super().__init__(database_url)
        self.create_forecast_version_call_count = 0

    def create_forecast_version(self, request):
        self.create_forecast_version_call_count += 1
        return super().create_forecast_version(request)


class ForecastImportServiceTest(unittest.TestCase):
    def test_success_rows_are_applied_to_forecast_repository(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'forecast-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_master_data(database_url, "BATCH-FC-APPLY-001")
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-FC-APPLY-001",
                    file_name="demand_forecast.csv",
                    file_type="demand_forecast",
                    uploaded_by="计划管理员",
                    business_date_from="2026-05-10",
                    business_date_to="2026-05-12",
                    rows=[
                        _success_row(
                            1,
                            {
                                "forecast_date": "2026-05-11",
                                "interval_start": "09:00",
                                "interval_end": "09:30",
                                "workplace_id": "SH-01",
                                "project_id": "BOSCH-CS",
                                "skill_id": "L1-CN",
                                "demand_level": "L1",
                                "required_agents": "12",
                            },
                        ),
                        _success_row(
                            2,
                            {
                                "forecast_interval_id": "FC-INT-EXPLICIT",
                                "forecast_date": "2026-05-11",
                                "interval_start": "09:30",
                                "interval_end": "10:00",
                                "workplace_id": "SH-01",
                                "project_id": "BOSCH-CS",
                                "skill_id": "L1-CN",
                                "demand_level": "L1",
                                "required_agents": "14",
                            },
                        ),
                        ImportBatchRowResultInput(
                            row_number=3,
                            row_status="failed",
                            source_key="IGNORED",
                            raw_data={
                                "standard_fields": {
                                    "forecast_date": "2026-05-11",
                                    "required_agents": "99",
                                }
                            },
                        ),
                    ],
                    versions=[
                        ImportBatchVersionInput(
                            version_id="IMPORT-FC-APPLY-001",
                            version_type="demand_forecast",
                            business_date_from="2026-05-11",
                            business_date_to="2026-05-11",
                        )
                    ],
                )
            )
            forecast_repository = ForecastPersistenceRepository(database_url)
            forecast_repository.init_schema()

            summary = apply_forecast_import_batch(
                detail,
                forecast_repository,
                compared_from_version_id="FC-OLD",
                change_reason="客户更新峰值需求",
            )

            self.assertEqual(
                summary,
                {
                    "batch_id": "BATCH-FC-APPLY-001",
                    "forecast_version_id": "BATCH-FC-APPLY-001::forecast",
                    "applied_status": "applied",
                    "intervals": 2,
                    "total_required_agents": 26,
                    "skipped_rows": 1,
                },
            )
            loaded = forecast_repository.get_forecast_version(
                "BATCH-FC-APPLY-001::forecast"
            )
            self.assertIsNotNone(loaded)
            self.assertEqual(loaded.version.import_version_id, "IMPORT-FC-APPLY-001")
            self.assertEqual(loaded.version.business_date_from, "2026-05-11")
            self.assertEqual(loaded.version.business_date_to, "2026-05-11")
            self.assertEqual(
                [interval.required_agents for interval in loaded.intervals],
                [12, 14],
            )
            self.assertEqual(
                loaded.intervals[0].forecast_interval_id,
                "SH-01|BOSCH-CS|L1-CN|2026-05-11|09:00",
            )
            self.assertEqual(
                loaded.intervals[1].forecast_interval_id,
                "FC-INT-EXPLICIT",
            )
            self.assertEqual(loaded.changes[0].compared_from_version_id, "FC-OLD")
            self.assertEqual(loaded.changes[0].change_reason, "客户更新峰值需求")

    def test_duplicate_batch_returns_already_applied_without_second_write(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'forecast-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_master_data(database_url, "BATCH-FC-APPLY-002")
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-FC-APPLY-002",
                    file_name="demand_forecast.csv",
                    file_type="demand_forecast",
                    uploaded_by="计划管理员",
                    business_date_from="2026-05-10",
                    business_date_to="2026-05-12",
                    rows=[
                        _success_row(
                            1,
                            {
                                "forecast_date": "2026-05-11",
                                "interval_start": "09:00",
                                "interval_end": "09:30",
                                "workplace_id": "SH-01",
                                "project_id": "BOSCH-CS",
                                "skill_id": "L1-CN",
                                "demand_level": "L1",
                                "required_agents": "12",
                            },
                        ),
                        _success_row(
                            2,
                            {
                                "forecast_date": "2026-05-11",
                                "interval_start": "09:30",
                                "interval_end": "10:00",
                                "workplace_id": "SH-01",
                                "project_id": "BOSCH-CS",
                                "skill_id": "L1-CN",
                                "demand_level": "L1",
                                "required_agents": "14",
                            },
                        ),
                    ],
                    versions=[
                        ImportBatchVersionInput(
                            version_id="IMPORT-FC-APPLY-002",
                            version_type="demand_forecast",
                            business_date_from="2026-05-11",
                            business_date_to="2026-05-11",
                        )
                    ],
                )
            )
            forecast_repository = CountingForecastPersistenceRepository(database_url)
            forecast_repository.init_schema()

            first_summary = apply_forecast_import_batch(
                detail,
                forecast_repository,
                compared_from_version_id="FC-OLD",
                change_reason="客户更新峰值需求",
            )
            second_summary = apply_forecast_import_batch(
                detail,
                forecast_repository,
                compared_from_version_id="FC-OLD",
                change_reason="客户更新峰值需求",
            )

            self.assertEqual(first_summary["applied_status"], "applied")
            self.assertEqual(second_summary["applied_status"], "already_applied")
            self.assertEqual(forecast_repository.create_forecast_version_call_count, 1)
            loaded = forecast_repository.get_forecast_version(
                "BATCH-FC-APPLY-002::forecast"
            )
            self.assertIsNotNone(loaded)
            self.assertEqual(len(loaded.intervals), 2)
            self.assertEqual(len(loaded.changes), 1)

    def test_non_demand_forecast_batch_is_rejected(self) -> None:
        detail = _detail_with_standard_fields(
            batch_id="BATCH-SCH-001",
            file_type="personnel_schedule",
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-SCH-001",
                    version_type="personnel_schedule",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                )
            ],
        )
        forecast_repository = ForecastPersistenceRepository("sqlite+pysqlite:///:memory:")

        with self.assertRaisesRegex(ValueError, "demand_forecast"):
            apply_forecast_import_batch(detail, forecast_repository)

    def test_missing_demand_forecast_import_version_is_rejected(self) -> None:
        detail = _detail_with_standard_fields(
            batch_id="BATCH-FC-NO-VERSION",
            versions=[],
        )
        forecast_repository = ForecastPersistenceRepository("sqlite+pysqlite:///:memory:")

        with self.assertRaisesRegex(ValueError, "import version"):
            apply_forecast_import_batch(detail, forecast_repository)

    def test_non_numeric_required_agents_reports_row_number(self) -> None:
        detail = _detail_with_standard_fields(
            batch_id="BATCH-FC-BAD-AGENTS",
            row_number=7,
            standard_fields={
                "forecast_date": "2026-05-11",
                "interval_start": "09:00",
                "interval_end": "09:30",
                "workplace_id": "SH-01",
                "project_id": "BOSCH-CS",
                "skill_id": "L1-CN",
                "demand_level": "L1",
                "required_agents": "not-a-number",
            },
        )
        forecast_repository = ForecastPersistenceRepository("sqlite+pysqlite:///:memory:")

        with self.assertRaisesRegex(ValueError, "row_number=7.*required_agents"):
            apply_forecast_import_batch(detail, forecast_repository)

    def test_missing_required_field_reports_row_number(self) -> None:
        detail = _detail_with_standard_fields(
            batch_id="BATCH-FC-MISSING-FIELD",
            row_number=4,
            standard_fields={
                "forecast_date": "2026-05-11",
                "interval_start": "09:00",
                "interval_end": "09:30",
                "workplace_id": "SH-01",
                "project_id": "BOSCH-CS",
                "skill_id": "L1-CN",
                "required_agents": "12",
            },
        )
        forecast_repository = ForecastPersistenceRepository("sqlite+pysqlite:///:memory:")

        with self.assertRaisesRegex(ValueError, "row_number=4.*demand_level"):
            apply_forecast_import_batch(detail, forecast_repository)

    def test_unknown_raw_shape_reports_row_number(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'forecast-import.db'}"
            repository = ImportPersistenceRepository(database_url)
            repository.init_schema()
            detail = repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-FC-BAD-SHAPE",
                    file_name="demand_forecast.csv",
                    file_type="demand_forecast",
                    uploaded_by="计划管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    rows=[
                        ImportBatchRowResultInput(
                            row_number=8,
                            row_status="success",
                            source_key="BAD",
                            raw_data={"unexpected": {}},
                        )
                    ],
                    versions=[
                        ImportBatchVersionInput(
                            version_id="IMPORT-FC-BAD-SHAPE",
                            version_type="demand_forecast",
                            business_date_from="2026-05-11",
                            business_date_to="2026-05-11",
                        )
                    ],
                )
            )
        forecast_repository = ForecastPersistenceRepository("sqlite+pysqlite:///:memory:")

        with self.assertRaisesRegex(ValueError, "row_number=8.*standard_fields"):
            apply_forecast_import_batch(detail, forecast_repository)


def _success_row(
    row_number: int,
    standard_fields: dict[str, str],
) -> ImportBatchRowResultInput:
    return ImportBatchRowResultInput(
        row_number=row_number,
        row_status="success",
        source_key=(
            standard_fields.get("forecast_interval_id")
            or f"{standard_fields.get('workplace_id')}|"
            f"{standard_fields.get('project_id')}|"
            f"{standard_fields.get('skill_id')}|"
            f"{standard_fields.get('forecast_date')}|"
            f"{standard_fields.get('interval_start')}"
        ),
        raw_data={"standard_fields": standard_fields},
    )


def _detail_with_standard_fields(
    *,
    batch_id: str,
    file_type: str = "demand_forecast",
    row_number: int = 1,
    standard_fields: dict[str, str] | None = None,
    versions: list[ImportBatchVersionInput] | None = None,
) -> ImportBatchPersistenceDetail:
    fields = standard_fields or {
        "forecast_date": "2026-05-11",
        "interval_start": "09:00",
        "interval_end": "09:30",
        "workplace_id": "SH-01",
        "project_id": "BOSCH-CS",
        "skill_id": "L1-CN",
        "demand_level": "L1",
        "required_agents": "12",
    }
    with tempfile.TemporaryDirectory() as directory:
        database_url = f"sqlite+pysqlite:///{Path(directory) / 'forecast-import.db'}"
        repository = ImportPersistenceRepository(database_url)
        repository.init_schema()
        return repository.create_import_batch(
            ImportBatchCreateRequest(
                batch_id=batch_id,
                file_name="demand_forecast.csv",
                file_type=file_type,
                uploaded_by="计划管理员",
                business_date_from="2026-05-11",
                business_date_to="2026-05-11",
                rows=[_success_row(row_number, fields)],
                versions=(
                    versions
                    if versions is not None
                    else [
                        ImportBatchVersionInput(
                            version_id=f"{batch_id}::v1",
                            version_type="demand_forecast",
                            business_date_from="2026-05-11",
                            business_date_to="2026-05-11",
                        )
                    ]
                ),
            )
        )


def _seed_master_data(database_url: str, batch_id: str) -> None:
    master_repository = MasterDataPersistenceRepository(database_url)
    master_repository.init_schema()
    master_repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id=batch_id,
            workplaces=[_reference("SH-01", "上海职场")],
            projects=[_reference("BOSCH-CS", "博西客服")],
            skills=[_reference("L1-CN", "中文一线")],
            employees=[
                EmployeeMasterDataInput(
                    employee_id="A-1001",
                    employee_name="张三",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
        )
    )


def _reference(reference_id: str, reference_name: str) -> MasterDataReferenceInput:
    return MasterDataReferenceInput(
        reference_id=reference_id,
        reference_name=reference_name,
        status="active",
        effective_from="2026-05-01",
        effective_to="2026-12-31",
    )


if __name__ == "__main__":
    unittest.main()
