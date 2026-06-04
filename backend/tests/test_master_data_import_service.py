import tempfile
import unittest
from pathlib import Path

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_import import apply_master_data_import_batch
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
)


class MasterDataImportServiceTest(unittest.TestCase):
    def test_success_rows_are_applied_to_master_data_repository(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'master_data.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-MD-IMPORT-001",
                    file_name="master_data.csv",
                    file_type="master_data",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-01",
                    business_date_to="2026-12-31",
                    rows=[
                        _success_row(
                            1,
                            {
                                "record_type": "supplier",
                                "supplier_id": "SUP-A",
                                "supplier_name": "供应商 A",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            2,
                            {
                                "record_type": "workplace",
                                "reference_id": "SH-01",
                                "reference_name": "上海职场",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            3,
                            {
                                "record_type": "project",
                                "project_id": "BOSCH-CS",
                                "project_name": "博西客服",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            4,
                            {
                                "record_type": "skill",
                                "skill_id": "L1-CN",
                                "skill_name": "中文一线",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            5,
                            {
                                "record_type": "employee",
                                "employee_id": "A-1001",
                                "employee_name": "张三",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            6,
                            {
                                "record_type": "binding",
                                "binding_id": "BIND-A-1001",
                                "employee_id": "A-1001",
                                "supplier_id": "SUP-A",
                                "workplace_id": "SH-01",
                                "project_id": "BOSCH-CS",
                                "skill_id": "L1-CN",
                                "effective_from": "2026-05-11",
                                "effective_to": "2026-06-30",
                            },
                        ),
                        ImportBatchRowResultInput(
                            row_number=7,
                            row_status="failed",
                            source_key="IGNORED",
                            raw_data={
                                "standard_fields": {
                                    "record_type": "supplier",
                                    "supplier_id": "SUP-IGNORED",
                                }
                            },
                        ),
                    ],
                )
            )
            master_repository = MasterDataPersistenceRepository(database_url)
            master_repository.init_schema()

            summary = apply_master_data_import_batch(detail, master_repository)

            self.assertEqual(
                summary,
                {
                    "batch_id": "BATCH-MD-IMPORT-001",
                    "applied_status": "applied",
                    "suppliers": 1,
                    "workplaces": 1,
                    "projects": 1,
                    "skills": 1,
                    "organizations": 0,
                    "employees": 1,
                    "employee_skills": 0,
                    "bindings": 1,
                    "skipped_rows": 1,
                },
            )
            binding = master_repository.get_employee_binding("BIND-A-1001")
            self.assertIsNotNone(binding)
            self.assertEqual(binding.employee_id, "A-1001")
            self.assertEqual(binding.supplier_id, "SUP-A")
            self.assertEqual(binding.batch_id, "BATCH-MD-IMPORT-001")

    def test_success_rows_apply_organization_employee_type_and_employee_skills(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'master_data.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-MD-IMPORT-ORG-001",
                    file_name="master_data.csv",
                    file_type="master_data",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-01",
                    business_date_to="2026-12-31",
                    rows=[
                        _success_row(
                            1,
                            {
                                "record_type": "workplace",
                                "workplace_id": "NJ-01",
                                "workplace_name": "南京职场",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            2,
                            {
                                "record_type": "organization",
                                "organization_id": "ORG-CC",
                                "organization_name": "CC",
                                "organization_level": "1",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            3,
                            {
                                "record_type": "organization",
                                "organization_id": "ORG-CCO",
                                "organization_name": "CCO",
                                "organization_level": "2",
                                "parent_organization_id": "ORG-CC",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            4,
                            {
                                "record_type": "organization",
                                "organization_id": "ORG-RETURN",
                                "organization_name": "集中退换小组",
                                "organization_level": "3",
                                "parent_organization_id": "ORG-CCO",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            5,
                            {
                                "record_type": "skill",
                                "skill_id": "SKILL-RETURN-TICKET",
                                "skill_name": "集中退换工单",
                                "skill_category": "ticket",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            6,
                            {
                                "record_type": "employee",
                                "employee_id": "A-2001",
                                "employee_name": "刘晓晓",
                                "employee_type": "internal",
                                "organization_id": "ORG-RETURN",
                                "workplace_id": "NJ-01",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                        _success_row(
                            7,
                            {
                                "record_type": "employee_skill",
                                "employee_id": "A-2001",
                                "skill_id": "SKILL-RETURN-TICKET",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        ),
                    ],
                )
            )
            master_repository = MasterDataPersistenceRepository(database_url)
            master_repository.init_schema()

            summary = apply_master_data_import_batch(detail, master_repository)
            employee = master_repository.get_employee("A-2001")
            organization = master_repository.get_organization("ORG-RETURN")
            employee_skills = master_repository.list_employee_skills("A-2001")

            self.assertEqual(summary["organizations"], 3)
            self.assertEqual(summary["employee_skills"], 1)
            self.assertIsNotNone(employee)
            self.assertEqual(employee.employee_type, "internal")
            self.assertEqual(employee.organization_id, "ORG-RETURN")
            self.assertEqual(employee.workplace_id, "NJ-01")
            self.assertIsNotNone(organization)
            self.assertEqual(organization.organization_path, "CC / CCO / 集中退换小组")
            self.assertEqual(employee_skills[0].skill_category, "ticket")

    def test_duplicate_batch_returns_already_applied_without_snapshot_write(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'master_data.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-MD-IMPORT-IDEMPOTENT",
                    file_name="master_data.csv",
                    file_type="master_data",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-01",
                    business_date_to="2026-12-31",
                    rows=[
                        _success_row(
                            1,
                            {
                                "record_type": "supplier",
                                "supplier_id": "SUP-A",
                                "supplier_name": "供应商 A",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        )
                    ],
                )
            )
            master_repository = CountingMasterDataRepository(database_url)
            master_repository.init_schema()

            first = apply_master_data_import_batch(detail, master_repository)
            second = apply_master_data_import_batch(detail, master_repository)

        self.assertEqual(first["applied_status"], "applied")
        self.assertEqual(second["applied_status"], "already_applied")
        self.assertEqual(master_repository.create_snapshot_calls, 1)

    def test_non_master_data_batch_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'master_data.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-PS-001",
                    file_name="personnel_schedule.csv",
                    file_type="personnel_schedule",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-01",
                    business_date_to="2026-05-31",
                    rows=[
                        _success_row(
                            1,
                            {
                                "record_type": "employee",
                                "employee_id": "A-1001",
                                "employee_name": "张三",
                                "status": "active",
                                "effective_from": "2026-05-01",
                                "effective_to": "2026-12-31",
                            },
                        )
                    ],
                )
            )
            master_repository = MasterDataPersistenceRepository(database_url)
            master_repository.init_schema()

            with self.assertRaisesRegex(ValueError, "master_data"):
                apply_master_data_import_batch(detail, master_repository)

    def test_missing_record_type_reports_row_number(self) -> None:
        detail = _detail_with_standard_fields("BATCH-MD-IMPORT-002", 3, {})
        master_repository = _empty_master_repository()

        with self.assertRaisesRegex(ValueError, "row_number=3.*record_type"):
            apply_master_data_import_batch(detail, master_repository)

    def test_missing_required_field_reports_row_number(self) -> None:
        detail = _detail_with_standard_fields(
            "BATCH-MD-IMPORT-003",
            5,
            {
                "record_type": "binding",
                "binding_id": "BIND-A-1001",
                "employee_id": "A-1001",
                "supplier_id": "SUP-A",
                "workplace_id": "SH-01",
                "project_id": "BOSCH-CS",
                "effective_from": "2026-05-11",
                "effective_to": "2026-06-30",
            },
        )
        master_repository = _empty_master_repository()

        with self.assertRaisesRegex(ValueError, "row_number=5.*skill_id"):
            apply_master_data_import_batch(detail, master_repository)


def _success_row(
    row_number: int,
    standard_fields: dict[str, str],
) -> ImportBatchRowResultInput:
    return ImportBatchRowResultInput(
        row_number=row_number,
        row_status="success",
        source_key=standard_fields.get("reference_id")
        or standard_fields.get("employee_id")
        or standard_fields.get("binding_id"),
        raw_data={"standard_fields": standard_fields},
    )


def _detail_with_standard_fields(
    batch_id: str,
    row_number: int,
    standard_fields: dict[str, str],
):
    with tempfile.TemporaryDirectory() as directory:
        database_url = f"sqlite+pysqlite:///{Path(directory) / 'master_data.db'}"
        repository = ImportPersistenceRepository(database_url)
        repository.init_schema()
        return repository.create_import_batch(
            ImportBatchCreateRequest(
                batch_id=batch_id,
                file_name="master_data.csv",
                file_type="master_data",
                uploaded_by="数据管理员",
                business_date_from="2026-05-01",
                business_date_to="2026-12-31",
                rows=[_success_row(row_number, standard_fields)],
            )
        )


def _empty_master_repository() -> MasterDataPersistenceRepository:
    return MasterDataPersistenceRepository("sqlite+pysqlite:///:memory:")


class CountingMasterDataRepository(MasterDataPersistenceRepository):
    def __init__(self, database_url: str):
        super().__init__(database_url)
        self.create_snapshot_calls = 0

    def create_snapshot(self, request):
        self.create_snapshot_calls += 1
        return super().create_snapshot(request)


if __name__ == "__main__":
    unittest.main()
