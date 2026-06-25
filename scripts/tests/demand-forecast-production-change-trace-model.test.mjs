import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeDemandForecastProductionDetail,
} = jiti("../../components/demand-forecast-production-model.ts");

const baseBatch = {
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

test("demand forecast production detail exposes source change tracking", () => {
  const detail = summarizeDemandForecastProductionDetail([baseBatch], "BATCH-FC-001");

  assert.equal(detail.changeBoundaryLabel, "暂无变更记录");
  assert.deepEqual(detail.changeRows, []);
});

test("demand forecast production detail blocks missing forecast rows without fabricated details", () => {
  const detail = summarizeDemandForecastProductionDetail(
    [
      {
        ...baseBatch,
        applied_record_count: 0,
      },
    ],
    "BATCH-FC-001"
  );

  assert.equal(detail.tone, "blocked");
  assert.equal(detail.timeBucketLabel, "未发现 0.5h 预测明细");
  assert.equal(detail.forecastScopeLabel, "暂无技能组/等级/时段明细");
  assert.equal(detail.alignmentResultLabel, "未发现技能组/等级/时段对齐结果");
  assert.equal(detail.blockerSummary, "已应用但未发现预测明细");
  assert.equal(detail.changeBoundaryLabel, "暂无变更记录");
});

test("demand forecast production detail shows a blocked state for unknown batch", () => {
  const detail = summarizeDemandForecastProductionDetail([baseBatch], "BATCH-MISSING");

  assert.equal(detail.tone, "blocked");
  assert.equal(detail.title, "预测版本未定位");
  assert.equal(detail.batchId, "BATCH-MISSING");
  assert.equal(detail.versionLabel, "未找到对应需求预测批次");
  assert.equal(detail.blockerSummary, "请返回预测版本列表选择已应用版本");
  assert.deepEqual(detail.comparisonEntry, {
    tone: "blocked",
    title: "无法进入比对",
    detail: "未定位预测业务版本或业务日，先回到需求计划选择已应用批次。",
    actionLabel: "查看业务版本列表",
    href: "/data-quality/versions?domain=demand_forecast",
    blockerLabel: "阻塞：请返回预测版本列表选择已应用版本",
  });
  assert.equal(detail.changeBoundaryLabel, "暂无变更记录");
  assert.deepEqual(detail.changeRows, []);
});
