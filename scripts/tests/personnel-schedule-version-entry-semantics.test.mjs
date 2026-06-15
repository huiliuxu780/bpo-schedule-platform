import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  summarizePersonnelScheduleProductionDetail,
  summarizePersonnelScheduleProductionWorkbench,
} from "../../components/personnel-schedule-production-model.ts";

const workbenchPath = new URL(
  "../../components/personnel-schedule-production-workbench.tsx",
  import.meta.url,
);
const detailPagePath = new URL(
  "../../app/schedule-plans/production/[batchId]/page.tsx",
  import.meta.url,
);

const scheduleBatch = {
  batch_id: "BATCH-SCH-001",
  file_name: "schedule.csv",
  file_type: "personnel_schedule",
  uploaded_by: "planner",
  uploaded_at: "2026-06-03T09:00:00+08:00",
  business_date_from: "2026-06-01",
  business_date_to: "2026-06-07",
  processing_status: "completed",
  total_rows: 12,
  success_rows: 12,
  failed_rows: 0,
  warning_rows: 0,
  version_count: 1,
  application_status: "applied",
  application_target: "personnel_schedule",
  import_version_id: "BATCH-SCH-001::v1",
  applied_record_count: 96,
};

test("schedule version list row action uses version semantics", () => {
  const summary = summarizePersonnelScheduleProductionWorkbench([scheduleBatch]);

  assert.equal(summary.rows[0].nextActionLabel, "查看排班版本");
  assert.equal(summary.rows[0].detailHref, "/schedule-plans/production/BATCH-SCH-001");
});

test("schedule version detail model exposes a version-list return label", () => {
  const detail = summarizePersonnelScheduleProductionDetail(
    [scheduleBatch],
    "BATCH-SCH-001",
  );

  assert.equal(detail.workbenchHref, "/schedule-plans/production");
  assert.equal(detail.workbenchLabel, "返回排班版本列表");
});

test("schedule version detail page copy does not fall back to source-batch processing semantics", async () => {
  const workbenchSource = await readFile(workbenchPath, "utf8");
  const detailPageSource = await readFile(detailPagePath, "utf8");

  assert.equal(workbenchSource.includes(">返回排班计划<"), false);
  assert.equal(workbenchSource.includes("来源批次对应"), false);
  assert.equal(workbenchSource.includes("排班来源读取失败"), false);
  assert.equal(workbenchSource.includes("排班版本读取失败"), true);
  assert.equal(detailPageSource.includes("排班版本详情"), true);
});
