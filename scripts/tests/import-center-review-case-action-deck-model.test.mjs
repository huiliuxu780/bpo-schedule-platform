import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportReviewCaseActionDeck,
  summarizeImportReviewCaseActionFeedback,
  summarizeImportReviewCaseActionContinuation,
  summarizeImportReviewCaseActionRetry,
  summarizeImportReviewOwnerNavigation,
} = jiti("../../components/import-center-model.ts");

test("import center review case detail summarizes the processing action deck", () => {
  const baseDetail = {
    case: {
      case_id: "CASE-ACTION-001",
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
    evidence: [],
    conclusions: [],
    closure: null,
  };

  assert.deepEqual(
    summarizeImportReviewCaseActionDeck({ detail: baseDetail, error: null }),
    {
      tone: "blocked",
      title: "处理动作区",
      statusLabel: "等待证据",
      primaryAction: "补充复核证据",
      summary: "证据 0 条 · 结论 0 条 · 未关闭",
      nextAction: "先补充证据，再补充复核结论；关闭入口会在材料齐全后开放。",
      steps: [
        {
          key: "evidence",
          title: "补充复核证据",
          statusLabel: "可补充",
          actionLabel: "提交证据",
          canSubmit: true,
          isPrimary: true,
          detail: "当前案例未关闭，可补充一条证据记录。",
        },
        {
          key: "conclusion",
          title: "补充复核结论",
          statusLabel: "可补充",
          actionLabel: "提交结论",
          canSubmit: true,
          isPrimary: false,
          detail: "当前案例未关闭，可补充一条复核结论。",
        },
        {
          key: "closure",
          title: "关闭复核案例",
          statusLabel: "不可关闭",
          actionLabel: "不可关闭",
          canSubmit: false,
          isPrimary: false,
          detail: "缺少证据；缺少复核结论",
        },
      ],
    }
  );

  const readyToCloseDetail = {
    ...baseDetail,
    evidence: [
      {
        evidence_id: "EVD-ACTION-001",
        case_id: "CASE-ACTION-001",
        evidence_type: "status_log",
        evidence_uri: "local://review/CASE-ACTION-001/status-log",
        submitted_by: "supervisor-02",
        submitted_at: "2026-05-11T10:10:00+08:00",
        note: "补充状态日志。",
      },
    ],
    conclusions: [
      {
        conclusion_id: "CON-ACTION-001",
        case_id: "CASE-ACTION-001",
        conclusion_type: "confirmed_late",
        risk_level: "medium",
        conclusion_text: "确认迟到异常成立。",
        decided_by: "ops-lead-02",
        decided_at: "2026-05-11T10:30:00+08:00",
      },
    ],
  };

  assert.deepEqual(
    summarizeImportReviewCaseActionDeck({
      detail: readyToCloseDetail,
      error: null,
    }).steps.map((step) => [step.key, step.isPrimary, step.canSubmit]),
    [
      ["evidence", false, true],
      ["conclusion", false, true],
      ["closure", true, true],
    ]
  );

  assert.deepEqual(
    summarizeImportReviewCaseActionDeck({
      detail: {
        ...readyToCloseDetail,
        case: { ...readyToCloseDetail.case, status: "closed" },
        closure: {
          closure_id: "CLO-ACTION-001",
          case_id: "CASE-ACTION-001",
          closure_status: "closed",
          closed_by: "ops-lead-02",
          closed_at: "2026-05-11T10:45:00+08:00",
          closure_note: "已完成闭环。",
        },
      },
      error: null,
    }).nextAction,
    "案例已关闭；可追溯处理动作、证据和结论。"
  );
});

test("import center review case detail summarizes action submit feedback", () => {
  assert.deepEqual(
    summarizeImportReviewCaseActionFeedback({
      evidence: "success",
      conclusion: null,
      closure: null,
    }),
    {
      tone: "ready",
      title: "补证据提交成功",
      statusLabel: "已写入",
      detail: "证据已写入当前复核案例；继续补充结论或复核关闭条件。",
      actionKey: "evidence",
    }
  );

  assert.deepEqual(
    summarizeImportReviewCaseActionFeedback({
      evidence: null,
      conclusion: "failed",
      closure: null,
    }),
    {
      tone: "blocked",
      title: "补结论提交失败",
      statusLabel: "写入失败",
      detail: "结论未写入；检查案例状态和必填字段后重试。",
      actionKey: "conclusion",
    }
  );

  assert.deepEqual(
    summarizeImportReviewCaseActionFeedback({
      evidence: null,
      conclusion: null,
      closure: "success",
    }),
    {
      tone: "ready",
      title: "关闭案例提交成功",
      statusLabel: "已关闭",
      detail: "关闭记录已写入；可追溯处理动作、证据和结论。",
      actionKey: "closure",
    }
  );

  assert.equal(
    summarizeImportReviewCaseActionFeedback({
      evidence: null,
      conclusion: null,
      closure: null,
    }),
    null
  );
});

test("import center review case detail summarizes failed action retry target", () => {
  const failedConclusionFeedback = summarizeImportReviewCaseActionFeedback({
    evidence: null,
    conclusion: "failed",
    closure: null,
  });

  assert.deepEqual(
    summarizeImportReviewCaseActionRetry(failedConclusionFeedback),
    {
      tone: "blocked",
      title: "重试定位",
      statusLabel: "已定位到补结论",
      detail: "补结论写入失败，当前已打开补结论入口；检查必填字段和案例状态后重试。",
      tabValue: "conclusion",
      actionLabel: "补结论",
    }
  );

  assert.equal(
    summarizeImportReviewCaseActionRetry(
      summarizeImportReviewCaseActionFeedback({
        evidence: "success",
        conclusion: null,
        closure: null,
      })
    ),
    null
  );
  assert.equal(summarizeImportReviewCaseActionRetry(null), null);
});

test("import center review case detail summarizes action continuation links", () => {
  const currentCase = {
    case_id: "CASE-CURRENT",
    source_result_type: "schedule_actual",
    source_result_id: 18,
    business_date: "2026-05-11",
    owner_id: "OWNER-A",
    severity: "medium",
    status: "open",
    created_at: "2026-05-11T10:10:00+08:00",
  };
  const cases = [
    currentCase,
    {
      case_id: "CASE-MISSING-EVIDENCE",
      source_result_type: "forecast_schedule",
      source_result_id: 20,
      business_date: "2026-05-11",
      owner_id: "OWNER-A",
      severity: "critical",
      status: "open",
      created_at: "2026-05-11T10:20:00+08:00",
    },
    {
      case_id: "CASE-READY-CLOSE",
      source_result_type: "forecast_schedule",
      source_result_id: 21,
      business_date: "2026-05-11",
      owner_id: "OWNER-A",
      severity: "low",
      status: "open",
      created_at: "2026-05-11T10:30:00+08:00",
    },
  ];
  const processingStages = {
    "CASE-CURRENT": { evidenceCount: 1, conclusionCount: 0, isClosed: false },
    "CASE-MISSING-EVIDENCE": { evidenceCount: 0, conclusionCount: 0, isClosed: false },
    "CASE-READY-CLOSE": { evidenceCount: 1, conclusionCount: 1, isClosed: false },
  };
  const feedback = summarizeImportReviewCaseActionFeedback({
    evidence: "success",
    conclusion: null,
    closure: null,
  });
  const navigation = summarizeImportReviewOwnerNavigation({
    currentCase,
    cases,
    processingStages,
  });

  const continuation = summarizeImportReviewCaseActionContinuation({
    feedback,
    navigation,
  });

  assert.deepEqual(continuation, {
    tone: "ready",
    title: "续办导航",
    statusLabel: "当前案例仍待处理",
    detail: "OWNER-A 在 2026-05-11 还有 3 条待处理案例；当前案例仍处于缺结论，建议先继续处理 CASE-CURRENT。",
    primaryLabel: "继续处理当前案例",
    primaryHref: "/data-quality/review-cases/CASE-CURRENT",
    primaryDetail: "CASE-CURRENT · 缺结论 · 中",
    listLabel: "返回同 Owner 列表",
    listHref: "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-A&status=open",
  });

  const closureFeedback = summarizeImportReviewCaseActionFeedback({
    evidence: null,
    conclusion: null,
    closure: "success",
  });
  const closedNavigation = summarizeImportReviewOwnerNavigation({
    currentCase: { ...currentCase, status: "closed" },
    cases,
    processingStages: {
      ...processingStages,
      "CASE-CURRENT": { evidenceCount: 1, conclusionCount: 1, isClosed: true },
    },
  });

  assert.deepEqual(
    summarizeImportReviewCaseActionContinuation({
      feedback: closureFeedback,
      navigation: closedNavigation,
    }),
    {
      tone: "ready",
      title: "续办导航",
      statusLabel: "当前案例已关闭",
      detail: "OWNER-A 在 2026-05-11 还有 2 条待处理案例；当前案例已关闭，建议继续处理 CASE-MISSING-EVIDENCE。",
      primaryLabel: "关闭后处理下一条",
      primaryHref: "/data-quality/review-cases/CASE-MISSING-EVIDENCE",
      primaryDetail: "CASE-MISSING-EVIDENCE · 缺证据 · 严重",
      listLabel: "返回同 Owner 列表",
      listHref: "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-A&status=open",
    }
  );

  assert.equal(
    summarizeImportReviewCaseActionContinuation({
      feedback: null,
      navigation,
    }),
    null
  );
});
