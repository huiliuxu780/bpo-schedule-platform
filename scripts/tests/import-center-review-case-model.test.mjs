import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportQualityIssueReviewCasesHref,
  buildImportReviewCaseDetailApiUrl,
  buildImportReviewCaseDetailWorkspaceHref,
  buildImportReviewCaseClosureWriteApiUrl,
  buildImportReviewConclusionWriteApiUrl,
  buildImportReviewEvidenceWriteApiUrl,
  buildImportReviewCasesWorkspaceHref,
  buildImportComparisonRunDetailWorkspaceHref,
  buildImportComparisonRunDetailApiUrl,
  summarizeImportReviewConclusionPreview,
  summarizeImportReviewCaseDetail,
  summarizeImportReviewCaseEvidenceChain,
  summarizeImportReviewCaseActionDeck,
  summarizeImportReviewCaseActionFeedback,
  summarizeImportReviewCaseActionContinuation,
  summarizeImportReviewCaseActionRetry,
  summarizeImportReviewCaseProcessingTimeline,
  summarizeImportReviewCaseProcessingStage,
  summarizeImportReviewCaseClosureAction,
  summarizeImportReviewCaseConclusionAction,
  summarizeImportReviewCaseEvidenceAction,
  summarizeImportReviewEvidenceGapDrilldown,
  summarizeImportReviewCasesWorkspace,
  summarizeImportReviewOwnerStageMatrix,
  summarizeImportReviewOwnerContext,
  summarizeImportReviewOwnerNavigation,
  summarizeImportReviewOwnerFirstPendingEntries,
  buildImportReviewCaseClosureWritePayload,
  buildImportReviewConclusionWritePayload,
  buildImportReviewEvidenceWritePayload,
  filterImportReviewCases,
} = jiti("../../components/import-center-model.ts");

test("import center review conclusion preview summarizes open review cases and evidence", () => {
  assert.deepEqual(
    summarizeImportReviewConclusionPreview({
      businessDate: "2026-05-11",
      comparisonRuns: [
        {
          run_id: "RUN-001",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-001",
          actual_import_version_id: "ACT-001",
          business_date_from: "2026-05-11",
          business_date_to: "2026-05-11",
          status: "completed",
          total_results: 18,
          total_gap_agents: null,
          total_late_minutes: 45,
          created_at: "2026-05-11T10:00:00+08:00",
        },
      ],
      reviewCases: [
        {
          case_id: "CASE-001",
          source_result_type: "schedule_actual",
          source_result_id: 10,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T11:00:00+08:00",
        },
        {
          case_id: "CASE-002",
          source_result_type: "schedule_actual",
          source_result_id: 11,
          business_date: "2026-05-11",
          owner_id: "supervisor-02",
          severity: "medium",
          status: "closed",
          created_at: "2026-05-11T12:00:00+08:00",
        },
      ],
      qualityImpact: {
        tone: "blocked",
        title: "质量问题正在影响下游判断",
        detail: "当前批次有 3 行质量问题。",
        downstreamLabel: "复核案例 2 个 · 未关闭 1 个 · 对比结果 18 条",
        topIssueLabel: "employee_id · REQUIRED_FIELD_MISSING",
        nextAction: "先处理质量问题行数最多的问题组，再回看未关闭复核案例和对比结果。",
        groups: [
          {
            key: "employee_id::REQUIRED_FIELD_MISSING",
            title: "employee_id · REQUIRED_FIELD_MISSING",
            rowCount: 3,
            failedRows: 2,
            warningRows: 1,
            affectedReviewCases: 2,
            openReviewCases: 1,
            comparisonResults: 18,
            impactLabel: "3 行问题 · 2 个复核案例 · 18 条对比结果",
            evidence: ["行 2 失败", "source_key A2"],
            nextAction: "先修正 employee_id 的 REQUIRED_FIELD_MISSING，再回看未关闭复核案例。",
          },
        ],
      },
      comparisonError: null,
      reviewError: null,
    }),
    {
      tone: "blocked",
      title: "建议暂缓关闭复核",
      suggestedConclusion: "当前有 1 个未关闭复核案例，且首要质量问题为 employee_id · REQUIRED_FIELD_MISSING；建议先补齐证据后再关闭。",
      evidenceSummary: "复核 CASE-001 · high · supervisor-01；对比 RUN-001 · 排班 vs 实际 · 18 条结果；质量 employee_id · REQUIRED_FIELD_MISSING",
      residualRisk: "仍有 1 个未关闭复核案例和 3 行质量问题；直接关闭会留下证据缺口。",
      nextAction: "先处理首要质量问题和未关闭复核案例，确认补证后再进入关闭流程。",
      evidence: [
        "业务日 2026-05-11",
        "复核案例 2 个",
        "未关闭 1 个",
        "对比结果 18 条",
      ],
    },
  );
});

test("import center review conclusion preview handles empty and read-error states", () => {
  assert.deepEqual(
    summarizeImportReviewConclusionPreview({
      businessDate: null,
      comparisonRuns: [],
      reviewCases: [],
      qualityImpact: {
        tone: "empty",
        title: "等待批次明细",
        detail: "还没有可聚合的行级质量结果。",
        downstreamLabel: "复核案例 0 个 · 未关闭 0 个 · 对比结果 0 条",
        topIssueLabel: "暂无质量问题",
        nextAction: "先确认批次明细是否读取成功，再查看质量影响聚合。",
        groups: [],
      },
      comparisonError: null,
      reviewError: "复核 API 返回 500",
    }),
    {
      tone: "blocked",
      title: "无法生成结论预览",
      suggestedConclusion: "复核案例读取失败，当前结论预览只能作为占位，不能用于关闭判断。",
      evidenceSummary: "复核案例读取失败；对比结果 0 条；质量 暂无质量问题",
      residualRisk: "下游结果读取不完整，可能漏掉未关闭异常或证据缺口。",
      nextAction: "先恢复下游结果读取，再生成复核结论预览。",
      evidence: [
        "业务日 未选择",
        "复核读取失败",
        "复核案例 0 个",
        "对比结果 0 条",
      ],
    },
  );
});

test("import center review evidence gap drilldown ranks open cases with quality context", () => {
  assert.deepEqual(
    summarizeImportReviewEvidenceGapDrilldown({
      businessDate: "2026-05-11",
      comparisonRuns: [
        {
          run_id: "RUN-001",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-001",
          actual_import_version_id: "ACT-001",
          business_date_from: "2026-05-11",
          business_date_to: "2026-05-11",
          status: "completed",
          total_results: 18,
          total_gap_agents: null,
          total_late_minutes: 45,
          created_at: "2026-05-11T10:00:00+08:00",
        },
      ],
      reviewCases: [
        {
          case_id: "CASE-LOW",
          source_result_type: "schedule_actual",
          source_result_id: 11,
          business_date: "2026-05-11",
          owner_id: "supervisor-02",
          severity: "medium",
          status: "open",
          created_at: "2026-05-11T12:00:00+08:00",
        },
        {
          case_id: "CASE-HIGH",
          source_result_type: "schedule_actual",
          source_result_id: 10,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T11:00:00+08:00",
        },
        {
          case_id: "CASE-CLOSED",
          source_result_type: "schedule_actual",
          source_result_id: 12,
          business_date: "2026-05-11",
          owner_id: "supervisor-03",
          severity: "low",
          status: "closed",
          created_at: "2026-05-11T13:00:00+08:00",
        },
      ],
      qualityImpact: {
        tone: "blocked",
        title: "质量问题正在影响下游判断",
        detail: "当前批次有 3 行质量问题。",
        downstreamLabel: "复核案例 3 个 · 未关闭 2 个 · 对比结果 18 条",
        topIssueLabel: "employee_id · REQUIRED_FIELD_MISSING",
        nextAction: "先处理质量问题行数最多的问题组，再回看未关闭复核案例和对比结果。",
        groups: [
          {
            key: "employee_id::REQUIRED_FIELD_MISSING",
            title: "employee_id · REQUIRED_FIELD_MISSING",
            rowCount: 3,
            failedRows: 2,
            warningRows: 1,
            affectedReviewCases: 3,
            openReviewCases: 2,
            comparisonResults: 18,
            impactLabel: "3 行问题 · 3 个复核案例 · 18 条对比结果",
            evidence: ["行 2 失败", "source_key A2"],
            nextAction: "先修正 employee_id 的 REQUIRED_FIELD_MISSING，再回看未关闭复核案例。",
          },
        ],
      },
      comparisonError: null,
      reviewError: null,
    }),
    {
      tone: "blocked",
      title: "证据缺口需要先处理",
      summary: "当前 2 个未关闭复核案例需要补齐证据；首要缺口为 CASE-HIGH，关联 employee_id · REQUIRED_FIELD_MISSING。",
      ownerSummary: "owner supervisor-01、supervisor-02",
      nextAction: "先按高风险缺口补齐证据，再回看复核结论预览。",
      gaps: [
        {
          key: "CASE-HIGH",
          title: "CASE-HIGH · high",
          ownerId: "supervisor-01",
          riskTone: "blocked",
          evidenceNeed: "补充登录/状态明细、排班版本引用和质量修正记录。",
          relatedQualityIssue: "employee_id · REQUIRED_FIELD_MISSING",
          relatedComparison: "RUN-001 · 排班 vs 实际 · 18 条结果",
          riskLabel: "高风险 · 质量问题 3 行 · 对比结果 18 条",
          nextAction: "owner supervisor-01 先补齐 CASE-HIGH 的关键证据，再进入关闭前复核。",
          evidence: ["业务日 2026-05-11", "来源 schedule_actual#10", "状态 open"],
        },
        {
          key: "CASE-LOW",
          title: "CASE-LOW · medium",
          ownerId: "supervisor-02",
          riskTone: "warning",
          evidenceNeed: "补充登录/状态明细、排班版本引用和质量修正记录。",
          relatedQualityIssue: "employee_id · REQUIRED_FIELD_MISSING",
          relatedComparison: "RUN-001 · 排班 vs 实际 · 18 条结果",
          riskLabel: "中风险 · 质量问题 3 行 · 对比结果 18 条",
          nextAction: "owner supervisor-02 先补齐 CASE-LOW 的关键证据，再进入关闭前复核。",
          evidence: ["业务日 2026-05-11", "来源 schedule_actual#11", "状态 open"],
        },
      ],
    },
  );
});

test("import center review evidence gap drilldown handles empty and read-error states", () => {
  assert.deepEqual(
    summarizeImportReviewEvidenceGapDrilldown({
      businessDate: null,
      comparisonRuns: [],
      reviewCases: [],
      qualityImpact: {
        tone: "empty",
        title: "等待批次明细",
        detail: "还没有可聚合的行级质量结果。",
        downstreamLabel: "复核案例 0 个 · 未关闭 0 个 · 对比结果 0 条",
        topIssueLabel: "暂无质量问题",
        nextAction: "先确认批次明细是否读取成功，再查看质量影响聚合。",
        groups: [],
      },
      comparisonError: null,
      reviewError: "复核 API 返回 500",
    }),
    {
      tone: "blocked",
      title: "无法判断证据缺口",
      summary: "复核案例读取失败，当前缺口列表只能作为占位。",
      ownerSummary: "owner 不可用",
      nextAction: "先恢复复核案例读取，再判断证据缺口。",
      gaps: [],
    },
  );

  assert.deepEqual(
    summarizeImportReviewEvidenceGapDrilldown({
      businessDate: "2026-05-11",
      comparisonRuns: [],
      reviewCases: [],
      qualityImpact: {
        tone: "ready",
        title: "暂无行级质量问题",
        detail: "当前批次没有失败行或警告行。",
        downstreamLabel: "复核案例 0 个 · 未关闭 0 个 · 对比结果 0 条",
        topIssueLabel: "暂无质量问题",
        nextAction: "继续查看下游结果判断。",
        groups: [],
      },
      comparisonError: null,
      reviewError: null,
    }),
    {
      tone: "empty",
      title: "暂无证据缺口",
      summary: "当前业务日没有未关闭复核案例，未形成证据缺口列表。",
      ownerSummary: "owner 无",
      nextAction: "继续查看对比结果和复核结论预览。",
      gaps: [],
    },
  );
});

test("import center review cases workspace builds page href and filters cases", () => {
  assert.equal(
    buildImportQualityIssueReviewCasesHref({
      businessDate: "2026-05-11",
      sourceResultType: "schedule_actual",
      issueTitle: "employee_id · REQUIRED_FIELD_MISSING",
    }),
    "/data-quality/review-cases?businessDate=2026-05-11&status=open&sourceResultType=schedule_actual&query=employee_id+%C2%B7+REQUIRED_FIELD_MISSING"
  );

  assert.equal(
    buildImportReviewCasesWorkspaceHref({
      businessDate: "2026-05-11",
      ownerId: "OWNER-A",
      status: "open",
      severity: "high",
      sourceResultType: "schedule_actual",
      query: "late",
    }),
    "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-A&status=open&severity=high&sourceResultType=schedule_actual&query=late"
  );

  const cases = [
    {
      case_id: "CASE-LATE-001",
      source_result_type: "schedule_actual",
      source_result_id: 18,
      business_date: "2026-05-11",
      owner_id: "OWNER-A",
      severity: "high",
      status: "open",
      created_at: "2026-05-11T10:00:00+08:00",
    },
    {
      case_id: "CASE-CLOSED-001",
      source_result_type: "forecast_schedule",
      source_result_id: 8,
      business_date: "2026-05-11",
      owner_id: "OWNER-B",
      severity: "low",
      status: "closed",
      created_at: "2026-05-11T11:00:00+08:00",
    },
  ];

  assert.deepEqual(
    filterImportReviewCases(cases, {
      businessDate: "2026-05-11",
      ownerId: "OWNER-A",
      status: "open",
      severity: "high",
      sourceResultType: "schedule_actual",
      query: "late",
    }),
    [cases[0]]
  );

  assert.deepEqual(
    filterImportReviewCases(cases, {
      businessDate: "2026-05-11",
      status: "open",
      sourceResultType: "schedule_actual",
      query: "employee_id · REQUIRED_FIELD_MISSING",
    }),
    [cases[0]]
  );
});

test("import center review cases workspace filters by processing stage", () => {
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

  assert.deepEqual(
    summarizeImportReviewCaseProcessingStage(cases[0], stages[cases[0].case_id]),
    {
      key: "missing_evidence",
      label: "缺证据",
      nextAction: "先补充证据，再补充复核结论。",
      evidenceLabel: "证据 0 条 · 结论 0 条",
    }
  );

  assert.deepEqual(
    filterImportReviewCases(cases, {
      processingStage: "ready_to_close",
      status: "all",
    }, stages).map((item) => item.case_id),
    ["CASE-READY-CLOSE"]
  );

  assert.deepEqual(
    filterImportReviewCases(cases, {
      processingStage: "unknown",
      status: "all",
    }, stages).map((item) => item.case_id),
    ["CASE-UNKNOWN"]
  );

  assert.equal(
    buildImportReviewCasesWorkspaceHref({ processingStage: "missing_conclusion" }),
    "/data-quality/review-cases?processingStage=missing_conclusion"
  );
});

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
