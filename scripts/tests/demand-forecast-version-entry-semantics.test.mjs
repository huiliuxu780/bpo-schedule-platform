import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  summarizeDemandForecastProductionDetail,
  summarizeDemandForecastProductionWorkbench,
} from "../../components/demand-forecast-production-model.ts";

const workbenchPath = new URL(
  "../../components/demand-forecast-production-workbench.tsx",
  import.meta.url,
);
const detailPagePath = new URL(
  "../../app/demand-plans/production/[batchId]/page.tsx",
  import.meta.url,
);

const forecastBatch = {
  batch_id: "BATCH-FC-001",
  file_name: "forecast.csv",
  file_type: "demand_forecast",
  uploaded_by: "planner",
  uploaded_at: "2026-06-04T09:00:00+08:00",
  business_date_from: "2026-06-08",
  business_date_to: "2026-06-14",
  processing_status: "completed",
  total_rows: 24,
  success_rows: 24,
  failed_rows: 0,
  warning_rows: 0,
  version_count: 1,
  application_status: "applied",
  application_target: "demand_forecast",
  import_version_id: "BATCH-FC-001::v1",
  applied_record_count: 336,
};

test("forecast version list row action uses version semantics", () => {
  const summary = summarizeDemandForecastProductionWorkbench([forecastBatch]);

  assert.equal(summary.rows[0].nextActionLabel, "查看预测版本");
  assert.equal(summary.rows[0].detailHref, "/demand-plans/production/BATCH-FC-001");
});

test("forecast version detail model exposes a version-list return label", () => {
  const detail = summarizeDemandForecastProductionDetail(
    [forecastBatch],
    "BATCH-FC-001",
  );

  assert.equal(detail.workbenchHref, "/demand-plans/production");
  assert.equal(detail.workbenchLabel, "返回预测版本列表");
});

test("forecast version detail page copy does not fall back to source-batch processing semantics", async () => {
  const workbenchSource = await readFile(workbenchPath, "utf8");
  const detailPageSource = await readFile(detailPagePath, "utf8");

  assert.equal(workbenchSource.includes(">返回需求计划<"), false);
  assert.equal(workbenchSource.includes("来源批次对应"), false);
  assert.equal(workbenchSource.includes("预测来源读取失败"), false);
  assert.equal(workbenchSource.includes("预测版本读取失败"), true);
  assert.equal(detailPageSource.includes("预测版本详情"), true);
});
