from backend.app.models import SchedulePlanDetail, SchedulePlanSummary
from backend.app.seed_data import SCHEDULE_PLANS


def list_plan_summaries() -> list[SchedulePlanSummary]:
    return [plan.summary for plan in SCHEDULE_PLANS]


def find_plan_detail(plan_id: str) -> SchedulePlanDetail | None:
    for plan in SCHEDULE_PLANS:
        if plan.summary.id == plan_id:
            return plan
    return None
