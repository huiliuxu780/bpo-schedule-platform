import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportReviewOwnerStageMatrix,
  summarizeImportReviewOwnerContext,
  summarizeImportReviewOwnerNavigation,
} = jiti("../../components/import-center-model.ts");

test("import center review owner stage matrix summarizes owner workload and hrefs", () => {
  const cases = [
    {
      case_id: "CASE-MISSING-EVIDENCE",
      source_result_type: "schedule_actual",
      source_result_id: 18,
      business_date: "2026-05-11",
      owner_id: "OWNER-A",
      severity: "high",
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
      severity: "medium",
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
  const stages = {
    "CASE-MISSING-EVIDENCE": { evidenceCount: 0, conclusionCount: 0, isClosed: false },
    "CASE-MISSING-CONCLUSION": { evidenceCount: 1, conclusionCount: 0, isClosed: false },
    "CASE-READY-CLOSE": { evidenceCount: 1, conclusionCount: 1, isClosed: false },
    "CASE-CLOSED": { evidenceCount: 1, conclusionCount: 1, isClosed: true },
  };

  const matrix = summarizeImportReviewOwnerStageMatrix({
    cases,
    processingStages: stages,
    baseFilters: {
      businessDate: "2026-05-11",
      status: "open",
      severity: "all",
      sourceResultType: "all",
      query: "late",
    },
  });

  assert.deepEqual(
    matrix.columns.map((column) => [column.key, column.label]),
    [
      ["missing_evidence", "缺证据"],
      ["missing_conclusion", "缺结论"],
      ["ready_to_close", "可关闭"],
      ["closed", "已关闭"],
      ["unknown", "阶段未知"],
    ]
  );
  assert.deepEqual(
    matrix.rows.map((row) => ({
      ownerId: row.ownerId,
      totalCount: row.totalCount,
      actionableCount: row.actionableCount,
      counts: Object.fromEntries(row.cells.map((cell) => [cell.key, cell.count])),
    })),
    [
      {
        ownerId: "OWNER-A",
        totalCount: 2,
        actionableCount: 2,
        counts: {
          missing_evidence: 1,
          missing_conclusion: 1,
          ready_to_close: 0,
          closed: 0,
          unknown: 0,
        },
      },
      {
        ownerId: "OWNER-B",
        totalCount: 2,
        actionableCount: 1,
        counts: {
          missing_evidence: 0,
          missing_conclusion: 0,
          ready_to_close: 1,
          closed: 1,
          unknown: 0,
        },
      },
      {
        ownerId: "OWNER-C",
        totalCount: 1,
        actionableCount: 1,
        counts: {
          missing_evidence: 0,
          missing_conclusion: 0,
          ready_to_close: 0,
          closed: 0,
          unknown: 1,
        },
      },
    ]
  );
  assert.equal(matrix.rows[0].cells[1].href, "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-A&processingStage=missing_conclusion&query=late");
  assert.equal(matrix.rows[1].cells[3].href, "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-B&processingStage=closed&query=late");
  assert.equal(matrix.rows[0].cells[2].href, null);
});

test("import center review case detail summarizes same-owner processing context", () => {
  const currentCase = {
    case_id: "CASE-CURRENT",
    source_result_type: "schedule_actual",
    source_result_id: 18,
    business_date: "2026-05-11",
    owner_id: "OWNER-A",
    severity: "high",
    status: "open",
    created_at: "2026-05-11T10:00:00+08:00",
  };
  const cases = [
    currentCase,
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
    {
      case_id: "CASE-OTHER-DAY",
      source_result_type: "schedule_actual",
      source_result_id: 22,
      business_date: "2026-05-12",
      owner_id: "OWNER-A",
      severity: "critical",
      status: "open",
      created_at: "2026-05-12T10:00:00+08:00",
    },
    {
      case_id: "CASE-OTHER-OWNER",
      source_result_type: "schedule_actual",
      source_result_id: 23,
      business_date: "2026-05-11",
      owner_id: "OWNER-B",
      severity: "critical",
      status: "open",
      created_at: "2026-05-11T10:00:00+08:00",
    },
  ];
  const processingStages = {
    "CASE-CURRENT": { evidenceCount: 1, conclusionCount: 0, isClosed: false },
    "CASE-MISSING-CONCLUSION": { evidenceCount: 1, conclusionCount: 0, isClosed: false },
    "CASE-MISSING-EVIDENCE": { evidenceCount: 0, conclusionCount: 0, isClosed: false },
    "CASE-READY-CLOSE": { evidenceCount: 1, conclusionCount: 1, isClosed: false },
  };

  const context = summarizeImportReviewOwnerContext({
    currentCase,
    cases,
    processingStages,
  });

  assert.deepEqual(
    {
      title: context.title,
      ownerId: context.ownerId,
      businessDate: context.businessDate,
      totalCount: context.totalCount,
      actionableCount: context.actionableCount,
      listHref: context.listHref,
      stageHref: context.stageHref,
      itemIds: context.items.map((item) => item.caseId),
      itemStages: context.items.map((item) => item.stageLabel),
      itemHref: context.items[0].detailHref,
    },
    {
      title: "同 Owner 待处理 3 个",
      ownerId: "OWNER-A",
      businessDate: "2026-05-11",
      totalCount: 3,
      actionableCount: 3,
      listHref: "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-A&status=open",
      stageHref: "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-A&processingStage=missing_evidence",
      itemIds: [
        "CASE-MISSING-EVIDENCE",
        "CASE-MISSING-CONCLUSION",
        "CASE-READY-CLOSE",
      ],
      itemStages: ["缺证据", "缺结论", "可关闭"],
      itemHref: "/data-quality/review-cases/CASE-MISSING-EVIDENCE",
    }
  );

  assert.deepEqual(
    summarizeImportReviewOwnerContext({
      currentCase: null,
      cases,
      processingStages,
    }),
    {
      tone: "blocked",
      title: "Owner 上下文不可用",
      detail: "当前案例读取失败，无法聚合同 owner 处理上下文。",
      ownerId: null,
      businessDate: null,
      totalCount: 0,
      actionableCount: 0,
      listHref: "/data-quality/review-cases",
      stageHref: "/data-quality/review-cases",
      items: [],
    }
  );
});

test("import center review case detail summarizes same-owner pending navigation", () => {
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
  const closedCurrentCase = {
    ...currentCase,
    case_id: "CASE-CLOSED",
    status: "closed",
    created_at: "2026-05-11T10:40:00+08:00",
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
    closedCurrentCase,
    {
      case_id: "CASE-OTHER-OWNER",
      source_result_type: "schedule_actual",
      source_result_id: 23,
      business_date: "2026-05-11",
      owner_id: "OWNER-B",
      severity: "critical",
      status: "open",
      created_at: "2026-05-11T10:00:00+08:00",
    },
  ];
  const processingStages = {
    "CASE-CURRENT": { evidenceCount: 1, conclusionCount: 0, isClosed: false },
    "CASE-MISSING-EVIDENCE": { evidenceCount: 0, conclusionCount: 0, isClosed: false },
    "CASE-READY-CLOSE": { evidenceCount: 1, conclusionCount: 1, isClosed: false },
    "CASE-CLOSED": { evidenceCount: 1, conclusionCount: 1, isClosed: true },
  };

  const navigation = summarizeImportReviewOwnerNavigation({
    currentCase,
    cases,
    processingStages,
  });

  assert.deepEqual(
    {
      title: navigation.title,
      positionLabel: navigation.positionLabel,
      totalActionableCount: navigation.totalActionableCount,
      listHref: navigation.listHref,
      previousCaseId: navigation.previous?.caseId ?? null,
      nextCaseId: navigation.next?.caseId ?? null,
      sequenceIds: navigation.sequence.map((item) => item.caseId),
    },
    {
      title: "同 Owner 待处理导航",
      positionLabel: "第 2 / 3 条",
      totalActionableCount: 3,
      listHref: "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-A&status=open",
      previousCaseId: "CASE-MISSING-EVIDENCE",
      nextCaseId: "CASE-READY-CLOSE",
      sequenceIds: [
        "CASE-MISSING-EVIDENCE",
        "CASE-CURRENT",
        "CASE-READY-CLOSE",
      ],
    }
  );
  assert.equal(navigation.previous?.href, "/data-quality/review-cases/CASE-MISSING-EVIDENCE");
  assert.equal(navigation.next?.href, "/data-quality/review-cases/CASE-READY-CLOSE");

  const closedNavigation = summarizeImportReviewOwnerNavigation({
    currentCase: closedCurrentCase,
    cases,
    processingStages,
  });

  assert.deepEqual(
    {
      positionLabel: closedNavigation.positionLabel,
      previousCaseId: closedNavigation.previous?.caseId ?? null,
      nextCaseId: closedNavigation.next?.caseId ?? null,
    },
    {
      positionLabel: "当前案例不在待处理序列",
      previousCaseId: null,
      nextCaseId: "CASE-MISSING-EVIDENCE",
    }
  );
});
