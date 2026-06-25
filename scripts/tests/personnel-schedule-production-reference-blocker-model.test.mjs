import assert from "node:assert/strict";
import test from "node:test";

import { summarizePersonnelScheduleProductionDetail } from "../../components/personnel-schedule-production-model.ts";

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
  assert.equal(detail.blockerSummary, "请返回排班版本列表选择已应用版本");
  assert.deepEqual(detail.comparisonEntry, {
    tone: "blocked",
    title: "无法进入比对",
    detail: "未定位排班业务版本或业务日，先回到排班计划选择已应用批次。",
    actionLabel: "查看业务版本列表",
    href: "/data-quality/versions?domain=personnel_schedule",
    blockerLabel: "阻塞：请返回排班版本列表选择已应用版本",
  });
});
