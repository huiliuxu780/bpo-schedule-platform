import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportVersionComparisonTrigger,
} = jiti("../../components/import-center-model.ts");

const baseBatch = {
  batch_id: "BATCH-MD-001",
  file_name: "master.csv",
  file_type: "master_data",
  uploaded_by: "ops",
  uploaded_at: "2026-05-29T09:00:00+08:00",
  business_date_from: "2026-05-01",
  business_date_to: "2026-05-31",
  processing_status: "completed",
  total_rows: 10,
  success_rows: 10,
  failed_rows: 0,
  warning_rows: 0,
  version_count: 1,
  application_status: "not_applied",
  application_target: "master_data",
  import_version_id: "BATCH-MD-001::v1",
  applied_record_count: 0,
};

test("import center version comparison trigger only opens when source versions are clear", () => {
  assert.deepEqual(
    summarizeImportVersionComparisonTrigger({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-IM086-SCH-001",
        file_type: "personnel_schedule",
        application_status: "applied",
        application_target: "personnel_schedule",
        import_version_id: "SCH-VERSION-001",
        applied_record_count: 36,
      },
      readiness: {
        batch_id: "BATCH-IM086-SCH-001",
        file_type: "personnel_schedule",
        readiness_status: "ready",
        blockers: [],
        row_blockers: [],
        total_rows: 36,
        success_rows: 36,
        failed_rows: 0,
        warning_rows: 0,
        version_count: 1,
        application_status: "applied",
        application_target: "personnel_schedule",
        import_version_id: "SCH-VERSION-001",
        applied_record_count: 36,
      },
      comparisonRuns: [
        {
          run_id: "RUN-IM086-SA-001",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-VERSION-001",
          actual_import_version_id: "STATUS-VERSION-001",
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          status: "completed",
          total_results: 18,
          total_gap_agents: null,
          total_late_minutes: 24,
          created_at: "2026-06-03T11:00:00+08:00",
        },
        {
          run_id: "RUN-IM086-FS-001",
          comparison_type: "forecast_vs_schedule",
          forecast_version_id: "FC-VERSION-001",
          schedule_version_id: "SCH-VERSION-001",
          actual_import_version_id: null,
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          status: "completed",
          total_results: 12,
          total_gap_agents: 6,
          total_late_minutes: null,
          created_at: "2026-06-03T10:00:00+08:00",
        },
      ],
    }),
    {
      tone: "ready",
      canSubmit: true,
      title: "可在当前版本语境发起比对运行",
      detail: "将按 排班实际 和已定位版本组合重新生成一次对比运行。",
      actionLabel: "发起比对运行",
      nextAction: "提交后留在当前结果页查看反馈，再进入新运行详情或回看比对运行列表。",
      comparisonTypeLabel: "排班实际",
      versionPairLabel: "SCH-VERSION-001 / STATUS-VERSION-001",
      businessDateLabel: "2026-05-01 ~ 2026-05-01",
      evidence: [
        "来源批次 BATCH-业务-SCH-001",
        "业务日 2026-05-01",
        "版本 SCH-VERSION-001",
        "对比口径 排班实际",
        "复用运行 RUN-IM086-SA-001",
      ],
      request: {
        comparisonType: "schedule_vs_actual",
        forecastVersionId: null,
        scheduleVersionId: "SCH-VERSION-001",
        actualImportVersionId: "STATUS-VERSION-001",
        businessDateFrom: "2026-05-01",
        businessDateTo: "2026-05-01",
      },
    },
  );

  assert.deepEqual(
    summarizeImportVersionComparisonTrigger({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-IM086-MD-001",
        file_type: "master_data",
        application_status: "applied",
        application_target: "master_data",
        import_version_id: "MD-VERSION-001",
        applied_record_count: 10,
      },
      readiness: {
        batch_id: "BATCH-IM086-MD-001",
        file_type: "master_data",
        readiness_status: "ready",
        blockers: [],
        row_blockers: [],
        total_rows: 10,
        success_rows: 10,
        failed_rows: 0,
        warning_rows: 0,
        version_count: 1,
        application_status: "applied",
        application_target: "master_data",
        import_version_id: "MD-VERSION-001",
        applied_record_count: 10,
      },
      comparisonRuns: [],
    }),
    {
      tone: "blocked",
      canSubmit: false,
      title: "当前版本暂无可复用的比对入口",
      detail: "当前 主数据 版本 MD-VERSION-001 没有比对口径；先核对版本记录和下游结果追踪。",
      actionLabel: "发起比对运行",
      nextAction: "仅在人员排班、需求预测、状态日志且已定位对比版本时才展示操作入口。",
      comparisonTypeLabel: "未支持",
      versionPairLabel: "MD-VERSION-001",
      businessDateLabel: "2026-05-01",
      evidence: [
        "来源批次 BATCH-业务-MD-001",
        "业务日 2026-05-01",
        "版本 MD-VERSION-001",
      ],
      request: null,
    },
  );
});
