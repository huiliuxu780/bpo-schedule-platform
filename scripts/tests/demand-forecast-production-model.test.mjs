import assert from "node:assert/strict";
import test from "node:test";

import {
  summarizeDemandForecastImportDialog,
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
  assert.equal(summary.rows[0].blockerSummary, "无阻塞");
  assert.equal(summary.rows[0].nextActionLabel, "查看预测版本");
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

test("demand forecast import dialog summary keeps upload flow in forecast page context", () => {
  const summary = summarizeDemandForecastImportDialog({
    batches: [
      {
        ...baseBatch,
        batch_id: "BATCH-FC-IMPORT-001",
        uploaded_at: "2026-06-12T09:00:00+08:00",
        total_rows: 10,
        success_rows: 9,
        failed_rows: 1,
        application_status: "not_applied",
        import_version_id: "BATCH-FC-IMPORT-001::v1",
        applied_record_count: 0,
      },
    ],
    templates: [
      {
        template_id: "TPL-FC",
        template_name: "需求预测字段映射",
        file_type: "demand_forecast",
        field_mapping: {
          forecast_date: "forecast_date",
          interval_start: "interval_start",
          skill_id: "skill_id",
        },
        is_active: true,
        created_by: "planner",
        created_at: "2026-06-12T09:00:00+08:00",
        updated_at: "2026-06-12T09:00:00+08:00",
      },
    ],
    uploadStatus: "success",
    uploadBatchId: "BATCH-FC-IMPORT-001",
  });

  assert.equal(summary.openHref, "/demand-plans/production?import_dialog=1");
  assert.equal(summary.closeHref, "/demand-plans/production");
  assert.equal(summary.resultRedirectTo, "/demand-plans/production?import_dialog=1");
  assert.equal(summary.fileType, "demand_forecast");
  assert.deepEqual(
    summary.steps.map((step) => step.title),
    ["上传文件", "字段映射", "导入结果"],
  );
  assert.equal(summary.activeTemplates.length, 1);
  assert.equal(summary.result?.batchHref, "/data-quality/import-batches/BATCH-FC-IMPORT-001");
  assert.equal(summary.result?.rowSummary, "成功 9 行 / 失败 1 行");
});

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
