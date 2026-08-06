import assert from "node:assert/strict";
import test from "node:test";

import {
  buildShiftSegmentBars,
  formatShiftDuration,
  groupShiftDefinitionVersions,
  normalizeShiftDefinitionForm,
  parseShiftTimeToMinutes,
  shiftSegmentDurationMinutes,
  summarizeShiftFeedback,
} from "../../components/base-config/shift-activity-model.ts";

function validForm(overrides = {}) {
  return {
    shift_code: "MORNING-A",
    shift_name: "早班",
    effective_from: "2026-08-01",
    effective_to: "2026-12-31",
    is_cross_day: false,
    segments: [
      { activity_type: "work", start_time: "08:00", end_time: "12:00" },
      { activity_type: "meal", start_time: "12:00", end_time: "12:45" },
      { activity_type: "work", start_time: "12:45", end_time: "16:30" },
    ],
    ...overrides,
  };
}

test("parseShiftTimeToMinutes accepts HH:MM and rejects malformed values", () => {
  assert.equal(parseShiftTimeToMinutes("08:00"), 480);
  assert.equal(parseShiftTimeToMinutes("23:45"), 1425);
  assert.equal(parseShiftTimeToMinutes(" 09:15 "), 555);
  assert.equal(parseShiftTimeToMinutes("24:00"), null);
  assert.equal(parseShiftTimeToMinutes("8:00"), null);
  assert.equal(parseShiftTimeToMinutes("08:60"), null);
  assert.equal(parseShiftTimeToMinutes("0800"), null);
  assert.equal(parseShiftTimeToMinutes(""), null);
});

test("formatShiftDuration renders hours and minutes in Chinese units", () => {
  assert.equal(formatShiftDuration(480), "8小时");
  assert.equal(formatShiftDuration(510), "8小时30分钟");
  assert.equal(formatShiftDuration(45), "45分钟");
  assert.equal(formatShiftDuration(0), "0分钟");
});

test("shiftSegmentDurationMinutes wraps only for cross-day segments", () => {
  const overnight = {
    activity_type: "work",
    start_time: "22:00",
    end_time: "06:00",
  };

  assert.equal(shiftSegmentDurationMinutes(overnight, true), 480);
  assert.equal(shiftSegmentDurationMinutes(overnight, false), null);
  assert.equal(
    shiftSegmentDurationMinutes(
      { activity_type: "work", start_time: "09:00", end_time: "09:00" },
      false
    ),
    null
  );
});

test("normalizeShiftDefinitionForm builds the backend create payload", () => {
  const result = normalizeShiftDefinitionForm(validForm());

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.payload, {
    shift_code: "MORNING-A",
    shift_name: "早班",
    effective_from: "2026-08-01",
    effective_to: "2026-12-31",
    segments: [
      { activity_type: "work", start_time: "08:00", end_time: "12:00" },
      { activity_type: "meal", start_time: "12:00", end_time: "12:45" },
      { activity_type: "work", start_time: "12:45", end_time: "16:30" },
    ],
    is_cross_day: false,
    night_attribution: "start_date",
  });
});

test("normalizeShiftDefinitionForm aligns with backend required-field rules", () => {
  const missingCode = normalizeShiftDefinitionForm(validForm({ shift_code: "  " }));
  assert.ok(missingCode.errors.some((error) => error.startsWith("SHIFT_CODE_REQUIRED")));
  assert.equal(missingCode.payload, null);

  const missingName = normalizeShiftDefinitionForm(validForm({ shift_name: "" }));
  assert.ok(missingName.errors.some((error) => error.startsWith("SHIFT_NAME_REQUIRED")));

  const missingSegments = normalizeShiftDefinitionForm(validForm({ segments: [] }));
  assert.ok(
    missingSegments.errors.some((error) =>
      error.startsWith("SHIFT_SEGMENTS_REQUIRED")
    )
  );

  const noWorkSegment = normalizeShiftDefinitionForm(
    validForm({
      segments: [{ activity_type: "meal", start_time: "12:00", end_time: "13:00" }],
    })
  );
  assert.ok(
    noWorkSegment.errors.some((error) =>
      error.startsWith("SHIFT_WORK_SEGMENT_REQUIRED")
    )
  );
});

test("normalizeShiftDefinitionForm rejects reversed effective period", () => {
  const result = normalizeShiftDefinitionForm(
    validForm({ effective_from: "2026-12-31", effective_to: "2026-08-01" })
  );

  assert.ok(
    result.errors.some((error) => error.startsWith("INVALID_EFFECTIVE_PERIOD"))
  );
  assert.equal(result.payload, null);
});

test("normalizeShiftDefinitionForm enforces 15-minute granularity", () => {
  const result = normalizeShiftDefinitionForm(
    validForm({
      segments: [{ activity_type: "work", start_time: "08:05", end_time: "16:00" }],
    })
  );

  assert.ok(
    result.errors.some((error) => error.startsWith("SHIFT_SEGMENT_GRANULARITY"))
  );
  assert.equal(result.payload, null);
});

test("normalizeShiftDefinitionForm rejects identical start/end and 24h overflow", () => {
  const identical = normalizeShiftDefinitionForm(
    validForm({
      segments: [{ activity_type: "work", start_time: "09:00", end_time: "09:00" }],
    })
  );
  assert.ok(
    identical.errors.some((error) => error.startsWith("SHIFT_SEGMENT_INVALID"))
  );

  const overflow = normalizeShiftDefinitionForm(
    validForm({
      segments: [
        { activity_type: "work", start_time: "00:00", end_time: "12:15" },
        { activity_type: "work", start_time: "11:00", end_time: "23:00" },
      ],
    })
  );
  assert.ok(
    overflow.errors.some((error) => error.startsWith("SHIFT_DURATION_EXCEEDED"))
  );
});

test("normalizeShiftDefinitionForm allows wrapped segments only for cross-day shifts", () => {
  const withoutFlag = normalizeShiftDefinitionForm(
    validForm({
      segments: [{ activity_type: "work", start_time: "22:00", end_time: "06:00" }],
    })
  );
  assert.ok(
    withoutFlag.errors.some((error) => error.startsWith("SHIFT_SEGMENT_CROSS_DAY"))
  );

  const withFlag = normalizeShiftDefinitionForm(
    validForm({
      is_cross_day: true,
      segments: [{ activity_type: "work", start_time: "22:00", end_time: "06:00" }],
    })
  );
  assert.deepEqual(withFlag.errors, []);
  assert.equal(withFlag.payload?.is_cross_day, true);
});

function record(overrides = {}) {
  return {
    shift_definition_id: "MORNING-A-V1",
    shift_code: "MORNING-A",
    version_number: 1,
    shift_name: "早班",
    effective_from: "2026-08-01",
    effective_to: "2026-12-31",
    segments: [{ activity_type: "work", start_time: "08:00", end_time: "16:00" }],
    is_cross_day: false,
    night_attribution: "start_date",
    status: "archived",
    created_at: "2026-08-01T00:00:00+00:00",
    ...overrides,
  };
}

test("groupShiftDefinitionVersions keeps history and picks the latest version", () => {
  const groups = groupShiftDefinitionVersions([
    record(),
    record({
      shift_definition_id: "MORNING-A-V2",
      version_number: 2,
      shift_name: "早班（调整）",
      status: "active",
    }),
    record({ shift_code: "NIGHT-B", shift_definition_id: "NIGHT-B-V1" }),
  ]);

  assert.deepEqual(groups.map((group) => group.shift_code), ["MORNING-A", "NIGHT-B"]);
  const morning = groups[0];
  assert.equal(morning.latest.version_number, 2);
  assert.equal(morning.latest.status, "active");
  assert.deepEqual(
    morning.versions.map((version) => version.version_number),
    [2, 1]
  );
  assert.equal(morning.versions[1].status, "archived");
  assert.equal(morning.latestTotalMinutes, 480);
});

test("buildShiftSegmentBars projects segments onto the 24h track", () => {
  const bars = buildShiftSegmentBars(
    [
      { activity_type: "work", start_time: "08:00", end_time: "12:00" },
      { activity_type: "meal", start_time: "12:00", end_time: "12:45" },
    ],
    false
  );

  assert.equal(bars.length, 2);
  assert.ok(Math.abs(bars[0].leftPercent - 33.3333) < 0.01);
  assert.ok(Math.abs(bars[0].widthPercent - 16.6666) < 0.01);
  assert.equal(bars[1].label, "用餐 12:00-12:45");
});

test("buildShiftSegmentBars splits wrapped overnight segments in two", () => {
  const bars = buildShiftSegmentBars(
    [{ activity_type: "work", start_time: "22:00", end_time: "06:00" }],
    true
  );

  assert.equal(bars.length, 2);
  const head = bars.find((bar) => !bar.wrapped);
  const tail = bars.find((bar) => bar.wrapped);
  assert.ok(Math.abs(head.leftPercent - 91.6666) < 0.01);
  assert.ok(Math.abs(head.widthPercent - 8.3333) < 0.01);
  assert.equal(tail.leftPercent, 0);
  assert.equal(tail.widthPercent, 25);
});

test("buildShiftSegmentBars drops the zero-width tail when a wrapped segment ends at 00:00", () => {
  const bars = buildShiftSegmentBars(
    [{ activity_type: "work", start_time: "22:00", end_time: "00:00" }],
    true
  );

  assert.equal(bars.length, 1);
  assert.equal(bars[0].wrapped, false);
  assert.ok(Math.abs(bars[0].leftPercent - 91.6666) < 0.01);
  assert.ok(Math.abs(bars[0].widthPercent - 8.3333) < 0.01);
});

test("summarizeShiftFeedback renders success and error banners from redirect params", () => {
  const success = summarizeShiftFeedback({
    shift_feedback_status: "success",
    shift_feedback_record_id: "MORNING-A-V2",
    shift_feedback_record_name: "早班（调整）",
  });
  assert.equal(success?.tone, "success");
  assert.ok(success.detail.includes("MORNING-A-V2"));
  assert.ok(success.detail.includes("历史版本未被覆写"));

  const error = summarizeShiftFeedback({
    shift_feedback_status: "error",
    shift_feedback_code: "SHIFT_WORK_SEGMENT_REQUIRED",
    shift_feedback_message: "班次必须包含至少一个工作分段",
  });
  assert.equal(error?.tone, "error");
  assert.ok(error.detail.includes("SHIFT_WORK_SEGMENT_REQUIRED"));

  assert.equal(summarizeShiftFeedback({}), null);
});
