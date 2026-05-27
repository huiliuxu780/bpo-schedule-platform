import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDemandSupplyAlignment,
  summarizeDemandPlanDimensions,
} from "../../lib/schedule-plans.ts";

test("demand plan dimensions expose site project interval skill group and level", () => {
  const rows = buildDemandSupplyAlignment();
  const summary = summarizeDemandPlanDimensions(rows);

  assert.deepEqual(summary.requiredDimensions, [
    "site_name",
    "project_name",
    "interval",
    "skill_group",
    "skill_level",
  ]);
  assert.equal(summary.siteCount, 2);
  assert.deepEqual(summary.skillGroups, ["工单", "热线"]);
  assert.deepEqual(summary.skillLevels, ["L1", "L2"]);
});

test("demand supply alignment exposes shortage overstaff and versions", () => {
  const rows = buildDemandSupplyAlignment();
  const shortage = rows.find(
    (row) =>
      row.siteName === "上海职场" &&
      row.intervalStart === "09:30" &&
      row.skillGroup === "热线"
  );
  const overstaffed = rows.find(
    (row) =>
      row.siteName === "上海职场" &&
      row.intervalStart === "12:30" &&
      row.skillGroup === "热线"
  );

  assert.deepEqual(
    {
      status: shortage?.alignmentStatus,
      forecastAgents: shortage?.forecastAgents,
      scheduledAgents: shortage?.scheduledAgents,
      shortageAgents: shortage?.shortageAgents,
      overstaffedAgents: shortage?.overstaffedAgents,
      forecastVersion: shortage?.forecastVersion,
      scheduleVersion: shortage?.scheduleVersion,
      personnelDetailHref: shortage?.personnelDetailHref,
    },
    {
      status: "缺口",
      forecastAgents: 18,
      scheduledAgents: 17,
      shortageAgents: 1,
      overstaffedAgents: 0,
      forecastVersion: "预测 v1",
      scheduleVersion: "排班 v1",
      personnelDetailHref:
        "/schedule-plans/plan-20260511-shanghai-bosch-v1#personnel-schedule-details",
    }
  );

  assert.deepEqual(
    {
      status: overstaffed?.alignmentStatus,
      forecastAgents: overstaffed?.forecastAgents,
      scheduledAgents: overstaffed?.scheduledAgents,
      shortageAgents: overstaffed?.shortageAgents,
      overstaffedAgents: overstaffed?.overstaffedAgents,
    },
    {
      status: "超排",
      forecastAgents: 12,
      scheduledAgents: 13,
      shortageAgents: 0,
      overstaffedAgents: 1,
    }
  );
});

test("demand supply alignment preserves imported demand source traceability", () => {
  const rows = buildDemandSupplyAlignment([
    {
      demand_id: "DF-BATCH-001-002",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      interval_start: "09:30",
      interval_end: "10:00",
      skill_group: "热线",
      skill_level: "L2",
      forecast_agents: 20,
      forecast_version: "VER-DF-20260527-001",
      source: "导入需求预测 / BATCH-DF-20260527-001",
      source_batch_id: "BATCH-DF-20260527-001",
      source_version_id: "VER-DF-20260527-001",
      status: "imported",
    },
  ]);

  assert.deepEqual(
    {
      demandId: rows[0]?.demandId,
      forecastVersion: rows[0]?.forecastVersion,
      sourceBatchId: rows[0]?.sourceBatchId,
      sourceVersionId: rows[0]?.sourceVersionId,
      forecastAgents: rows[0]?.forecastAgents,
      status: rows[0]?.alignmentStatus,
    },
    {
      demandId: "DF-BATCH-001-002",
      forecastVersion: "VER-DF-20260527-001",
      sourceBatchId: "BATCH-DF-20260527-001",
      sourceVersionId: "VER-DF-20260527-001",
      forecastAgents: 20,
      status: "缺口",
    }
  );
});

test("demand supply alignment exposes unmatched skill group anomalies", () => {
  const rows = buildDemandSupplyAlignment();
  const mismatch = rows.find(
    (row) =>
      row.siteName === "上海职场" &&
      row.intervalStart === "11:30" &&
      row.skillGroup === "工单"
  );

  assert.deepEqual(
    {
      status: mismatch?.alignmentStatus,
      skillGroup: mismatch?.skillGroup,
      skillLevel: mismatch?.skillLevel,
      mismatchReason: mismatch?.mismatchReason,
    },
    {
      status: "技能不匹配",
      skillGroup: "工单",
      skillLevel: "L2",
      mismatchReason: "当前时段没有匹配 工单 / L2 的已排人员",
    }
  );
});
