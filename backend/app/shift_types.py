from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
import re


@dataclass(frozen=True)
class ShiftTypeConfig:
    shift_code: str
    time_expression: str
    work_hours: float | None = None
    meal_or_break_note: str | None = None
    special_rule_note: str | None = None
    active: bool = True


@dataclass(frozen=True)
class ShiftCoverageInterval:
    shift_code: str
    business_date: str
    interval_start_at: str
    interval_end_at: str


@dataclass(frozen=True)
class ShiftTypeException:
    shift_code: str
    message: str


@dataclass(frozen=True)
class ShiftTypeCoverageResult:
    intervals: list[ShiftCoverageInterval]
    exceptions: list[ShiftTypeException]


@dataclass(frozen=True)
class _ParsedSegment:
    start_minutes: int
    end_minutes: int


_SEGMENT_PATTERN = re.compile(
    r"^\s*(?P<start>\d{1,2}:\d{2})\s*-\s*(?P<end>\d{1,2}:\d{2})\s*$"
)


def expand_shift_type_coverages(
    *,
    business_date: str,
    shift_types: list[ShiftTypeConfig],
) -> ShiftTypeCoverageResult:
    roster_date = date.fromisoformat(business_date)
    intervals: list[ShiftCoverageInterval] = []
    exceptions: list[ShiftTypeException] = []

    for shift_type in shift_types:
        if not shift_type.active:
            continue
        try:
            segments = _parse_segments(shift_type.time_expression)
        except ValueError as error:
            exceptions.append(
                ShiftTypeException(
                    shift_code=shift_type.shift_code,
                    message=f"Cannot parse shift time expression: {error}",
                )
            )
            continue

        for segment in segments:
            intervals.extend(_expand_segment(roster_date, shift_type.shift_code, segment))

    return ShiftTypeCoverageResult(intervals=intervals, exceptions=exceptions)


def _parse_segments(time_expression: str) -> list[_ParsedSegment]:
    if not time_expression or not time_expression.strip():
        raise ValueError("empty expression")

    segments: list[_ParsedSegment] = []
    for raw_segment in time_expression.split("&"):
        match = _SEGMENT_PATTERN.match(raw_segment)
        if match is None:
            raise ValueError(raw_segment.strip() or "empty segment")

        start_minutes = _parse_clock(match.group("start"))
        end_minutes = _parse_clock(match.group("end"))
        if end_minutes == start_minutes:
            raise ValueError(f"{raw_segment.strip()} has zero duration")
        if end_minutes < start_minutes:
            end_minutes += 24 * 60
        _validate_half_hour(start_minutes, raw_segment)
        _validate_half_hour(end_minutes, raw_segment)
        segments.append(_ParsedSegment(start_minutes=start_minutes, end_minutes=end_minutes))

    return segments


def _parse_clock(value: str) -> int:
    hour_text, minute_text = value.split(":", maxsplit=1)
    hour = int(hour_text)
    minute = int(minute_text)
    if minute not in {0, 30}:
        raise ValueError(f"{value} is not aligned to a half-hour boundary")
    if hour == 24 and minute == 0:
        return 24 * 60
    if hour < 0 or hour > 23 or minute < 0 or minute > 59:
        raise ValueError(f"{value} is outside supported 00:00-24:00 range")
    return hour * 60 + minute


def _validate_half_hour(minutes: int, raw_segment: str) -> None:
    if minutes % 30 != 0:
        raise ValueError(f"{raw_segment.strip()} is not aligned to half-hour intervals")


def _expand_segment(
    roster_date: date,
    shift_code: str,
    segment: _ParsedSegment,
) -> list[ShiftCoverageInterval]:
    intervals: list[ShiftCoverageInterval] = []
    cursor = segment.start_minutes
    while cursor < segment.end_minutes:
        interval_start = _minutes_to_datetime(roster_date, cursor)
        interval_end = _minutes_to_datetime(roster_date, cursor + 30)
        intervals.append(
            ShiftCoverageInterval(
                shift_code=shift_code,
                business_date=roster_date.isoformat(),
                interval_start_at=_format_datetime(interval_start),
                interval_end_at=_format_datetime(interval_end),
            )
        )
        cursor += 30
    return intervals


def _minutes_to_datetime(roster_date: date, minutes: int) -> datetime:
    day_offset, minute_of_day = divmod(minutes, 24 * 60)
    hour, minute = divmod(minute_of_day, 60)
    return datetime.combine(roster_date + timedelta(days=day_offset), time(hour, minute))


def _format_datetime(value: datetime) -> str:
    return value.isoformat(timespec="minutes")
