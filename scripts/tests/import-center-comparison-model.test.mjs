import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportComparisonRunDetail,
  summarizeImportComparisonRunReturnLinks,
  summarizeImportComparisonRunReviewCases,
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

test("import center comparison run detail summarizes result rows", () => {
  assert.deepEqual(
    summarizeImportComparisonRunDetail({
      detail: {
        run: {
          run_id: "RUN-DB008-FS",
          comparison_type: "forecast_vs_schedule",
          forecast_version_id: "FC-20260511-V1",
          schedule_version_id: "SCH-20260511-V1",
          actual_import_version_id: null,
          business_date_from: "2026-05-11",
          business_date_to: "2026-05-11",
          status: "completed",
          total_results: 2,
          total_gap_agents: 4,
          total_late_minutes: null,
          created_at: "2026-05-11T10:00:00+08:00",
        },
        forecast_schedule_results: [
          {
            result_id: 12,
            run_id: "RUN-DB008-FS",
            forecast_version_id: "FC-20260511-V1",
            schedule_version_id: "SCH-20260511-V1",
            forecast_interval_id: "FC-INT-001",
            schedule_detail_id: "DETAIL-A-1001-20260511",
            business_date: "2026-05-11",
            workplace_id: "SH-01",
            project_id: "BOSCH-CS",
            skill_id: "L1-CN",
            interval_start: "09:00",
            interval_end: "09:30",
            forecast_agents: 3,
            scheduled_agents: 1,
            gap_agents: 2,
            result_status: "gap",
          },
        ],
        schedule_actual_results: [],
      },
      error: null,
    }),
    {
      tone: "ready",
      title: "RUN-DB008-FS · 预测排班 · 完成",
      workspaceTabs: [
        { key: "overview", label: "总览" },
        { key: "source", label: "来源链路" },
        { key: "results", label: "结果明细" },
        { key: "reviews", label: "复核案例" },
      ],
      resultReviewContext: {
        title: "完整结果回看主页",
        detail:
          "当前页面展示 RUN-DB008-FS 的完整结果明细，来源版本为 预测 FC-20260511-V1 · 排班 SCH-20260511-V1，业务日 2026-05-11 至 2026-05-11。",
        scopeLabel: "当前版本语境 · 预测排班",
        sourceVersionLabel: "预测 FC-20260511-V1 · 排班 SCH-20260511-V1",
        businessDateLabel: "2026-05-11 ~ 2026-05-11",
        sourceExplanation:
          "预测排班口径使用预测版本 FC-20260511-V1 和排班版本 SCH-20260511-V1，按同一业务日区间比较 0.5h 人力缺口。",
        sourceBlocker: null,
        nextAction: "先核对来源版本和业务日，再按明细行检查异常结果。",
      },
      metricCards: [
        { label: "结果数", value: "2", detail: "计算结果" },
        { label: "缺口", value: "4 人", detail: "预测排班差异" },
        { label: "迟到", value: "0 分钟", detail: "排班实际差异" },
        { label: "业务日", value: "2026-05-11", detail: "至 2026-05-11" },
      ],
      versionLabel: "预测 FC-20260511-V1 · 排班 SCH-20260511-V1",
      detailHref: "/data-quality/comparison-runs/RUN-DB008-FS",
      resultRows: [
        {
          id: "forecast-12",
          source: "预测排班",
          dimension: "2026-05-11 · 09:00-09:30 · SH-01 · BOSCH-CS · L1-CN",
          metric: "预测 3 人 · 排班 1 人 · 缺口 2 人",
          status: "gap",
        },
      ],
    }
  );

  assert.deepEqual(
    summarizeImportComparisonRunDetail({
      detail: {
        run: {
          run_id: "RUN-DB008-SA",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-20260511-V1",
          actual_import_version_id: "LOGIN-20260511-V1",
          business_date_from: "2026-05-11",
          business_date_to: "2026-05-11",
          status: "completed",
          total_results: 1,
          total_gap_agents: null,
          total_late_minutes: 24,
          created_at: "2026-05-11T10:00:00+08:00",
        },
        forecast_schedule_results: [],
        schedule_actual_results: [
          {
            result_id: 42,
            run_id: "RUN-DB008-SA",
            schedule_version_id: "SCH-20260511-V1",
            actual_import_version_id: "LOGIN-20260511-V1",
            schedule_detail_id: "DETAIL-A-1001-20260511",
            actual_log_id: "LOGIN-A-1001-20260511",
            business_date: "2026-05-11",
            employee_id: "A-1001",
            interval_start: "09:00",
            interval_end: "09:30",
            scheduled_minutes: 30,
            actual_productive_minutes: 6,
            late_minutes: 24,
            result_status: "late",
          },
        ],
      },
      error: null,
    }),
    {
      tone: "ready",
      title: "RUN-DB008-SA · 排班实际 · 完成",
      workspaceTabs: [
        { key: "overview", label: "总览" },
        { key: "source", label: "来源链路" },
        { key: "results", label: "结果明细" },
        { key: "reviews", label: "复核案例" },
      ],
      resultReviewContext: {
        title: "完整结果回看主页",
        detail:
          "当前页面展示 RUN-DB008-SA 的完整结果明细，来源版本为 排班 SCH-20260511-V1 · 实际 LOGIN-20260511-V1，业务日 2026-05-11 至 2026-05-11。",
        scopeLabel: "当前版本语境 · 排班实际",
        sourceVersionLabel: "排班 SCH-20260511-V1 · 实际 LOGIN-20260511-V1",
        businessDateLabel: "2026-05-11 ~ 2026-05-11",
        sourceExplanation:
          "排班实际口径使用排班版本 SCH-20260511-V1 和实际日志版本 LOGIN-20260511-V1，按同一业务日区间比较坐席排班分钟、有效生产分钟和迟到分钟。",
        sourceBlocker: null,
        nextAction: "先核对来源版本和业务日，再按明细行检查异常结果。",
      },
      metricCards: [
        { label: "结果数", value: "1", detail: "计算结果" },
        { label: "缺口", value: "0 人", detail: "预测排班差异" },
        { label: "迟到", value: "24 分钟", detail: "排班实际差异" },
        { label: "业务日", value: "2026-05-11", detail: "至 2026-05-11" },
      ],
      versionLabel: "排班 SCH-20260511-V1 · 实际 LOGIN-20260511-V1",
      detailHref: "/data-quality/comparison-runs/RUN-DB008-SA",
      resultRows: [
        {
          id: "actual-42",
          source: "排班实际",
          dimension: "2026-05-11 · 09:00-09:30 · A-1001",
          metric: "排班 30 分钟 · 有效 6 分钟 · 迟到 24 分钟",
          status: "late",
        },
      ],
    }
  );
});

test("import center comparison run detail returns to source batch and version workbench", () => {
  const detail = {
    run: {
      run_id: "RUN-IM092-SA-001",
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
    forecast_schedule_results: [],
    schedule_actual_results: [],
  };

  assert.deepEqual(
    summarizeImportComparisonRunReturnLinks({
      detail,
      error: null,
      batches: [
        {
          ...baseBatch,
          batch_id: "BATCH-IM092-SCH-001",
          file_type: "personnel_schedule",
          uploaded_at: "2026-06-03T10:00:00+08:00",
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          application_status: "applied",
          application_target: "personnel_schedule",
          import_version_id: "SCH-VERSION-001",
          applied_record_count: 36,
        },
        {
          ...baseBatch,
          batch_id: "BATCH-IM092-STATUS-001",
          file_type: "status_log",
          uploaded_at: "2026-06-03T11:00:00+08:00",
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          application_status: "applied",
          application_target: "actual_logs",
          import_version_id: "STATUS-VERSION-001",
          applied_record_count: 48,
        },
      ],
      batchError: null,
    }),
    {
      tone: "ready",
      title: "已形成回跳闭环",
      detail:
        "当前运行已匹配 2 个来源批次；可回到 BATCH-业务-STATUS-001 的结果追踪，或按业务日进入业务版本列表。",
      sourceBatchLabel: "BATCH-业务-STATUS-001 · BATCH-业务-SCH-001",
      versionWorkbenchLabel: "业务版本列表 · 2026-05-01",
      primaryActionLabel: "回到来源批次结果追踪",
      primaryHref: "/data-quality/BATCH-IM092-STATUS-001?tab=result-trace",
      secondaryActionLabel: "查看版本列表",
      secondaryHref: "/data-quality/versions?businessDate=2026-05-01&domain=actual_logs",
      evidence: [
        "来源版本 排班 SCH-VERSION-001",
        "来源版本 实际 STATUS-VERSION-001",
        "来源批次 BATCH-业务-STATUS-001",
        "来源批次 BATCH-业务-SCH-001",
      ],
    },
  );

  assert.deepEqual(
    summarizeImportComparisonRunReturnLinks({
      detail,
      error: null,
      batches: [],
      batchError: null,
    }),
    {
      tone: "blocked",
      title: "来源批次未定位",
      detail:
        "当前运行能识别版本语境，但未在导入批次列表中匹配到来源批次。",
      sourceBatchLabel: "未定位",
      versionWorkbenchLabel: "业务版本列表 · 2026-05-01",
      primaryActionLabel: "来源批次不可回跳",
      primaryHref: null,
      secondaryActionLabel: "查看版本列表",
      secondaryHref: "/data-quality/versions?businessDate=2026-05-01",
      evidence: [
        "来源版本 排班 SCH-VERSION-001",
        "来源版本 实际 STATUS-VERSION-001",
      ],
    },
  );
});

test("import center comparison run detail links related review cases", () => {
  const detail = {
    run: {
      run_id: "RUN-DB008-FS",
      comparison_type: "forecast_vs_schedule",
      forecast_version_id: "FC-20260511-V1",
      schedule_version_id: "SCH-20260511-V1",
      actual_import_version_id: null,
      business_date_from: "2026-05-11",
      business_date_to: "2026-05-11",
      status: "completed",
      total_results: 2,
      total_gap_agents: 4,
      total_late_minutes: null,
      created_at: "2026-05-11T10:00:00+08:00",
    },
    forecast_schedule_results: [
      {
        result_id: 12,
        run_id: "RUN-DB008-FS",
        forecast_version_id: "FC-20260511-V1",
        schedule_version_id: "SCH-20260511-V1",
        forecast_interval_id: "FC-INT-001",
        schedule_detail_id: "DETAIL-A-1001-20260511",
        business_date: "2026-05-11",
        workplace_id: "SH-01",
        project_id: "BOSCH-CS",
        skill_id: "L1-CN",
        interval_start: "09:00",
        interval_end: "09:30",
        forecast_agents: 3,
        scheduled_agents: 1,
        gap_agents: 2,
        result_status: "gap",
      },
    ],
    schedule_actual_results: [],
  };

  assert.deepEqual(
    summarizeImportComparisonRunReviewCases({
      detail,
      reviewCases: [
        {
          case_id: "CASE-QUERY-001",
          source_result_type: "forecast_schedule",
          source_result_id: 12,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T10:10:00+08:00",
        },
        {
          case_id: "CASE-OTHER-001",
          source_result_type: "schedule_actual",
          source_result_id: 99,
          business_date: "2026-05-11",
          owner_id: "supervisor-02",
          severity: "medium",
          status: "open",
          created_at: "2026-05-11T11:00:00+08:00",
        },
      ],
      reviewError: null,
    }),
    {
      tone: "blocked",
      title: "关联复核案例 1 个",
      detail: "当前运行有 1 个结果已形成复核案例，其中 1 个仍未关闭。",
      nextAction: "先查看未关闭或高风险复核案例，再回看运行结果和证据。",
      cases: [
        {
          caseId: "CASE-QUERY-001",
          resultLabel: "预测排班 #12",
          ownerLabel: "supervisor-01",
          severityLabel: "高",
          statusLabel: "未关闭",
          href: "/data-quality/review-cases/CASE-QUERY-001",
        },
      ],
    }
  );

  assert.deepEqual(
    summarizeImportComparisonRunReviewCases({
      detail,
      reviewCases: [],
      reviewError: null,
    }),
    {
      tone: "empty",
      title: "暂无关联复核案例",
      detail: "当前运行结果尚未匹配到复核案例。",
      nextAction: "继续查看结果明细。",
      cases: [],
    }
  );
});
