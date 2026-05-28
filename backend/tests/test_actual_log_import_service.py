import tempfile
import unittest
from pathlib import Path

from backend.app.actual_log_import import apply_actual_log_import_batch
from backend.app.actual_log_persistence import ActualLogPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeMasterDataInput,
    ImportBatchCreateRequest,
    ImportBatchPersistenceDetail,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    MasterDataSnapshotRequest,
)


class ActualLogImportServiceTest(unittest.TestCase):
    def test_login_success_rows_are_applied_to_actual_log_repository(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'actual-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_employee(database_url, "BATCH-LOGIN-APPLY-001")
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-LOGIN-APPLY-001",
                    file_name="login_log.csv",
                    file_type="login_log",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    rows=[
                        _success_row(
                            1,
                            {
                                "event_id": "LOGIN-001",
                                "employee_id": "A-1001",
                                "event_type": "login",
                                "event_at": "2026-05-11T08:59:30",
                                "timezone": "Asia/Shanghai",
                            },
                        ),
                        _success_row(
                            2,
                            {
                                "event_id": "LOGOUT-001",
                                "employee_id": "A-1001",
                                "event_type": "logout",
                                "event_at": "2026-05-11T18:03:00",
                                "timezone": "Asia/Shanghai",
                            },
                        ),
                        ImportBatchRowResultInput(
                            row_number=3,
                            row_status="failed",
                            source_key="IGNORED",
                            raw_data={"standard_fields": {"employee_id": "IGNORED"}},
                        ),
                    ],
                    versions=[
                        ImportBatchVersionInput(
                            version_id="IMPORT-LOGIN-APPLY-001",
                            version_type="login_log",
                            business_date_from="2026-05-11",
                            business_date_to="2026-05-11",
                        )
                    ],
                )
            )
            actual_repository = ActualLogPersistenceRepository(database_url)
            actual_repository.init_schema()

            summary = apply_actual_log_import_batch(detail, actual_repository)

            self.assertEqual(
                summary,
                {
                    "batch_id": "BATCH-LOGIN-APPLY-001",
                    "file_type": "login_log",
                    "login_events": 2,
                    "status_dictionary_entries": 0,
                    "status_intervals": 0,
                    "skipped_rows": 1,
                },
            )
            loaded = actual_repository.get_login_events("IMPORT-LOGIN-APPLY-001")
            self.assertEqual([event.event_type for event in loaded], ["login", "logout"])
            self.assertEqual([event.employee_id for event in loaded], ["A-1001", "A-1001"])

    def test_status_success_rows_apply_dictionary_and_intervals(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'actual-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_employee(database_url, "BATCH-STATUS-APPLY-001")
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-STATUS-APPLY-001",
                    file_name="status_log.csv",
                    file_type="status_log",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-12",
                    rows=[
                        _success_row(
                            1,
                            {
                                "record_type": "status_dictionary",
                                "external_status_code": "READY",
                                "normalized_status": "ready",
                                "category": "available",
                                "is_productive": "true",
                            },
                        ),
                        _success_row(
                            2,
                            {
                                "record_type": "status_interval",
                                "interval_id": "STATUS-001",
                                "employee_id": "A-1001",
                                "external_status_code": "READY",
                                "start_at": "2026-05-11T23:30:00",
                                "end_at": "2026-05-12T00:30:00",
                                "timezone": "Asia/Shanghai",
                            },
                        ),
                        ImportBatchRowResultInput(
                            row_number=3,
                            row_status="failed",
                            source_key="IGNORED",
                            raw_data={"standard_fields": {"record_type": "status_interval"}},
                        ),
                    ],
                    versions=[
                        ImportBatchVersionInput(
                            version_id="IMPORT-STATUS-APPLY-001",
                            version_type="status_log",
                            business_date_from="2026-05-11",
                            business_date_to="2026-05-12",
                        )
                    ],
                )
            )
            actual_repository = ActualLogPersistenceRepository(database_url)
            actual_repository.init_schema()

            summary = apply_actual_log_import_batch(detail, actual_repository)

            self.assertEqual(summary["status_dictionary_entries"], 1)
            self.assertEqual(summary["status_intervals"], 1)
            self.assertEqual(summary["skipped_rows"], 1)
            self.assertEqual(
                [
                    (row.business_date, row.interval_start, row.interval_end)
                    for row in actual_repository.get_status_intervals(
                        "IMPORT-STATUS-APPLY-001"
                    )
                ],
                [
                    ("2026-05-11", "23:30", "24:00"),
                    ("2026-05-12", "00:00", "00:30"),
                ],
            )

    def test_non_actual_log_batch_is_rejected(self) -> None:
        detail = _detail_with_standard_fields(
            batch_id="BATCH-FC-001",
            file_type="demand_forecast",
            version_type="demand_forecast",
        )
        actual_repository = ActualLogPersistenceRepository("sqlite+pysqlite:///:memory:")

        with self.assertRaisesRegex(ValueError, "login_log or status_log"):
            apply_actual_log_import_batch(detail, actual_repository)

    def test_missing_actual_import_version_is_rejected(self) -> None:
        detail = _detail_with_standard_fields(
            batch_id="BATCH-LOGIN-NO-VERSION",
            file_type="login_log",
            versions=[],
        )
        actual_repository = ActualLogPersistenceRepository("sqlite+pysqlite:///:memory:")

        with self.assertRaisesRegex(ValueError, "import version"):
            apply_actual_log_import_batch(detail, actual_repository)

    def test_missing_required_field_reports_row_number(self) -> None:
        detail = _detail_with_standard_fields(
            batch_id="BATCH-LOGIN-MISSING-FIELD",
            file_type="login_log",
            row_number=4,
            standard_fields={
                "event_id": "LOGIN-MISSING",
                "employee_id": "A-1001",
                "event_type": "login",
                "timezone": "Asia/Shanghai",
            },
        )
        actual_repository = ActualLogPersistenceRepository("sqlite+pysqlite:///:memory:")

        with self.assertRaisesRegex(ValueError, "row_number=4.*event_at"):
            apply_actual_log_import_batch(detail, actual_repository)

    def test_invalid_status_dictionary_boolean_reports_row_number(self) -> None:
        detail = _detail_with_standard_fields(
            batch_id="BATCH-STATUS-BAD-BOOL",
            file_type="status_log",
            row_number=7,
            standard_fields={
                "record_type": "status_dictionary",
                "external_status_code": "READY",
                "normalized_status": "ready",
                "category": "available",
                "is_productive": "maybe",
            },
        )
        actual_repository = ActualLogPersistenceRepository("sqlite+pysqlite:///:memory:")

        with self.assertRaisesRegex(ValueError, "row_number=7.*is_productive"):
            apply_actual_log_import_batch(detail, actual_repository)

    def test_unknown_raw_shape_reports_row_number(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'actual-import.db'}"
            repository = ImportPersistenceRepository(database_url)
            repository.init_schema()
            detail = repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-ACTUAL-BAD-SHAPE",
                    file_name="login_log.csv",
                    file_type="login_log",
                    uploaded_by="数据管理员",
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
                            version_id="IMPORT-ACTUAL-BAD-SHAPE",
                            version_type="login_log",
                            business_date_from="2026-05-11",
                            business_date_to="2026-05-11",
                        )
                    ],
                )
            )
        actual_repository = ActualLogPersistenceRepository("sqlite+pysqlite:///:memory:")

        with self.assertRaisesRegex(ValueError, "row_number=8.*standard_fields"):
            apply_actual_log_import_batch(detail, actual_repository)


def _success_row(
    row_number: int,
    standard_fields: dict[str, str],
) -> ImportBatchRowResultInput:
    return ImportBatchRowResultInput(
        row_number=row_number,
        row_status="success",
        source_key=standard_fields.get("event_id")
        or standard_fields.get("interval_id")
        or standard_fields.get("external_status_code")
        or f"ROW-{row_number}",
        raw_data={"standard_fields": standard_fields},
    )


def _detail_with_standard_fields(
    *,
    batch_id: str,
    file_type: str,
    version_type: str | None = None,
    row_number: int = 1,
    standard_fields: dict[str, str] | None = None,
    versions: list[ImportBatchVersionInput] | None = None,
) -> ImportBatchPersistenceDetail:
    fields = standard_fields or {
        "event_id": "LOGIN-001",
        "employee_id": "A-1001",
        "event_type": "login",
        "event_at": "2026-05-11T09:00:00",
        "timezone": "Asia/Shanghai",
    }
    with tempfile.TemporaryDirectory() as directory:
        database_url = f"sqlite+pysqlite:///{Path(directory) / 'actual-import.db'}"
        repository = ImportPersistenceRepository(database_url)
        repository.init_schema()
        return repository.create_import_batch(
            ImportBatchCreateRequest(
                batch_id=batch_id,
                file_name=f"{file_type}.csv",
                file_type=file_type,
                uploaded_by="数据管理员",
                business_date_from="2026-05-11",
                business_date_to="2026-05-12",
                rows=[_success_row(row_number, fields)],
                versions=(
                    versions
                    if versions is not None
                    else [
                        ImportBatchVersionInput(
                            version_id=f"{batch_id}::v1",
                            version_type=version_type or file_type,
                            business_date_from="2026-05-11",
                            business_date_to="2026-05-12",
                        )
                    ]
                ),
            )
        )


def _seed_employee(database_url: str, batch_id: str) -> None:
    master_repository = MasterDataPersistenceRepository(database_url)
    master_repository.init_schema()
    master_repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id=batch_id,
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


if __name__ == "__main__":
    unittest.main()
