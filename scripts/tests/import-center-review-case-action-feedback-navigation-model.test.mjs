import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportReviewCaseActionFeedback,
  summarizeImportReviewCaseActionContinuation,
  summarizeImportReviewCaseActionRetry,
  summarizeImportReviewOwnerNavigation,
} = jiti("../../components/import-center-model.ts");

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
