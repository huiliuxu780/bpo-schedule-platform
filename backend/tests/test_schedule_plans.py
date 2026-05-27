import unittest

from fastapi import HTTPException

from backend.app.main import (
    app,
    create_schedule_plan_draft,
    get_schedule_plan,
    get_import_batch_result,
    import_master_data_csv,
    import_demand_forecast_csv,
    import_login_log_csv,
    import_personnel_schedule_csv,
    preview_csv_import,
    import_status_log_csv,
    list_imported_master_data_records,
    list_imported_personnel_schedule_records,
    list_personnel_schedule_interval_records,
    upsert_master_data_record,
    freeze_master_data_record,
    unfreeze_master_data_record,
    check_master_data_reference,
    list_import_batches,
    list_demand_plans,
    list_fulfillment_comparison_contract,
    list_master_data_import_contract,
    list_personnel_schedule_import_contract,
    list_shift_details,
    list_schedule_plans,
    list_schedule_risks,
    list_unavailability,
    update_schedule_plan_draft,
)
from backend.app.models import (
    DemandForecastCsvImportRequest,
    ImportBatchListResponse,
    LoginLogCsvImportRequest,
    CsvImportPreviewRequest,
    MasterDataCsvImportRequest,
    MasterDataRecordUpsertRequest,
    MasterDataReferenceCheckRequest,
    PersonnelScheduleCsvImportRequest,
    SchedulePlanDraftRequest,
    SchedulePlanIntervalInput,
    StatusLogCsvImportRequest,
)


class SchedulePlansApiTest(unittest.TestCase):
    def test_schedule_plan_list_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/schedule-plans", "GET"), routes)
        self.assertIn(("/api/v1/demand-plans", "GET"), routes)
        self.assertIn(("/api/v1/shift-details", "GET"), routes)
        self.assertIn(("/api/v1/schedule-risks", "GET"), routes)
        self.assertIn(("/api/v1/unavailability", "GET"), routes)
        self.assertIn(("/api/v1/master-data/import-contract", "GET"), routes)
        self.assertIn(("/api/v1/personnel-schedules/import-contract", "GET"), routes)
        self.assertIn(("/api/v1/fulfillment-comparison/contract", "GET"), routes)
        self.assertIn(("/api/v1/schedule-plans/drafts", "POST"), routes)
        self.assertIn(("/api/v1/schedule-plans/{plan_id}/draft", "PUT"), routes)
        self.assertIn(("/api/v1/import-batches/preview", "POST"), routes)
        self.assertIn(("/api/v1/import-batches/master-data", "POST"), routes)
        self.assertIn(("/api/v1/master-data/records", "POST"), routes)
        self.assertIn(("/api/v1/master-data/records/{employee_id}", "PUT"), routes)
        self.assertIn(("/api/v1/master-data/records/{employee_id}/freeze", "POST"), routes)
        self.assertIn(("/api/v1/master-data/records/{employee_id}/unfreeze", "POST"), routes)
        self.assertIn(("/api/v1/master-data/reference-check", "POST"), routes)
        self.assertIn(("/api/v1/import-batches/demand-forecast", "POST"), routes)
        self.assertIn(("/api/v1/import-batches/personnel-schedule", "POST"), routes)
        self.assertIn(("/api/v1/import-batches/login-log", "POST"), routes)
        self.assertIn(("/api/v1/import-batches/status-log", "POST"), routes)
        self.assertIn(("/api/v1/master-data/imported-records", "GET"), routes)
        self.assertIn(("/api/v1/personnel-schedules/imported-records", "GET"), routes)
        self.assertIn(("/api/v1/personnel-schedules/interval-schedules", "GET"), routes)
        self.assertIn(("/api/v1/import-batches", "GET"), routes)
        self.assertIn(("/api/v1/import-batches/{batch_id}", "GET"), routes)

    def test_csv_import_preview_maps_uploaded_headers_before_import(self) -> None:
        response = preview_csv_import(
            CsvImportPreviewRequest(
                file_name="demand_forecast_preview.csv",
                import_type="demand_forecast",
                csv_content=(
                    "business_date,workplace_id,project_id,interval_start,interval_end,skill_group,grade,forecast_agents\n"
                    "2026-05-11,SH,P1,09:00,09:30,热线,L2,12\n"
                    "2026-05-11,SH,P1,09:30,10:00,热线,L2,14"
                ),
            )
        )

        self.assertEqual(response.file_name, "demand_forecast_preview.csv")
        self.assertEqual(response.import_type, "demand_forecast")
        self.assertEqual(response.total_rows, 2)
        self.assertEqual(response.missing_required_fields, [])
        self.assertIn("forecast_agents", response.pending_validation_fields)

    def test_csv_import_preview_identifies_missing_master_data_headers(self) -> None:
        response = preview_csv_import(
            CsvImportPreviewRequest(
                file_name="master_data_preview.csv",
                import_type="master_data",
                csv_content=(
                    "employee_id,workplace_id,project_id,effective_from\n"
                    "A-1001,SH,P1,2026-05-01"
                ),
            )
        )

        self.assertEqual(response.total_rows, 1)
        self.assertIn("supplier_id", response.missing_required_fields)
        self.assertIn("skill_group", response.missing_required_fields)
        self.assertEqual(response.warning_fields, [])

    def test_master_data_csv_import_accepts_valid_rows_and_exposes_records(self) -> None:
        response = import_master_data_csv(
            MasterDataCsvImportRequest(
                file_name="master_data_test.csv",
                uploaded_by="数据管理员",
                csv_content=(
                    "employee_id,employee_name,workplace_id,workplace_name,supplier_id,supplier_name,project_id,project_name,skill_group,skill_level,effective_from,effective_to,status\n"
                    "E-901,赵一,WP-SH,上海职场,SUP-01,供应商 A,P-BOSCH,博西客服,热线,L2,2026-05-01,2026-12-31,active\n"
                    "E-902,钱二,WP-SZ,苏州职场,SUP-02,供应商 B,P-BOSCH,博西客服,工单,L1,2026-05-01,2026-12-31,active\n"
                ),
            )
        )

        self.assertEqual(response.entity, "master_data")
        self.assertEqual(response.status, "completed")
        self.assertEqual(response.total_rows, 2)
        self.assertEqual(response.success_rows, 2)
        self.assertEqual(response.failed_rows, 0)
        self.assertEqual(response.error_codes, [])
        self.assertEqual(response.failure_rows, [])
        self.assertEqual(len(response.version_records), 1)
        self.assertEqual(response.version_records[0].entity, "master_data")
        self.assertEqual(response.version_records[0].row_count, 2)

        records = list_imported_master_data_records()
        employee_ids = {item.employee_id for item in records.items}
        self.assertIn("E-901", employee_ids)
        imported = next(item for item in records.items if item.employee_id == "E-901")
        self.assertEqual(imported.source_batch_id, response.batch_id)
        self.assertEqual(imported.source_version_id, response.version_records[0].version_id)
        self.assertEqual(imported.reference_status, "ready")
        self.assertEqual(imported.supplier_name, "供应商 A")
        self.assertEqual(imported.workplace_name, "上海职场")

    def test_master_data_csv_import_records_failed_rows_without_business_record(self) -> None:
        before_ids = {
            item.employee_id for item in list_imported_master_data_records().items
        }
        response = import_master_data_csv(
            MasterDataCsvImportRequest(
                file_name="master_data_missing.csv",
                uploaded_by="数据管理员",
                csv_content=(
                    "employee_id,employee_name,workplace_id,supplier_id,project_id,skill_group,effective_from\n"
                    "E-903,孙三,WP-SH,SUP-01,P-BOSCH,,2026-05-01\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.total_rows, 1)
        self.assertEqual(response.success_rows, 0)
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["missing_required_field"])
        self.assertEqual(response.version_records, [])
        self.assertEqual(len(response.failure_rows), 1)
        self.assertEqual(response.failure_rows[0].entity, "master_data")
        self.assertEqual(response.failure_rows[0].failed_row_number, 2)
        self.assertEqual(response.failure_rows[0].field_name, "skill_group")

        after_ids = {
            item.employee_id for item in list_imported_master_data_records().items
        }
        self.assertEqual(after_ids - before_ids, set())

    def test_master_data_record_upsert_updates_process_memory_record(self) -> None:
        created = upsert_master_data_record(
            MasterDataRecordUpsertRequest(
                employee_id="E-910",
                employee_name="维护员工",
                workplace_id="WP-SH",
                workplace_name="上海职场",
                supplier_id="SUP-01",
                supplier_name="供应商 A",
                project_id="P-BOSCH",
                project_name="博西客服",
                skill_group="热线",
                skill_level="L2",
                effective_from="2026-05-01",
                effective_to="2026-12-31",
                status="active",
            )
        )
        updated = upsert_master_data_record(
            MasterDataRecordUpsertRequest(
                employee_id="E-910",
                employee_name="维护员工",
                workplace_id="WP-SH",
                workplace_name="上海职场",
                supplier_id="SUP-01",
                supplier_name="供应商 A",
                project_id="P-BOSCH",
                project_name="博西客服",
                skill_group="工单",
                skill_level="L1",
                effective_from="2026-05-01",
                effective_to="2026-12-31",
                status="active",
            )
        )

        self.assertEqual(created.employee_id, "E-910")
        self.assertEqual(updated.skill_group, "工单")
        self.assertEqual(updated.skill_level, "L1")
        self.assertEqual(updated.reference_status, "ready")

    def test_master_data_freeze_and_unfreeze_drive_reference_check(self) -> None:
        upsert_master_data_record(
            MasterDataRecordUpsertRequest(
                employee_id="E-911",
                employee_name="冻结员工",
                workplace_id="WP-SH",
                workplace_name="上海职场",
                supplier_id="SUP-01",
                supplier_name="供应商 A",
                project_id="P-BOSCH",
                project_name="博西客服",
                skill_group="热线",
                skill_level="L2",
                effective_from="2026-05-01",
                effective_to="2026-12-31",
                status="active",
            )
        )

        frozen = freeze_master_data_record("E-911")
        blocked = check_master_data_reference(
            MasterDataReferenceCheckRequest(
                employee_id="E-911",
                business_date="2026-05-27",
                workplace_id="WP-SH",
                supplier_id="SUP-01",
                project_id="P-BOSCH",
            )
        )
        unfrozen = unfreeze_master_data_record("E-911")
        ready = check_master_data_reference(
            MasterDataReferenceCheckRequest(
                employee_id="E-911",
                business_date="2026-05-27",
                workplace_id="WP-SH",
                supplier_id="SUP-01",
                project_id="P-BOSCH",
            )
        )

        self.assertEqual(frozen.status, "frozen")
        self.assertEqual(frozen.reference_status, "blocked")
        self.assertEqual(blocked.reference_status, "blocked")
        self.assertEqual(blocked.error_code, "master_data_frozen")
        self.assertEqual(unfrozen.status, "active")
        self.assertEqual(unfrozen.reference_status, "ready")
        self.assertEqual(ready.reference_status, "ready")
        self.assertIsNone(ready.error_code)

    def test_master_data_reference_check_blocks_expired_or_missing_bindings(self) -> None:
        upsert_master_data_record(
            MasterDataRecordUpsertRequest(
                employee_id="E-912",
                employee_name="过期员工",
                workplace_id="WP-SH",
                workplace_name="上海职场",
                supplier_id="SUP-01",
                supplier_name="供应商 A",
                project_id="P-BOSCH",
                project_name="博西客服",
                skill_group="热线",
                skill_level="L2",
                effective_from="2026-05-01",
                effective_to="2026-05-20",
                status="active",
            )
        )

        expired = check_master_data_reference(
            MasterDataReferenceCheckRequest(
                employee_id="E-912",
                business_date="2026-05-27",
                workplace_id="WP-SH",
                supplier_id="SUP-01",
                project_id="P-BOSCH",
            )
        )
        missing = check_master_data_reference(
            MasterDataReferenceCheckRequest(
                employee_id="E-999",
                business_date="2026-05-27",
                workplace_id="WP-SH",
                supplier_id="SUP-01",
                project_id="P-BOSCH",
            )
        )

        self.assertEqual(expired.reference_status, "blocked")
        self.assertEqual(expired.error_code, "master_data_effective_range_invalid")
        self.assertEqual(missing.reference_status, "blocked")
        self.assertEqual(missing.error_code, "master_data_missing")

    def test_demand_forecast_csv_import_accepts_valid_rows(self) -> None:
        response = import_demand_forecast_csv(
            DemandForecastCsvImportRequest(
                file_name="demand_forecast_test.csv",
                uploaded_by="数据管理员",
                csv_content=(
                    "business_date,workplace_id,project_id,interval_start,interval_end,skill_group,grade,forecast_agents\n"
                    "2026-05-26,WP-SH,P-BOSCH,09:00,09:30,热线,L2,18\n"
                    "2026-05-26,WP-SH,P-BOSCH,09:30,10:00,热线,L2,20\n"
                ),
            )
        )

        self.assertEqual(response.entity, "demand_forecast")
        self.assertEqual(response.status, "completed")
        self.assertEqual(response.total_rows, 2)
        self.assertEqual(response.success_rows, 2)
        self.assertEqual(response.failed_rows, 0)
        self.assertEqual(response.warning_rows, 0)
        self.assertEqual(response.error_codes, [])
        self.assertEqual(response.failure_rows, [])
        self.assertEqual(response.file_name, "demand_forecast_test.csv")
        self.assertEqual(response.business_date_start, "2026-05-26")
        self.assertEqual(response.business_date_end, "2026-05-26")
        self.assertEqual(len(response.version_records), 1)
        self.assertEqual(response.version_records[0].batch_id, response.batch_id)
        self.assertEqual(response.version_records[0].row_count, 2)

        stored = get_import_batch_result(response.batch_id)
        self.assertIsNotNone(stored)
        self.assertEqual(stored, response)

        demand_rows = list_demand_plans(query=response.batch_id).items
        imported = next(
            item
            for item in demand_rows
            if item.interval_start == "09:30" and item.interval_end == "10:00"
        )
        self.assertEqual(imported.site_name, "上海职场")
        self.assertEqual(imported.project_name, "博西客服")
        self.assertEqual(imported.skill_group, "热线")
        self.assertEqual(imported.skill_level, "L2")
        self.assertEqual(imported.forecast_agents, 20)
        self.assertEqual(imported.forecast_version, response.version_records[0].version_id)
        self.assertEqual(imported.source_batch_id, response.batch_id)
        self.assertEqual(imported.source_version_id, response.version_records[0].version_id)
        self.assertEqual(imported.status, "imported")

    def test_demand_forecast_csv_import_rejects_unknown_skill_group(self) -> None:
        response = import_demand_forecast_csv(
            DemandForecastCsvImportRequest(
                file_name="demand_forecast_unknown_skill.csv",
                uploaded_by="数据管理员",
                csv_content=(
                    "business_date,workplace_id,project_id,interval_start,interval_end,skill_group,grade,forecast_agents\n"
                    "2026-05-26,WP-SH,P-BOSCH,09:00,09:30,未知技能,L2,18\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.success_rows, 0)
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["skill_group_invalid"])
        self.assertEqual(response.failure_rows[0].field_name, "skill_group")
        self.assertEqual(response.failure_rows[0].raw_value, "未知技能")
        self.assertEqual(list_demand_plans(query=response.batch_id).items, [])

    def test_demand_forecast_csv_import_records_failed_rows(self) -> None:
        response = import_demand_forecast_csv(
            DemandForecastCsvImportRequest(
                file_name="demand_forecast_missing.csv",
                uploaded_by="数据管理员",
                csv_content=(
                    "business_date,workplace_id,project_id,interval_start,interval_end,skill_group,grade,forecast_agents\n"
                    "2026-05-26,WP-SH,P-BOSCH,09:00,09:30,热线,L2,\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.total_rows, 1)
        self.assertEqual(response.success_rows, 0)
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["missing_required_field"])
        self.assertEqual(len(response.failure_rows), 1)
        failure = response.failure_rows[0]
        self.assertEqual(failure.failed_row_number, 2)
        self.assertEqual(failure.field_name, "forecast_agents")
        self.assertEqual(failure.error_code, "missing_required_field")
        self.assertEqual(failure.raw_value, "")

    def test_demand_forecast_csv_import_rejects_invalid_forecast_agents(self) -> None:
        response = import_demand_forecast_csv(
            DemandForecastCsvImportRequest(
                file_name="demand_forecast_invalid.csv",
                uploaded_by="数据管理员",
                csv_content=(
                    "business_date,workplace_id,project_id,interval_start,interval_end,skill_group,grade,forecast_agents\n"
                    "2026-05-26,WP-SH,P-BOSCH,09:00,09:30,热线,L2,abc\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["invalid_number"])
        self.assertEqual(response.failure_rows[0].field_name, "forecast_agents")
        self.assertEqual(response.failure_rows[0].raw_value, "abc")

    def test_personnel_schedule_csv_import_accepts_valid_rows(self) -> None:
        response = import_personnel_schedule_csv(
            PersonnelScheduleCsvImportRequest(
                file_name="personnel_schedule_test.csv",
                uploaded_by="排班运营",
                csv_content=(
                    "schedule_detail_id,schedule_version_id,employee_id,business_date,workplace_id,supplier_id,project_id,shift_type_id,start_at,end_at,status\n"
                    "SCH-001,SV-20260526,E-001,2026-05-26,WP-SH,SUP-01,P-BOSCH,SHIFT-DAY,09:00,18:00,published\n"
                    "SCH-002,SV-20260526,E-002,2026-05-26,WP-SH,SUP-01,P-BOSCH,SHIFT-DAY,10:00,19:00,published\n"
                ),
            )
        )

        self.assertEqual(response.entity, "personnel_schedule")
        self.assertEqual(response.status, "completed")
        self.assertEqual(response.total_rows, 2)
        self.assertEqual(response.success_rows, 2)
        self.assertEqual(response.failed_rows, 0)
        self.assertEqual(response.error_codes, [])
        self.assertEqual(response.failure_rows, [])

        stored = get_import_batch_result(response.batch_id)
        self.assertEqual(stored, response)

        records = list_imported_personnel_schedule_records()
        imported = next(
            item for item in records.items if item.schedule_detail_id == "SCH-001"
        )
        self.assertEqual(imported.source_batch_id, response.batch_id)
        self.assertEqual(imported.source_version_id, response.version_records[0].version_id)
        self.assertEqual(imported.schedule_version_id, "SV-20260526")
        self.assertEqual(imported.shift_type_reference_status, "ready")
        self.assertEqual(imported.shift_type_id, "SHIFT-DAY")

        interval_records = list_personnel_schedule_interval_records().items
        interval = next(
            item
            for item in interval_records
            if item.source_batch_id == response.batch_id
            and item.interval_start == "10:00"
            and item.interval_end == "10:30"
        )
        self.assertEqual(interval.schedule_version_id, "SV-20260526")
        self.assertEqual(interval.business_date, "2026-05-26")
        self.assertEqual(interval.workplace_id, "WP-SH")
        self.assertEqual(interval.project_id, "P-BOSCH")
        self.assertEqual(interval.scheduled_agents, 2)
        self.assertEqual(interval.employee_ids, ["E-001", "E-002"])
        self.assertEqual(interval.schedule_detail_ids, ["SCH-001", "SCH-002"])
        self.assertEqual(interval.source_version_id, response.version_records[0].version_id)
        self.assertEqual(interval.trace_status, "ready")

    def test_personnel_schedule_csv_import_rejects_unknown_shift_type(self) -> None:
        response = import_personnel_schedule_csv(
            PersonnelScheduleCsvImportRequest(
                file_name="personnel_schedule_unknown_shift.csv",
                uploaded_by="排班运营",
                csv_content=(
                    "schedule_detail_id,schedule_version_id,employee_id,business_date,workplace_id,supplier_id,project_id,shift_type_id,start_at,end_at,status\n"
                    "SCH-009,SV-20260526,E-009,2026-05-26,WP-SH,SUP-01,P-BOSCH,SHIFT-UNKNOWN,09:00,18:00,published\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.success_rows, 0)
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["shift_type_missing"])
        self.assertEqual(response.failure_rows[0].field_name, "shift_type_id")
        self.assertEqual(response.failure_rows[0].raw_value, "SHIFT-UNKNOWN")

    def test_personnel_schedule_csv_import_records_missing_required_field(self) -> None:
        response = import_personnel_schedule_csv(
            PersonnelScheduleCsvImportRequest(
                file_name="personnel_schedule_missing.csv",
                uploaded_by="排班运营",
                csv_content=(
                    "schedule_detail_id,schedule_version_id,employee_id,business_date,workplace_id,supplier_id,project_id,shift_type_id,start_at,end_at,status\n"
                    "SCH-003,SV-20260526,,2026-05-26,WP-SH,SUP-01,P-BOSCH,SHIFT-DAY,09:00,18:00,published\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.total_rows, 1)
        self.assertEqual(response.success_rows, 0)
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["missing_required_field"])
        self.assertEqual(response.failure_rows[0].failed_row_number, 2)
        self.assertEqual(response.failure_rows[0].field_name, "employee_id")
        self.assertEqual(response.failure_rows[0].raw_value, "")

    def test_personnel_schedule_csv_import_rejects_invalid_time_range(self) -> None:
        response = import_personnel_schedule_csv(
            PersonnelScheduleCsvImportRequest(
                file_name="personnel_schedule_invalid_time.csv",
                uploaded_by="排班运营",
                csv_content=(
                    "schedule_detail_id,schedule_version_id,employee_id,business_date,workplace_id,supplier_id,project_id,shift_type_id,start_at,end_at,status\n"
                    "SCH-004,SV-20260526,E-004,2026-05-26,WP-SH,SUP-01,P-BOSCH,SHIFT-DAY,18:00,09:00,published\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["invalid_time_range"])
        self.assertEqual(response.failure_rows[0].field_name, "end_at")
        self.assertEqual(response.failure_rows[0].raw_value, "09:00")
        interval_records = list_personnel_schedule_interval_records().items
        self.assertFalse(
            any("SCH-004" in item.schedule_detail_ids for item in interval_records)
        )

    def test_login_log_csv_import_accepts_valid_rows(self) -> None:
        response = import_login_log_csv(
            LoginLogCsvImportRequest(
                file_name="login_log_test.csv",
                uploaded_by="现场主管",
                csv_content=(
                    "login_log_id,employee_id,business_date,login_at,logout_at,workplace_id,project_id,source_system\n"
                    "LOG-001,E-001,2026-05-26,2026-05-26T09:02:00,2026-05-26T18:03:00,WP-SH,P-BOSCH,CORN\n"
                    "LOG-002,E-002,2026-05-26,2026-05-26T09:10:00,2026-05-26T18:12:00,WP-SH,P-BOSCH,CORN\n"
                ),
            )
        )

        self.assertEqual(response.entity, "login_log")
        self.assertEqual(response.status, "completed")
        self.assertEqual(response.total_rows, 2)
        self.assertEqual(response.success_rows, 2)
        self.assertEqual(response.failed_rows, 0)
        self.assertEqual(response.error_codes, [])
        self.assertEqual(response.failure_rows, [])

        stored = get_import_batch_result(response.batch_id)
        self.assertEqual(stored, response)

    def test_login_log_csv_import_records_missing_required_field(self) -> None:
        response = import_login_log_csv(
            LoginLogCsvImportRequest(
                file_name="login_log_missing.csv",
                uploaded_by="现场主管",
                csv_content=(
                    "login_log_id,employee_id,business_date,login_at,logout_at,workplace_id,project_id,source_system\n"
                    "LOG-003,,2026-05-26,2026-05-26T09:02:00,2026-05-26T18:03:00,WP-SH,P-BOSCH,CORN\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.total_rows, 1)
        self.assertEqual(response.success_rows, 0)
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["missing_required_field"])
        self.assertEqual(response.failure_rows[0].failed_row_number, 2)
        self.assertEqual(response.failure_rows[0].field_name, "employee_id")
        self.assertEqual(response.failure_rows[0].raw_value, "")

    def test_login_log_csv_import_rejects_invalid_time_range(self) -> None:
        response = import_login_log_csv(
            LoginLogCsvImportRequest(
                file_name="login_log_invalid_time.csv",
                uploaded_by="现场主管",
                csv_content=(
                    "login_log_id,employee_id,business_date,login_at,logout_at,workplace_id,project_id,source_system\n"
                    "LOG-004,E-004,2026-05-26,2026-05-26T18:00:00,2026-05-26T09:00:00,WP-SH,P-BOSCH,CORN\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["invalid_time_range"])
        self.assertEqual(response.failure_rows[0].field_name, "logout_at")
        self.assertEqual(response.failure_rows[0].raw_value, "2026-05-26T09:00:00")

    def test_status_log_csv_import_accepts_valid_rows(self) -> None:
        response = import_status_log_csv(
            StatusLogCsvImportRequest(
                file_name="status_log_test.csv",
                uploaded_by="现场主管",
                csv_content=(
                    "status_log_id,employee_id,business_date,status_type,start_at,end_at,workplace_id,project_id,source_system\n"
                    "STATUS-001,E-001,2026-05-26,productive,2026-05-26T09:00:00,2026-05-26T09:30:00,WP-SH,P-BOSCH,CORN\n"
                    "STATUS-002,E-002,2026-05-26,break,2026-05-26T10:00:00,2026-05-26T10:30:00,WP-SH,P-BOSCH,CORN\n"
                ),
            )
        )

        self.assertEqual(response.entity, "status_log")
        self.assertEqual(response.status, "completed")
        self.assertEqual(response.total_rows, 2)
        self.assertEqual(response.success_rows, 2)
        self.assertEqual(response.failed_rows, 0)
        self.assertEqual(response.error_codes, [])
        self.assertEqual(response.failure_rows, [])

        stored = get_import_batch_result(response.batch_id)
        self.assertEqual(stored, response)

    def test_status_log_csv_import_records_missing_required_field(self) -> None:
        response = import_status_log_csv(
            StatusLogCsvImportRequest(
                file_name="status_log_missing.csv",
                uploaded_by="现场主管",
                csv_content=(
                    "status_log_id,employee_id,business_date,status_type,start_at,end_at,workplace_id,project_id,source_system\n"
                    "STATUS-003,E-003,2026-05-26,,2026-05-26T09:00:00,2026-05-26T09:30:00,WP-SH,P-BOSCH,CORN\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.total_rows, 1)
        self.assertEqual(response.success_rows, 0)
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["missing_required_field"])
        self.assertEqual(response.failure_rows[0].failed_row_number, 2)
        self.assertEqual(response.failure_rows[0].field_name, "status_type")
        self.assertEqual(response.failure_rows[0].raw_value, "")

    def test_status_log_csv_import_rejects_invalid_time_range(self) -> None:
        response = import_status_log_csv(
            StatusLogCsvImportRequest(
                file_name="status_log_invalid_time.csv",
                uploaded_by="现场主管",
                csv_content=(
                    "status_log_id,employee_id,business_date,status_type,start_at,end_at,workplace_id,project_id,source_system\n"
                    "STATUS-004,E-004,2026-05-26,productive,2026-05-26T09:30:00,2026-05-26T09:00:00,WP-SH,P-BOSCH,CORN\n"
                ),
            )
        )

        self.assertEqual(response.status, "completed_with_errors")
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.error_codes, ["invalid_time_range"])
        self.assertEqual(response.failure_rows[0].field_name, "end_at")
        self.assertEqual(response.failure_rows[0].raw_value, "2026-05-26T09:00:00")

    def test_import_batch_list_returns_process_memory_results_newest_first(self) -> None:
        older = import_demand_forecast_csv(
            DemandForecastCsvImportRequest(
                file_name="demand_forecast_list.csv",
                uploaded_by="数据管理员",
                csv_content=(
                    "business_date,workplace_id,project_id,interval_start,interval_end,skill_group,grade,forecast_agents\n"
                    "2026-05-26,WP-SH,P-BOSCH,09:00,09:30,热线,L2,18\n"
                ),
            )
        )
        newer = import_status_log_csv(
            StatusLogCsvImportRequest(
                file_name="status_log_list.csv",
                uploaded_by="现场主管",
                csv_content=(
                    "status_log_id,employee_id,business_date,status_type,start_at,end_at,workplace_id,project_id,source_system\n"
                    "STATUS-501,E-501,2026-05-26,productive,2026-05-26T09:00:00,2026-05-26T09:30:00,WP-SH,P-BOSCH,CORN\n"
                ),
            )
        )

        response = list_import_batches()

        self.assertIsInstance(response, ImportBatchListResponse)
        batch_ids = [item.batch_id for item in response.items]
        self.assertLess(batch_ids.index(newer.batch_id), batch_ids.index(older.batch_id))
        self.assertIn(newer.batch_id, batch_ids)
        self.assertIn(older.batch_id, batch_ids)

    def test_master_data_import_contract_defines_required_entities(self) -> None:
        response = list_master_data_import_contract()

        entity_names = {entity.entity for entity in response.entities}

        self.assertEqual(
            entity_names,
            {
                "agent",
                "workplace",
                "supplier",
                "project",
                "agent_binding",
                "shift_type",
            },
        )
        self.assertIn("batch_id", response.batch_fields)
        self.assertIn("failed_row_number", response.failure_row_fields)
        self.assertIn("missing_required_field", response.quality_error_codes)

    def test_master_data_import_contract_tracks_keys_and_validation(self) -> None:
        response = list_master_data_import_contract()

        contracts = {entity.entity: entity for entity in response.entities}
        agent_contract = contracts["agent"]
        binding_contract = contracts["agent_binding"]
        shift_type_contract = contracts["shift_type"]

        self.assertEqual(agent_contract.primary_key, ["employee_id"])
        self.assertIn("external_employee_id", agent_contract.fields)
        self.assertIn("employee_id", binding_contract.foreign_keys)
        self.assertIn("counts_as_scheduled", shift_type_contract.fields)
        self.assertIn("duplicate_primary_key", binding_contract.validation_rules)

    def test_personnel_schedule_import_contract_defines_schedule_detail_fields(self) -> None:
        response = list_personnel_schedule_import_contract()

        self.assertEqual(response.version, "production-mvp-v1")
        self.assertEqual(response.entity, "personnel_schedule")
        self.assertEqual(response.primary_key, ["schedule_detail_id"])
        self.assertIn("employee_id", response.fields)
        self.assertIn("shift_type_id", response.fields)
        self.assertIn("break_windows", response.fields)
        self.assertIn("meal_windows", response.fields)
        self.assertIn("expanded_interval_ids", response.generated_fields)

    def test_personnel_schedule_import_contract_defines_half_hour_expansion(self) -> None:
        response = list_personnel_schedule_import_contract()

        self.assertEqual(response.expansion.interval_minutes, 30)
        self.assertEqual(response.expansion.source_entity, "personnel_schedule")
        self.assertEqual(response.expansion.target_entity, "interval_schedule")
        self.assertIn("business_date", response.expansion.group_by)
        self.assertIn("workplace_id", response.expansion.group_by)
        self.assertIn("employee_ids", response.expansion.target_fields)
        self.assertIn("invalid_time_range", response.validation_rules)
        self.assertIn("cross_day_without_business_date", response.validation_rules)

    def test_fulfillment_comparison_contract_defines_sources_and_keys(self) -> None:
        response = list_fulfillment_comparison_contract()

        source_names = {source.source for source in response.sources}

        self.assertEqual(
            source_names,
            {"demand_forecast", "personnel_schedule", "login_log", "status_log"},
        )
        self.assertEqual(
            response.comparison_keys,
            ["business_date", "workplace_id", "project_id", "interval_start", "interval_end"],
        )
        self.assertIn("employee_id", response.person_level_keys)
        self.assertIn("status_type", response.status_dictionary_fields)

    def test_fulfillment_comparison_contract_defines_anomalies(self) -> None:
        response = list_fulfillment_comparison_contract()

        anomaly_codes = {item.code for item in response.anomaly_rules}

        self.assertTrue(
            {
                "forecast_shortage",
                "forecast_overstaffed",
                "no_login",
                "late_login",
                "early_logout",
                "unscheduled_login",
                "non_productive_status",
            }.issubset(anomaly_codes)
        )
        shortage = next(item for item in response.anomaly_rules if item.code == "forecast_shortage")
        self.assertEqual(shortage.compares, ["demand_forecast", "interval_schedule"])
        self.assertIn("review_result", response.review_fields)

    def test_list_schedule_plans_returns_required_summary_fields(self) -> None:
        response = list_schedule_plans()

        self.assertGreaterEqual(len(response.items), 3)

        first_plan = response.items[0].model_dump()
        required_fields = {
            "id",
            "plan_date",
            "project_name",
            "site_name",
            "version",
            "status",
            "forecast_agents",
            "scheduled_agents",
            "gap_agents",
            "coverage_rate",
            "updated_at",
        }

        self.assertTrue(required_fields.issubset(first_plan.keys()))
        self.assertIn(first_plan["status"], {"draft", "review_ready", "published"})

    def test_list_schedule_plans_filters_by_status(self) -> None:
        response = list_schedule_plans(status="draft")

        self.assertGreaterEqual(len(response.items), 1)
        self.assertTrue(all(plan.status == "draft" for plan in response.items))

    def test_list_schedule_plans_filters_by_query(self) -> None:
        response = list_schedule_plans(query="苏州")

        self.assertGreaterEqual(len(response.items), 1)
        self.assertTrue(all("苏州" in plan.site_name for plan in response.items))

    def test_get_schedule_plan_returns_detail_with_half_hour_intervals(self) -> None:
        plan_id = list_schedule_plans().items[0].id

        detail = get_schedule_plan(plan_id)

        self.assertEqual(detail.summary.id, plan_id)
        self.assertGreaterEqual(len(detail.intervals), 8)
        self.assertEqual(detail.intervals[0].interval_start, "09:00")
        self.assertEqual(detail.intervals[0].interval_end, "09:30")

    def test_list_shift_details_returns_plan_and_interval_fields(self) -> None:
        response = list_shift_details()

        self.assertGreaterEqual(len(response.items), 24)
        first_item = response.items[0].model_dump()
        required_fields = {
            "plan_id",
            "plan_date",
            "project_name",
            "site_name",
            "version",
            "status",
            "interval_start",
            "interval_end",
            "forecast_agents",
            "scheduled_agents",
            "gap_agents",
            "coverage_rate",
            "note",
        }

        self.assertTrue(required_fields.issubset(first_item.keys()))

    def test_list_shift_details_filters_by_query(self) -> None:
        response = list_shift_details(query="培训")

        self.assertGreaterEqual(len(response.items), 1)
        self.assertTrue(all("培训" in item.note for item in response.items))

    def test_list_demand_plans_returns_forecast_rows(self) -> None:
        response = list_demand_plans()

        self.assertGreaterEqual(len(response.items), 24)
        first_item = response.items[0].model_dump()
        required_fields = {
            "demand_id",
            "plan_date",
            "project_name",
            "site_name",
            "interval_start",
            "interval_end",
            "forecast_agents",
            "source",
            "status",
        }

        self.assertTrue(required_fields.issubset(first_item.keys()))

    def test_list_demand_plans_filters_by_query(self) -> None:
        response = list_demand_plans(query="苏州")

        self.assertGreaterEqual(len(response.items), 1)
        self.assertTrue(all("苏州" in item.site_name for item in response.items))

    def test_list_unavailability_returns_required_fields(self) -> None:
        response = list_unavailability()

        self.assertGreaterEqual(len(response.items), 3)
        first_item = response.items[0].model_dump()
        required_fields = {
            "unavailability_id",
            "staff_name",
            "team_name",
            "project_name",
            "site_name",
            "unavailable_date",
            "start_time",
            "end_time",
            "reason",
            "status",
            "affected_intervals",
            "note",
        }

        self.assertTrue(required_fields.issubset(first_item.keys()))
        self.assertIn(first_item["status"], {"active", "resolved"})

    def test_list_unavailability_filters_by_status(self) -> None:
        response = list_unavailability(status="active")

        self.assertGreaterEqual(len(response.items), 1)
        self.assertTrue(all(item.status == "active" for item in response.items))

    def test_list_unavailability_filters_by_query(self) -> None:
        response = list_unavailability(query="培训")

        self.assertGreaterEqual(len(response.items), 1)
        self.assertTrue(all("培训" in item.reason or "培训" in item.note for item in response.items))

    def test_list_schedule_risks_returns_gap_and_unavailability_fields(self) -> None:
        response = list_schedule_risks()

        self.assertGreaterEqual(len(response.items), 1)
        first_item = response.items[0].model_dump()
        required_fields = {
            "risk_id",
            "plan_id",
            "plan_date",
            "project_name",
            "site_name",
            "interval_start",
            "interval_end",
            "risk_level",
            "gap_agents",
            "affected_unavailability",
            "reason",
            "recommendation",
        }

        self.assertTrue(required_fields.issubset(first_item.keys()))
        self.assertIn(first_item["risk_level"], {"high", "medium", "low"})

    def test_list_schedule_risks_includes_combined_high_risk(self) -> None:
        response = list_schedule_risks()

        combined = [
            item
            for item in response.items
            if item.site_name == "苏州职场"
            and item.interval_start == "10:00"
            and item.risk_level == "high"
        ]

        self.assertEqual(len(combined), 1)
        self.assertEqual(combined[0].gap_agents, 2)
        self.assertEqual(combined[0].affected_unavailability, 1)

    def test_list_schedule_risks_filters_by_query(self) -> None:
        response = list_schedule_risks(query="苏州")

        self.assertGreaterEqual(len(response.items), 1)
        self.assertTrue(all("苏州" in item.site_name for item in response.items))

    def test_get_schedule_plan_returns_404_for_missing_plan(self) -> None:
        with self.assertRaises(HTTPException) as raised:
            get_schedule_plan("missing-plan")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(
            raised.exception.detail,
            {
                "error": {
                    "code": "SCHEDULE_PLAN_NOT_FOUND",
                    "message": "排班计划不存在",
                }
            },
        )

    def test_create_schedule_plan_draft_calculates_summary(self) -> None:
        draft = create_schedule_plan_draft(
            SchedulePlanDraftRequest(
                plan_date="2026-05-13",
                project_name="博西客服",
                site_name="上海职场",
                version="v1",
                intervals=[
                    SchedulePlanIntervalInput(
                        interval_start="09:00",
                        interval_end="09:30",
                        forecast_agents=10,
                        scheduled_agents=8,
                        note="新建草稿缺口",
                    ),
                    SchedulePlanIntervalInput(
                        interval_start="09:30",
                        interval_end="10:00",
                        forecast_agents=10,
                        scheduled_agents=10,
                        note="覆盖正常",
                    ),
                ],
            )
        )

        self.assertTrue(draft.summary.id.startswith("draft-20260513-"))
        self.assertEqual(draft.summary.status, "draft")
        self.assertEqual(draft.summary.forecast_agents, 20)
        self.assertEqual(draft.summary.scheduled_agents, 18)
        self.assertEqual(draft.summary.gap_agents, 2)
        self.assertEqual(draft.summary.coverage_rate, 0.9)

    def test_update_schedule_plan_draft_recalculates_intervals(self) -> None:
        created = create_schedule_plan_draft(
            SchedulePlanDraftRequest(
                plan_date="2026-05-14",
                project_name="博西客服",
                site_name="苏州职场",
                version="v1",
                intervals=[
                    SchedulePlanIntervalInput(
                        interval_start="09:00",
                        interval_end="09:30",
                        forecast_agents=12,
                        scheduled_agents=10,
                        note="初稿缺口",
                    )
                ],
            )
        )

        updated = update_schedule_plan_draft(
            created.summary.id,
            SchedulePlanDraftRequest(
                plan_date="2026-05-14",
                project_name="博西客服",
                site_name="苏州职场",
                version="v2",
                intervals=[
                    SchedulePlanIntervalInput(
                        interval_start="09:00",
                        interval_end="09:30",
                        forecast_agents=12,
                        scheduled_agents=12,
                        note="已补齐",
                    )
                ],
            ),
        )

        self.assertEqual(updated.summary.id, created.summary.id)
        self.assertEqual(updated.summary.version, "v2")
        self.assertEqual(updated.summary.scheduled_agents, 12)
        self.assertEqual(updated.summary.gap_agents, 0)
        self.assertEqual(updated.intervals[0].note, "已补齐")

    def test_update_schedule_plan_draft_rejects_non_draft_plan(self) -> None:
        with self.assertRaises(HTTPException) as raised:
            update_schedule_plan_draft(
                "plan-20260512-shanghai-bosch-v2",
                SchedulePlanDraftRequest(
                    plan_date="2026-05-12",
                    project_name="博西客服",
                    site_name="上海职场",
                    version="v3",
                    intervals=[
                        SchedulePlanIntervalInput(
                            interval_start="09:00",
                            interval_end="09:30",
                            forecast_agents=15,
                            scheduled_agents=15,
                            note="尝试编辑已发布",
                        )
                    ],
                ),
            )

        self.assertEqual(raised.exception.status_code, 409)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "SCHEDULE_PLAN_NOT_EDITABLE",
        )


if __name__ == "__main__":
    unittest.main()
