import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildPersonTimelineHref,
  buildPersonScheduleSource,
  buildPersonnelScheduleIntervalExpansion,
  mapImportedPersonnelScheduleRecord,
  mergeImportedPersonnelScheduleDetails,
  buildPersonnelIntervalTrace,
  buildPersonnelScheduleIntervalLinkage,
  summarizePersonnelScheduleIntervalLinkage,
  buildScheduleGapExplanation,
  fallbackPersonnelScheduleDetails,
  getPersonnelScheduleDetails,
  getPersonnelScheduleDetailForEmployeeDate,
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

test("imported personnel schedule records map source batch version and shift reference", () => {
  const row = mapImportedPersonnelScheduleRecord({
    schedule_detail_id: "SCH-001",
    schedule_version_id: "SV-20260526",
    employee_id: "E-001",
    employee_name: "导入员工",
    business_date: "2026-05-26",
    workplace_id: "WP-SH",
    workplace_name: "上海职场",
    supplier_id: "SUP-01",
    supplier_name: "供应商 A",
    project_id: "P-BOSCH",
    project_name: "博西客服",
    shift_type_id: "SHIFT-DAY",
    shift_type_name: "标准早班",
    shift_type_reference_status: "ready",
    start_at: "09:00",
    end_at: "18:00",
    skill_group: "热线",
    skill_level: "L2",
    status: "published",
    source_batch_id: "BATCH-PS-20260527-001",
    source_version_id: "VER-PS-20260527-001",
  });

  assert.equal(row.scheduleDetailId, "SCH-001");
  assert.equal(row.scheduleVersionId, "SV-20260526");
  assert.equal(row.sourceBatchId, "BATCH-PS-20260527-001");
  assert.equal(row.sourceVersionId, "VER-PS-20260527-001");
  assert.equal(row.shiftTypeReferenceStatus, "ready");
  assert.equal(row.shiftType, "标准早班");
});

test("personnel schedule interval expansion groups half-hour source rows with trace links", () => {
  const rows = [
    mapImportedPersonnelScheduleRecord({
      schedule_detail_id: "SCH-001",
      schedule_version_id: "SV-20260526",
      employee_id: "E-001",
      employee_name: "导入员工 1",
      business_date: "2026-05-26",
      workplace_id: "WP-SH",
      workplace_name: "上海职场",
      supplier_id: "SUP-01",
      supplier_name: "供应商 A",
      project_id: "P-BOSCH",
      project_name: "博西客服",
      shift_type_id: "SHIFT-DAY",
      shift_type_name: "标准早班",
      shift_type_reference_status: "ready",
      start_at: "09:00",
      end_at: "10:00",
      skill_group: "热线",
      skill_level: "L2",
      status: "published",
      source_batch_id: "BATCH-PS-20260527-001",
      source_version_id: "VER-PS-20260527-001",
    }),
    mapImportedPersonnelScheduleRecord({
      schedule_detail_id: "SCH-002",
      schedule_version_id: "SV-20260526",
      employee_id: "E-002",
      employee_name: "导入员工 2",
      business_date: "2026-05-26",
      workplace_id: "WP-SH",
      workplace_name: "上海职场",
      supplier_id: "SUP-01",
      supplier_name: "供应商 A",
      project_id: "P-BOSCH",
      project_name: "博西客服",
      shift_type_id: "SHIFT-DAY",
      shift_type_name: "标准早班",
      shift_type_reference_status: "ready",
      start_at: "09:30",
      end_at: "10:30",
      skill_group: "热线",
      skill_level: "L2",
      status: "published",
      source_batch_id: "BATCH-PS-20260527-001",
      source_version_id: "VER-PS-20260527-001",
    }),
  ];

  const expansions = buildPersonnelScheduleIntervalExpansion(rows);
  const interval = expansions.find(
    (item) => item.intervalStart === "09:30" && item.intervalEnd === "10:00"
  );

  assert.equal(interval.scheduledAgents, 2);
  assert.equal(interval.scheduleVersionId, "SV-20260526");
  assert.equal(interval.sourceBatchId, "BATCH-PS-20260527-001");
  assert.deepEqual(interval.employeeIds, ["E-001", "E-002"]);
  assert.deepEqual(interval.scheduleDetailIds, ["SCH-001", "SCH-002"]);
  assert.equal(interval.people[0].timelineHref.includes("/person-timeline/E-001"), true);
});

test("imported personnel schedule rows are shown before fallback rows", () => {
  const rows = mergeImportedPersonnelScheduleDetails([
    mapImportedPersonnelScheduleRecord({
      schedule_detail_id: "SCH-001",
      schedule_version_id: "SV-20260526",
      employee_id: "E-001",
      employee_name: "导入员工",
      business_date: "2026-05-26",
      workplace_id: "WP-SH",
      workplace_name: "上海职场",
      supplier_id: "SUP-01",
      supplier_name: "供应商 A",
      project_id: "P-BOSCH",
      project_name: "博西客服",
      shift_type_id: "SHIFT-DAY",
      shift_type_name: "标准早班",
      shift_type_reference_status: "ready",
      start_at: "09:00",
      end_at: "18:00",
      skill_group: "热线",
      skill_level: "L2",
      status: "published",
      source_batch_id: "BATCH-PS-20260527-001",
      source_version_id: "VER-PS-20260527-001",
    }),
  ]);

  assert.equal(rows[0].scheduleDetailId, "SCH-001");
  assert.equal(rows[0].sourceVersionId, "VER-PS-20260527-001");
  assert.ok(rows.some((row) => row.scheduleDetailId === "PSD-1001-20260511"));
});

test("schedule plans page exposes imported personnel schedule traceability", () => {
  const source = readFileSync("app/schedule-plans/page.tsx", "utf8");

  assert.ok(source.includes("人员排班导入"));
  assert.ok(source.includes("来源批次"));
  assert.ok(source.includes("排班版本"));
  assert.ok(source.includes("班次引用"));
  assert.ok(source.includes("0.5h 展开"));
  assert.ok(source.includes("履约链接"));
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
        timelineHref: "/person-timeline/A-1001?date=2026-05-11&team=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&group=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D%7C%7C%E4%BE%9B%E5%BA%94%E5%95%86%20A&returnDate=2026-05-11",
      },
      {
        employeeId: "A-1002",
        employeeName: "王敏",
        supplier: "供应商 A",
        shiftType: "早班",
        skill: "热线 / L2",
        anomalyLabels: ["登录迟到"],
        timelineHref: "/person-timeline/A-1002?date=2026-05-11&team=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&group=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D%7C%7C%E4%BE%9B%E5%BA%94%E5%95%86%20A&returnDate=2026-05-11",
      },
      {
        employeeId: "A-1005",
        employeeName: "赵一",
        supplier: "供应商 B",
        shiftType: "支援班",
        skill: "热线 / L1",
        anomalyLabels: [],
        timelineHref: "/person-timeline/A-1005?date=2026-05-11&team=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&group=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D%7C%7C%E4%BE%9B%E5%BA%94%E5%95%86%20B&returnDate=2026-05-11",
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
  assert.equal(
    noon?.assignedPeople[0]?.timelineHref,
    "/person-timeline/A-1003?date=2026-05-11&team=%E8%8B%8F%E5%B7%9E%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&group=%E8%8B%8F%E5%B7%9E%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D%7C%7C%E4%BE%9B%E5%BA%94%E5%95%86%20B&returnDate=2026-05-11"
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

test("person schedule source traces a person day back to the schedule draft", async () => {
  const row = getPersonnelScheduleDetailForEmployeeDate("A-1003", "2026-05-11");
  const plan = await getSchedulePlan("plan-20260511-suzhou-bosch-v1");
  const source = buildPersonScheduleSource(row, plan);

  assert.deepEqual(source, {
    planId: "plan-20260511-suzhou-bosch-v1",
    planHref: "/schedule-plans/plan-20260511-suzhou-bosch-v1",
    draftHref: "/schedule-plans/plan-20260511-suzhou-bosch-v1/edit",
    scheduleDetailId: "PSD-1003-20260511",
    shiftType: "晚班",
    scheduledWindow: "12:00-20:00",
    skill: "热线 / L2",
    linkedIntervalCount: 2,
    reviewIntervalCount: 2,
    reviewIntervals: [
      {
        intervalStart: "12:00",
        intervalEnd: "12:30",
        scheduledAgents: 10,
        linkedPeopleCount: 1,
        difference: 9,
        status: "需核对",
      },
      {
        intervalStart: "12:30",
        intervalEnd: "13:00",
        scheduledAgents: 10,
        linkedPeopleCount: 1,
        difference: 9,
        status: "需核对",
      },
    ],
  });
});
