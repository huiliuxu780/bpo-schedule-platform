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

const apiDetail = {
  batch: {
    batch_id: "BATCH-FC-001",
    file_name: "forecast.csv",
    uploaded_at: "2026-06-04T09:00:00+08:00",
    business_date_from: "2026-06-08",
    business_date_to: "2026-06-14",
    total_rows: 24,
    success_rows: 24,
  },
  version: {
    forecast_version_id: "FC-PROD-001",
    import_version_id: "BATCH-FC-001::v1",
    business_date_from: "2026-06-08",
    business_date_to: "2026-06-14",
    total_intervals: 2,
    total_required_agents: 26,
  },
  intervals: [
    {
      forecast_interval_id: "FC-INT-001",
      forecast_version_id: "FC-PROD-001",
      forecast_date: "2026-06-08",
      interval_start: "09:00",
      interval_end: "09:30",
      workplace_id: "SH-01",
      project_id: "BOSCH-CS",
      skill_id: "L1-CN",
      demand_level: "L1",
      required_agents: 12,
    },
    {
      forecast_interval_id: "FC-INT-002",
      forecast_version_id: "FC-PROD-001",
      forecast_date: "2026-06-08",
      interval_start: "09:30",
      interval_end: "10:00",
      workplace_id: "SH-01",
      project_id: "BOSCH-CS",
      skill_id: "L1-CN",
      demand_level: "L1",
      required_agents: 14,
    },
  ],
  changes: [
    {
      change_id: 1,
      forecast_version_id: "FC-PROD-001",
      compared_from_version_id: "FC-PREV-001",
      change_reason: "客户更新峰值需求",
    },
  ],
};

test("demand forecast production detail resolves a forecast version by source batch", () => {
  const detail = summarizeDemandForecastProductionDetail([baseBatch], "BATCH-FC-001");

  assert.equal(detail.tone, "ready");
  assert.equal(detail.title, "预测版本详情已定位");
  assert.deepEqual(detail.workspaceTabs, [
    { key: "overview", label: "总览" },
    { key: "source", label: "来源与对齐" },
    { key: "rows", label: "预测明细" },
    { key: "comparison", label: "比对" },
  ]);
  assert.equal(detail.batchId, "BATCH-FC-001");
  assert.equal(detail.versionLabel, "BATCH-FC-001::v1");
  assert.equal(detail.sourceBatchHref, "/data-quality/import-batches/BATCH-FC-001");
  assert.equal(detail.workbenchHref, "/demand-plans/production");
  assert.equal(detail.businessDateLabel, "2026-06-08 至 2026-06-14");
  assert.equal(detail.sourceRowLabel, "24 / 24 条成功导入");
  assert.equal(detail.skillAlignmentLabel, "来自 24 条成功导入行，等待版本明细返回技能组和等级。");
  assert.equal(detail.timeBucketLabel, "0.5h 时段口径已确认");
  assert.equal(detail.forecastScopeLabel, "暂无技能组/等级/时段明细");
  assert.equal(detail.alignmentResultLabel, "已形成 336 条技能组/等级/时段预测明细");
  assert.equal(detail.blockerSummary, "无阻塞");
  assert.equal(detail.changeBoundaryLabel, "暂无变更记录");
});

test("demand forecast production detail uses api intervals and change records", () => {
  const detail = summarizeDemandForecastProductionDetail(
    [baseBatch],
    "BATCH-FC-001",
    apiDetail
  );

  assert.equal(detail.versionLabel, "FC-PROD-001");
  assert.equal(detail.appliedRecordCountLabel, "2");
  assert.equal(detail.sourceRowLabel, "2 条预测区间来自版本明细");
  assert.equal(detail.skillAlignmentLabel, "1 个技能组已定位：L1-CN；1 个需求等级：L1");
  assert.equal(detail.timeBucketLabel, "已读取 2 条 0.5h 预测区间");
  assert.equal(detail.forecastScopeLabel, "版本明细已返回技能组/等级/0.5h 时段明细");
  assert.equal(detail.alignmentResultLabel, "预测合计需求 26 人次");
  assert.equal(detail.changeBoundaryLabel, "已读取 1 条版本变更记录");
  assert.deepEqual(detail.comparisonEntry, {
    tone: "ready",
    title: "进入预测 vs 排班比对入口",
    detail: "已定位预测版本 FC-PROD-001，可到业务版本列表按同业务日寻找排班版本并发起比对。",
    actionLabel: "去业务版本列表",
    href: "/data-quality/versions?domain=demand_forecast&status=applied&businessDate=2026-06-08",
    blockerLabel: "无阻塞；从业务版本列表继续完成成对版本确认",
  });
  assert.deepEqual(detail.intervalRows, [
    {
      id: "FC-INT-001",
      dateLabel: "2026-06-08",
      timeLabel: "09:00-09:30",
      dimensionLabel: "职场 SH-01 / 项目 BOSCH-CS / 技能 L1-CN",
      demandLevelLabel: "L1",
      requiredAgentsLabel: "12",
      alignmentStatusLabel: "对齐完整",
      blockerLabel: "无阻塞；预测区间维度、等级、时段和需求值完整",
    },
    {
      id: "FC-INT-002",
      dateLabel: "2026-06-08",
      timeLabel: "09:30-10:00",
      dimensionLabel: "职场 SH-01 / 项目 BOSCH-CS / 技能 L1-CN",
      demandLevelLabel: "L1",
      requiredAgentsLabel: "14",
      alignmentStatusLabel: "对齐完整",
      blockerLabel: "无阻塞；预测区间维度、等级、时段和需求值完整",
    },
  ]);
  assert.deepEqual(detail.changeRows, [
    {
      id: "1",
      comparedFromVersionLabel: "FC-PREV-001",
      changeReasonLabel: "客户更新峰值需求",
    },
  ]);
});

test("demand forecast production detail explains blocked interval rows", () => {
  const detail = summarizeDemandForecastProductionDetail(
    [baseBatch],
    "BATCH-FC-001",
    {
      ...apiDetail,
      intervals: [
        {
          ...apiDetail.intervals[0],
          forecast_interval_id: "FC-INT-BLOCKED",
          workplace_id: "",
          demand_level: "",
          required_agents: 0,
        },
      ],
    }
  );

  assert.deepEqual(detail.intervalRows, [
    {
      id: "FC-INT-BLOCKED",
      dateLabel: "2026-06-08",
      timeLabel: "09:00-09:30",
      dimensionLabel: "未填写职场 / 项目 BOSCH-CS / 技能 L1-CN",
      demandLevelLabel: "未填写等级",
      requiredAgentsLabel: "0",
      alignmentStatusLabel: "对齐阻塞",
      blockerLabel: "阻塞：缺少职场、需求等级；需求值需大于 0",
    },
  ]);
});
