import tempfile
import unittest
from pathlib import Path

from backend.app.actual_log_persistence import ActualLogPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    ActualLoginEventInput,
    ActualStatusDictionaryInput,
    ActualStatusIntervalInput,
    ActualStatusIntervalImportRequest,
    EmployeeMasterDataInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    MasterDataSnapshotRequest,
)


class ActualLogPersistenceTest(unittest.TestCase):
    def test_login_logout_events_survive_new_repository(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'actual.db'}"
            _seed_import_and_employee(database_url)
            writer = ActualLogPersistenceRepository(database_url)
            writer.init_schema()

            writer.create_login_events(
                [
                    ActualLoginEventInput(
                        event_id="LOGIN-001",
                        import_version_id="IMPORT-LOGIN-20260511",
                        employee_id="A-1001",
                        event_type="login",
                        event_at="2026-05-11T08:59:30",
                        timezone="Asia/Shanghai",
                    ),
                    ActualLoginEventInput(
                        event_id="LOGOUT-001",
                        import_version_id="IMPORT-LOGIN-20260511",
                        employee_id="A-1001",
                        event_type="logout",
                        event_at="2026-05-11T18:03:00",
                        timezone="Asia/Shanghai",
                    ),
                ]
            )

            reader = ActualLogPersistenceRepository(database_url)
            loaded = reader.get_login_events("IMPORT-LOGIN-20260511")

            self.assertEqual([event.event_type for event in loaded], ["login", "logout"])
            self.assertEqual([event.employee_id for event in loaded], ["A-1001", "A-1001"])

    def test_status_interval_maps_dictionary_and_splits_cross_day(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'actual.db'}"
            _seed_import_and_employee(database_url)
            writer = ActualLogPersistenceRepository(database_url)
            writer.init_schema()
            writer.upsert_status_dictionary(
                [
                    ActualStatusDictionaryInput(
                        external_status_code="READY",
                        normalized_status="ready",
                        category="available",
                        is_productive=True,
                    )
                ]
            )

            writer.create_status_intervals(
                ActualStatusIntervalImportRequest(
                    import_version_id="IMPORT-STATUS-20260511",
                    intervals=[
                        ActualStatusIntervalInput(
                            interval_id="STATUS-001",
                            employee_id="A-1001",
                            external_status_code="READY",
                            start_at="2026-05-11T23:30:00",
                            end_at="2026-05-12T00:30:00",
                            timezone="Asia/Shanghai",
                        )
                    ],
                )
            )

            reader = ActualLogPersistenceRepository(database_url)
            loaded = reader.get_status_intervals("IMPORT-STATUS-20260511")

            self.assertEqual(
                [
                    (row.business_date, row.interval_start, row.interval_end)
                    for row in loaded
                ],
                [
                    ("2026-05-11", "23:30", "24:00"),
                    ("2026-05-12", "00:00", "00:30"),
                ],
            )
            self.assertEqual([row.normalized_status for row in loaded], ["ready", "ready"])
            self.assertEqual([row.category for row in loaded], ["available", "available"])
            self.assertEqual([row.is_productive for row in loaded], [True, True])

    def test_status_interval_rejects_frozen_employee(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'actual.db'}"
            _seed_import_and_employee(database_url, employee_status="frozen")
            repository = ActualLogPersistenceRepository(database_url)
            repository.init_schema()
            repository.upsert_status_dictionary(
                [
                    ActualStatusDictionaryInput(
                        external_status_code="READY",
                        normalized_status="ready",
                        category="available",
                        is_productive=True,
                    )
                ]
            )

            with self.assertRaisesRegex(ValueError, "employee_id A-1001 is frozen"):
                repository.create_status_intervals(
                    ActualStatusIntervalImportRequest(
                        import_version_id="IMPORT-STATUS-20260511",
                        intervals=[
                            ActualStatusIntervalInput(
                                interval_id="STATUS-FROZEN",
                                employee_id="A-1001",
                                external_status_code="READY",
                                start_at="2026-05-11T09:00:00",
                                end_at="2026-05-11T09:30:00",
                                timezone="Asia/Shanghai",
                            )
                        ],
                    )
                )

    def test_actual_logs_reject_non_shanghai_timezone(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'actual.db'}"
            _seed_import_and_employee(database_url)
            repository = ActualLogPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(ValueError, "timezone must be Asia/Shanghai"):
                repository.create_login_events(
                    [
                        ActualLoginEventInput(
                            event_id="LOGIN-TZ",
                            import_version_id="IMPORT-LOGIN-20260511",
                            employee_id="A-1001",
                            event_type="login",
                            event_at="2026-05-11T09:00:00",
                            timezone="UTC",
                        )
                    ]
                )

    def test_login_event_rejects_frozen_employee(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'actual.db'}"
            _seed_import_and_employee(database_url, employee_status="frozen")
            repository = ActualLogPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(ValueError, "employee_id A-1001 is frozen"):
                repository.create_login_events(
                    [
                        ActualLoginEventInput(
                            event_id="LOGIN-FROZEN",
                            import_version_id="IMPORT-LOGIN-20260511",
                            employee_id="A-1001",
                            event_type="login",
                            event_at="2026-05-11T09:00:00",
                            timezone="Asia/Shanghai",
                        )
                    ]
                )

    def test_status_interval_rejects_unknown_status_code(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'actual.db'}"
            _seed_import_and_employee(database_url)
            repository = ActualLogPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "external_status_code UNKNOWN does not exist",
            ):
                repository.create_status_intervals(
                    ActualStatusIntervalImportRequest(
                        import_version_id="IMPORT-STATUS-20260511",
                        intervals=[
                            ActualStatusIntervalInput(
                                interval_id="STATUS-UNKNOWN",
                                employee_id="A-1001",
                                external_status_code="UNKNOWN",
                                start_at="2026-05-11T09:00:00",
                                end_at="2026-05-11T09:30:00",
                                timezone="Asia/Shanghai",
                            )
                        ],
                    )
                )


def _seed_import_and_employee(database_url: str, employee_status: str = "active") -> None:
    import_repository = ImportPersistenceRepository(database_url)
    import_repository.init_schema()
    import_repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id="BATCH-ACTUAL-20260511",
            file_name="actual_logs_20260511.csv",
            file_type="login_log",
            uploaded_by="数据管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-12",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="A-1001|2026-05-11",
                    raw_data={"employee_id": "A-1001"},
                )
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-LOGIN-20260511",
                    version_type="login_log",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-12",
                ),
                ImportBatchVersionInput(
                    version_id="IMPORT-STATUS-20260511",
                    version_type="status_log",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-12",
                ),
            ],
        )
    )
    master_repository = MasterDataPersistenceRepository(database_url)
    master_repository.init_schema()
    master_repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id="BATCH-ACTUAL-20260511",
            employees=[
                EmployeeMasterDataInput(
                    employee_id="A-1001",
                    employee_name="张三",
                    status=employee_status,
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
        )
    )


if __name__ == "__main__":
    unittest.main()
