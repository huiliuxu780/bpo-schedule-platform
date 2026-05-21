import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPersonTimelineHref,
  buildPersonnelIntervalTrace,
  fallbackPersonnelScheduleDetails,
  getPersonnelScheduleDetails,
  getPersonnelScheduleDetailsForInterval,
  getPersonnelScheduleFieldCoverage,
  summarizePersonnelScheduleDetails,
} from "../../lib/personnel-schedule-details.ts";

test("personnel schedule details expose employee-level rows for a plan", () => {
  const rows = getPersonnelScheduleDetails("plan-20260511-shanghai-bosch-v1");

  assert.equal(rows.length, 4);
  assert.equal(rows[0].employeeId, "A-1001");
  assert.equal(rows[0].employeeName, "刘晨");
  assert.equal(rows[0].supplier, "供应商 A");
  assert.equal(rows[0].workplace, "上海职场");
  assert.equal(rows[0].project, "博西客服");
  assert.equal(rows[0].skillGroup, "热线");
  assert.equal(rows[0].skillLevel, "L2");
  assert.equal(rows[0].shiftType, "早班 + 午后班");
  assert.deepEqual(rows[0].anomalyLabels, ["状态不一致"]);
  assert.deepEqual(rows[0].expandedIntervals.slice(0, 2), [
    { start: "09:00", end: "09:30" },
    { start: "09:30", end: "10:00" },
  ]);
});

test("personnel schedule field coverage confirms business columns", () => {
  const rows = getPersonnelScheduleDetails("plan-20260511-shanghai-bosch-v1");
  const coverage = getPersonnelScheduleFieldCoverage(rows);

  assert.deepEqual(coverage.requiredFields, [
    "employeeId",
    "employeeName",
    "supplier",
    "workplace",
    "project",
    "skillGroup",
    "skillLevel",
    "shiftType",
    "anomalyLabels",
  ]);
  assert.equal(coverage.completeRows, 4);
  assert.equal(coverage.totalRows, 4);
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

test("half-hour interval trace exposes assigned people and anomaly labels", () => {
  const trace = buildPersonnelIntervalTrace(
    "plan-20260511-shanghai-bosch-v1",
    "09:30",
    "10:00"
  );

  assert.deepEqual(trace, {
    planId: "plan-20260511-shanghai-bosch-v1",
    intervalStart: "09:30",
    intervalEnd: "10:00",
    assignedPeople: [
      {
        employeeId: "A-1001",
        employeeName: "刘晨",
        supplier: "供应商 A",
        shiftType: "早班 + 午后班",
        skill: "热线 / L2",
        anomalyLabels: ["状态不一致"],
      },
      {
        employeeId: "A-1002",
        employeeName: "王敏",
        supplier: "供应商 A",
        shiftType: "早班",
        skill: "热线 / L2",
        anomalyLabels: ["登录迟到"],
      },
      {
        employeeId: "A-1005",
        employeeName: "赵一",
        supplier: "供应商 B",
        shiftType: "支援班",
        skill: "热线 / L1",
        anomalyLabels: [],
      },
    ],
  });
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
