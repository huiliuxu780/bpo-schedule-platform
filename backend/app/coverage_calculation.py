"""Half-hour coverage calculation shared by schedule endpoints.

Pure, dependency-free logic so the future frontend model layer can mirror the
same functions (golden test cases in ``backend/tests/test_coverage_calculation.py``
are the shared source of truth).

Business basis (CORN WFM V2.0, chapter 13.3):

    区间标准人力 = 区间重叠比例 × 技能分配比例 × 技能标准人力系数 × 活动覆盖系数

Phase 1 endpoints report the physical headcount caliber; the standard-headcount
caliber is computed here as well so both stay available.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date as date_type
from datetime import timedelta

INTERVAL_MINUTES = 30
MINUTES_PER_DAY = 24 * 60
WORK_ACTIVITY_TYPE = "work"


@dataclass(frozen=True)
class CoverageSegment:
    """One activity segment inside a matrix cell.

    ``start_time``/``end_time`` are ``HH:MM``. When ``end_time`` is not after
    ``start_time`` (or ``crosses_day`` is set) the segment crosses midnight and
    the tail belongs to the next calendar day; night shifts stay attributed to
    the schedule (start) date (chapter 13.2).
    """

    activity_type: str
    start_time: str
    end_time: str
    crosses_day: bool = False
    skill_id: str | None = None
    allocation_ratio: float = 1.0
    skill_coefficient: float = 1.0
    activity_coverage: float = 1.0


@dataclass(frozen=True)
class IntervalContribution:
    date: str
    interval_start: str
    overlap_ratio: float
    std_headcount: float


@dataclass(frozen=True)
class CoverageRow:
    date: str
    interval_start: str
    demand_headcount: float
    planned_headcount: float
    gap: float
    coverage_rate: float | None
    std_planned_headcount: float


@dataclass
class DayCoverageInput:
    """Coverage inputs for one schedule date.

    ``cells`` maps ``employee_id`` to that day's segments; ``demand_by_interval``
    maps ``HH:MM`` interval starts to the required headcount.
    """

    schedule_date: str
    cells: dict[str, list[CoverageSegment]] = field(default_factory=dict)
    demand_by_interval: dict[str, float] = field(default_factory=dict)


def parse_time_to_minutes(value: str) -> int:
    hours_text, minutes_text = value.split(":")
    hours = int(hours_text)
    minutes = int(minutes_text)
    if not 0 <= hours <= 23 or not 0 <= minutes <= 59:
        raise ValueError(f"time {value} is not a valid HH:MM value")
    return hours * 60 + minutes


def minutes_to_time(minutes: int) -> str:
    minutes %= MINUTES_PER_DAY
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def next_date(schedule_date: str) -> str:
    parsed = date_type.fromisoformat(schedule_date)
    return (parsed + timedelta(days=1)).isoformat()


def segment_duration_minutes(segment: CoverageSegment) -> int:
    start = parse_time_to_minutes(segment.start_time)
    end = parse_time_to_minutes(segment.end_time)
    duration = end - start
    if duration <= 0:
        duration += MINUTES_PER_DAY
    if duration == MINUTES_PER_DAY and not segment.crosses_day and end != start:
        raise ValueError("segment duration cannot be 24 hours")
    return duration


def crosses_midnight(segment: CoverageSegment) -> bool:
    start = parse_time_to_minutes(segment.start_time)
    end = parse_time_to_minutes(segment.end_time)
    return segment.crosses_day or end <= start


def segment_interval_contributions(
    schedule_date: str,
    segment: CoverageSegment,
) -> list[IntervalContribution]:
    """Expand one segment into half-hour interval contributions.

    Implements the chapter 13.3 formula: each covered interval gets
    ``overlap_ratio × allocation_ratio × skill_coefficient × activity_coverage``.
    Partially covered boundary intervals keep their fractional overlap ratio.
    """
    start = parse_time_to_minutes(segment.start_time)
    duration = segment_duration_minutes(segment)
    if duration > MINUTES_PER_DAY:
        raise ValueError("segment duration cannot exceed 24 hours")

    contributions: list[IntervalContribution] = []
    cursor = start
    end = start + duration
    dates = (schedule_date, next_date(schedule_date))
    while cursor < end:
        slot_index = cursor // INTERVAL_MINUTES
        slot_start = slot_index * INTERVAL_MINUTES
        slot_end = slot_start + INTERVAL_MINUTES
        overlap_minutes = min(end, slot_end) - cursor
        overlap_ratio = overlap_minutes / INTERVAL_MINUTES
        day_offset = min(slot_index * INTERVAL_MINUTES // MINUTES_PER_DAY, 1)
        contributions.append(
            IntervalContribution(
                date=dates[day_offset],
                interval_start=minutes_to_time(slot_index * INTERVAL_MINUTES),
                overlap_ratio=round(overlap_ratio, 6),
                std_headcount=round(
                    overlap_ratio
                    * segment.allocation_ratio
                    * segment.skill_coefficient
                    * segment.activity_coverage,
                    6,
                ),
            )
        )
        cursor = slot_end
    return contributions


def employee_covered_intervals(
    schedule_date: str,
    segments: list[CoverageSegment],
) -> set[tuple[str, str]]:
    """Dates+interval starts where the employee is physically present (work)."""
    covered: set[tuple[str, str]] = set()
    for segment in segments:
        if segment.activity_type != WORK_ACTIVITY_TYPE:
            continue
        for contribution in segment_interval_contributions(schedule_date, segment):
            if contribution.overlap_ratio > 0:
                covered.add((contribution.date, contribution.interval_start))
    return covered


def calculate_day_coverage(input: DayCoverageInput) -> list[CoverageRow]:
    """Compute all 48 half-hour coverage rows for one schedule date.

    ``planned_headcount`` is the physical headcount caliber (chapter 2.1): the
    number of employees with at least one work segment covering the interval.
    ``std_planned_headcount`` applies the chapter 13.3 formula and only counts
    work segments; phase 1 endpoints may mirror the physical caliber into the
    std fields, but the standard value is always computed here.

    Cross-day segments only contribute their same-date portion here; the
    overnight tail is handled by :func:`calculate_range_coverage`.
    """
    std_by_interval: dict[str, float] = {}
    physical_by_interval: dict[str, int] = {}

    for segments in input.cells.values():
        covered_intervals: set[str] = set()
        for segment in segments:
            if segment.activity_type != WORK_ACTIVITY_TYPE:
                continue
            for contribution in segment_interval_contributions(
                input.schedule_date, segment
            ):
                if contribution.date != input.schedule_date:
                    continue
                interval = contribution.interval_start
                std_by_interval[interval] = (
                    std_by_interval.get(interval, 0.0) + contribution.std_headcount
                )
                covered_intervals.add(interval)
        for interval in covered_intervals:
            physical_by_interval[interval] = physical_by_interval.get(interval, 0) + 1

    return _coverage_rows(input.schedule_date, std_by_interval, physical_by_interval, input.demand_by_interval)


def calculate_range_coverage(
    date_from: str,
    date_to: str,
    cells_by_date: dict[str, dict[str, list[CoverageSegment]]],
    demand_by_date: dict[str, dict[str, float]],
) -> list[CoverageRow]:
    """Coverage rows for every date in ``[date_from, date_to]`` inclusive.

    Cross-day segments count their overnight tail on the following calendar
    day, so contributions are aggregated across all dates first and only then
    split into per-day rows.
    """
    if date_to < date_from:
        raise ValueError("date_to must not be before date_from")

    std_by_key: dict[tuple[str, str], float] = {}
    covered_by_employee: dict[str, set[tuple[str, str]]] = {}
    for schedule_date, cells in cells_by_date.items():
        for employee_id, segments in cells.items():
            covered = covered_by_employee.setdefault(employee_id, set())
            for segment in segments:
                if segment.activity_type != WORK_ACTIVITY_TYPE:
                    continue
                for contribution in segment_interval_contributions(
                    schedule_date, segment
                ):
                    key = (contribution.date, contribution.interval_start)
                    std_by_key[key] = (
                        std_by_key.get(key, 0.0) + contribution.std_headcount
                    )
                    covered.add(key)

    physical_by_key: dict[tuple[str, str], int] = {}
    for covered in covered_by_employee.values():
        for key in covered:
            physical_by_key[key] = physical_by_key.get(key, 0) + 1

    rows: list[CoverageRow] = []
    current = date_type.fromisoformat(date_from)
    last = date_type.fromisoformat(date_to)
    while current <= last:
        schedule_date = current.isoformat()
        std_by_interval = {
            interval: total
            for (date, interval), total in std_by_key.items()
            if date == schedule_date
        }
        physical_by_interval = {
            interval: total
            for (date, interval), total in physical_by_key.items()
            if date == schedule_date
        }
        rows.extend(
            _coverage_rows(
                schedule_date,
                std_by_interval,
                physical_by_interval,
                demand_by_date.get(schedule_date, {}),
            )
        )
        current += timedelta(days=1)
    return rows


def _coverage_rows(
    schedule_date: str,
    std_by_interval: dict[str, float],
    physical_by_interval: dict[str, int],
    demand_by_interval: dict[str, float],
) -> list[CoverageRow]:
    rows: list[CoverageRow] = []
    for slot_index in range(MINUTES_PER_DAY // INTERVAL_MINUTES):
        interval_start = minutes_to_time(slot_index * INTERVAL_MINUTES)
        demand = float(demand_by_interval.get(interval_start, 0.0))
        planned = float(physical_by_interval.get(interval_start, 0))
        std_planned = round(std_by_interval.get(interval_start, 0.0), 6)
        rows.append(
            CoverageRow(
                date=schedule_date,
                interval_start=interval_start,
                demand_headcount=demand,
                planned_headcount=planned,
                gap=round(demand - planned, 6),
                coverage_rate=round(planned / demand, 6) if demand > 0 else None,
                std_planned_headcount=std_planned,
            )
        )
    return rows
