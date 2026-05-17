import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildImportedRecordSourceRows,
  clampDashboardPageIndex,
  dashboardAnomalyMatchesQuery,
  filterDashboardAnomalies,
  filterSchedulePlanRows,
  filterScheduleRiskRows,
  filterSyncStatusRows,
  filterUnavailabilityRows,
  getDashboardPaginationRange,
  summarizeHeatmapRows,
  summarizeDashboardImportKpiPreview,
  summarizeDashboardImportRecords,
  summarizeAnomalyAlertRecords,
  summarizeAgentStatusTraceRecords,
  summarizeCornStatusLogRecords,
  summarizeAdherenceMonitoringRecords,
  summarizeDataQualityRecords,
  summarizeFulfillmentExceptionRecords,
  summarizeExceptionReviewRecords,
  summarizeFieldMappingRecords,
  summarizeFulfillmentImportRecords,
  summarizeOrganizationPeopleRecords,
  summarizeRuleConfigurationRecords,
  summarizeMonthlySettlementRecords,
  summarizeOperationAuditRecords,
  summarizeReportCenterRecords,
  summarizeInterfaceIntegrationRecords,
  summarizeSchedulePlanImportRecords,
  summarizeSchedulePlanRows,
  summarizeScheduleRiskRows,
  summarizeSmartSchedulingRecords,
  summarizeSupplierReviewRecords,
  summarizeSyncStatusRows,
  summarizeTodayFulfillmentRecords,
  summarizeUnavailabilityRows,
  summarizeVendorManagementRecords,
} from "../../components/data-table-model.ts";
import {
  filterShiftDetailRowsByScope,
  filterScheduleRiskRowsByScope,
  scheduleRiskLevelLabel,
  summarizeDraftReviewReadiness,
} from "../../lib/schedule-plans.ts";
import { filterUnavailabilityRowsByScope } from "../../lib/unavailability.ts";
import { buildDemoImportBatchRows } from "../../lib/demo-imports.ts";
import {
  buildDemandPlansHref,
  buildNewSchedulePlanHref,
  buildPlanEditHref,
  buildReviewBackLink,
  buildPlanDetailHref,
  buildSchedulePlansHref,
  buildScheduleRisksHref,
  buildScheduleRiskDetailHref,
  buildUnavailabilityDetailHref,
} from "../../lib/review-navigation.ts";

const anomaly = {
  id: "ANM-202605-001",
  type: "实际有效在线不足",
  project: "Bosch CC",
  team: "华东一组",
  shiftTime: "05-11 12:00-14:00",
  headcount: 6,
  impactedHours: "18.0h",
  severity: "高",
  status: "待复核",
};

test("dashboard anomaly search matches all visible table fields", () => {
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "bosch"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "华东"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "待复核"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "12:00"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "missing"), false);
});

test("dashboard page index is clamped after filter or page-size changes", () => {
  assert.equal(clampDashboardPageIndex({ pageIndex: 3, pageSize: 5, rowCount: 6 }), 1);
  assert.equal(clampDashboardPageIndex({ pageIndex: -2, pageSize: 5, rowCount: 6 }), 0);
  assert.equal(clampDashboardPageIndex({ pageIndex: 4, pageSize: 10, rowCount: 0 }), 0);
});

test("dashboard anomaly filters combine query, severity, and status", () => {
  const rows = [
    anomaly,
    { ...anomaly, id: "ANM-2", severity: "中", status: "已确认", team: "华南二组" },
    { ...anomaly, id: "ANM-3", severity: "低", status: "已忽略", team: "西区支援组" },
  ];

  assert.deepEqual(
    filterDashboardAnomalies(rows, { query: "华", severity: "中", status: "已确认" }).map((row) => row.id),
    ["ANM-2"],
  );
  assert.deepEqual(
    filterDashboardAnomalies(rows, { query: "", severity: "all", status: "待复核" }).map((row) => row.id),
    ["ANM-202605-001"],
  );
});

test("dashboard pagination range reports visible row bounds", () => {
  assert.deepEqual(getDashboardPaginationRange({ pageIndex: 0, pageSize: 5, rowCount: 12 }), {
    from: 1,
    to: 5,
  });
  assert.deepEqual(getDashboardPaginationRange({ pageIndex: 2, pageSize: 5, rowCount: 12 }), {
    from: 11,
    to: 12,
  });
  assert.deepEqual(getDashboardPaginationRange({ pageIndex: 0, pageSize: 5, rowCount: 0 }), {
    from: 0,
    to: 0,
  });
});

test("sync status helpers filter rows and summarize state counts", () => {
  const rows = [
    { source: "CORN 登录数据", batch: "A", status: "已同步", syncedAt: "今日 08:36" },
    { source: "CORN 状态日志", batch: "B", status: "处理中", syncedAt: "今日 09:04" },
    { source: "预测需求数据", batch: "C", status: "需关注", syncedAt: "昨日 18:42" },
  ];

  assert.deepEqual(filterSyncStatusRows(rows, "需关注").map((row) => row.source), ["预测需求数据"]);
  assert.deepEqual(summarizeSyncStatusRows(rows), {
    total: 3,
    synced: 1,
    processing: 1,
    attention: 1,
  });
});

test("dashboard import KPI preview summarizes local demo batches", () => {
  const summary = summarizeDashboardImportKpiPreview([
    {
      source_name: "坐席主数据",
      batch_id: "staff_master-20260516093000-001",
      status: "imported",
      success_rows: 2,
      failed_rows: 0,
      imported_at: "2026-05-16T09:30:00+08:00",
    },
    {
      source_name: "登录数据",
      batch_id: "login_log-20260516094000-001",
      status: "needs_attention",
      success_rows: 1,
      failed_rows: 1,
      imported_at: "2026-05-16T09:40:00+08:00",
    },
  ]);

  assert.deepEqual(summary, {
    importedSources: 2,
    importedRows: 3,
    attentionBatches: 1,
    latestBatch: "login_log-20260516094000-001",
    latestSource: "登录数据",
    statusLabel: "需关注",
  });
});

test("dashboard import records preview summarizes processed rows", () => {
  const summary = summarizeDashboardImportRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260516093000-001",
      updated_at: "2026-05-16T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", name: "张敏" }],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 1,
      latest_batch_id: "login_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
    {
      kind: "schedule_plan",
      source_name: "排班数据",
      total_rows: 4,
      latest_batch_id: "schedule_plan-20260517093000-001",
      updated_at: "2026-05-17T09:30:00+08:00",
      sample_rows: [{ plan_id: "SP-20260511-SH", site_name: "上海职场" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedSources: 3,
    importedRows: 7,
    latestBatch: "schedule_plan-20260517093000-001",
    latestSource: "排班数据",
    staffRows: 2,
    statusRows: 0,
    loginRows: 1,
    scheduleRows: 4,
    statusLabel: "已处理",
  });
});

test("imported record source rows order sources and expose table fields", () => {
  const rows = buildImportedRecordSourceRows([
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 2,
      latest_batch_id: "login_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [
        { staff_id: "A001", actual_login: "09:08" },
        { staff_id: "A002", actual_login: "09:00" },
      ],
    },
    {
      kind: "schedule_plan",
      source_name: "排班数据",
      total_rows: 4,
      latest_batch_id: "schedule_plan-20260517093000-001",
      updated_at: "2026-05-17T09:30:00+08:00",
      sample_rows: [{ plan_id: "SP-20260511-SH", site_name: "上海职场" }],
    },
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 3,
      latest_batch_id: "staff_master-20260516093000-001",
      updated_at: "2026-05-16T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", name: "张敏" }],
    },
  ]);

  assert.deepEqual(rows, [
    {
      kind: "staff_master",
      label: "坐席主数据",
      totalRows: 3,
      sampleRows: 1,
      latestBatch: "staff_master-20260516093000-001",
    },
    {
      kind: "login_log",
      label: "登录数据",
      totalRows: 2,
      sampleRows: 2,
      latestBatch: "login_log-20260516094000-001",
    },
    {
      kind: "schedule_plan",
      label: "排班数据",
      totalRows: 4,
      sampleRows: 1,
      latestBatch: "schedule_plan-20260517093000-001",
    },
  ]);

  assert.deepEqual(buildImportedRecordSourceRows([]), []);
});

test("demo import batch rows sort newest first and expose table fields", () => {
  const rows = buildDemoImportBatchRows([
    {
      batch_id: "staff_master-20260516093000-001",
      kind: "staff_master",
      source_name: "坐席主数据",
      status: "imported",
      success_rows: 2,
      failed_rows: 0,
      imported_at: "2026-05-16T09:30:00+08:00",
    },
    {
      batch_id: "login_log-20260516094000-001",
      kind: "login_log",
      source_name: "登录数据",
      status: "needs_attention",
      success_rows: 1,
      failed_rows: 1,
      imported_at: "2026-05-16T09:40:00+08:00",
    },
  ]);

  assert.deepEqual(rows, [
    {
      sourceName: "登录数据",
      batchId: "login_log-20260516094000-001",
      statusLabel: "需关注",
      successRows: 1,
      failedRows: 1,
      importedAt: "2026-05-16T09:40:00+08:00",
    },
    {
      sourceName: "坐席主数据",
      batchId: "staff_master-20260516093000-001",
      statusLabel: "已同步",
      successRows: 2,
      failedRows: 0,
      importedAt: "2026-05-16T09:30:00+08:00",
    },
  ]);

  assert.deepEqual(buildDemoImportBatchRows([]), []);
});

test("schedule plan import records preview summarizes local schedule rows", () => {
  const summary = summarizeSchedulePlanImportRecords([
    {
      kind: "schedule_plan",
      source_name: "排班数据",
      total_rows: 3,
      latest_batch_id: "schedule_plan-20260517093000-001",
      updated_at: "2026-05-17T09:30:00+08:00",
      sample_rows: [
        {
          plan_id: "SP-20260511-SH",
          plan_date: "2026-05-11",
          project_name: "博西客服",
          site_name: "上海职场",
          interval_start: "09:00",
          interval_end: "09:30",
        },
        {
          plan_id: "SP-20260511-SH",
          plan_date: "2026-05-11",
          project_name: "博西客服",
          site_name: "上海职场",
          interval_start: "09:30",
          interval_end: "10:00",
        },
      ],
    },
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260517092000-001",
      updated_at: "2026-05-17T09:20:00+08:00",
      sample_rows: [{ staff_id: "A001", name: "张敏" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 3,
    planCount: 1,
    sampleRows: 2,
    latestBatch: "schedule_plan-20260517093000-001",
    latestSource: "排班数据",
    statusLabel: "本机排班预览",
  });
});

test("monthly settlement records summarize local read-only review signals", () => {
  const summary = summarizeMonthlySettlementRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260517092000-001",
      updated_at: "2026-05-17T09:20:00+08:00",
      sample_rows: [{ staff_id: "A001", name: "张敏" }],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 3,
      latest_batch_id: "status_log-20260517093000-001",
      updated_at: "2026-05-17T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", status: "在线" }],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 2,
      latest_batch_id: "login_log-20260517094000-001",
      updated_at: "2026-05-17T09:40:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
    {
      kind: "schedule_plan",
      source_name: "排班数据",
      total_rows: 4,
      latest_batch_id: "schedule_plan-20260517095000-001",
      updated_at: "2026-05-17T09:50:00+08:00",
      sample_rows: [{ plan_id: "SP-20260511-SH", interval_start: "09:00" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 11,
    sourceCount: 4,
    staffRows: 2,
    fulfillmentRows: 5,
    scheduleRows: 4,
    reviewSignals: 3,
    latestBatch: "schedule_plan-20260517095000-001",
    latestSource: "排班数据",
    statusLabel: "本机复盘预览",
  });
});

test("report center records summarize imported module outcomes", () => {
  const summary = summarizeReportCenterRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260517092000-001",
      updated_at: "2026-05-17T09:20:00+08:00",
      sample_rows: [{ staff_id: "A001", vendor: "供应商A" }],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 3,
      latest_batch_id: "status_log-20260517093000-001",
      updated_at: "2026-05-17T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", status: "在线" }],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 2,
      latest_batch_id: "login_log-20260517094000-001",
      updated_at: "2026-05-17T09:40:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
    {
      kind: "schedule_plan",
      source_name: "排班数据",
      total_rows: 4,
      latest_batch_id: "schedule_plan-20260517095000-001",
      updated_at: "2026-05-17T09:50:00+08:00",
      sample_rows: [{ plan_id: "SP-20260511-SH", interval_start: "09:00" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 11,
    sourceCount: 4,
    reportSections: 4,
    staffRows: 2,
    fulfillmentRows: 5,
    scheduleRows: 4,
    latestBatch: "schedule_plan-20260517095000-001",
    latestSource: "排班数据",
    statusLabel: "本机报表预览",
  });
});

test("supplier review records summarize vendor and operations coverage", () => {
  const summary = summarizeSupplierReviewRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 4,
      latest_batch_id: "staff_master-20260517092000-001",
      updated_at: "2026-05-17T09:20:00+08:00",
      sample_rows: [
        { staff_id: "A001", vendor: "供应商A", site: "上海职场" },
        { staff_id: "A002", vendor: "供应商B", site: "苏州职场" },
        { staff_id: "A003", vendor: "供应商A", site: "上海职场" },
      ],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 3,
      latest_batch_id: "status_log-20260517093000-001",
      updated_at: "2026-05-17T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", status: "在线" }],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 2,
      latest_batch_id: "login_log-20260517094000-001",
      updated_at: "2026-05-17T09:40:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
    {
      kind: "schedule_plan",
      source_name: "排班数据",
      total_rows: 4,
      latest_batch_id: "schedule_plan-20260517095000-001",
      updated_at: "2026-05-17T09:50:00+08:00",
      sample_rows: [{ plan_id: "SP-20260511-SH", interval_start: "09:00" }],
    },
  ]);

  assert.deepEqual(summary, {
    staffRows: 4,
    vendorCount: 2,
    largestVendor: "供应商A",
    fulfillmentRows: 5,
    scheduleRows: 4,
    reviewSignals: 3,
    latestBatch: "schedule_plan-20260517095000-001",
    latestSource: "排班数据",
    statusLabel: "本机供应商复盘",
  });
});

test("smart scheduling records summarize local suggestion readiness", () => {
  const summary = summarizeSmartSchedulingRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260517092000-001",
      updated_at: "2026-05-17T09:20:00+08:00",
      sample_rows: [{ staff_id: "A001", name: "张敏", vendor: "供应商A" }],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 3,
      latest_batch_id: "status_log-20260517093000-001",
      updated_at: "2026-05-17T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", status: "在线" }],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 2,
      latest_batch_id: "login_log-20260517094000-001",
      updated_at: "2026-05-17T09:40:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
    {
      kind: "schedule_plan",
      source_name: "排班数据",
      total_rows: 4,
      latest_batch_id: "schedule_plan-20260517095000-001",
      updated_at: "2026-05-17T09:50:00+08:00",
      sample_rows: [
        { plan_id: "SP-20260511-SH", interval_start: "09:00" },
        { plan_id: "SP-20260511-SH", interval_start: "09:30" },
      ],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 11,
    sourceCount: 4,
    staffRows: 2,
    fulfillmentRows: 5,
    scheduleRows: 4,
    planCount: 1,
    recommendationSignals: 3,
    latestBatch: "schedule_plan-20260517095000-001",
    latestSource: "排班数据",
    statusLabel: "本机建议预览",
  });
});

test("interface integration records summarize local readiness coverage", () => {
  const summary = summarizeInterfaceIntegrationRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260517092000-001",
      updated_at: "2026-05-17T09:20:00+08:00",
      sample_rows: [
        {
          staff_id: "A001",
          name: "张敏",
          team: "一组",
          site: "上海职场",
          vendor: "供应商A",
          role: "坐席",
          status: "active",
        },
      ],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 3,
      latest_batch_id: "status_log-20260517093000-001",
      updated_at: "2026-05-17T09:30:00+08:00",
      sample_rows: [
        {
          staff_id: "A001",
          date: "2026-05-17",
          start_time: "09:00",
          end_time: "09:30",
          status: "在线",
        },
        {
          staff_id: "A002",
          date: "2026-05-17",
          start_time: "09:30",
          end_time: "10:00",
          status: "培训",
        },
      ],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 2,
      latest_batch_id: "login_log-20260517094000-001",
      updated_at: "2026-05-17T09:40:00+08:00",
      sample_rows: [
        {
          staff_id: "A001",
          date: "2026-05-17",
          planned_login: "09:00",
          actual_login: "09:08",
          actual_logout: "18:00",
          online_minutes: "532",
        },
      ],
    },
    {
      kind: "schedule_plan",
      source_name: "排班数据",
      total_rows: 4,
      latest_batch_id: "schedule_plan-20260517095000-001",
      updated_at: "2026-05-17T09:50:00+08:00",
      sample_rows: [{ plan_id: "SP-20260511-SH", interval_start: "09:00" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 11,
    sourceCount: 4,
    mappedFields: 18,
    missingFields: 0,
    statusRows: 3,
    cornStatusTypes: 2,
    readinessSignals: 4,
    latestBatch: "schedule_plan-20260517095000-001",
    latestSource: "排班数据",
    statusLabel: "本机接入预览",
  });
});

test("operation audit records summarize local evidence coverage", () => {
  const summary = summarizeOperationAuditRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260517092000-001",
      updated_at: "2026-05-17T09:20:00+08:00",
      sample_rows: [{ staff_id: "A001", name: "张敏", vendor: "供应商A" }],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 3,
      latest_batch_id: "status_log-20260517093000-001",
      updated_at: "2026-05-17T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", status: "在线" }],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 2,
      latest_batch_id: "login_log-20260517094000-001",
      updated_at: "2026-05-17T09:40:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
    {
      kind: "schedule_plan",
      source_name: "排班数据",
      total_rows: 4,
      latest_batch_id: "schedule_plan-20260517095000-001",
      updated_at: "2026-05-17T09:50:00+08:00",
      sample_rows: [{ plan_id: "SP-20260511-SH", interval_start: "09:00" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 11,
    sourceCount: 4,
    batchCount: 4,
    staffRows: 2,
    workflowRows: 9,
    auditSignals: 4,
    latestBatch: "schedule_plan-20260517095000-001",
    latestSource: "排班数据",
    statusLabel: "本机审计预览",
  });
});

test("fulfillment import records summarize status and login coverage", () => {
  const summary = summarizeFulfillmentImportRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260516093000-001",
      updated_at: "2026-05-16T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", name: "张敏" }],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 3,
      latest_batch_id: "status_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [{ staff_id: "A001", status: "在线" }],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 1,
      latest_batch_id: "login_log-20260516095000-001",
      updated_at: "2026-05-16T09:50:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 4,
    statusRows: 3,
    loginRows: 1,
    latestBatch: "login_log-20260516095000-001",
    latestSource: "登录数据",
    statusLabel: "可核验",
  });
});

test("today fulfillment records summarize local status and login readiness", () => {
  const summary = summarizeTodayFulfillmentRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260516093000-001",
      updated_at: "2026-05-16T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", name: "张敏" }],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 5,
      latest_batch_id: "status_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [
        { staff_id: "A001", status: "在线" },
        { staff_id: "A002", status: "培训" },
      ],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 3,
      latest_batch_id: "login_log-20260516095000-001",
      updated_at: "2026-05-16T09:50:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 10,
    staffRows: 2,
    statusRows: 5,
    loginRows: 3,
    readySignals: 3,
    latestBatch: "login_log-20260516095000-001",
    latestSource: "登录数据",
    statusLabel: "本机履约预览",
  });
});

test("anomaly alert records combine seeded anomalies with imported coverage", () => {
  const summary = summarizeAnomalyAlertRecords(
    [
      anomaly,
      { ...anomaly, id: "ANM-2", severity: "中", status: "已确认" },
      { ...anomaly, id: "ANM-3", severity: "低", status: "已忽略" },
    ],
    [
      {
        kind: "status_log",
        source_name: "坐席状态数据",
        total_rows: 5,
        latest_batch_id: "status_log-20260516094000-001",
        updated_at: "2026-05-16T09:40:00+08:00",
        sample_rows: [{ staff_id: "A001", status: "在线" }],
      },
      {
        kind: "login_log",
        source_name: "登录数据",
        total_rows: 3,
        latest_batch_id: "login_log-20260516095000-001",
        updated_at: "2026-05-16T09:50:00+08:00",
        sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
      },
    ],
  );

  assert.deepEqual(summary, {
    alertRows: 3,
    highSeverity: 1,
    pendingReview: 1,
    importedRows: 8,
    statusLabel: "本机预警预览",
  });
});

test("agent status trace records summarize imported status coverage", () => {
  const summary = summarizeAgentStatusTraceRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260516093000-001",
      updated_at: "2026-05-16T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", name: "张敏" }],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 3,
      latest_batch_id: "status_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [
        { staff_id: "A001", status: "在线" },
        { staff_id: "A002", status: "离线" },
        { staff_id: "A003", status: "在线" },
      ],
    },
  ]);

  assert.deepEqual(summary, {
    statusRows: 3,
    statusTypes: 2,
    latestBatch: "status_log-20260516094000-001",
    latestSource: "坐席状态数据",
    statusLabel: "已接入",
  });
});

test("corn status log records summarize local status coverage", () => {
  const summary = summarizeCornStatusLogRecords([
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 5,
      latest_batch_id: "status_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [
        { staff_id: "A001", status: "在线" },
        { staff_id: "A002", status: "离线" },
        { staff_id: "A003", status: "在线" },
      ],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 2,
      latest_batch_id: "login_log-20260516095000-001",
      updated_at: "2026-05-16T09:50:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
  ]);

  assert.deepEqual(summary, {
    statusRows: 5,
    statusTypes: 2,
    sampleRows: 3,
    latestBatch: "status_log-20260516094000-001",
    latestSource: "坐席状态数据",
    statusLabel: "本机预览",
  });
});

test("fulfillment exception records summarize imported review leads", () => {
  const summary = summarizeFulfillmentExceptionRecords([
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 3,
      latest_batch_id: "status_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [{ staff_id: "A001", status: "离线" }],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 2,
      latest_batch_id: "login_log-20260516095000-001",
      updated_at: "2026-05-16T09:50:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 5,
    statusRows: 3,
    loginRows: 2,
    reviewLeadRows: 2,
    latestBatch: "login_log-20260516095000-001",
    latestSource: "登录数据",
    statusLabel: "可复核",
  });
});

test("exception review records summarize read-only review queue", () => {
  const summary = summarizeExceptionReviewRecords([
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 4,
      latest_batch_id: "status_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [
        { staff_id: "A001", status: "离线" },
        { staff_id: "A002", status: "在线" },
      ],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 3,
      latest_batch_id: "login_log-20260516095000-001",
      updated_at: "2026-05-16T09:50:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 7,
    statusRows: 4,
    loginRows: 3,
    reviewQueueRows: 2,
    latestBatch: "login_log-20260516095000-001",
    latestSource: "登录数据",
    statusLabel: "只读待复核",
  });
});

test("adherence monitoring records summarize local status and login preview", () => {
  const summary = summarizeAdherenceMonitoringRecords([
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 4,
      latest_batch_id: "status_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [
        { staff_id: "A001", date: "2026-05-11", status: "在线" },
        { staff_id: "A002", date: "2026-05-11", status: "离线" },
      ],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 3,
      latest_batch_id: "login_log-20260516095000-001",
      updated_at: "2026-05-16T09:50:00+08:00",
      sample_rows: [{ staff_id: "A001", date: "2026-05-11", actual_login: "09:08" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedRows: 7,
    statusRows: 4,
    loginRows: 3,
    previewRows: 2,
    latestBatch: "login_log-20260516095000-001",
    latestSource: "登录数据",
    statusLabel: "本机预览",
  });
});

test("data quality records summarize local imported source coverage", () => {
  const summary = summarizeDataQualityRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260516093000-001",
      updated_at: "2026-05-16T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", name: "张敏" }],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 4,
      latest_batch_id: "status_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [
        { staff_id: "A001", status: "在线" },
        { staff_id: "A002", status: "离线" },
      ],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 3,
      latest_batch_id: "login_log-20260516095000-001",
      updated_at: "2026-05-16T09:50:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedSources: 3,
    importedRows: 9,
    staffRows: 2,
    statusRows: 4,
    loginRows: 3,
    sampleRows: 4,
    latestBatch: "login_log-20260516095000-001",
    latestSource: "登录数据",
    statusLabel: "本机预览",
  });
});

test("field mapping records summarize sample field coverage", () => {
  const summary = summarizeFieldMappingRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 2,
      latest_batch_id: "staff_master-20260516093000-001",
      updated_at: "2026-05-16T09:30:00+08:00",
      sample_rows: [
        {
          staff_id: "A001",
          name: "张敏",
          team: "华东一组",
          site: "上海职场",
          vendor: "供应商A",
          role: "客服",
          status: "在线",
        },
      ],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 4,
      latest_batch_id: "status_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [
        {
          staff_id: "A001",
          date: "2026-05-11",
          start_time: "09:00",
          end_time: "12:00",
          status: "在线",
        },
      ],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 3,
      latest_batch_id: "login_log-20260516095000-001",
      updated_at: "2026-05-16T09:50:00+08:00",
      sample_rows: [
        {
          staff_id: "A001",
          date: "2026-05-11",
          planned_login: "09:00",
          actual_login: "09:08",
          actual_logout: "17:30",
        },
      ],
    },
  ]);

  assert.deepEqual(summary, {
    importedSources: 3,
    mappedFields: 17,
    missingFields: 1,
    latestBatch: "login_log-20260516095000-001",
    latestSource: "登录数据",
    statusLabel: "缺少字段",
  });
});

test("organization people records summarize staff master coverage", () => {
  const summary = summarizeOrganizationPeopleRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 3,
      latest_batch_id: "staff_master-20260516093000-001",
      updated_at: "2026-05-16T09:30:00+08:00",
      sample_rows: [
        {
          staff_id: "A001",
          name: "张敏",
          team: "华东一组",
          site: "上海职场",
          vendor: "供应商A",
          role: "客服",
          status: "在线",
        },
        {
          staff_id: "A002",
          name: "李娜",
          team: "华东二组",
          site: "上海职场",
          vendor: "供应商B",
          role: "组长",
          status: "培训",
        },
        {
          staff_id: "A003",
          name: "王晨",
          team: "华东一组",
          site: "苏州职场",
          vendor: "供应商A",
          role: "客服",
          status: "在线",
        },
      ],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 2,
      latest_batch_id: "login_log-20260516095000-001",
      updated_at: "2026-05-16T09:50:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
  ]);

  assert.deepEqual(summary, {
    staffRows: 3,
    teamCount: 2,
    siteCount: 2,
    vendorCount: 2,
    sampleRows: 3,
    latestBatch: "staff_master-20260516093000-001",
    latestSource: "坐席主数据",
    statusLabel: "本机只读",
  });
});

test("vendor management records summarize staff vendor coverage", () => {
  const summary = summarizeVendorManagementRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 4,
      latest_batch_id: "staff_master-20260516093000-001",
      updated_at: "2026-05-16T09:30:00+08:00",
      sample_rows: [
        {
          staff_id: "A001",
          name: "张敏",
          team: "华东一组",
          site: "上海职场",
          vendor: "供应商A",
          role: "客服",
          status: "在线",
        },
        {
          staff_id: "A002",
          name: "李娜",
          team: "华东二组",
          site: "上海职场",
          vendor: "供应商B",
          role: "组长",
          status: "培训",
        },
        {
          staff_id: "A003",
          name: "王晨",
          team: "华东一组",
          site: "苏州职场",
          vendor: "供应商A",
          role: "客服",
          status: "在线",
        },
      ],
    },
  ]);

  assert.deepEqual(summary, {
    staffRows: 4,
    vendorCount: 2,
    sampleRows: 3,
    largestVendor: "供应商A",
    latestBatch: "staff_master-20260516093000-001",
    latestSource: "坐席主数据",
    statusLabel: "本机供应商预览",
  });
});

test("rule configuration records summarize local read-only rule readiness", () => {
  const summary = summarizeRuleConfigurationRecords([
    {
      kind: "staff_master",
      source_name: "坐席主数据",
      total_rows: 4,
      latest_batch_id: "staff_master-20260516093000-001",
      updated_at: "2026-05-16T09:30:00+08:00",
      sample_rows: [{ staff_id: "A001", vendor: "供应商A" }],
    },
    {
      kind: "status_log",
      source_name: "坐席状态数据",
      total_rows: 5,
      latest_batch_id: "status_log-20260516094000-001",
      updated_at: "2026-05-16T09:40:00+08:00",
      sample_rows: [{ staff_id: "A001", status: "在线" }],
    },
    {
      kind: "login_log",
      source_name: "登录数据",
      total_rows: 3,
      latest_batch_id: "login_log-20260516095000-001",
      updated_at: "2026-05-16T09:50:00+08:00",
      sample_rows: [{ staff_id: "A001", actual_login: "09:08" }],
    },
  ]);

  assert.deepEqual(summary, {
    importedSources: 3,
    importedRows: 12,
    enabledPreviewRules: 4,
    deferredRules: 5,
    latestBatch: "login_log-20260516095000-001",
    latestSource: "登录数据",
    statusLabel: "本机规则目录",
  });
});

test("heatmap summary reports total deficit, severe slots, and peak shortage", () => {
  const summary = summarizeHeatmapRows([
    { day: "周一", slots: [-1, -6, 0] },
    { day: "周二", slots: [-3, -8, 1] },
  ], ["09:00", "10:00", "11:00"]);

  assert.deepEqual(summary, {
    totalDeficit: 18,
    severeSlotCount: 2,
    normalSlotCount: 2,
    peak: {
      day: "周二",
      slot: "10:00",
      value: -8,
    },
  });
});

test("schedule plan helpers filter rows and summarize plan coverage", () => {
  const rows = [
    {
      id: "plan-a",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      version: "v1",
      status: "review_ready",
      forecast_agents: 20,
      scheduled_agents: 18,
      gap_agents: 2,
      coverage_rate: 0.9,
      updated_at: "2026-05-11T09:30:00+08:00",
    },
    {
      id: "plan-b",
      plan_date: "2026-05-12",
      project_name: "博西客服",
      site_name: "苏州职场",
      version: "v2",
      status: "published",
      forecast_agents: 10,
      scheduled_agents: 10,
      gap_agents: 0,
      coverage_rate: 1,
      updated_at: "2026-05-11T18:20:00+08:00",
    },
  ];

  assert.deepEqual(
    filterSchedulePlanRows(rows, { query: "上海", status: "review_ready", gap: "with_gap" }).map((row) => row.id),
    ["plan-a"],
  );
  assert.deepEqual(
    filterSchedulePlanRows(rows, { query: "", status: "all", gap: "covered" }).map((row) => row.id),
    ["plan-b"],
  );
  assert.deepEqual(summarizeSchedulePlanRows(rows), {
    total: 2,
    draft: 0,
    reviewReady: 1,
    published: 1,
    totalForecast: 30,
    totalScheduled: 28,
    totalGap: 2,
    coverageRate: 0.9333333333333333,
  });
});

test("draft review readiness summarizes gaps, risks, and unavailable evidence", () => {
  const summary = summarizeDraftReviewReadiness(
    {
      summary: {
        id: "plan-draft",
        plan_date: "2026-05-11",
        project_name: "博西客服",
        site_name: "苏州职场",
        version: "v1",
        status: "draft",
        forecast_agents: 29,
        scheduled_agents: 26,
        gap_agents: 3,
        coverage_rate: 0.897,
        updated_at: "2026-05-11T09:30:00+08:00",
      },
      intervals: [
        {
          interval_start: "09:00",
          interval_end: "09:30",
          forecast_agents: 14,
          scheduled_agents: 14,
          gap_agents: 0,
          coverage_rate: 1,
          note: "覆盖正常",
        },
        {
          interval_start: "10:00",
          interval_end: "10:30",
          forecast_agents: 15,
          scheduled_agents: 12,
          gap_agents: 3,
          coverage_rate: 0.8,
          note: "培训占用导致缺口",
        },
      ],
    },
    [
      {
        risk_id: "risk-a",
        plan_id: "plan-draft",
        plan_date: "2026-05-11",
        project_name: "博西客服",
        site_name: "苏州职场",
        interval_start: "10:00",
        interval_end: "10:30",
        risk_level: "high",
        gap_agents: 3,
        affected_unavailability: 1,
        reason: "缺口 3 人",
        recommendation: "优先复核不可用",
      },
    ],
    [
      {
        unavailability_id: "unavail-a",
        staff_name: "李想",
        team_name: "一线客服 B 组",
        project_name: "博西客服",
        site_name: "苏州职场",
        unavailable_date: "2026-05-11",
        start_time: "10:00",
        end_time: "10:30",
        reason: "培训占用",
        status: "active",
        affected_intervals: 1,
        note: "影响覆盖率",
      },
    ],
  );

  assert.deepEqual(summary, {
    gapIntervals: 1,
    highRiskCount: 1,
    activeUnavailabilityCount: 1,
    readinessSignals: 3,
    statusLabel: "需补齐缺口",
    nextStep: "先补齐缺口时段，再复核风险和不可用。",
  });
});

test("schedule risk helpers filter rows and summarize risk exposure", () => {
  const rows = [
    {
      risk_id: "risk-a",
      plan_id: "plan-a",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      interval_start: "09:30",
      interval_end: "10:00",
      risk_level: "high",
      gap_agents: 2,
      affected_unavailability: 1,
      reason: "缺口 2 人",
      recommendation: "优先复核",
    },
    {
      risk_id: "risk-b",
      plan_id: "plan-b",
      plan_date: "2026-05-12",
      project_name: "博西客服",
      site_name: "苏州职场",
      interval_start: "10:00",
      interval_end: "10:30",
      risk_level: "medium",
      gap_agents: 1,
      affected_unavailability: 0,
      reason: "排班缺口",
      recommendation: "检查草稿",
    },
  ];

  assert.deepEqual(
    filterScheduleRiskRows(rows, { query: "上海", level: "high" }).map((row) => row.risk_id),
    ["risk-a"],
  );
  assert.deepEqual(summarizeScheduleRiskRows(rows), {
    total: 2,
    high: 1,
    medium: 1,
    low: 0,
    totalGap: 3,
    affectedUnavailability: 1,
  });
});

test("schedule risk scope filters preserve upstream drilldown context", () => {
  const rows = [
    {
      risk_id: "risk-a",
      plan_id: "plan-a",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      interval_start: "09:30",
      interval_end: "10:00",
      risk_level: "high",
      gap_agents: 2,
      affected_unavailability: 1,
      reason: "缺口 2 人",
      recommendation: "优先复核",
    },
    {
      risk_id: "risk-b",
      plan_id: "plan-b",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "苏州职场",
      interval_start: "09:30",
      interval_end: "10:00",
      risk_level: "medium",
      gap_agents: 1,
      affected_unavailability: 0,
      reason: "排班缺口",
      recommendation: "检查草稿",
    },
  ];

  assert.equal(scheduleRiskLevelLabel("high"), "高风险");
  assert.deepEqual(
    filterScheduleRiskRowsByScope(rows, {
      planId: "plan-a",
      planDate: "2026-05-11",
      siteName: "上海职场",
      intervalStart: "09:30",
      intervalEnd: "10:00",
      query: "优先",
    }).map((row) => row.risk_id),
    ["risk-a"],
  );
});

test("shift detail scope filters keep exact drilldown context", () => {
  const rows = [
    {
      plan_id: "plan-a",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      version: "v1",
      status: "review_ready",
      interval_start: "09:30",
      interval_end: "10:00",
      forecast_agents: 18,
      scheduled_agents: 17,
      gap_agents: 1,
      coverage_rate: 0.944,
      note: "预测需求上升",
    },
    {
      plan_id: "plan-a",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      version: "v1",
      status: "review_ready",
      interval_start: "10:00",
      interval_end: "10:30",
      forecast_agents: 18,
      scheduled_agents: 18,
      gap_agents: 0,
      coverage_rate: 1,
      note: "覆盖正常",
    },
  ];

  assert.deepEqual(
    filterShiftDetailRowsByScope(rows, {
      planId: "plan-a",
      planDate: "2026-05-11",
      siteName: "上海职场",
      intervalStart: "09:30",
      intervalEnd: "10:00",
      query: "需求上升",
    }).map((row) => `${row.plan_id}-${row.interval_start}`),
    ["plan-a-09:30"],
  );
});

test("unavailability helpers filter rows and summarize active impact", () => {
  const rows = [
    {
      unavailability_id: "unavail-a",
      staff_name: "张敏",
      team_name: "一线客服 A 组",
      project_name: "博西客服",
      site_name: "上海职场",
      unavailable_date: "2026-05-11",
      start_time: "09:30",
      end_time: "10:30",
      reason: "临时请假",
      status: "active",
      affected_intervals: 2,
      note: "需补班",
    },
    {
      unavailability_id: "unavail-b",
      staff_name: "王宁",
      team_name: "外包夜班组",
      project_name: "博西客服",
      site_name: "苏州职场",
      unavailable_date: "2026-05-12",
      start_time: "12:00",
      end_time: "13:00",
      reason: "不可用申请",
      status: "resolved",
      affected_intervals: 2,
      note: "已调整",
    },
  ];

  assert.deepEqual(
    filterUnavailabilityRows(rows, { query: "张敏", status: "active" }).map((row) => row.unavailability_id),
    ["unavail-a"],
  );
  assert.deepEqual(summarizeUnavailabilityRows(rows), {
    total: 2,
    active: 1,
    resolved: 1,
    affectedIntervals: 4,
    teamCount: 2,
    siteCount: 2,
  });
});

test("unavailability scope filters preserve overlapping drilldown context", () => {
  const rows = [
    {
      unavailability_id: "unavail-a",
      staff_name: "张敏",
      team_name: "一线客服 A 组",
      project_name: "博西客服",
      site_name: "上海职场",
      unavailable_date: "2026-05-11",
      start_time: "09:30",
      end_time: "10:30",
      reason: "临时请假",
      status: "active",
      affected_intervals: 2,
      note: "需补位",
    },
    {
      unavailability_id: "unavail-b",
      staff_name: "李想",
      team_name: "一线客服 B 组",
      project_name: "博西客服",
      site_name: "上海职场",
      unavailable_date: "2026-05-11",
      start_time: "11:00",
      end_time: "11:30",
      reason: "培训",
      status: "active",
      affected_intervals: 1,
      note: "不重叠",
    },
  ];

  assert.deepEqual(
    filterUnavailabilityRowsByScope(rows, {
      projectName: "博西客服",
      siteName: "上海职场",
      unavailableDate: "2026-05-11",
      startTime: "09:30",
      endTime: "10:00",
      status: "active",
    }).map((row) => row.unavailability_id),
    ["unavail-a"],
  );
});

test("review-navigation detail builders preserve scoped source context", () => {
  assert.equal(
    buildScheduleRiskDetailHref("risk-a", {
      from: "schedule-risks",
      planId: "plan-a",
      project: "博西客服",
      site: "上海职场",
      date: "2026-05-11",
      intervalStart: "09:30",
      intervalEnd: "10:00",
    }),
    "/schedule-risks/risk-a?from=schedule-risks&planId=plan-a&date=2026-05-11&project=%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&site=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA&intervalStart=09%3A30&intervalEnd=10%3A00",
  );

  assert.equal(
    buildUnavailabilityDetailHref("unavail-a", {
      from: "unavailability",
      project: "博西客服",
      site: "上海职场",
      date: "2026-05-11",
      startTime: "09:30",
      endTime: "10:30",
      status: "active",
    }),
    "/unavailability/unavail-a?from=unavailability&status=active&date=2026-05-11&project=%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&site=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA&startTime=09%3A30&endTime=10%3A30",
  );

  assert.equal(
    buildPlanDetailHref("plan-a", {
      from: "schedule-risks",
      project: "博西客服",
      site: "上海职场",
      date: "2026-05-11",
      intervalStart: "09:30",
      intervalEnd: "10:00",
    }),
    "/schedule-plans/plan-a?from=schedule-risks&date=2026-05-11&project=%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&site=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA&intervalStart=09%3A30&intervalEnd=10%3A00",
  );
});

test("schedule plan draft builders preserve list and detail return context", () => {
  assert.equal(
    buildSchedulePlansHref({
      query: "上海",
      status: "review_ready",
      draft: "failed",
    }),
    "/schedule-plans?query=%E4%B8%8A%E6%B5%B7&status=review_ready&draft=failed",
  );

  assert.equal(
    buildNewSchedulePlanHref({
      query: "博西",
      status: "draft",
    }),
    "/schedule-plans/new?query=%E5%8D%9A%E8%A5%BF&status=draft",
  );

  assert.equal(
    buildSchedulePlansHref({
      query: "上海",
      status: "review_ready",
    }),
    "/schedule-plans?query=%E4%B8%8A%E6%B5%B7&status=review_ready",
  );

  assert.equal(
    buildPlanEditHref("plan-a", {
      from: "schedule-risks",
      query: "高风险",
      status: "active",
      date: "2026-05-11",
      project: "博西客服",
      site: "上海职场",
      intervalStart: "09:30",
      intervalEnd: "10:00",
    }),
    "/schedule-plans/plan-a/edit?from=schedule-risks&query=%E9%AB%98%E9%A3%8E%E9%99%A9&status=active&date=2026-05-11&project=%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&site=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA&intervalStart=09%3A30&intervalEnd=10%3A00",
  );
});

test("review back-link builder supports schedule-plans as the source page", () => {
  assert.deepEqual(
    buildReviewBackLink(
      {
        from: "schedule-plans",
        planId: "plan-a",
        date: "2026-05-11",
        project: "博西客服",
        site: "上海职场",
        intervalStart: "09:30",
        intervalEnd: "10:00",
      },
      {
        href: "/fallback",
        label: "fallback",
      },
    ),
    {
      href: "/schedule-plans/plan-a?from=schedule-plans&date=2026-05-11&project=%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D&site=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA&intervalStart=09%3A30&intervalEnd=10%3A00",
      label: "返回计划详情",
    },
  );
});

test("shift details page exposes a wide-screen review rail", async () => {
  const source = await readFile(new URL("../../app/shift-details/page.tsx", import.meta.url), "utf8");

  assert.match(source, /ReviewChecklistRail/);
});

test("unavailability page exposes a wide-screen review rail", async () => {
  const source = await readFile(new URL("../../app/unavailability/page.tsx", import.meta.url), "utf8");

  assert.match(source, /ReviewChecklistRail/);
});

test("schedule plan interval table exposes continuation actions", async () => {
  const source = await readFile(
    new URL("../../components/schedule-plan-interval-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /Link/);
  assert.match(source, /查看风险/);
  assert.match(source, /查看班次/);
  assert.match(source, /查看不可用/);
});

test("schedule plan interval table keeps schedule-plans as the row-action source", async () => {
  const source = await readFile(
    new URL("../../components/schedule-plan-interval-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /buildScheduleRisksHref/);
  assert.match(source, /buildShiftDetailsHref/);
  assert.match(source, /buildUnavailabilityHref/);
  assert.match(source, /from: "schedule-plans"/);
});

test("unavailability impact risk table exposes scoped continuation actions", async () => {
  const source = await readFile(
    new URL("../../components/unavailability-impact-risk-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /查看计划/);
  assert.match(source, /查看班次/);
  assert.match(source, /查看风险/);
});

test("unavailability impact shift table preserves scoped plan links", async () => {
  const source = await readFile(
    new URL("../../components/unavailability-impact-shift-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /buildPlanDetailHref/);
  assert.match(source, /sourceFrom/);
  assert.doesNotMatch(source, /href=\{`\/schedule-plans\/\$\{row\.original\.plan_id\}`\}/);
});

test("schedule risk shift table exposes scoped continuation actions", async () => {
  const componentSource = await readFile(
    new URL("../../components/schedule-risk-shift-table.tsx", import.meta.url),
    "utf8",
  );
  const pageSource = await readFile(
    new URL("../../app/schedule-risks/[riskId]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(componentSource, /buildPlanDetailHref/);
  assert.match(componentSource, /buildShiftDetailsHref/);
  assert.match(componentSource, /sourceFrom/);
  assert.match(pageSource, /sourceFrom=\{sourceFrom\}/);
});

test("schedule risk unavailability table exposes scoped continuation actions", async () => {
  const componentSource = await readFile(
    new URL("../../components/schedule-risk-unavailability-table.tsx", import.meta.url),
    "utf8",
  );
  const pageSource = await readFile(
    new URL("../../app/schedule-risks/[riskId]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(componentSource, /buildUnavailabilityDetailHref/);
  assert.match(componentSource, /buildShiftDetailsHref/);
  assert.match(componentSource, /sourceFrom/);
  assert.match(pageSource, /sourceFrom=\{sourceFrom\}/);
});

test("schedule risk list exposes row-action parity with plan and unavailability links", async () => {
  const source = await readFile(
    new URL("../../components/schedule-risk-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /buildPlanDetailHref/);
  assert.match(source, /buildUnavailabilityHref/);
});

test("unavailability list exposes row-action parity with risk links", async () => {
  const source = await readFile(
    new URL("../../components/unavailability-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /buildScheduleRisksHref/);
});

test("schedule plan list exposes review continuation actions beyond the detail entry", async () => {
  const source = await readFile(
    new URL("../../components/schedule-plan-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /buildScheduleRisksHref/);
  assert.match(source, /buildShiftDetailsHref/);
  assert.match(source, /buildUnavailabilityHref/);
});

test("schedule plan draft pages and actions preserve return context", async () => {
  const listSource = await readFile(
    new URL("../../app/schedule-plans/page.tsx", import.meta.url),
    "utf8",
  );
  const newPageSource = await readFile(
    new URL("../../app/schedule-plans/new/page.tsx", import.meta.url),
    "utf8",
  );
  const newActionSource = await readFile(
    new URL("../../app/schedule-plans/new/actions.ts", import.meta.url),
    "utf8",
  );
  const detailSource = await readFile(
    new URL("../../app/schedule-plans/[planId]/page.tsx", import.meta.url),
    "utf8",
  );
  const editPageSource = await readFile(
    new URL("../../app/schedule-plans/[planId]/edit/page.tsx", import.meta.url),
    "utf8",
  );
  const editActionSource = await readFile(
    new URL("../../app/schedule-plans/[planId]/edit/actions.ts", import.meta.url),
    "utf8",
  );

  assert.match(listSource, /buildNewSchedulePlanHref/);
  assert.match(newPageSource, /buildSchedulePlansHref/);
  assert.match(newPageSource, /name="query"/);
  assert.match(newPageSource, /name="status"/);
  assert.match(newActionSource, /buildSchedulePlansHref/);
  assert.match(newActionSource, /buildPlanDetailHref/);
  assert.match(detailSource, /buildPlanEditHref/);
  assert.match(editPageSource, /buildPlanDetailHref/);
  assert.match(editPageSource, /name="from"/);
  assert.match(editActionSource, /buildPlanDetailHref/);
});

test("schedule plan list and detail pages surface visible draft failure feedback", async () => {
  const listSource = await readFile(
    new URL("../../app/schedule-plans/page.tsx", import.meta.url),
    "utf8",
  );
  const detailSource = await readFile(
    new URL("../../app/schedule-plans/[planId]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(listSource, /draft === "failed"/);
  assert.match(listSource, /草稿操作失败/);
  assert.match(detailSource, /draft === "failed"/);
  assert.match(detailSource, /草稿操作失败/);
});

test("schedule plan detail page surfaces visible draft success feedback", async () => {
  const detailSource = await readFile(
    new URL("../../app/schedule-plans/[planId]/page.tsx", import.meta.url),
    "utf8",
  );
  const createActionSource = await readFile(
    new URL("../../app/schedule-plans/new/actions.ts", import.meta.url),
    "utf8",
  );
  const editActionSource = await readFile(
    new URL("../../app/schedule-plans/[planId]/edit/actions.ts", import.meta.url),
    "utf8",
  );

  assert.match(detailSource, /draft === "created"/);
  assert.match(detailSource, /draft === "updated"/);
  assert.match(detailSource, /草稿已创建/);
  assert.match(detailSource, /草稿已保存/);
  assert.match(createActionSource, /draft: "created"/);
  assert.match(editActionSource, /draft: "updated"/);
});

test("schedule plan detail page exposes a wide-screen review rail", async () => {
  const source = await readFile(
    new URL("../../app/schedule-plans/[planId]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /ReviewChecklistRail/);
});

test("shift details table preserves scoped row actions instead of raw routes", async () => {
  const source = await readFile(
    new URL("../../components/shift-details-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /buildPlanDetailHref/);
  assert.match(source, /buildScheduleRisksHref/);
  assert.doesNotMatch(source, /href=`\/schedule-plans\/\$\{row\.original\.plan_id\}`/);
  assert.doesNotMatch(source, /href=`\/schedule-risks\?/);
  assert.match(source, /sourceFrom/);
});

test("schedule risk detail page exposes a wide-screen review rail", async () => {
  const source = await readFile(
    new URL("../../app/schedule-risks/[riskId]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /ReviewChecklistRail/);
});

test("unavailability impact page exposes a wide-screen review rail", async () => {
  const source = await readFile(
    new URL("../../app/unavailability/[unavailabilityId]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /ReviewChecklistRail/);
});

test("shared review checklist rail component defines current and next step sections", async () => {
  const source = await readFile(
    new URL("../../components/review-checklist-rail.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /当前步骤/);
  assert.match(source, /下一步/);
});

test("review workflow pages use the shared review checklist rail", async () => {
  const pagePaths = [
    "../../app/schedule-risks/page.tsx",
    "../../app/schedule-plans/[planId]/page.tsx",
    "../../app/shift-details/page.tsx",
    "../../app/unavailability/page.tsx",
    "../../app/schedule-risks/[riskId]/page.tsx",
    "../../app/unavailability/[unavailabilityId]/page.tsx",
  ];

  for (const pagePath of pagePaths) {
    const source = await readFile(new URL(pagePath, import.meta.url), "utf8");
    assert.match(source, /ReviewChecklistRail/);
  }
});

test("risk and unavailability tables use scoped detail href builders", async () => {
  const riskTableSource = await readFile(
    new URL("../../components/schedule-risk-table.tsx", import.meta.url),
    "utf8",
  );
  const unavailabilityTableSource = await readFile(
    new URL("../../components/unavailability-table.tsx", import.meta.url),
    "utf8",
  );
  const impactRiskTableSource = await readFile(
    new URL("../../components/unavailability-impact-risk-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(riskTableSource, /buildScheduleRiskDetailHref/);
  assert.match(unavailabilityTableSource, /buildUnavailabilityDetailHref/);
  assert.match(impactRiskTableSource, /buildScheduleRiskDetailHref/);
});

test("detail pages preserve scoped back navigation", async () => {
  const planDetailSource = await readFile(
    new URL("../../app/schedule-plans/[planId]/page.tsx", import.meta.url),
    "utf8",
  );
  const riskDetailSource = await readFile(
    new URL("../../app/schedule-risks/[riskId]/page.tsx", import.meta.url),
    "utf8",
  );
  const unavailabilityDetailSource = await readFile(
    new URL("../../app/unavailability/[unavailabilityId]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(planDetailSource, /buildReviewBackLink/);
  assert.match(riskDetailSource, /buildReviewBackLink/);
  assert.match(unavailabilityDetailSource, /buildReviewBackLink/);
  assert.match(riskDetailSource, /scopeParams\.from \?\? "schedule-risks"/);
  assert.match(unavailabilityDetailSource, /scopeParams\.from \?\? "unavailability"/);
});

test("shift details page preserves schedule-plans review context", async () => {
  const shiftDetailsSource = await readFile(
    new URL("../../app/shift-details/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(shiftDetailsSource, /buildPlanDetailHref/);
  assert.match(shiftDetailsSource, /sourceFrom === "schedule-plans"/);
  assert.match(shiftDetailsSource, /buildReviewBackLink/);
  assert.match(shiftDetailsSource, /返回计划详情/);
});

test("schedule plan list view action preserves list filter and source context", async () => {
  const listPageSource = await readFile(
    new URL("../../app/schedule-plans/page.tsx", import.meta.url),
    "utf8",
  );
  const tableSource = await readFile(
    new URL("../../components/schedule-plan-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(listPageSource, /<SchedulePlanTable/);
  assert.match(listPageSource, /query=\{query\}/);
  assert.match(listPageSource, /status=\{status\}/);
  assert.match(tableSource, /buildPlanDetailHref/);
  assert.match(tableSource, /from: "schedule-plans"/);
  assert.match(tableSource, /query,/);
  assert.match(tableSource, /status,/);
  assert.doesNotMatch(
    tableSource,
    /<Link href=\{`\/schedule-plans\/\$\{row\.original\.id\}`\}>查看<\/Link>/,
  );
});

test("review-navigation supports schedule-plans-list as a distinct source", async () => {
  const { buildReviewBackLink } = await import("../../lib/review-navigation.ts");

  assert.deepEqual(
    buildReviewBackLink(
      {
        from: "schedule-plans-list",
        query: "上海",
        status: "review_ready",
      },
      { href: "/fallback", label: "fallback" },
    ),
    {
      href: "/schedule-plans?query=%E4%B8%8A%E6%B5%B7&status=review_ready",
      label: "返回计划列表",
    },
  );
});

test("plan-list review actions preserve list-origin source and filtered return context", async () => {
  const tableSource = await readFile(
    new URL("../../components/schedule-plan-table.tsx", import.meta.url),
    "utf8",
  );
  const shiftPageSource = await readFile(
    new URL("../../app/shift-details/page.tsx", import.meta.url),
    "utf8",
  );
  const riskPageSource = await readFile(
    new URL("../../app/schedule-risks/page.tsx", import.meta.url),
    "utf8",
  );
  const unavailabilityPageSource = await readFile(
    new URL("../../app/unavailability/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(tableSource, /from: "schedule-plans-list"/);
  assert.match(tableSource, /query,/);
  assert.match(tableSource, /status,/);
  assert.match(shiftPageSource, /schedule-plans-list/);
  assert.match(riskPageSource, /buildReviewBackLink/);
  assert.match(riskPageSource, /返回计划列表/);
  assert.match(unavailabilityPageSource, /buildReviewBackLink/);
  assert.match(unavailabilityPageSource, /返回计划列表/);
});

test("schedule-plans risk summary entry preserves plan-list source and status context", async () => {
  const listPageSource = await readFile(
    new URL("../../app/schedule-plans/page.tsx", import.meta.url),
    "utf8",
  );
  const riskPageSource = await readFile(
    new URL("../../app/schedule-risks/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(listPageSource, /buildScheduleRisksHref/);
  assert.match(listPageSource, /from: "schedule-plans-list"/);
  assert.match(listPageSource, /status,/);
  assert.match(riskPageSource, /status\?: string/);
  assert.match(riskPageSource, /const status = params\.status/);
  assert.match(riskPageSource, /buildScheduleRisksHref\(\{ query, status \}\)/);
});

test("schedule risk table can preserve schedule-plans list review context", async () => {
  const source = await readFile(
    new URL("../../components/schedule-risk-table.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /sourceFrom/);
  assert.match(source, /query\?: string/);
  assert.match(source, /status\?: string/);
  assert.match(source, /from: scope\.sourceFrom \|\| "schedule-risks"/);
});

test("review-navigation keeps status when risk entry starts from schedule-plans list", () => {
  assert.equal(
    buildScheduleRisksHref({
      from: "schedule-plans-list",
      query: "上海",
      status: "review_ready",
    }),
    "/schedule-risks?from=schedule-plans-list&query=%E4%B8%8A%E6%B5%B7&status=review_ready",
  );
});

test("mvp flow summary avoids hardcoded risk detail routes and uses context-aware CTA builders", async () => {
  const summarySource = await readFile(
    new URL("../../components/mvp-flow-summary.tsx", import.meta.url),
    "utf8",
  );
  const plansPageSource = await readFile(
    new URL("../../app/schedule-plans/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(summarySource, /buildScheduleRisksHref/);
  assert.match(summarySource, /buildShiftDetailsHref/);
  assert.match(summarySource, /buildUnavailabilityHref/);
  assert.doesNotMatch(summarySource, /risk-plan-20260511-suzhou-bosch-v1-10%3A00/);
  assert.match(summarySource, /query\?: string/);
  assert.match(summarySource, /status\?: string/);
  assert.match(plansPageSource, /<MvpFlowSummary/);
  assert.match(plansPageSource, /query=\{query\}/);
  assert.match(plansPageSource, /status=\{status\}/);
});

test("risk workbench header CTA and fallback stay inside context-aware routes", async () => {
  const riskPageSource = await readFile(
    new URL("../../app/schedule-risks/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(riskPageSource, /const unavailabilityHref = buildUnavailabilityHref/);
  assert.match(riskPageSource, /<Link href=\{unavailabilityHref\}>不可用管理<\/Link>/);
  assert.doesNotMatch(riskPageSource, /<Link href="\/unavailability">不可用管理<\/Link>/);
  assert.match(
    riskPageSource,
    /href: buildScheduleRisksHref\(\{ query, status \}\),\s+label: "回到全部风险"/,
  );
});

test("demand-plans CTA into schedule-plans preserves the active query", async () => {
  const demandPlansSource = await readFile(
    new URL("../../app/demand-plans/page.tsx", import.meta.url),
    "utf8",
  );

  assert.equal(buildDemandPlansHref(), "/demand-plans");
  assert.match(demandPlansSource, /buildSchedulePlansHref/);
  assert.match(demandPlansSource, /buildDemandPlansHref/);
  assert.match(demandPlansSource, /<Link href=\{buildSchedulePlansHref\(\{ query \}\)\}>查看排班计划<\/Link>/);
  assert.match(demandPlansSource, /<Link href=\{buildDemandPlansHref\(\)\}>清空<\/Link>/);
  assert.doesNotMatch(demandPlansSource, /<Link href="\/schedule-plans">查看排班计划<\/Link>/);
  assert.doesNotMatch(demandPlansSource, /<Link href="\/demand-plans">清空<\/Link>/);
});

test("schedule-plans list interactions preserve local draft feedback context", async () => {
  const plansPageSource = await readFile(
    new URL("../../app/schedule-plans/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(plansPageSource, /buildSchedulePlansHref/);
  assert.match(
    plansPageSource,
    /function statusHref\([\s\S]*?status: SchedulePlanStatus \| undefined,[\s\S]*?query: string,[\s\S]*?draft: string,[\s\S]*?\)/,
  );
  assert.match(plansPageSource, /if \(draft\.trim\(\)\) \{\s+searchParams\.set\("draft", draft\.trim\(\)\)\s+\}/);
  assert.match(plansPageSource, /\{draft \? <input name="draft" type="hidden" value=\{draft\} \/>\s+: null\}/);
  assert.match(plansPageSource, /<Link href=\{statusHref\(option\.value, query, draft\)\}>/);
  assert.match(plansPageSource, /<Link href=\{buildSchedulePlansHref\(\{ draft \}\)\}>清空<\/Link>/);
  assert.doesNotMatch(plansPageSource, /<Link href="\/schedule-plans">清空<\/Link>/);
});

test("schedule-plans list exposes a dismiss action for local draft feedback", async () => {
  const plansPageSource = await readFile(
    new URL("../../app/schedule-plans/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(plansPageSource, /buildSchedulePlansHref\(\{ query, status \}\)/);
  assert.match(plansPageSource, /草稿操作失败/);
  assert.match(plansPageSource, /<Link href=\{buildSchedulePlansHref\(\{ query, status \}\)\}>关闭<\/Link>/);
});

test("risk workbench scoped `查看全部` preserves query and status while clearing drilldown scope", async () => {
  const riskPageSource = await readFile(
    new URL("../../app/schedule-risks/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(riskPageSource, /<Link href=\{buildScheduleRisksHref\(\{ query, status \}\)\}>查看全部<\/Link>/);
  assert.doesNotMatch(riskPageSource, /<Link href="\/schedule-risks">查看全部<\/Link>/);
});

test("shift details clear actions preserve source-aware list context", async () => {
  const shiftPageSource = await readFile(
    new URL("../../app/shift-details/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    shiftPageSource,
    /<Link[\s\S]*?href=\{buildShiftDetailsHref\(\{[\s\S]*?from: sourceFrom \|\| undefined,[\s\S]*?query,[\s\S]*?status,[\s\S]*?\}\)\}[\s\S]*?>[\s\S]*?清空范围[\s\S]*?<\/Link>/,
  );
  assert.match(
    shiftPageSource,
    /<Link[\s\S]*?href=\{buildShiftDetailsHref\(\{ from: sourceFrom \|\| undefined \}\)\}[\s\S]*?>[\s\S]*?清空[\s\S]*?<\/Link>/,
  );
  assert.doesNotMatch(shiftPageSource, /<Link href="\/shift-details">清空范围<\/Link>/);
  assert.doesNotMatch(shiftPageSource, /<Link href="\/shift-details">清空<\/Link>/);
});

test("unavailability clear actions preserve source-aware list context", async () => {
  const unavailabilityPageSource = await readFile(
    new URL("../../app/unavailability/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    unavailabilityPageSource,
    /<Link[\s\S]*?href=\{buildUnavailabilityHref\(\{[\s\S]*?from: sourceFrom \|\| undefined,[\s\S]*?query,[\s\S]*?status,[\s\S]*?\}\)\}[\s\S]*?>[\s\S]*?清空范围[\s\S]*?<\/Link>/,
  );
  assert.match(
    unavailabilityPageSource,
    /<Link[\s\S]*?href=\{buildUnavailabilityHref\(\{ from: sourceFrom \|\| undefined \}\)\}[\s\S]*?>[\s\S]*?清空[\s\S]*?<\/Link>/,
  );
  assert.doesNotMatch(unavailabilityPageSource, /<Link href="\/unavailability">清空范围<\/Link>/);
  assert.doesNotMatch(unavailabilityPageSource, /<Link href="\/unavailability">清空<\/Link>/);
});
