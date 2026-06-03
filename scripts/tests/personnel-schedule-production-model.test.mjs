import assert from "node:assert/strict";
import test from "node:test";

import {
  summarizePersonnelScheduleProductionWorkbench,
} from "../../components/personnel-schedule-production-model.ts";

const baseBatch = {
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

test("personnel schedule production workbench shows an empty state without schedule batches", () => {
  const summary = summarizePersonnelScheduleProductionWorkbench([]);

  assert.equal(summary.tone, "empty");
  assert.equal(summary.totalVersions, 0);
  assert.equal(summary.expandedVersions, 0);
  assert.equal(summary.blockedVersions, 0);
  assert.equal(summary.rows.length, 0);
  assert.equal(summary.title, "等待人员排班来源批次");
});

test("personnel schedule production workbench summarizes applied schedule versions", () => {
  const summary = summarizePersonnelScheduleProductionWorkbench([
    baseBatch,
    {
      ...baseBatch,
      batch_id: "BATCH-MD-001",
      file_type: "master_data",
      import_version_id: "BATCH-MD-001::v1",
    },
  ]);

  assert.equal(summary.tone, "ready");
  assert.equal(summary.totalVersions, 1);
  assert.equal(summary.appliedVersions, 1);
  assert.equal(summary.expandedVersions, 1);
  assert.equal(summary.blockedVersions, 0);
  assert.equal(summary.rows[0].versionLabel, "BATCH-SCH-001::v1");
  assert.equal(summary.rows[0].sourceBatchHref, "/data-quality/import-batches/BATCH-SCH-001");
  assert.equal(summary.rows[0].applicationLabel, "已应用");
  assert.equal(summary.rows[0].expansionLabel, "0.5h 已展开");
  assert.equal(summary.rows[0].blockerSummary, "无阻塞；当前只读展示排班生产口径");
  assert.equal(summary.rows[0].nextActionLabel, "版本详情待 IM100");
});

test("personnel schedule production workbench blocks unapplied schedule versions", () => {
  const summary = summarizePersonnelScheduleProductionWorkbench([
    {
      ...baseBatch,
      batch_id: "BATCH-SCH-002",
      application_status: "not_applied",
      import_version_id: "BATCH-SCH-002::v1",
      applied_record_count: 0,
    },
  ]);

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.appliedVersions, 0);
  assert.equal(summary.expandedVersions, 0);
  assert.equal(summary.blockedVersions, 1);
  assert.equal(summary.rows[0].applicationLabel, "待应用");
  assert.equal(summary.rows[0].expansionLabel, "等待应用后展开");
  assert.equal(summary.rows[0].blockerSummary, "排班批次尚未应用到业务数据");
});

test("personnel schedule production workbench blocks missing import version", () => {
  const summary = summarizePersonnelScheduleProductionWorkbench([
    {
      ...baseBatch,
      import_version_id: null,
      application_status: "applied",
      applied_record_count: 0,
    },
  ]);

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.rows[0].versionLabel, "暂无排班业务版本");
  assert.equal(summary.rows[0].expansionLabel, "缺少版本无法展开");
  assert.equal(summary.rows[0].blockerSummary, "缺少人员排班业务版本");
});
