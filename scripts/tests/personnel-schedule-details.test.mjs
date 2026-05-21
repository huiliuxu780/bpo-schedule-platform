import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPersonTimelineHref,
  buildPersonnelIntervalTrace,
  buildPersonnelScheduleIntervalLinkage,
  summarizePersonnelScheduleIntervalLinkage,
  buildScheduleGapExplanation,
  fallbackPersonnelScheduleDetails,
  getPersonnelScheduleDetails,
  getPersonnelScheduleDetailsForInterval,
  getPersonnelScheduleFieldCoverage,
  summarizePersonnelScheduleDetails,
} from "../../lib/personnel-schedule-details.ts";
import { getSchedulePlan } from "../../lib/schedule-plans.ts";

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
    "/person-timeline/A-1001?date=2026-05-11&team=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&group=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D%7C%7C%E4%BE%9B%E5%BA%94%E5%95%86%20A&returnDate=2026-05-11"
  );
});

test("schedule gap explanation exposes involved people and shifts", () => {
  const explanation = buildScheduleGapExplanation(
    "plan-20260511-shanghai-bosch-v1",
    "09:30",
    "10:00"
  );

  assert.deepEqual(explanation, {
    planId: "plan-20260511-shanghai-bosch-v1",
    intervalStart: "09:30",
    intervalEnd: "10:00",
    involvedPeople: [
      {
        employeeId: "A-1001",
        employeeName: "刘晨",
        supplier: "供应商 A",
        shiftType: "早班 + 午后班",
        scheduledWindow: "09:00-18:00",
        skill: "热线 / L2",
        timelineHref: "/person-timeline/A-1001?date=2026-05-11&team=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&group=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D%7C%7C%E4%BE%9B%E5%BA%94%E5%95%86%20A&returnDate=2026-05-11",
      },
      {
        employeeId: "A-1002",
        employeeName: "王敏",
        supplier: "供应商 A",
        shiftType: "早班",
        scheduledWindow: "09:00-17:00",
        skill: "热线 / L2",
        timelineHref: "/person-timeline/A-1002?date=2026-05-11&team=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&group=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D%7C%7C%E4%BE%9B%E5%BA%94%E5%95%86%20A&returnDate=2026-05-11",
      },
      {
        employeeId: "A-1005",
        employeeName: "赵一",
        supplier: "供应商 B",
        shiftType: "支援班",
        scheduledWindow: "09:30-15:30",
        skill: "热线 / L1",
        timelineHref: "/person-timeline/A-1005?date=2026-05-11&team=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&group=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D%7C%7C%E4%BE%9B%E5%BA%94%E5%95%86%20B&returnDate=2026-05-11",
      },
    ],
    candidatePeople: [
      {
        employeeId: "A-1006",
        employeeName: "周航",
        supplier: "供应商 C",
        shiftType: "午后班",
        scheduledWindow: "13:00-18:00",
        skill: "工单 / L1",
        timelineHref: "/person-timeline/A-1006?date=2026-05-11&team=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&group=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D%7C%7C%E4%BE%9B%E5%BA%94%E5%95%86%20C&returnDate=2026-05-11",
      },
    ],
  });
});

test("personnel schedule interval linkage compares summary count with linked people", async () => {
  const plan = await getSchedulePlan("plan-20260511-suzhou-bosch-v1");
  const linkage = buildPersonnelScheduleIntervalLinkage(plan);
  const noon = linkage.find(
    (item) => item.intervalStart === "12:00" && item.intervalEnd === "12:30"
  );

  assert.equal(noon?.scheduledAgents, 10);
  assert.equal(noon?.linkedPeopleCount, 1);
  assert.equal(noon?.difference, 9);
  assert.equal(noon?.status, "需核对");
  assert.deepEqual(
    noon?.assignedPeople.map((person) => person.employeeId),
    ["A-1003"]
  );
});

test("personnel schedule linkage summary exposes interval and people coverage", async () => {
  const plan = await getSchedulePlan("plan-20260511-suzhou-bosch-v1");
  const summary = summarizePersonnelScheduleIntervalLinkage(
    buildPersonnelScheduleIntervalLinkage(plan)
  );

  assert.equal(summary.intervalCount, 8);
  assert.equal(summary.linkedPeopleCount, 1);
  assert.equal(summary.intervalsNeedingReview, 8);
});
