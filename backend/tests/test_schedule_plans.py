import unittest

from fastapi import HTTPException

from backend.app.main import (
    app,
    create_schedule_plan_draft,
    get_schedule_plan,
    get_import_batch_result,
    import_demand_forecast_csv,
    import_login_log_csv,
    import_personnel_schedule_csv,
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
    LoginLogCsvImportRequest,
    PersonnelScheduleCsvImportRequest,
    SchedulePlanDraftRequest,
    SchedulePlanIntervalInput,
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
        self.assertIn(("/api/v1/import-batches/demand-forecast", "POST"), routes)
        self.assertIn(("/api/v1/import-batches/personnel-schedule", "POST"), routes)
        self.assertIn(("/api/v1/import-batches/login-log", "POST"), routes)
        self.assertIn(("/api/v1/import-batches/{batch_id}", "GET"), routes)

    def test_demand_forecast_csv_import_accepts_valid_rows(self) -> None:
        response = import_demand_forecast_csv(
            DemandForecastCsvImportRequest(
                file_name="demand_forecast_test.csv",
                uploaded_by="数据管理员",
                csv_content=(
                    "business_date,workplace_id,project_id,interval_start,interval_end,forecast_agents\n"
                    "2026-05-26,WP-SH,P-BOSCH,09:00,09:30,18\n"
                    "2026-05-26,WP-SH,P-BOSCH,09:30,10:00,20\n"
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

        stored = get_import_batch_result(response.batch_id)
        self.assertIsNotNone(stored)
        self.assertEqual(stored, response)

    def test_demand_forecast_csv_import_records_failed_rows(self) -> None:
        response = import_demand_forecast_csv(
            DemandForecastCsvImportRequest(
                file_name="demand_forecast_missing.csv",
                uploaded_by="数据管理员",
                csv_content=(
                    "business_date,workplace_id,project_id,interval_start,interval_end,forecast_agents\n"
                    "2026-05-26,WP-SH,P-BOSCH,09:00,09:30,\n"
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
                    "business_date,workplace_id,project_id,interval_start,interval_end,forecast_agents\n"
                    "2026-05-26,WP-SH,P-BOSCH,09:00,09:30,abc\n"
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
