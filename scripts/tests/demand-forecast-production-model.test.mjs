import assert from "node:assert/strict";
import test from "node:test";

import {
  summarizeDemandForecastProductionDetail,
  summarizeDemandForecastProductionWorkbench,
} from "../../components/demand-forecast-production-model.ts";

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

test("demand forecast production workbench shows an empty state without forecast batches", () => {
  const summary = summarizeDemandForecastProductionWorkbench([]);

  assert.equal(summary.tone, "empty");
  assert.equal(summary.totalVersions, 0);
  assert.equal(summary.appliedVersions, 0);
  assert.equal(summary.alignedVersions, 0);
  assert.equal(summary.blockedVersions, 0);
  assert.equal(summary.rows.length, 0);
  assert.equal(summary.title, "等待需求预测来源批次");
});

test("demand forecast production workbench summarizes applied forecast versions", () => {
  const summary = summarizeDemandForecastProductionWorkbench([
    baseBatch,
    {
      ...baseBatch,
      batch_id: "BATCH-SCH-001",
      file_type: "personnel_schedule",
      import_version_id: "BATCH-SCH-001::v1",
    },
  ]);

  assert.equal(summary.tone, "ready");
  assert.equal(summary.totalVersions, 1);
  assert.equal(summary.appliedVersions, 1);
  assert.equal(summary.alignedVersions, 1);
  assert.equal(summary.blockedVersions, 0);
  assert.equal(summary.rows[0].versionLabel, "BATCH-FC-001::v1");
  assert.equal(summary.rows[0].sourceBatchHref, "/data-quality/import-batches/BATCH-FC-001");
  assert.equal(summary.rows[0].detailHref, "/demand-plans/production/BATCH-FC-001");
  assert.equal(summary.rows[0].businessDateLabel, "2026-06-08 至 2026-06-14");
  assert.equal(summary.rows[0].applicationLabel, "已应用");
  assert.equal(summary.rows[0].alignmentLabel, "技能组/等级/时段已对齐");
  assert.equal(summary.rows[0].appliedRecordCountLabel, "336");
  assert.equal(summary.rows[0].blockerSummary, "无阻塞；当前只读展示需求预测生产口径");
  assert.equal(summary.rows[0].nextActionLabel, "查看版本详情");
});

test("demand forecast production workbench blocks unapplied forecast versions", () => {
  const summary = summarizeDemandForecastProductionWorkbench([
    {
      ...baseBatch,
      batch_id: "BATCH-FC-002",
      application_status: "not_applied",
      import_version_id: "BATCH-FC-002::v1",
      applied_record_count: 0,
    },
  ]);

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.appliedVersions, 0);
  assert.equal(summary.alignedVersions, 0);
  assert.equal(summary.blockedVersions, 1);
  assert.equal(summary.rows[0].applicationLabel, "待应用");
  assert.equal(summary.rows[0].alignmentLabel, "等待应用后对齐");
  assert.equal(summary.rows[0].blockerSummary, "预测批次尚未应用到业务数据");
});

test("demand forecast production workbench blocks missing import version", () => {
  const summary = summarizeDemandForecastProductionWorkbench([
    {
      ...baseBatch,
      import_version_id: null,
      application_status: "applied",
      applied_record_count: 0,
    },
  ]);

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.rows[0].versionLabel, "暂无预测业务版本");
  assert.equal(summary.rows[0].alignmentLabel, "缺少版本无法对齐");
  assert.equal(summary.rows[0].blockerSummary, "缺少需求预测业务版本");
});

test("demand forecast production detail resolves a forecast version by source batch", () => {
  const detail = summarizeDemandForecastProductionDetail([baseBatch], "BATCH-FC-001");

  assert.equal(detail.tone, "ready");
  assert.equal(detail.title, "预测版本详情已定位");
  assert.equal(detail.batchId, "BATCH-FC-001");
  assert.equal(detail.versionLabel, "BATCH-FC-001::v1");
  assert.equal(detail.sourceBatchHref, "/data-quality/import-batches/BATCH-FC-001");
  assert.equal(detail.workbenchHref, "/demand-plans/production");
  assert.equal(detail.businessDateLabel, "2026-06-08 至 2026-06-14");
  assert.equal(detail.sourceRowLabel, "24 / 24 条成功导入");
  assert.equal(detail.skillAlignmentLabel, "来自 24 条成功导入行，技能组和等级明细待版本 API 暴露");
  assert.equal(detail.timeBucketLabel, "0.5h 时段口径已确认");
  assert.equal(detail.forecastScopeLabel, "当前列表 API 未暴露预测明细，不伪造技能组/等级/时段行");
  assert.equal(detail.alignmentResultLabel, "已形成 336 条技能组/等级/时段预测明细");
  assert.equal(detail.blockerSummary, "无阻塞；当前只读展示需求预测生产口径");
  assert.equal(detail.changeBoundaryLabel, "变更追踪边界待 IM104");
});

test("demand forecast production detail exposes a non-writing change tracking shell", () => {
  const detail = summarizeDemandForecastProductionDetail([baseBatch], "BATCH-FC-001");

  assert.equal(detail.changeTracking.title, "变更追踪边界安全壳");
  assert.equal(detail.changeTracking.sourceVersionLabel, "来源版本 BATCH-FC-001::v1 已定位");
  assert.equal(detail.changeTracking.alignmentCheckLabel, "技能组/等级/0.5h 时段已具备只读对齐口径");
  assert.equal(detail.changeTracking.downstreamImpactLabel, "下游影响需先回看排班、比对和复核结果，本页不写预测变更");
  assert.equal(detail.changeTracking.failureBoundaryLabel, "写入动作进入前需要单独确认后端、schema、migration 和生产状态边界");
  assert.deepEqual(
    detail.changeTracking.actionShells.map((action) => ({
      label: action.label,
      disabledLabel: action.disabledLabel,
      isDisabled: action.isDisabled,
    })),
    [
      {
        label: "记录预测变更",
        disabledLabel: "暂不写入",
        isDisabled: true,
      },
      {
        label: "校验下游影响",
        disabledLabel: "暂不提交",
        isDisabled: true,
      },
      {
        label: "更新生产口径",
        disabledLabel: "暂不变更",
        isDisabled: true,
      },
    ]
  );
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
  assert.equal(detail.timeBucketLabel, "暂未发现 0.5h 预测明细");
  assert.equal(detail.forecastScopeLabel, "当前列表 API 未暴露预测明细，不伪造技能组/等级/时段行");
  assert.equal(detail.alignmentResultLabel, "暂未发现技能组/等级/时段对齐结果");
  assert.equal(detail.blockerSummary, "已应用但暂未发现预测明细");
  assert.equal(detail.changeTracking.sourceVersionLabel, "来源版本 BATCH-FC-001::v1 已定位");
  assert.equal(detail.changeTracking.alignmentCheckLabel, "阻塞：暂未发现技能组/等级/0.5h 时段预测明细");
  assert.equal(detail.changeTracking.downstreamImpactLabel, "下游影响校验阻塞：预测明细未形成，不能进入变更追踪");
});

test("demand forecast production detail shows a blocked state for unknown batch", () => {
  const detail = summarizeDemandForecastProductionDetail([baseBatch], "BATCH-MISSING");

  assert.equal(detail.tone, "blocked");
  assert.equal(detail.title, "预测版本未定位");
  assert.equal(detail.batchId, "BATCH-MISSING");
  assert.equal(detail.versionLabel, "未找到对应需求预测批次");
  assert.equal(detail.blockerSummary, "请返回预测生产工作台选择来源批次");
  assert.equal(detail.changeTracking.sourceVersionLabel, "来源版本未定位");
  assert.equal(detail.changeTracking.alignmentCheckLabel, "阻塞：未定位来源批次，无法校验技能组/等级/0.5h 时段");
  assert.equal(detail.changeTracking.downstreamImpactLabel, "下游影响校验阻塞：未定位预测版本，不能进入变更追踪");
});
