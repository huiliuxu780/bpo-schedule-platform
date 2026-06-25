import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportReviewCaseProcessingTimeline,
} = jiti("../../components/import-center-model.ts");

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
