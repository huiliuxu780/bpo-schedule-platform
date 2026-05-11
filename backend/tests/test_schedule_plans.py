import unittest

from fastapi import HTTPException

from backend.app.main import (
    app,
    create_schedule_plan_draft,
    get_schedule_plan,
    list_demand_plans,
    list_shift_details,
    list_schedule_plans,
    list_unavailability,
    update_schedule_plan_draft,
)
from backend.app.models import SchedulePlanDraftRequest, SchedulePlanIntervalInput


class SchedulePlansApiTest(unittest.TestCase):
    def test_schedule_plan_list_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/schedule-plans", "GET"), routes)
        self.assertIn(("/api/v1/demand-plans", "GET"), routes)
        self.assertIn(("/api/v1/shift-details", "GET"), routes)
        self.assertIn(("/api/v1/unavailability", "GET"), routes)
        self.assertIn(("/api/v1/schedule-plans/drafts", "POST"), routes)
        self.assertIn(("/api/v1/schedule-plans/{plan_id}/draft", "PUT"), routes)

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
