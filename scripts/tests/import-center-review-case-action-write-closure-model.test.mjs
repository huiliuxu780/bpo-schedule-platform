import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportReviewCaseClosureWriteApiUrl,
  summarizeImportReviewCaseClosureAction,
  buildImportReviewCaseClosureWritePayload,
} = jiti("../../components/import-center-model.ts");

test("import center review case detail prepares controlled closure write action", () => {
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

  assert.equal(
    buildImportReviewCaseClosureWriteApiUrl(),
    "http://127.0.0.1:8000/api/v1/review-cases/write-closure"
  );

  assert.deepEqual(
    summarizeImportReviewCaseClosureAction({ detail, error: null }),
    {
      tone: "warning",
      title: "关闭复核案例",
      canSubmit: true,
      statusLabel: "可关闭",
      actionLabel: "关闭案例",
      detail: "已有 1 条证据和 1 条结论，可提交关闭写入。",
      blockers: [],
      apiHref: "http://127.0.0.1:8000/api/v1/review-cases/write-closure",
    }
  );

  assert.deepEqual(
    buildImportReviewCaseClosureWritePayload({
      detail,
      closedBy: "ops-lead-01",
      closureNote: "证据和结论已复核。",
    }),
    {
      case: {
        case_id: "CASE-QUERY-001",
        source_result_type: "forecast_schedule",
        source_result_id: 12,
        business_date: "2026-05-11",
        owner_id: "supervisor-01",
        severity: "high",
        status: "open",
      },
      evidence: [
        {
          evidence_id: "EVD-QUERY-001",
          case_id: "CASE-QUERY-001",
          evidence_type: "note",
          evidence_uri: "local://review/CASE-QUERY-001/note",
          submitted_by: "supervisor-01",
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
        },
      ],
      closure: {
        closure_id: "CLO-CASE-QUERY-001",
        case_id: "CASE-QUERY-001",
        closure_status: "closed",
        closed_by: "ops-lead-01",
        closure_note: "证据和结论已复核。",
      },
    }
  );

  assert.deepEqual(
    summarizeImportReviewCaseClosureAction({
      detail: { ...detail, conclusions: [] },
      error: null,
    }).blockers,
    ["缺少复核结论"]
  );

  assert.equal(
    summarizeImportReviewCaseClosureAction({
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
});
