import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPersonTimelineHref,
  fallbackPersonnelScheduleDetails,
  getPersonnelScheduleDetails,
  getPersonnelScheduleDetailsForInterval,
  summarizePersonnelScheduleDetails,
} from "../../lib/personnel-schedule-details.ts";

test("personnel schedule details expose employee-level rows for a plan", () => {
  const rows = getPersonnelScheduleDetails("plan-20260511-shanghai-bosch-v1");

  assert.equal(rows.length, 4);
  assert.equal(rows[0].employeeId, "A-1001");
  assert.equal(rows[0].employeeName, "刘晨");
  assert.equal(rows[0].shiftType, "早班 + 午后班");
  assert.deepEqual(rows[0].expandedIntervals.slice(0, 2), [
    { start: "09:00", end: "09:30" },
    { start: "09:30", end: "10:00" },
  ]);
});

test("personnel schedule details can be traced from a half-hour interval", () => {
  const rows = getPersonnelScheduleDetailsForInterval(
    "plan-20260511-shanghai-bosch-v1",
    "09:30",
    "10:00"
  );

  assert.deepEqual(
    rows.map((row) => row.employeeId),
    ["A-1001", "A-1002", "A-1005"]
  );
});

test("personnel schedule details summarize people, hours, and anomalies", () => {
  const rows = getPersonnelScheduleDetails("plan-20260511-shanghai-bosch-v1");
  const summary = summarizePersonnelScheduleDetails(rows);

  assert.equal(summary.peopleCount, 4);
  assert.equal(summary.totalScheduledHours, 27);
  assert.equal(summary.peopleWithAnomalies, 2);
  assert.equal(summary.intervalCount, 18);
});

test("personnel schedule detail rows link to the matching daily timeline", () => {
  const row = fallbackPersonnelScheduleDetails[0];

  assert.equal(
    buildPersonTimelineHref(row),
    "/person-timeline/A-1001?date=2026-05-11"
  );
});
