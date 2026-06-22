import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportReviewCaseAcceptanceBlock,
  summarizeImportReviewCaseDetailAcceptance,
  summarizeImportReviewOwnerNavigation,
} = jiti("../../components/import-center-model.ts");

const baseCases = [
  {
    case_id: "CASE-MISSING-EVIDENCE",
    source_result_type: "schedule_actual",
    source_result_id: 18,
    business_date: "2026-05-11",
    owner_id: "OWNER-A",
    severity: "critical",
    status: "open",
    created_at: "2026-05-11T10:00:00+08:00",
  },
  {
    case_id: "CASE-MISSING-CONCLUSION",
    source_result_type: "schedule_actual",
    source_result_id: 19,
    business_date: "2026-05-11",
    owner_id: "OWNER-A",
    severity: "medium",
    status: "open",
    created_at: "2026-05-11T10:10:00+08:00",
  },
  {
    case_id: "CASE-READY-CLOSE",
    source_result_type: "forecast_schedule",
    source_result_id: 20,
    business_date: "2026-05-11",
    owner_id: "OWNER-B",
    severity: "high",
    status: "open",
    created_at: "2026-05-11T10:20:00+08:00",
  },
  {
    case_id: "CASE-CLOSED",
    source_result_type: "forecast_schedule",
    source_result_id: 21,
    business_date: "2026-05-11",
    owner_id: "OWNER-B",
    severity: "low",
    status: "closed",
    created_at: "2026-05-11T10:30:00+08:00",
  },
  {
    case_id: "CASE-UNKNOWN",
    source_result_type: "schedule_actual",
    source_result_id: 22,
    business_date: "2026-05-11",
    owner_id: "OWNER-C",
    severity: "low",
    status: "open",
    created_at: "2026-05-11T10:40:00+08:00",
  },
];

const baseStages = {
  "CASE-MISSING-EVIDENCE": { evidenceCount: 0, conclusionCount: 0, isClosed: false },
  "CASE-MISSING-CONCLUSION": { evidenceCount: 1, conclusionCount: 0, isClosed: false },
  "CASE-READY-CLOSE": { evidenceCount: 1, conclusionCount: 1, isClosed: false },
  "CASE-CLOSED": { evidenceCount: 1, conclusionCount: 1, isClosed: true },
};

function buildDetail(overrides = {}) {
  return {
    case: {
      case_id: "CASE-DETAIL-001",
      source_result_type: "schedule_actual",
      source_result_id: 42,
      business_date: "2026-05-11",
      owner_id: "OWNER-A",
      severity: "high",
      status: "open",
      created_at: "2026-05-11T09:40:00+08:00",
      ...(overrides.case ?? {}),
    },
    source_result: overrides.source_result === undefined
      ? {
          source_result_type: "schedule_actual",
          result_id: 42,
          run_id: "RUN-DETAIL-001",
          business_date: "2026-05-11",
          interval_start: "2026-05-11T10:00:00+08:00",
          interval_end: "2026-05-11T10:30:00+08:00",
          result_status: "late",
          workplace_id: "WP-001",
          project_id: "PRJ-001",
          skill_id: "SK-001",
          employee_id: "EMP-001",
          forecast_version_id: null,
          schedule_version_id: "SCH-V1",
          actual_import_version_id: "ACT-V1",
          forecast_interval_id: null,
          schedule_detail_id: "SCH-DETAIL-001",
          actual_status_interval_row_id: 7,
          forecast_agents: null,
          scheduled_agents: null,
          gap_agents: null,
          scheduled_minutes: 30,
          actual_productive_minutes: 10,
          late_minutes: 20,
        }
      : overrides.source_result,
    source_trace: overrides.source_trace ?? null,
    evidence: overrides.evidence ?? [],
    conclusions: overrides.conclusions ?? [],
    closure: overrides.closure ?? null,
  };
}

const evidence = {
  evidence_id: "EVD-DETAIL-001",
  case_id: "CASE-DETAIL-001",
  evidence_type: "status_log",
  evidence_uri: "local://review/CASE-DETAIL-001/status-log",
  submitted_by: "OWNER-A",
  submitted_at: "2026-05-11T10:10:00+08:00",
  note: "补充状态日志。",
};

const conclusion = {
  conclusion_id: "CON-DETAIL-001",
  case_id: "CASE-DETAIL-001",
  conclusion_type: "confirmed_late",
  risk_level: "high",
  conclusion_text: "确认迟到异常成立。",
  decided_by: "ops-lead-01",
  decided_at: "2026-05-11T10:30:00+08:00",
};

test("review case acceptance block summarizes operator queue processing path", () => {
  const summary = summarizeImportReviewCaseAcceptanceBlock({
    cases: baseCases,
    filters: { status: "all" },
    processingStages: baseStages,
    error: null,
  });

  assert.equal(summary.title, "队列处理路径");
  assert.equal(summary.tone, "blocked");
  assert.equal(summary.statusLabel, "优先处理缺证据");
  assert.equal(summary.primaryActionLabel, "处理 CASE-MISSING-EVIDENCE");
  assert.equal(summary.primaryHref, "/data-quality/review-cases/CASE-MISSING-EVIDENCE");
  assert.deepEqual(
    summary.stageCoverage.map((item) => [item.key, item.count, item.label]),
    [
      ["missing_evidence", 1, "缺证据"],
      ["missing_conclusion", 1, "缺结论"],
      ["ready_to_close", 1, "可关闭"],
      ["closed", 1, "已关闭"],
      ["unknown", 1, "阶段未知"],
    ]
  );
  assert.equal(
    summary.detail,
    "当前筛选结果有 5 个复核案例，4 个仍待处理；优先进入缺证据案例。"
  );
});

test("review case acceptance block distinguishes read errors and empty queues", () => {
  assert.deepEqual(
    summarizeImportReviewCaseAcceptanceBlock({
      cases: [],
      filters: {},
      processingStages: {},
      error: "fetch failed",
    }),
    {
      tone: "blocked",
      title: "复核案例读取受阻",
      statusLabel: "读取受阻",
      detail: "fetch failed",
      primaryActionLabel: "返回复核列表",
      primaryHref: "/data-quality/review-cases",
      stageCoverage: [],
      nextAction: "先恢复复核案例读取，再判断队列处理路径。",
    }
  );

  assert.equal(
    summarizeImportReviewCaseAcceptanceBlock({
      cases: [],
      filters: {},
      processingStages: {},
      error: null,
    }).title,
    "暂无复核案例"
  );
});

test("review case detail acceptance summarizes the current case processing path", () => {
  const missingEvidenceNavigation = summarizeImportReviewOwnerNavigation({
    currentCase: buildDetail().case,
    cases: [buildDetail().case],
    processingStages: {
      "CASE-DETAIL-001": { evidenceCount: 0, conclusionCount: 0, isClosed: false },
    },
    error: null,
  });
  const missingEvidence = summarizeImportReviewCaseDetailAcceptance({
    detail: buildDetail(),
    error: null,
    navigation: missingEvidenceNavigation,
  });

  assert.equal(missingEvidence.title, "单案例处理路径");
  assert.equal(missingEvidence.statusLabel, "等待证据");
  assert.equal(missingEvidence.primaryActionLabel, "补充复核证据");
  assert.deepEqual(
    missingEvidence.steps.map((step) => [step.key, step.statusLabel]),
    [
      ["source", "可追溯"],
      ["evidence", "缺证据"],
      ["conclusion", "等待证据"],
      ["closure", "不可关闭"],
      ["continuation", "当前案例仍待处理"],
    ]
  );

  assert.equal(
    summarizeImportReviewCaseDetailAcceptance({
      detail: buildDetail({ evidence: [evidence] }),
      error: null,
      navigation: missingEvidenceNavigation,
    }).primaryActionLabel,
    "补充复核结论"
  );

  assert.equal(
    summarizeImportReviewCaseDetailAcceptance({
      detail: buildDetail({ evidence: [evidence], conclusions: [conclusion] }),
      error: null,
      navigation: missingEvidenceNavigation,
    }).primaryActionLabel,
    "关闭复核案例"
  );

  const closed = summarizeImportReviewCaseDetailAcceptance({
    detail: buildDetail({
      case: { status: "closed" },
      evidence: [evidence],
      conclusions: [conclusion],
      closure: {
        closure_id: "CLO-DETAIL-001",
        case_id: "CASE-DETAIL-001",
        closure_status: "closed",
        closed_by: "ops-lead-01",
        closed_at: "2026-05-11T10:45:00+08:00",
        closure_note: "已完成闭环。",
      },
    }),
    error: null,
    navigation: summarizeImportReviewOwnerNavigation({
      currentCase: { ...buildDetail().case, status: "closed" },
      cases: [{ ...buildDetail().case, status: "closed" }],
      processingStages: {
        "CASE-DETAIL-001": { evidenceCount: 1, conclusionCount: 1, isClosed: true },
      },
      error: null,
    }),
  });

  assert.equal(closed.tone, "ready");
  assert.equal(closed.primaryActionLabel, "回看关闭依据");
  assert.equal(closed.steps.at(-1).statusLabel, "当前队列已清空");
});

test("review case detail acceptance handles read errors without completion claims", () => {
  const summary = summarizeImportReviewCaseDetailAcceptance({
    detail: null,
    error: "复核案例 API 返回 500",
    navigation: summarizeImportReviewOwnerNavigation({
      currentCase: null,
      cases: [],
      processingStages: {},
      error: null,
    }),
  });

  assert.equal(summary.title, "复核案例读取受阻");
  assert.equal(summary.statusLabel, "读取受阻");
  assert.equal(summary.primaryActionLabel, "返回复核列表");
  assert.equal(summary.steps.length, 0);
});
