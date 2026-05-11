from typing import Literal

from pydantic import BaseModel, Field


SchedulePlanStatus = Literal["draft", "review_ready", "published"]
DemandPlanStatus = Literal["imported", "mapped"]
UnavailabilityStatus = Literal["active", "resolved"]
ScheduleRiskLevel = Literal["high", "medium", "low"]


class SchedulePlanSummary(BaseModel):
    id: str
    plan_date: str
    project_name: str
    site_name: str
    version: str
    status: SchedulePlanStatus
    forecast_agents: int = Field(ge=0)
    scheduled_agents: int = Field(ge=0)
    gap_agents: int = Field(ge=0)
    coverage_rate: float = Field(ge=0)
    updated_at: str


class SchedulePlanInterval(BaseModel):
    interval_start: str
    interval_end: str
    forecast_agents: int = Field(ge=0)
    scheduled_agents: int = Field(ge=0)
    gap_agents: int = Field(ge=0)
    coverage_rate: float = Field(ge=0)
    note: str


class SchedulePlanDetail(BaseModel):
    summary: SchedulePlanSummary
    intervals: list[SchedulePlanInterval]


class DemandPlanRow(BaseModel):
    demand_id: str
    plan_date: str
    project_name: str
    site_name: str
    interval_start: str
    interval_end: str
    forecast_agents: int = Field(ge=0)
    source: str
    status: DemandPlanStatus


class DemandPlanListResponse(BaseModel):
    items: list[DemandPlanRow]


class UnavailabilityRow(BaseModel):
    unavailability_id: str
    staff_name: str
    team_name: str
    project_name: str
    site_name: str
    unavailable_date: str
    start_time: str
    end_time: str
    reason: str
    status: UnavailabilityStatus
    affected_intervals: int = Field(ge=0)
    note: str


class UnavailabilityListResponse(BaseModel):
    items: list[UnavailabilityRow]


class ScheduleRiskRow(BaseModel):
    risk_id: str
    plan_id: str
    plan_date: str
    project_name: str
    site_name: str
    interval_start: str
    interval_end: str
    risk_level: ScheduleRiskLevel
    gap_agents: int = Field(ge=0)
    affected_unavailability: int = Field(ge=0)
    reason: str
    recommendation: str


class ScheduleRiskListResponse(BaseModel):
    items: list[ScheduleRiskRow]


class ShiftDetailRow(BaseModel):
    plan_id: str
    plan_date: str
    project_name: str
    site_name: str
    version: str
    status: SchedulePlanStatus
    interval_start: str
    interval_end: str
    forecast_agents: int = Field(ge=0)
    scheduled_agents: int = Field(ge=0)
    gap_agents: int = Field(ge=0)
    coverage_rate: float = Field(ge=0)
    note: str


class ShiftDetailListResponse(BaseModel):
    items: list[ShiftDetailRow]


class SchedulePlanIntervalInput(BaseModel):
    interval_start: str
    interval_end: str
    forecast_agents: int = Field(ge=0)
    scheduled_agents: int = Field(ge=0)
    note: str


class SchedulePlanDraftRequest(BaseModel):
    plan_date: str
    project_name: str
    site_name: str
    version: str
    intervals: list[SchedulePlanIntervalInput] = Field(min_length=1)


class SchedulePlanListResponse(BaseModel):
    items: list[SchedulePlanSummary]


class ApiError(BaseModel):
    code: str
    message: str


class ApiErrorResponse(BaseModel):
    error: ApiError
