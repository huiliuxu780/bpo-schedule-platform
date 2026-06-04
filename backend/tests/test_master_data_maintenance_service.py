import tempfile
import unittest
from pathlib import Path

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_maintenance import maintain_employee
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeMasterDataInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    MasterDataEmployeeMaintenanceRequest,
    MasterDataSnapshotRequest,
)


class MasterDataMaintenanceServiceTest(unittest.TestCase):
    def test_create_employee_writes_single_agent_record(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-001")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            response = maintain_employee(
                "A-2001",
                MasterDataEmployeeMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-MAINT-001",
                    employee_name="赵一",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "created")
            self.assertEqual(response.employee.employee_id, "A-2001")
            self.assertEqual(response.employee.employee_name, "赵一")
            self.assertEqual(response.employee.status, "active")
            self.assertEqual(response.employee.batch_id, "BATCH-MD-MAINT-001")

    def test_freeze_employee_preserves_name_and_effective_period(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-002")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-002",
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2002",
                            employee_name="钱二",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            response = maintain_employee(
                "A-2002",
                MasterDataEmployeeMaintenanceRequest(
                    action="freeze",
                    source_batch_id="BATCH-MD-MAINT-002",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "frozen")
            self.assertEqual(response.employee.employee_name, "钱二")
            self.assertEqual(response.employee.status, "frozen")
            self.assertEqual(response.employee.effective_from, "2026-06-01")
            self.assertEqual(response.employee.effective_to, "2026-12-31")

    def test_edit_employee_updates_name_and_status(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-003")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-003",
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2003",
                            employee_name="李三",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            response = maintain_employee(
                "A-2003",
                MasterDataEmployeeMaintenanceRequest(
                    action="edit",
                    source_batch_id="BATCH-MD-MAINT-003",
                    employee_name="李三-修正",
                    status="inactive",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "updated")
            self.assertEqual(response.employee.employee_name, "李三-修正")
            self.assertEqual(response.employee.status, "inactive")
            self.assertEqual(response.employee.effective_from, "2026-06-01")

    def test_effective_period_updates_dates_only(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-004")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-004",
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2004",
                            employee_name="周四",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            response = maintain_employee(
                "A-2004",
                MasterDataEmployeeMaintenanceRequest(
                    action="effective_period",
                    source_batch_id="BATCH-MD-MAINT-004",
                    effective_from="2026-07-01",
                    effective_to="2026-10-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "effective_period_updated")
            self.assertEqual(response.employee.employee_name, "周四")
            self.assertEqual(response.employee.status, "active")
            self.assertEqual(response.employee.effective_from, "2026-07-01")
            self.assertEqual(response.employee.effective_to, "2026-10-31")

    def test_edit_missing_employee_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-005")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(ValueError, "EMPLOYEE_NOT_FOUND"):
                maintain_employee(
                    "A-MISSING",
                    MasterDataEmployeeMaintenanceRequest(
                        action="edit",
                        source_batch_id="BATCH-MD-MAINT-005",
                        employee_name="不存在",
                    ),
                    repository,
                )


def _create_import_batch(database_url: str, batch_id: str) -> None:
    repository = ImportPersistenceRepository(database_url)
    repository.init_schema()
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name=f"{batch_id}.csv",
            file_type="master_data",
            uploaded_by="数据管理员",
            business_date_from="2026-06-01",
            business_date_to="2026-12-31",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key=batch_id,
                    raw_data={"batch_id": batch_id},
                )
            ],
        )
    )


if __name__ == "__main__":
    unittest.main()
