import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportReviewCaseEvidenceChain,
} = jiti("../../components/import-center-model.ts");

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
