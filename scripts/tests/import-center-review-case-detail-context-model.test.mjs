import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportReviewCaseDetailApiUrl,
  buildImportReviewCaseDetailWorkspaceHref,
  buildImportComparisonRunDetailWorkspaceHref,
  buildImportComparisonRunDetailApiUrl,
  summarizeImportReviewCaseDetail,
} = jiti("../../components/import-center-model.ts");

test("import center review case detail summarizes read-only case context", () => {
  assert.equal(
    buildImportReviewCaseDetailWorkspaceHref("CASE-QUERY-001"),
    "/data-quality/review-cases/CASE-QUERY-001"
  );
  assert.equal(
    buildImportReviewCaseDetailApiUrl("CASE-QUERY-001"),
    "http://127.0.0.1:8000/api/v1/review-cases/CASE-QUERY-001"
  );
  assert.equal(
    buildImportComparisonRunDetailWorkspaceHref("RUN-DB008-FS"),
    "/data-quality/comparison-runs/RUN-DB008-FS"
  );
  assert.equal(
    buildImportComparisonRunDetailApiUrl("RUN-DB008-FS"),
    "http://127.0.0.1:8000/api/v1/comparison-runs/RUN-DB008-FS"
  );

  assert.deepEqual(
    summarizeImportReviewCaseDetail({
      detail: {
        case: {
          case_id: "CASE-QUERY-001",
          source_result_type: "forecast_schedule",
          source_result_id: 12,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T10:00:00+08:00",
        },
        source_result: {
          source_result_type: "forecast_schedule",
          result_id: 12,
          run_id: "RUN-DB008-FS",
          business_date: "2026-05-11",
          interval_start: "09:00",
          interval_end: "09:30",
          result_status: "gap",
          workplace_id: "SH-01",
          project_id: "BOSCH-CS",
          skill_id: "L1-CN",
          employee_id: null,
          forecast_version_id: "FC-20260511-V1",
          schedule_version_id: "SCH-20260511-V1",
          actual_import_version_id: null,
          forecast_interval_id: "FC-INT-001",
          schedule_detail_id: "DETAIL-A-1001-20260511",
          actual_status_interval_row_id: null,
          forecast_agents: 3,
          scheduled_agents: 1,
          gap_agents: 2,
          scheduled_minutes: null,
          actual_productive_minutes: null,
          late_minutes: null,
        },
        source_trace: {
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
          versions: [
            {
              version_role: "forecast",
              business_version_id: "FC-20260511-V1",
              import_version_id: "IMPORT-FC-20260511",
              import_version_type: "demand_forecast",
              batch_id: "BATCH-DB007-20260511",
              file_name: "db007_sources.csv",
              business_date_from: "2026-05-11",
              business_date_to: "2026-05-11",
            },
            {
              version_role: "schedule",
              business_version_id: "SCH-20260511-V1",
              import_version_id: "IMPORT-SCH-20260511",
              import_version_type: "personnel_schedule",
              batch_id: "BATCH-DB007-20260511",
              file_name: "db007_sources.csv",
              business_date_from: "2026-05-11",
              business_date_to: "2026-05-11",
            },
          ],
        },
        evidence: [
          {
            evidence_id: "EVD-QUERY-001",
            case_id: "CASE-QUERY-001",
            evidence_type: "note",
            evidence_uri: "local://review/CASE-QUERY-001/note",
            submitted_by: "supervisor-01",
            submitted_at: "2026-05-11T10:20:00+08:00",
            note: "复核说明",
          },
        ],
        conclusions: [
          {
            conclusion_id: "CON-QUERY-001",
            case_id: "CASE-QUERY-001",
            conclusion_type: "confirmed_gap",
            risk_level: "high",
            conclusion_text: "确认预测与排班缺口。",
            decided_by: "ops-lead-01",
            decided_at: "2026-05-11T10:30:00+08:00",
          },
        ],
        closure: null,
      },
      error: null,
    }),
    {
      tone: "blocked",
      title: "CASE-QUERY-001 · 高 · 未关闭",
      workspaceTabs: [
        { key: "overview", label: "总览" },
        { key: "source", label: "来源链路" },
        { key: "evidence", label: "证据结论" },
        { key: "actions", label: "处理动作" },
        { key: "owner", label: "Owner 导航" },
      ],
      sourceLabel: "预测排班 #12",
      sourceResultDimensions: [
        "业务日 2026-05-11",
        "时段 09:00-09:30",
        "职场 SH-01",
        "项目 BOSCH-CS",
        "技能 L1-CN",
      ],
      sourceResultMetrics: [
        "预测 3 人",
        "排班 1 人",
        "缺口 2 人",
        "状态 gap",
      ],
      ownerLabel: "supervisor-01",
      evidenceLabel: "证据 1 条 · 结论 1 条 · 未关闭",
      sourceTraceRun: "计算 RUN-DB008-FS · 预测排班 · completed · 2 条结果",
      sourceTraceHref: "/data-quality/comparison-runs/RUN-DB008-FS",
      sourceTraceVersions: [
        "预测版本 FC-20260511-V1 · IMPORT-FC-20260511 · BATCH-DB007-20260511",
        "排班版本 SCH-20260511-V1 · IMPORT-SCH-20260511 · BATCH-DB007-20260511",
      ],
      sourceTraceVersionRows: [
        {
          key: "forecast::FC-20260511-V1::IMPORT-FC-20260511::BATCH-DB007-20260511",
          roleLabel: "预测版本",
          businessVersionLabel: "预测版本 FC-20260511-V1",
          importVersionLabel: "导入版本 IMPORT-FC-20260511",
          importVersionTypeLabel: "需求预测",
          batchLabel: "来源批次 BATCH-DB007-20260511",
          batchHref: "/data-quality/BATCH-DB007-20260511",
          batchStatusLabel: "可查看批次",
          fileNameLabel: "db007_sources.csv",
          businessDateLabel: "业务日 2026-05-11",
        },
        {
          key: "schedule::SCH-20260511-V1::IMPORT-SCH-20260511::BATCH-DB007-20260511",
          roleLabel: "排班版本",
          businessVersionLabel: "排班版本 SCH-20260511-V1",
          importVersionLabel: "导入版本 IMPORT-SCH-20260511",
          importVersionTypeLabel: "人员排班",
          batchLabel: "来源批次 BATCH-DB007-20260511",
          batchHref: "/data-quality/BATCH-DB007-20260511",
          batchStatusLabel: "可查看批次",
          fileNameLabel: "db007_sources.csv",
          businessDateLabel: "业务日 2026-05-11",
        },
      ],
      qualityFocus: "预测版本、排班版本和质量修正记录。",
      evidenceGap: "仍需确认预测版本、排班版本引用和质量修正记录。",
      nextAction: "owner supervisor-01 先复核 1 条证据和 1 条结论，再进入关闭流程。",
      detailHref: "/data-quality/review-cases/CASE-QUERY-001",
      listHref: "/data-quality/review-cases?businessDate=2026-05-11&ownerId=supervisor-01&status=open&severity=high&sourceResultType=forecast_schedule",
      evidence: [
        "业务日 2026-05-11",
        "来源 预测排班 #12",
        "证据 EVD-QUERY-001 · note · supervisor-01",
        "结论 CON-QUERY-001 · high · ops-lead-01",
      ],
    }
  );

  assert.deepEqual(
    summarizeImportReviewCaseDetail({
      detail: null,
      error: "复核案例 API 返回 404",
    }),
    {
      tone: "blocked",
      title: "复核案例读取失败",
      workspaceTabs: [
        { key: "overview", label: "总览" },
        { key: "source", label: "来源链路" },
        { key: "evidence", label: "证据结论" },
        { key: "actions", label: "处理动作" },
        { key: "owner", label: "Owner 导航" },
      ],
      sourceLabel: "来源不可用",
      sourceResultDimensions: ["来源不可用"],
      sourceResultMetrics: ["等待服务恢复"],
      ownerLabel: "owner 不可用",
      evidenceLabel: "证据不可用",
      sourceTraceRun: "来源链路不可用",
      sourceTraceHref: "/data-quality/review-cases",
      sourceTraceVersions: ["等待服务恢复"],
      sourceTraceVersionRows: [],
      qualityFocus: "质量问题不可用",
      evidenceGap: "复核案例 API 返回 404",
      nextAction: "先恢复复核案例读取，再查看来源结果和证据缺口。",
      detailHref: "/data-quality/review-cases",
      listHref: "/data-quality/review-cases",
      evidence: ["读取失败"],
    }
  );
});

test("import center review case detail exposes schedule actual source trace batches", () => {
  const summary = summarizeImportReviewCaseDetail({
    detail: {
      case: {
        case_id: "CASE-ACTUAL-001",
        source_result_type: "schedule_actual",
        source_result_id: 42,
        business_date: "2026-05-12",
        owner_id: "supervisor-02",
        severity: "medium",
        status: "open",
        created_at: "2026-05-12T10:00:00+08:00",
      },
      source_result: {
        source_result_type: "schedule_actual",
        result_id: 42,
        run_id: "RUN-DB008-SA",
        business_date: "2026-05-12",
        interval_start: "09:00",
        interval_end: "09:30",
        result_status: "late",
        workplace_id: null,
        project_id: null,
        skill_id: null,
        employee_id: "EMP-001",
        forecast_version_id: null,
        schedule_version_id: "SCH-20260512-V1",
        actual_import_version_id: "ACT-20260512-V1",
        forecast_interval_id: null,
        schedule_detail_id: "DETAIL-A-1001-20260512",
        actual_status_interval_row_id: 1201,
        forecast_agents: null,
        scheduled_agents: null,
        gap_agents: null,
        scheduled_minutes: 30,
        actual_productive_minutes: 20,
        late_minutes: 10,
      },
      source_trace: {
        run: {
          run_id: "RUN-DB008-SA",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-20260512-V1",
          actual_import_version_id: "ACT-20260512-V1",
          business_date_from: "2026-05-12",
          business_date_to: "2026-05-12",
          status: "completed",
          total_results: 3,
          total_gap_agents: null,
          total_late_minutes: 18,
          created_at: "2026-05-12T10:00:00+08:00",
        },
        versions: [
          {
            version_role: "schedule",
            business_version_id: "SCH-20260512-V1",
            import_version_id: "IMPORT-SCH-20260512",
            import_version_type: "personnel_schedule",
            batch_id: "BATCH-SCH-20260512",
            file_name: "schedule.csv",
            business_date_from: "2026-05-12",
            business_date_to: "2026-05-12",
          },
          {
            version_role: "actual",
            business_version_id: "ACT-20260512-V1",
            import_version_id: "IMPORT-ACT-20260512",
            import_version_type: "status_log",
            batch_id: null,
            file_name: null,
            business_date_from: "2026-05-12",
            business_date_to: "2026-05-13",
          },
        ],
      },
      evidence: [],
      conclusions: [],
      closure: null,
    },
    error: null,
  });

  assert.equal(
    summary.sourceTraceRun,
    "计算 RUN-DB008-SA · 排班实际 · completed · 3 条结果"
  );
  assert.deepEqual(summary.sourceTraceVersionRows, [
    {
      key: "schedule::SCH-20260512-V1::IMPORT-SCH-20260512::BATCH-SCH-20260512",
      roleLabel: "排班版本",
      businessVersionLabel: "排班版本 SCH-20260512-V1",
      importVersionLabel: "导入版本 IMPORT-SCH-20260512",
      importVersionTypeLabel: "人员排班",
      batchLabel: "来源批次 BATCH-SCH-20260512",
      batchHref: "/data-quality/BATCH-SCH-20260512",
      batchStatusLabel: "可查看批次",
      fileNameLabel: "schedule.csv",
      businessDateLabel: "业务日 2026-05-12",
    },
    {
      key: "actual::ACT-20260512-V1::IMPORT-ACT-20260512::no-batch",
      roleLabel: "实际版本",
      businessVersionLabel: "实际版本 ACT-20260512-V1",
      importVersionLabel: "导入版本 IMPORT-ACT-20260512",
      importVersionTypeLabel: "状态日志",
      batchLabel: "来源批次不可用",
      batchHref: null,
      batchStatusLabel: "批次不可用",
      fileNameLabel: "文件名不可用",
      businessDateLabel: "业务日 2026-05-12 至 2026-05-13",
    },
  ]);
});
