import unittest

from fastapi import HTTPException

from backend.app.main import (
    app,
    create_schedule_plan_draft,
    import_demo_csv,
    list_demo_import_records,
    list_demo_import_batches,
    get_schedule_plan,
    health_check,
    list_demand_plans,
    list_shift_details,
    list_schedule_plans,
    list_schedule_risks,
    list_unavailability,
    update_schedule_plan_draft,
)
from backend.app.models import SchedulePlanDraftRequest, SchedulePlanIntervalInput
from backend.app.demo_imports import clear_demo_import_state


class SchedulePlansApiTest(unittest.TestCase):
    def setUp(self) -> None:
        clear_demo_import_state()

    def test_schedule_plan_list_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/schedule-plans", "GET"), routes)
        self.assertIn(("/api/v1/demand-plans", "GET"), routes)
        self.assertIn(("/api/v1/shift-details", "GET"), routes)
        self.assertIn(("/api/v1/schedule-risks", "GET"), routes)
        self.assertIn(("/api/v1/unavailability", "GET"), routes)
        self.assertIn(("/api/v1/schedule-plans/drafts", "POST"), routes)
        self.assertIn(("/api/v1/schedule-plans/{plan_id}/draft", "PUT"), routes)
        self.assertIn(("/api/v1/demo-imports/{kind}", "POST"), routes)
        self.assertIn(("/api/v1/demo-imports/batches", "GET"), routes)
        self.assertIn(("/api/v1/demo-imports/records", "GET"), routes)
        self.assertIn(("/health", "GET"), routes)

    def test_import_demo_csv_returns_batch_summary(self) -> None:
        response = import_demo_csv(
            "staff_master",
            {
                "csv_text": "\n".join(
                    [
                        "staff_id,name,team,site,vendor,role,status",
                        "A001,张敏,华东一组,上海职场,供应商A,客服,在线",
                        "A002,李想,华南二组,苏州职场,供应商B,客服,培训",
                    ]
                )
            },
        )

        self.assertEqual(response.batch.kind, "staff_master")
        self.assertEqual(response.batch.success_rows, 2)
        self.assertEqual(response.batch.failed_rows, 0)
        self.assertEqual(response.errors, [])

        batches = list_demo_import_batches()
        self.assertEqual(len(batches.items), 1)
        self.assertEqual(batches.items[0].source_name, "坐席主数据")

    def test_import_demo_csv_reports_missing_required_fields(self) -> None:
        response = import_demo_csv(
            "login_log",
            {
                "csv_text": "\n".join(
                    [
                        "staff_id,date,planned_login,actual_login,actual_logout,online_minutes",
                        "A001,2026-05-11,09:00,09:08,17:30,510",
                        "A002,2026-05-11,09:00,,17:00,480",
                    ]
                )
            },
        )

        self.assertEqual(response.batch.kind, "login_log")
        self.assertEqual(response.batch.success_rows, 1)
        self.assertEqual(response.batch.failed_rows, 1)
        self.assertEqual(response.errors[0].row_number, 3)
        self.assertIn("actual_login", response.errors[0].message)

    def test_list_demo_import_records_returns_processed_rows(self) -> None:
        import_demo_csv(
            "staff_master",
            {
                "csv_text": "\n".join(
                    [
                        "staff_id,name,team,site,vendor,role,status",
                        "A001,张敏,华东一组,上海职场,供应商A,客服,在线",
                        "A002,李想,华南二组,苏州职场,供应商B,客服,培训",
                    ]
                )
            },
        )
        import_demo_csv(
            "status_log",
            {
                "csv_text": "\n".join(
                    [
                        "staff_id,date,start_time,end_time,status",
                        "A001,2026-05-11,09:00,09:30,在线",
                    ]
                )
            },
        )

        records = list_demo_import_records()
        self.assertEqual(len(records.items), 2)

        staff_records = next(item for item in records.items if item.kind == "staff_master")
        self.assertEqual(staff_records.source_name, "坐席主数据")
        self.assertEqual(staff_records.total_rows, 2)
        self.assertEqual(staff_records.sample_rows[0]["staff_id"], "A001")

        status_records = next(item for item in records.items if item.kind == "status_log")
        self.assertEqual(status_records.total_rows, 1)
        self.assertEqual(status_records.sample_rows[0]["status"], "在线")

    def test_health_check_returns_project_status(self) -> None:
        self.assertEqual(
            health_check(),
            {
                "project": "bpo-schedule-platform",
                "status": "ok",
            },
        )

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
