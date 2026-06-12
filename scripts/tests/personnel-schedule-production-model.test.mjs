import assert from "node:assert/strict";
import test from "node:test";

import {
  summarizePersonnelScheduleImportDialog,
  summarizePersonnelScheduleProductionDetail,
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
  assert.equal(summary.rows[0].detailHref, "/schedule-plans/production/BATCH-SCH-001");
  assert.equal(summary.rows[0].applicationLabel, "已应用");
  assert.equal(summary.rows[0].expansionLabel, "0.5h 已展开");
  assert.equal(summary.rows[0].blockerSummary, "无阻塞");
  assert.equal(summary.rows[0].nextActionLabel, "查看版本详情");
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

test("personnel schedule import dialog summary keeps upload flow in schedule page context", () => {
  const dialog = summarizePersonnelScheduleImportDialog({
    batches: [baseBatch],
    templates: [
      {
        template_id: "TPL-SCH-001",
        template_name: "排班模板",
        file_type: "personnel_schedule",
        field_mapping: { schedule_date: "schedule_date" },
        required_fields: ["schedule_date"],
        is_active: true,
        updated_at: "2026-06-12T09:00:00+08:00",
      },
      {
        template_id: "TPL-FC-001",
        template_name: "预测模板",
        file_type: "demand_forecast",
        field_mapping: { forecast_date: "forecast_date" },
        required_fields: ["forecast_date"],
        is_active: true,
        updated_at: "2026-06-12T09:00:00+08:00",
      },
    ],
    uploadStatus: "success",
    uploadBatchId: "BATCH-SCH-001",
  });

  assert.equal(dialog.openHref, "/schedule-plans/production?import_dialog=1");
  assert.equal(dialog.closeHref, "/schedule-plans/production");
  assert.equal(dialog.resultRedirectTo, "/schedule-plans/production?import_dialog=1");
  assert.equal(dialog.fileType, "personnel_schedule");
  assert.equal(dialog.templateDownloadName, "personnel-schedule-template.csv");
  assert.equal(dialog.templateDownloadHref.startsWith("data:text/csv;charset=utf-8,"), true);
  assert.deepEqual(dialog.steps.map((step) => step.key), ["upload", "mapping", "result"]);
  assert.deepEqual(dialog.activeTemplates.map((template) => template.template_id), ["TPL-SCH-001"]);
  assert.equal(dialog.result?.tone, "success");
  assert.equal(dialog.result?.title, "导入已提交");
  assert.equal(dialog.result?.batchHref, "/data-quality/import-batches/BATCH-SCH-001");
});

test("personnel schedule production detail resolves a schedule version by source batch", () => {
  const detail = summarizePersonnelScheduleProductionDetail([baseBatch], "BATCH-SCH-001");

  assert.equal(detail.tone, "ready");
  assert.equal(detail.title, "排班版本详情已定位");
  assert.deepEqual(detail.workspaceTabs, [
    { key: "overview", label: "总览" },
    { key: "source", label: "来源与版本" },
    { key: "rows", label: "明细" },
    { key: "comparison", label: "比对" },
  ]);
  assert.equal(detail.batchId, "BATCH-SCH-001");
  assert.equal(detail.versionLabel, "BATCH-SCH-001::v1");
  assert.equal(detail.sourceBatchHref, "/data-quality/import-batches/BATCH-SCH-001");
  assert.equal(detail.workbenchHref, "/schedule-plans/production");
  assert.equal(detail.businessDateLabel, "2026-06-01 至 2026-06-07");
  assert.equal(detail.shiftReferenceLabel, "来自 12 条成功导入行，等待版本明细返回班次引用。");
  assert.equal(detail.personScopeLabel, "暂无人员清单明细");
  assert.equal(detail.halfHourResultLabel, "已形成 96 条 0.5h 展开记录");
  assert.equal(detail.blockerSummary, "无阻塞");
});

test("personnel schedule production detail uses real api details when available", () => {
  const detail = summarizePersonnelScheduleProductionDetail(
    [baseBatch],
    "BATCH-SCH-001",
    {
      batch: baseBatch,
      version: {
        schedule_version_id: "SCH-PROD-001",
        import_version_id: "BATCH-SCH-001::v1",
        business_date_from: "2026-06-01",
        business_date_to: "2026-06-07",
        created_at: "2026-06-04T10:00:00+08:00",
      },
      details: [
        {
          schedule_detail_id: "SCH-DETAIL-001",
          schedule_version_id: "SCH-PROD-001",
          employee_id: "A-1001",
          workplace_id: "SH-01",
          supplier_id: "BOSCH-CS",
          project_id: "BOSCH-HOTLINE",
          skill_id: "L1-CN",
          schedule_date: "2026-06-01",
          shift_type_id: "MORNING-2H",
          start_time: "09:00",
          end_time: "11:00",
        },
      ],
      intervals: [
        {
          schedule_interval_id: "SCH-INT-001",
          schedule_detail_id: "SCH-DETAIL-001",
          schedule_version_id: "SCH-PROD-001",
          employee_id: "A-1001",
          interval_date: "2026-06-01",
          interval_start: "09:00",
          interval_end: "09:30",
          workplace_id: "SH-01",
          supplier_id: "BOSCH-CS",
          project_id: "BOSCH-HOTLINE",
          skill_id: "L1-CN",
        },
        {
          schedule_interval_id: "SCH-INT-002",
          schedule_detail_id: "SCH-DETAIL-001",
          schedule_version_id: "SCH-PROD-001",
          employee_id: "A-1001",
          interval_date: "2026-06-01",
          interval_start: "09:30",
          interval_end: "10:00",
          workplace_id: "SH-01",
          supplier_id: "BOSCH-CS",
          project_id: "BOSCH-HOTLINE",
          skill_id: "L1-CN",
        },
      ],
    }
  );

  assert.equal(detail.versionLabel, "SCH-PROD-001");
  assert.equal(detail.appliedRecordCountLabel, "2");
  assert.equal(detail.sourceRowLabel, "1 条排班明细来自版本明细");
  assert.equal(detail.shiftReferenceLabel, "1 个班次引用已定位：MORNING-2H");
  assert.equal(detail.personScopeLabel, "1 名坐席已定位：A-1001");
  assert.equal(detail.halfHourResultLabel, "已形成 2 条 0.5h 展开区间");
  assert.deepEqual(detail.comparisonEntry, {
    tone: "ready",
    title: "进入预测 vs 排班比对入口",
    detail: "已定位排班版本 SCH-PROD-001，可到业务版本列表按同业务日寻找预测版本并发起比对。",
    actionLabel: "去业务版本列表",
    href: "/data-quality/versions?domain=personnel_schedule&status=applied&businessDate=2026-06-01",
    blockerLabel: "无阻塞；从业务版本列表继续完成成对版本确认",
  });
  assert.equal(detail.detailRows.length, 1);
  assert.equal(detail.intervalRows.length, 2);
  assert.deepEqual(detail.detailRows[0], {
    id: "SCH-DETAIL-001",
    employeeLabel: "A-1001",
    dateLabel: "2026-06-01",
    shiftLabel: "MORNING-2H",
    timeLabel: "09:00-11:00",
    referenceLabel: "SH-01 / BOSCH-CS / BOSCH-HOTLINE / L1-CN",
    referenceStatusLabel: "引用完整",
    blockerLabel: "无阻塞；行级引用字段完整",
  });
  assert.deepEqual(detail.intervalRows[0], {
    id: "SCH-INT-001",
    employeeLabel: "A-1001",
    dateLabel: "2026-06-01",
    timeLabel: "09:00-09:30",
    referenceLabel: "SH-01 / BOSCH-CS / BOSCH-HOTLINE / L1-CN",
    referenceStatusLabel: "引用完整",
    blockerLabel: "无阻塞；行级引用字段完整",
  });
});

test("personnel schedule production detail explains row-level reference blockers", () => {
  const detail = summarizePersonnelScheduleProductionDetail(
    [baseBatch],
    "BATCH-SCH-001",
    {
      batch: baseBatch,
      version: {
        schedule_version_id: "SCH-PROD-002",
        import_version_id: "BATCH-SCH-001::v1",
        business_date_from: "2026-06-01",
        business_date_to: "2026-06-07",
        created_at: "2026-06-04T10:00:00+08:00",
      },
      details: [
        {
          schedule_detail_id: "SCH-DETAIL-BLOCKED",
          schedule_version_id: "SCH-PROD-002",
          employee_id: "A-1001",
          workplace_id: "",
          supplier_id: "BOSCH-CS",
          project_id: "",
          skill_id: "L1-CN",
          schedule_date: "2026-06-01",
          shift_type_id: "",
          start_time: "09:00",
          end_time: "11:00",
        },
      ],
      intervals: [
        {
          schedule_interval_id: "SCH-INT-BLOCKED",
          schedule_detail_id: "SCH-DETAIL-BLOCKED",
          schedule_version_id: "SCH-PROD-002",
          employee_id: "",
          interval_date: "2026-06-01",
          interval_start: "09:00",
          interval_end: "09:30",
          workplace_id: "SH-01",
          supplier_id: "",
          project_id: "BOSCH-HOTLINE",
          skill_id: "",
        },
      ],
    }
  );

  assert.equal(detail.detailRows[0].referenceStatusLabel, "引用缺失");
  assert.equal(
    detail.detailRows[0].blockerLabel,
    "阻塞：缺少职场、项目、班次类型引用"
  );
  assert.equal(detail.intervalRows[0].employeeLabel, "未填写坐席");
  assert.equal(detail.intervalRows[0].referenceStatusLabel, "引用缺失");
  assert.equal(
    detail.intervalRows[0].blockerLabel,
    "阻塞：缺少坐席、供应商、技能引用"
  );
});

test("personnel schedule production detail blocks missing expansion records without fabricated details", () => {
  const detail = summarizePersonnelScheduleProductionDetail(
    [
      {
        ...baseBatch,
        applied_record_count: 0,
      },
    ],
    "BATCH-SCH-001"
  );

  assert.equal(detail.tone, "blocked");
  assert.equal(detail.halfHourResultLabel, "未发现 0.5h 展开记录");
  assert.equal(detail.personScopeLabel, "暂无人员清单明细");
  assert.equal(detail.blockerSummary, "已应用但未发现展开记录");
});

test("personnel schedule production detail shows a blocked state for unknown batch", () => {
  const detail = summarizePersonnelScheduleProductionDetail([baseBatch], "BATCH-MISSING");

  assert.equal(detail.tone, "blocked");
  assert.equal(detail.title, "排班版本未定位");
  assert.equal(detail.batchId, "BATCH-MISSING");
  assert.equal(detail.versionLabel, "未找到对应人员排班批次");
  assert.equal(detail.blockerSummary, "请返回排班计划选择来源批次");
  assert.deepEqual(detail.comparisonEntry, {
    tone: "blocked",
    title: "无法进入比对",
    detail: "未定位排班业务版本或业务日，先回到排班计划选择已应用批次。",
    actionLabel: "查看业务版本列表",
    href: "/data-quality/versions?domain=personnel_schedule",
    blockerLabel: "阻塞：请返回排班计划选择来源批次",
  });
});
