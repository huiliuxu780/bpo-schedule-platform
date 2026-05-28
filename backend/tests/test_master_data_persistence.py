import tempfile
import unittest
from pathlib import Path

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeBindingInput,
    EmployeeMasterDataInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    MasterDataReferenceInput,
    MasterDataSnapshotRequest,
)


class MasterDataPersistenceTest(unittest.TestCase):
    def test_master_data_bindings_survive_new_repository_instance(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'master_data.db'}"
            _create_import_batch(database_url, "BATCH-MD-001")
            writer = MasterDataPersistenceRepository(database_url)
            writer.init_schema()

            writer.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-001",
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
                            binding_id="BIND-A-1001",
                            employee_id="A-1001",
                            supplier_id="SUP-A",
                            workplace_id="SH-01",
                            project_id="BOSCH-CS",
                            skill_id="L1-CN",
                            effective_from="2026-05-11",
                            effective_to="2026-06-30",
                        )
                    ],
                )
            )

            reader = MasterDataPersistenceRepository(database_url)
            loaded = reader.get_employee_binding("BIND-A-1001")

            self.assertIsNotNone(loaded)
            self.assertEqual(loaded.employee_id, "A-1001")
            self.assertEqual(loaded.supplier_id, "SUP-A")
            self.assertEqual(loaded.workplace_id, "SH-01")
            self.assertEqual(loaded.project_id, "BOSCH-CS")
            self.assertEqual(loaded.skill_id, "L1-CN")

    def test_binding_rejects_frozen_references(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'master_data.db'}"
            _create_import_batch(database_url, "BATCH-MD-002")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(ValueError, "supplier_id SUP-FROZEN is frozen"):
                repository.create_snapshot(
                    MasterDataSnapshotRequest(
                        batch_id="BATCH-MD-002",
                        suppliers=[
                            MasterDataReferenceInput(
                                reference_id="SUP-FROZEN",
                                reference_name="供应商冻结",
                                status="frozen",
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
                                employee_id="A-1002",
                                employee_name="李四",
                                status="active",
                                effective_from="2026-05-01",
                                effective_to="2026-12-31",
                            )
                        ],
                        bindings=[
                            EmployeeBindingInput(
                                binding_id="BIND-A-1002",
                                employee_id="A-1002",
                                supplier_id="SUP-FROZEN",
                                workplace_id="SH-01",
                                project_id="BOSCH-CS",
                                skill_id="L1-CN",
                                effective_from="2026-05-11",
                                effective_to="2026-06-30",
                            )
                        ],
                    )
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
            business_date_from="2026-05-01",
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
