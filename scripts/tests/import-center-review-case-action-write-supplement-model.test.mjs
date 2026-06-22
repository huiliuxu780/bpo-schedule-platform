import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportReviewConclusionWriteApiUrl,
  buildImportReviewEvidenceWriteApiUrl,
  summarizeImportReviewCaseConclusionAction,
  summarizeImportReviewCaseEvidenceAction,
  buildImportReviewConclusionWritePayload,
  buildImportReviewEvidenceWritePayload,
} = jiti("../../components/import-center-model.ts");

test("import center review case detail prepares controlled evidence write action", () => {
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
    evidence: [],
    conclusions: [],
    closure: null,
  };

  assert.equal(
    buildImportReviewEvidenceWriteApiUrl("CASE-QUERY-001"),
    "http://127.0.0.1:8000/api/v1/review-cases/CASE-QUERY-001/evidence"
  );

  assert.deepEqual(
    summarizeImportReviewCaseEvidenceAction({ detail, error: null }),
    {
      tone: "warning",
      title: "补充复核证据",
      canSubmit: true,
      statusLabel: "可补充",
      actionLabel: "提交证据",
      detail: "当前案例未关闭，可补充一条证据记录。",
      blockers: [],
      apiHref: "http://127.0.0.1:8000/api/v1/review-cases/CASE-QUERY-001/evidence",
    }
  );

  assert.deepEqual(
    buildImportReviewEvidenceWritePayload({
      detail,
      evidenceType: "status_log",
      evidenceUri: "local://review/CASE-QUERY-001/status-log",
      submittedBy: "supervisor-01",
      note: "补充状态日志。",
    }),
    {
      evidence_id: "EVD-CASE-QUERY-001-001",
      case_id: "CASE-QUERY-001",
      evidence_type: "status_log",
      evidence_uri: "local://review/CASE-QUERY-001/status-log",
      submitted_by: "supervisor-01",
      note: "补充状态日志。",
    }
  );

  assert.equal(
    summarizeImportReviewCaseEvidenceAction({
      detail: {
        ...detail,
        case: { ...detail.case, status: "closed" },
        closure: {
          closure_id: "CLO-CASE-QUERY-001",
          case_id: "CASE-QUERY-001",
          closure_status: "closed",
          closed_by: "ops-lead-01",
          closed_at: "2026-05-11T11:00:00+08:00",
          closure_note: "证据和结论已复核。",
        },
      },
      error: null,
    }).canSubmit,
    false
  );

  assert.deepEqual(
    summarizeImportReviewCaseEvidenceAction({
      detail: null,
      error: "复核案例 API 返回 404",
    }).blockers,
    ["复核案例 API 返回 404"]
  );
});

test("import center review case detail prepares controlled conclusion write action", () => {
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
        evidence_id: "EVD-CASE-QUERY-001-001",
        case_id: "CASE-QUERY-001",
        evidence_type: "status_log",
        evidence_uri: "local://review/CASE-QUERY-001/status-log",
        submitted_by: "supervisor-01",
        submitted_at: "2026-05-11T10:30:00+08:00",
        note: "补充状态日志。",
      },
    ],
    conclusions: [],
    closure: null,
  };

  assert.equal(
    buildImportReviewConclusionWriteApiUrl("CASE-QUERY-001"),
    "http://127.0.0.1:8000/api/v1/review-cases/CASE-QUERY-001/conclusion"
  );

  assert.deepEqual(
    summarizeImportReviewCaseConclusionAction({ detail, error: null }),
    {
      tone: "warning",
      title: "补充复核结论",
      canSubmit: true,
      statusLabel: "可补充",
      actionLabel: "提交结论",
      detail: "当前案例未关闭，可补充一条复核结论。",
      blockers: [],
      apiHref: "http://127.0.0.1:8000/api/v1/review-cases/CASE-QUERY-001/conclusion",
    }
  );

  assert.deepEqual(
    buildImportReviewConclusionWritePayload({
      detail,
      conclusionType: "confirmed_gap",
      riskLevel: "high",
      conclusionText: "确认预测与排班缺口。",
      decidedBy: "ops-lead-01",
    }),
    {
      conclusion_id: "CON-CASE-QUERY-001-001",
      case_id: "CASE-QUERY-001",
      conclusion_type: "confirmed_gap",
      risk_level: "high",
      conclusion_text: "确认预测与排班缺口。",
      decided_by: "ops-lead-01",
    }
  );

  assert.equal(
    summarizeImportReviewCaseConclusionAction({
      detail: {
        ...detail,
        case: { ...detail.case, status: "closed" },
        closure: {
          closure_id: "CLO-CASE-QUERY-001",
          case_id: "CASE-QUERY-001",
          closure_status: "closed",
          closed_by: "ops-lead-01",
          closed_at: "2026-05-11T11:00:00+08:00",
          closure_note: "证据和结论已复核。",
        },
      },
      error: null,
    }).canSubmit,
    false
  );

  assert.deepEqual(
    summarizeImportReviewCaseConclusionAction({
      detail: null,
      error: "复核案例 API 返回 404",
    }).blockers,
    ["复核案例 API 返回 404"]
  );
});
