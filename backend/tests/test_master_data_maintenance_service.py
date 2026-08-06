import tempfile
import unittest
from pathlib import Path

from sqlalchemy import inspect as inspect_schema
from sqlalchemy import text

from backend.app.import_persistence import ImportPersistenceRepository, build_engine
from backend.app import master_data_maintenance
from backend.app import models
from backend.app.master_data_maintenance import maintain_employee
from backend.app.master_data_maintenance import maintain_employee_binding
from backend.app.master_data_maintenance import maintain_employee_skills
from backend.app.master_data_maintenance import maintain_organization
from backend.app.master_data_maintenance import maintain_reference
from backend.app.master_data_maintenance import maintain_workplace_service_team
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeMasterDataInput,
    EmployeeBindingInput,
    EmployeeSkillInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    MasterDataEmployeeSkillMaintenanceRequest,
    MasterDataEmployeeMaintenanceRequest,
    MasterDataBindingMaintenanceRequest,
    MasterDataOrganizationMaintenanceRequest,
    MasterDataOrganizationInput,
    MasterDataReferenceInput,
    MasterDataReferenceMaintenanceRequest,
    MasterDataSnapshotRequest,
    MasterDataWorkplaceServiceTeamMaintenanceRequest,
)


class MasterDataMaintenanceServiceTest(unittest.TestCase):
    def test_workplace_service_team_maintenance_contract_is_exposed(self) -> None:
        self.assertTrue(
            hasattr(models, "MasterDataWorkplaceServiceTeamMaintenanceRequest")
        )
        self.assertTrue(hasattr(models, "MasterDataWorkplaceServiceTeamRecord"))
        self.assertTrue(
            hasattr(master_data_maintenance, "maintain_workplace_service_team")
        )
        self.assertTrue(
            hasattr(
                MasterDataPersistenceRepository,
                "list_workplace_service_teams",
            )
        )

    def test_create_edit_and_freeze_workplace_service_team(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'service-team.db'}"
            _create_import_batch(database_url, "BATCH-MD-SERVICE-TEAM")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-SERVICE-TEAM",
                    workplaces=[
                        MasterDataReferenceInput(
                            reference_id="SH-01",
                            reference_name="上海职场",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                    suppliers=[
                        MasterDataReferenceInput(
                            reference_id="SUP-001",
                            reference_name="上海供应商",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                    organizations=[
                        MasterDataOrganizationInput(
                            organization_id="ORG-CC",
                            organization_name="CC",
                            organization_level=1,
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                        MasterDataOrganizationInput(
                            organization_id="ORG-RETURN",
                            organization_name="集中退换小组",
                            organization_level=2,
                            parent_organization_id="ORG-CC",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                    ],
                )
            )

            created = maintain_workplace_service_team(
                "TEAM-SH-RETURN",
                MasterDataWorkplaceServiceTeamMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-SERVICE-TEAM",
                    workplace_id="SH-01",
                    team_type="internal",
                    team_name="集中退换小组",
                    organization_id="ORG-RETURN",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )
            edited = maintain_workplace_service_team(
                "TEAM-SH-RETURN",
                MasterDataWorkplaceServiceTeamMaintenanceRequest(
                    action="edit",
                    source_batch_id="BATCH-MD-SERVICE-TEAM",
                    team_type="supplier",
                    team_name="供应商驻场团队",
                    supplier_id="SUP-001",
                ),
                repository,
            )
            frozen = maintain_workplace_service_team(
                "TEAM-SH-RETURN",
                MasterDataWorkplaceServiceTeamMaintenanceRequest(
                    action="freeze",
                    source_batch_id="BATCH-MD-SERVICE-TEAM",
                ),
                repository,
            )

        self.assertEqual(created.action_status, "created")
        self.assertEqual(created.service_team.organization_id, "ORG-RETURN")
        self.assertIsNone(created.service_team.supplier_id)
        self.assertEqual(edited.action_status, "updated")
        self.assertEqual(edited.service_team.team_type, "supplier")
        self.assertIsNone(edited.service_team.organization_id)
        self.assertEqual(edited.service_team.supplier_id, "SUP-001")
        self.assertEqual(frozen.action_status, "frozen")
        self.assertEqual(frozen.service_team.status, "frozen")

    def test_legacy_local_schema_allows_employee_skill_and_organization_maintenance(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'legacy-maintenance.db'}"
            _create_legacy_master_data_schema(database_url, "BATCH-MD-LEGACY")
            repository = MasterDataPersistenceRepository(database_url)

            created_employee = maintain_employee(
                "A-LEGACY-NEW",
                MasterDataEmployeeMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-LEGACY",
                    employee_name="旧库新增员工",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )
            created_skill = maintain_reference(
                "skills",
                "SKILL-LEGACY-NEW",
                MasterDataReferenceMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-LEGACY",
                    reference_name="旧库新增技能",
                    skill_category="ticket",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )
            created_organization = maintain_organization(
                "ORG-LEGACY",
                MasterDataOrganizationMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-LEGACY",
                    organization_name="旧库组织",
                    organization_level=1,
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(created_employee.employee.employee_type, "internal")
            self.assertIsNone(created_employee.employee.organization_id)
            self.assertIsNone(created_employee.employee.workplace_id)
            self.assertEqual(created_skill.reference.skill_category, "ticket")
            self.assertEqual(created_organization.organization.organization_path, "旧库组织")

    def test_pre_restrictions_legacy_schema_backfills_columns_and_keeps_paths(self) -> None:
        """alembic 20260804_0011 之前的旧表：运行时 ensure 补齐限制三列。

        覆盖：补列幂等、存量行默认值回填、员工列表走 enriched 投影、
        restrictions 读写正常、重导入保留既有约束。
        """
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'pre-restrictions.db'}"
            _create_legacy_master_data_schema(
                database_url, "BATCH-MD-PRE-RESTRICT", include_restrictions=False
            )
            engine = build_engine(database_url)
            # 补列前写入的存量行：用于验证 ALTER 默认值回填与 0011 一致。
            with engine.begin() as connection:
                connection.execute(
                    text(
                        """
                        INSERT INTO master_data_employees (
                            employee_id, employee_name, status,
                            effective_from, effective_to, batch_id
                        )
                        VALUES ('A-OLD-001', '张三', 'active',
                                '2026-06-01', '2026-12-31', 'BATCH-MD-PRE-RESTRICT')
                        """
                    )
                )

            repository = MasterDataPersistenceRepository(database_url)

            employee_columns = {
                column["name"]
                for column in inspect_schema(engine).get_columns("master_data_employees")
            }
            for column in (
                "night_shift_allowed",
                "cross_day_allowed",
                "unavailable_dates",
            ):
                self.assertIn(column, employee_columns)
            with engine.connect() as connection:
                stored = connection.execute(
                    text(
                        "SELECT night_shift_allowed, cross_day_allowed, unavailable_dates "
                        "FROM master_data_employees WHERE employee_id = 'A-OLD-001'"
                    )
                ).one()
            self.assertEqual(stored[0], 1)
            self.assertEqual(stored[1], 1)
            self.assertEqual(stored[2], "[]")

            updated = repository.update_employee_restrictions(
                "A-OLD-001",
                night_shift_allowed=False,
                cross_day_allowed=False,
                unavailable_dates=["2026-08-10"],
            )
            self.assertFalse(updated.night_shift_allowed)
            self.assertFalse(updated.cross_day_allowed)
            self.assertEqual(updated.unavailable_dates, ["2026-08-10"])

            # 限制值为 False 只可能来自 enriched 投影（legacy 投影恒为默认 True）。
            rows = repository.list_employees()
            self.assertEqual(len(rows), 1)
            self.assertEqual(rows[0].employee_id, "A-OLD-001")
            self.assertEqual(rows[0].employee_type, "internal")
            self.assertFalse(rows[0].night_shift_allowed)
            self.assertFalse(rows[0].cross_day_allowed)
            self.assertEqual(rows[0].unavailable_dates, ["2026-08-10"])

            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-PRE-RESTRICT",
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-OLD-001",
                            employee_name="张三（改）",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )
            reimported = repository.get_employee("A-OLD-001")
            self.assertIsNotNone(reimported)
            assert reimported is not None
            self.assertEqual(reimported.employee_name, "张三（改）")
            self.assertFalse(reimported.night_shift_allowed)
            self.assertFalse(reimported.cross_day_allowed)
            self.assertEqual(reimported.unavailable_dates, ["2026-08-10"])

            # 再次构造 repository（ensure 重跑）：列已存在时 ALTER 被跳过。
            MasterDataPersistenceRepository(database_url)
            engine.dispose()

    def test_create_edit_and_freeze_organization_writes_hierarchy_record(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'organization-maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-ORG-MAINT")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-ORG-MAINT",
                    organizations=[
                        MasterDataOrganizationInput(
                            organization_id="ORG-CC",
                            organization_name="CC",
                            organization_level=1,
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            created = maintain_organization(
                "ORG-RETURN",
                MasterDataOrganizationMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-ORG-MAINT",
                    organization_name="集中退换小组",
                    organization_level=2,
                    parent_organization_id="ORG-CC",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )
            edited = maintain_organization(
                "ORG-RETURN",
                MasterDataOrganizationMaintenanceRequest(
                    action="edit",
                    source_batch_id="BATCH-MD-ORG-MAINT",
                    organization_name="集中退换组",
                    organization_level=2,
                    parent_organization_id="ORG-CC",
                    status="inactive",
                    effective_from="2026-07-01",
                ),
                repository,
            )
            frozen = maintain_organization(
                "ORG-RETURN",
                MasterDataOrganizationMaintenanceRequest(
                    action="freeze",
                    source_batch_id="BATCH-MD-ORG-MAINT",
                ),
                repository,
            )

            self.assertEqual(created.action_status, "created")
            self.assertEqual(created.organization.organization_path, "CC / 集中退换小组")
            self.assertEqual(edited.action_status, "updated")
            self.assertEqual(edited.organization.organization_name, "集中退换组")
            self.assertEqual(edited.organization.status, "inactive")
            self.assertEqual(edited.organization.effective_from, "2026-07-01")
            self.assertEqual(frozen.action_status, "frozen")
            self.assertEqual(frozen.organization.organization_name, "集中退换组")
            self.assertEqual(frozen.organization.status, "frozen")
            self.assertEqual(frozen.organization.parent_organization_id, "ORG-CC")

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

    def test_edit_employee_updates_type_organization_and_workplace(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-010")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-010",
                    workplaces=[
                        MasterDataReferenceInput(
                            reference_id="NJ-01",
                            reference_name="南京职场",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                        MasterDataReferenceInput(
                            reference_id="SH-01",
                            reference_name="上海职场",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                    ],
                    organizations=[
                        MasterDataOrganizationInput(
                            organization_id="ORG-RETURN",
                            organization_name="集中退换小组",
                            organization_level=1,
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                        MasterDataOrganizationInput(
                            organization_id="ORG-SUPPORT",
                            organization_name="在线支持小组",
                            organization_level=1,
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                    ],
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2010",
                            employee_name="刘晓晓",
                            status="active",
                            employee_type="internal",
                            organization_id="ORG-RETURN",
                            workplace_id="NJ-01",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            response = maintain_employee(
                "A-2010",
                MasterDataEmployeeMaintenanceRequest(
                    action="edit",
                    source_batch_id="BATCH-MD-MAINT-010",
                    employee_name="刘晓晓-修正",
                    status="inactive",
                    employee_type="outsourced",
                    organization_id="ORG-SUPPORT",
                    workplace_id="SH-01",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "updated")
            self.assertEqual(response.employee.employee_name, "刘晓晓-修正")
            self.assertEqual(response.employee.status, "inactive")
            self.assertEqual(response.employee.employee_type, "outsourced")
            self.assertEqual(response.employee.organization_id, "ORG-SUPPORT")
            self.assertEqual(response.employee.workplace_id, "SH-01")

    def test_replace_employee_skills_updates_skill_set(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-011")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-011",
                    skills=[
                        MasterDataReferenceInput(
                            reference_id="SKILL-RETURN-TICKET",
                            reference_name="集中退换工单",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                            skill_category="ticket",
                        ),
                        MasterDataReferenceInput(
                            reference_id="SKILL-RETURN-CALL",
                            reference_name="集中退换外呼",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                            skill_category="hotline",
                        ),
                        MasterDataReferenceInput(
                            reference_id="SKILL-GENERAL",
                            reference_name="通用技能组",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                            skill_category="online",
                        ),
                    ],
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2011",
                            employee_name="刘晓晓",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                    employee_skills=[
                        EmployeeSkillInput(
                            employee_id="A-2011",
                            skill_id="SKILL-RETURN-TICKET",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                    ],
                )
            )

            response = maintain_employee_skills(
                "A-2011",
                MasterDataEmployeeSkillMaintenanceRequest(
                    action="replace",
                    source_batch_id="BATCH-MD-MAINT-011",
                    skill_ids=["SKILL-RETURN-CALL", "SKILL-GENERAL"],
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "replaced")
            self.assertEqual(response.employee_id, "A-2011")
            self.assertEqual(
                [(skill.skill_id, skill.skill_category) for skill in response.skills],
                [
                    ("SKILL-GENERAL", "online"),
                    ("SKILL-RETURN-CALL", "hotline"),
                ],
            )
            self.assertEqual(
                [skill.skill_id for skill in repository.list_employee_skills("A-2011")],
                ["SKILL-GENERAL", "SKILL-RETURN-CALL"],
            )

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

    def test_create_reference_writes_workplace_record(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-006")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            response = maintain_reference(
                "workplaces",
                "SITE-001",
                MasterDataReferenceMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-MAINT-006",
                    reference_name="上海职场",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "created")
            self.assertEqual(response.reference.reference_id, "SITE-001")
            self.assertEqual(response.reference.reference_name, "上海职场")
            self.assertEqual(response.reference.status, "active")
            self.assertEqual(response.reference.batch_id, "BATCH-MD-MAINT-006")

    def test_create_skill_reference_writes_skill_category(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-SKILL")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            response = maintain_reference(
                "skills",
                "SKILL-ONLINE-001",
                MasterDataReferenceMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-MAINT-SKILL",
                    reference_name="在线接待",
                    skill_category="online",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "created")
            self.assertEqual(response.reference.reference_id, "SKILL-ONLINE-001")
            self.assertEqual(response.reference.skill_category, "online")

    def test_freeze_reference_preserves_project_name_and_effective_period(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-007")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-007",
                    projects=[
                        MasterDataReferenceInput(
                            reference_id="PROJ-001",
                            reference_name="热线项目",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            response = maintain_reference(
                "projects",
                "PROJ-001",
                MasterDataReferenceMaintenanceRequest(
                    action="freeze",
                    source_batch_id="BATCH-MD-MAINT-007",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "frozen")
            self.assertEqual(response.reference.reference_name, "热线项目")
            self.assertEqual(response.reference.status, "frozen")
            self.assertEqual(response.reference.effective_from, "2026-06-01")

    def test_create_binding_rejects_frozen_supplier_reference(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-008")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            _seed_binding_references(repository, "BATCH-MD-MAINT-008", supplier_status="frozen")

            with self.assertRaisesRegex(ValueError, "supplier_id SUP-001 is frozen"):
                maintain_employee_binding(
                    "BIND-001",
                    MasterDataBindingMaintenanceRequest(
                        action="create",
                        source_batch_id="BATCH-MD-MAINT-008",
                        employee_id="A-4001",
                        supplier_id="SUP-001",
                        workplace_id="SITE-001",
                        project_id="PROJ-001",
                        skill_id="SKILL-001",
                        effective_from="2026-06-01",
                        effective_to="2026-12-31",
                    ),
                    repository,
                )

    def test_create_binding_writes_validated_relationship(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-009")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            _seed_binding_references(repository, "BATCH-MD-MAINT-009")

            response = maintain_employee_binding(
                "BIND-002",
                MasterDataBindingMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-MAINT-009",
                    employee_id="A-4001",
                    supplier_id="SUP-001",
                    workplace_id="SITE-001",
                    project_id="PROJ-001",
                    skill_id="SKILL-001",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "created")
            self.assertEqual(response.binding.binding_id, "BIND-002")
            self.assertEqual(response.binding.employee_id, "A-4001")
            self.assertEqual(response.binding.supplier_id, "SUP-001")


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


def _create_legacy_master_data_schema(
    database_url: str,
    batch_id: str,
    *,
    include_restrictions: bool = True,
) -> None:
    """旧版运行时建表形态的 fixture。

    include_restrictions=False 还原 alembic 20260804_0011 之前的真实旧表：
    master_data_employees 不含员工排班限制三列。
    """
    engine = build_engine(database_url)
    with engine.begin() as connection:
        connection.execute(
            text(
                """
                CREATE TABLE import_batches (
                    batch_id VARCHAR(80) NOT NULL PRIMARY KEY,
                    file_name VARCHAR(255) NOT NULL,
                    file_type VARCHAR(80) NOT NULL,
                    uploaded_by VARCHAR(120) NOT NULL,
                    uploaded_at VARCHAR(40) NOT NULL,
                    business_date_from VARCHAR(20) NOT NULL,
                    business_date_to VARCHAR(20) NOT NULL,
                    processing_status VARCHAR(40) NOT NULL,
                    total_rows INTEGER NOT NULL,
                    success_rows INTEGER NOT NULL,
                    failed_rows INTEGER NOT NULL,
                    warning_rows INTEGER NOT NULL
                )
                """
            )
        )
        connection.execute(
            text(
                """
                INSERT INTO import_batches (
                    batch_id,
                    file_name,
                    file_type,
                    uploaded_by,
                    uploaded_at,
                    business_date_from,
                    business_date_to,
                    processing_status,
                    total_rows,
                    success_rows,
                    failed_rows,
                    warning_rows
                )
                VALUES (
                    :batch_id,
                    :file_name,
                    'master_data',
                    '数据管理员',
                    '2026-06-08T00:00:00+00:00',
                    '2026-06-01',
                    '2026-12-31',
                    'completed',
                    1,
                    1,
                    0,
                    0
                )
                """
            ),
            {"batch_id": batch_id, "file_name": f"{batch_id}.csv"},
        )
        restriction_columns = (
            """
                    night_shift_allowed BOOLEAN NOT NULL DEFAULT 1,
                    cross_day_allowed BOOLEAN NOT NULL DEFAULT 1,
                    unavailable_dates JSON NOT NULL DEFAULT '[]',
"""
            if include_restrictions
            else ""
        )
        connection.execute(
            text(
                """
                CREATE TABLE master_data_employees (
                    employee_id VARCHAR(80) NOT NULL PRIMARY KEY,
                    employee_name VARCHAR(255) NOT NULL,
                    status VARCHAR(20) NOT NULL,
                    effective_from VARCHAR(20) NOT NULL,
                    effective_to VARCHAR(20) NOT NULL,
"""
                + restriction_columns
                + """
                    batch_id VARCHAR(80) NOT NULL
                )
                """
            )
        )
        connection.execute(
            text(
                """
                CREATE TABLE master_data_skills (
                    skill_id VARCHAR(80) NOT NULL PRIMARY KEY,
                    skill_name VARCHAR(255) NOT NULL,
                    status VARCHAR(20) NOT NULL,
                    effective_from VARCHAR(20) NOT NULL,
                    effective_to VARCHAR(20) NOT NULL,
                    batch_id VARCHAR(80) NOT NULL
                )
                """
            )
        )


def _seed_binding_references(
    repository: MasterDataPersistenceRepository,
    batch_id: str,
    supplier_status: str = "active",
) -> None:
    repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id=batch_id,
            suppliers=[
                MasterDataReferenceInput(
                    reference_id="SUP-001",
                    reference_name="供应商一",
                    status=supplier_status,
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            workplaces=[
                MasterDataReferenceInput(
                    reference_id="SITE-001",
                    reference_name="上海职场",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            projects=[
                MasterDataReferenceInput(
                    reference_id="PROJ-001",
                    reference_name="热线项目",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            skills=[
                MasterDataReferenceInput(
                    reference_id="SKILL-001",
                    reference_name="普通话",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            employees=[
                EmployeeMasterDataInput(
                    employee_id="A-4001",
                    employee_name="吴五",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
        )
    )


if __name__ == "__main__":
    unittest.main()
