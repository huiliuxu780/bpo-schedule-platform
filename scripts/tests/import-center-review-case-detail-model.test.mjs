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
  summarizeImportReviewCaseEvidenceChain,
  summarizeImportReviewCaseProcessingTimeline,
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
      qualityFocus: "质量问题不可用",
      evidenceGap: "复核案例 API 返回 404",
      nextAction: "先恢复复核案例读取，再查看来源结果和证据缺口。",
      detailHref: "/data-quality/review-cases",
      listHref: "/data-quality/review-cases",
      evidence: ["读取失败"],
    }
  );
});

test("import center review case detail builds evidence conclusion chain", () => {
  const detail = {
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
    source_result: null,
    source_trace: null,
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
  };

  assert.deepEqual(
    summarizeImportReviewCaseEvidenceChain({ detail, error: null }),
    {
      tone: "warning",
      title: "证据与结论链路",
      statusLabel: "未关闭",
      summary: "证据 1 条 · 结论 1 条 · 未关闭",
      nextAction: "先复核证据和结论内容，再进入关闭流程。",
      items: [
        {
          id: "EVD-QUERY-001",
          typeLabel: "证据",
          title: "note · supervisor-01",
          detail: "复核说明",
          timestamp: "2026-05-11T10:20:00+08:00",
        },
        {
          id: "CON-QUERY-001",
          typeLabel: "结论",
          title: "confirmed_gap · high · ops-lead-01",
          detail: "确认预测与排班缺口。",
          timestamp: "2026-05-11T10:30:00+08:00",
        },
      ],
    }
  );

  assert.deepEqual(
    summarizeImportReviewCaseEvidenceChain({
      detail: {
        ...detail,
        case: { ...detail.case, status: "closed" },
        closure: {
          closure_id: "CLS-QUERY-001",
          case_id: "CASE-QUERY-001",
          closure_status: "closed",
          closed_by: "ops-lead-01",
          closed_at: "2026-05-11T11:00:00+08:00",
          closure_note: "证据和结论已复核。",
        },
      },
      error: null,
    }).items.at(-1),
    {
      id: "CLS-QUERY-001",
      typeLabel: "关闭",
      title: "closed · ops-lead-01",
      detail: "证据和结论已复核。",
      timestamp: "2026-05-11T11:00:00+08:00",
    }
  );

  assert.deepEqual(
    summarizeImportReviewCaseEvidenceChain({
      detail: null,
      error: "复核案例 API 返回 404",
    }),
    {
      tone: "blocked",
      title: "证据链路读取失败",
      statusLabel: "读取失败",
      summary: "复核案例 API 返回 404",
      nextAction: "先恢复复核案例读取，再查看证据、结论和关闭记录。",
      items: [],
    }
  );
});

test("import center review case detail builds processing timeline", () => {
  const detail = {
    case: {
      case_id: "CASE-TIMELINE-001",
      source_result_type: "schedule_actual",
      source_result_id: 42,
      business_date: "2026-05-11",
      owner_id: "supervisor-02",
      severity: "medium",
      status: "open",
      created_at: "2026-05-11T09:40:00+08:00",
    },
    source_result: null,
    source_trace: null,
    evidence: [
      {
        evidence_id: "EVD-TIMELINE-001",
        case_id: "CASE-TIMELINE-001",
        evidence_type: "login_log",
        evidence_uri: "local://review/CASE-TIMELINE-001/login",
        submitted_by: "supervisor-02",
        submitted_at: "2026-05-11T10:10:00+08:00",
        note: "补充登录日志。",
      },
    ],
    conclusions: [
      {
        conclusion_id: "CON-TIMELINE-001",
        case_id: "CASE-TIMELINE-001",
        conclusion_type: "confirmed_late",
        risk_level: "medium",
        conclusion_text: "确认迟到异常成立。",
        decided_by: "ops-lead-02",
        decided_at: "2026-05-11T10:30:00+08:00",
      },
    ],
    closure: {
      closure_id: "CLO-TIMELINE-001",
      case_id: "CASE-TIMELINE-001",
      closure_status: "closed",
      closed_by: "ops-lead-02",
      closed_at: "2026-05-11T10:45:00+08:00",
      closure_note: "已完成闭环。",
    },
  };

  assert.deepEqual(
    summarizeImportReviewCaseProcessingTimeline({ detail, error: null }),
    {
      tone: "ready",
      title: "处理时间线",
      statusLabel: "已关闭",
      currentStage: "已关闭",
      summary: "3 个处理动作 · 最新动作 2026-05-11T10:45:00+08:00",
      nextAction: "案例已关闭；可追溯处理动作、证据和结论。",
      items: [
        {
          id: "EVD-TIMELINE-001",
          stage: "补充证据",
          actor: "supervisor-02",
          timestamp: "2026-05-11T10:10:00+08:00",
          title: "login_log",
          detail: "补充登录日志。",
          sourceLabel: "证据",
        },
        {
          id: "CON-TIMELINE-001",
          stage: "补充结论",
          actor: "ops-lead-02",
          timestamp: "2026-05-11T10:30:00+08:00",
          title: "confirmed_late · medium",
          detail: "确认迟到异常成立。",
          sourceLabel: "结论",
        },
        {
          id: "CLO-TIMELINE-001",
          stage: "关闭案例",
          actor: "ops-lead-02",
          timestamp: "2026-05-11T10:45:00+08:00",
          title: "closed",
          detail: "已完成闭环。",
          sourceLabel: "关闭",
        },
      ],
    }
  );

  assert.deepEqual(
    summarizeImportReviewCaseProcessingTimeline({
      detail: { ...detail, evidence: [], conclusions: [], closure: null },
      error: null,
    }),
    {
      tone: "warning",
      title: "处理时间线",
      statusLabel: "未开始",
      currentStage: "等待证据",
      summary: "暂无处理动作",
      nextAction: "先补充证据，再补充复核结论；关闭入口需要证据和结论齐全。",
      items: [],
    }
  );
});
