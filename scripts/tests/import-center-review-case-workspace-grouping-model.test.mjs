import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportReviewCasesWorkspace,
  summarizeImportReviewOwnerFirstPendingEntries,
} = jiti("../../components/import-center-model.ts");

test("import center review cases workspace summarizes owner first pending entries", () => {
  const cases = [
    {
      case_id: "CASE-A-CURRENT",
      source_result_type: "schedule_actual",
      source_result_id: 18,
      business_date: "2026-05-11",
      owner_id: "OWNER-A",
      severity: "medium",
      status: "open",
      created_at: "2026-05-11T10:10:00+08:00",
    },
    {
      case_id: "CASE-A-MISSING-EVIDENCE",
      source_result_type: "forecast_schedule",
      source_result_id: 20,
      business_date: "2026-05-11",
      owner_id: "OWNER-A",
      severity: "critical",
      status: "open",
      created_at: "2026-05-11T10:20:00+08:00",
    },
    {
      case_id: "CASE-A-CLOSED",
      source_result_type: "forecast_schedule",
      source_result_id: 21,
      business_date: "2026-05-11",
      owner_id: "OWNER-A",
      severity: "low",
      status: "closed",
      created_at: "2026-05-11T10:30:00+08:00",
    },
    {
      case_id: "CASE-B-READY",
      source_result_type: "schedule_actual",
      source_result_id: 22,
      business_date: "2026-05-11",
      owner_id: "OWNER-B",
      severity: "high",
      status: "open",
      created_at: "2026-05-11T10:05:00+08:00",
    },
    {
      case_id: "CASE-C-CLOSED",
      source_result_type: "schedule_actual",
      source_result_id: 23,
      business_date: "2026-05-11",
      owner_id: "OWNER-C",
      severity: "critical",
      status: "closed",
      created_at: "2026-05-11T10:00:00+08:00",
    },
  ];
  const processingStages = {
    "CASE-A-CURRENT": { evidenceCount: 1, conclusionCount: 0, isClosed: false },
    "CASE-A-MISSING-EVIDENCE": { evidenceCount: 0, conclusionCount: 0, isClosed: false },
    "CASE-A-CLOSED": { evidenceCount: 1, conclusionCount: 1, isClosed: true },
    "CASE-B-READY": { evidenceCount: 1, conclusionCount: 1, isClosed: false },
    "CASE-C-CLOSED": { evidenceCount: 1, conclusionCount: 1, isClosed: true },
  };

  const entries = summarizeImportReviewOwnerFirstPendingEntries({
    cases,
    processingStages,
  });

  assert.deepEqual(
    entries.map((entry) => ({
      ownerId: entry.ownerId,
      totalCount: entry.totalCount,
      actionableCount: entry.actionableCount,
      firstCaseId: entry.firstPendingCase.caseId,
      firstStage: entry.firstPendingCase.stageLabel,
      href: entry.firstPendingCase.href,
      listHref: entry.listHref,
    })),
    [
      {
        ownerId: "OWNER-A",
        totalCount: 3,
        actionableCount: 2,
        firstCaseId: "CASE-A-MISSING-EVIDENCE",
        firstStage: "缺证据",
        href: "/data-quality/review-cases/CASE-A-MISSING-EVIDENCE",
        listHref: "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-A",
      },
      {
        ownerId: "OWNER-B",
        totalCount: 1,
        actionableCount: 1,
        firstCaseId: "CASE-B-READY",
        firstStage: "可关闭",
        href: "/data-quality/review-cases/CASE-B-READY",
        listHref: "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-B",
      },
    ]
  );
});

test("import center review cases workspace summarizes groups and next action", () => {
  const summary = summarizeImportReviewCasesWorkspace({
    cases: [
      {
        case_id: "CASE-HIGH-001",
        source_result_type: "schedule_actual",
        source_result_id: 18,
        business_date: "2026-05-11",
        owner_id: "OWNER-A",
        severity: "high",
        status: "open",
        created_at: "2026-05-11T10:00:00+08:00",
      },
      {
        case_id: "CASE-MEDIUM-001",
        source_result_type: "forecast_schedule",
        source_result_id: 12,
        business_date: "2026-05-11",
        owner_id: "OWNER-A",
        severity: "medium",
        status: "open",
        created_at: "2026-05-11T10:20:00+08:00",
      },
      {
        case_id: "CASE-CLOSED-001",
        source_result_type: "schedule_actual",
        source_result_id: 20,
        business_date: "2026-05-11",
        owner_id: "OWNER-B",
        severity: "low",
        status: "closed",
        created_at: "2026-05-11T11:00:00+08:00",
      },
    ],
    filters: {
      businessDate: "2026-05-11",
      status: "all",
      severity: "all",
      sourceResultType: "all",
    },
    error: null,
  });

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.title, "复核案例 3 个");
  assert.equal(summary.openCount, 2);
  assert.equal(summary.closedCount, 1);
  assert.equal(summary.ownerGroups[0].ownerId, "OWNER-A");
  assert.equal(summary.ownerGroups[0].openCount, 2);
  assert.equal(summary.statusGroups[0].label, "未关闭");
  assert.equal(summary.statusGroups[0].count, 2);
  assert.equal(summary.sourceGroups[0].label, "排班实际");
  assert.equal(summary.sourceGroups[0].count, 2);
  assert.equal(
    summary.nextAction,
    "先处理 OWNER-A 名下 2 个未关闭复核案例，再回看高风险来源和证据缺口。"
  );
});
