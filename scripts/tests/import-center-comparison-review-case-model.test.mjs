import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportComparisonRunReviewCases,
} = jiti("../../components/import-center-model.ts");

const FORECAST_SCHEDULE_DETAIL = {
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
  forecast_schedule_results: [
    {
      result_id: 12,
      run_id: "RUN-DB008-FS",
      forecast_version_id: "FC-20260511-V1",
      schedule_version_id: "SCH-20260511-V1",
      forecast_interval_id: "FC-INT-001",
      schedule_detail_id: "DETAIL-A-1001-20260511",
      business_date: "2026-05-11",
      workplace_id: "SH-01",
      project_id: "BOSCH-CS",
      skill_id: "L1-CN",
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 3,
      scheduled_agents: 1,
      gap_agents: 2,
      result_status: "gap",
    },
    {
      result_id: 13,
      run_id: "RUN-DB008-FS",
      forecast_version_id: "FC-20260511-V1",
      schedule_version_id: "SCH-20260511-V1",
      forecast_interval_id: "FC-INT-002",
      schedule_detail_id: "DETAIL-A-1002-20260511",
      business_date: "2026-05-11",
      workplace_id: "SH-01",
      project_id: "BOSCH-CS",
      skill_id: "L1-CN",
      interval_start: "10:00",
      interval_end: "10:30",
      forecast_agents: 5,
      scheduled_agents: 3,
      gap_agents: 2,
      result_status: "gap",
    },
  ],
  schedule_actual_results: [],
};

test("review case summary matches forecast_schedule case and rejects unrelated source", () => {
  assert.deepEqual(
    summarizeImportComparisonRunReviewCases({
      detail: FORECAST_SCHEDULE_DETAIL,
      reviewCases: [
        {
          case_id: "CASE-QUERY-001",
          source_result_type: "forecast_schedule",
          source_result_id: 12,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T10:10:00+08:00",
        },
        {
          case_id: "CASE-OTHER-001",
          source_result_type: "schedule_actual",
          source_result_id: 99,
          business_date: "2026-05-11",
          owner_id: "supervisor-02",
          severity: "medium",
          status: "open",
          created_at: "2026-05-11T11:00:00+08:00",
        },
      ],
      reviewError: null,
    }),
    {
      tone: "blocked",
      title: "关联复核案例 1 个",
      detail: "当前运行有 1 个结果已形成复核案例，其中 1 个仍未关闭。",
      nextAction: "先查看未关闭或高风险复核案例，再回看运行结果和证据。",
      totalCount: 1,
      openCount: 1,
      cases: [
        {
          caseId: "CASE-QUERY-001",
          resultLabel: "预测排班 #12",
          ownerLabel: "supervisor-01",
          severityLabel: "高",
          statusLabel: "未关闭",
          href: "/data-quality/review-cases/CASE-QUERY-001",
        },
      ],
    }
  );
});

test("review case summary returns empty state when no cases match", () => {
  assert.deepEqual(
    summarizeImportComparisonRunReviewCases({
      detail: FORECAST_SCHEDULE_DETAIL,
      reviewCases: [],
      reviewError: null,
    }),
    {
      tone: "empty",
      title: "暂无关联复核案例",
      detail: "当前运行结果尚未匹配到复核案例。",
      nextAction: "继续查看结果明细。",
      totalCount: 0,
      openCount: 0,
      cases: [],
    }
  );
});

test("review case summary returns blocked state on review read error", () => {
  assert.deepEqual(
    summarizeImportComparisonRunReviewCases({
      detail: FORECAST_SCHEDULE_DETAIL,
      reviewCases: [],
      reviewError: "连接超时",
    }),
    {
      tone: "blocked",
      title: "复核案例读取失败",
      detail: "连接超时",
      nextAction: "先恢复复核案例读取，再判断当前运行结果是否已进入复核。",
      totalCount: 0,
      openCount: 0,
      cases: [],
    }
  );
});

test("review case summary returns empty state when detail is null", () => {
  assert.deepEqual(
    summarizeImportComparisonRunReviewCases({
      detail: null,
      reviewCases: [],
      reviewError: null,
    }),
    {
      tone: "empty",
      title: "等待运行结果",
      detail: "还没有可匹配复核案例的对比运行结果。",
      nextAction: "先选择一个对比运行。",
      totalCount: 0,
      openCount: 0,
      cases: [],
    }
  );
});

test("review case summary sorts open cases before closed and higher severity first", () => {
  const summary = summarizeImportComparisonRunReviewCases({
    detail: FORECAST_SCHEDULE_DETAIL,
    reviewCases: [
      {
        case_id: "CASE-A",
        source_result_type: "forecast_schedule",
        source_result_id: 12,
        business_date: "2026-05-11",
        owner_id: "supervisor-01",
        severity: "low",
        status: "open",
        created_at: "2026-05-11T10:00:00+08:00",
      },
      {
        case_id: "CASE-B",
        source_result_type: "forecast_schedule",
        source_result_id: 13,
        business_date: "2026-05-11",
        owner_id: "supervisor-02",
        severity: "critical",
        status: "closed",
        created_at: "2026-05-11T10:05:00+08:00",
      },
      {
        case_id: "CASE-C",
        source_result_type: "forecast_schedule",
        source_result_id: 12,
        business_date: "2026-05-11",
        owner_id: "supervisor-01",
        severity: "high",
        status: "open",
        created_at: "2026-05-11T10:10:00+08:00",
      },
    ],
    reviewError: null,
  });

  assert.equal(summary.totalCount, 3);
  assert.equal(summary.openCount, 2);
  assert.equal(summary.tone, "blocked");

  const caseIds = summary.cases.map((c) => c.caseId);
  assert.deepEqual(caseIds, ["CASE-C", "CASE-A", "CASE-B"]);
});

test("review case summary returns ready tone when all cases are closed", () => {
  const summary = summarizeImportComparisonRunReviewCases({
    detail: FORECAST_SCHEDULE_DETAIL,
    reviewCases: [
      {
        case_id: "CASE-X",
        source_result_type: "forecast_schedule",
        source_result_id: 12,
        business_date: "2026-05-11",
        owner_id: "supervisor-01",
        severity: "high",
        status: "closed",
        created_at: "2026-05-11T10:00:00+08:00",
      },
      {
        case_id: "CASE-Y",
        source_result_type: "forecast_schedule",
        source_result_id: 13,
        business_date: "2026-05-11",
        owner_id: "supervisor-02",
        severity: "medium",
        status: "closed",
        created_at: "2026-05-11T10:05:00+08:00",
      },
    ],
    reviewError: null,
  });

  assert.equal(summary.tone, "ready");
  assert.equal(summary.totalCount, 2);
  assert.equal(summary.openCount, 0);
  assert.equal(
    summary.nextAction,
    "当前关联案例均已关闭，可继续回看结果明细和关闭证据。"
  );
});

test("review case summary matches schedule_actual results from sa comparison run", () => {
  const saDetail = {
    run: {
      run_id: "RUN-SA-001",
      comparison_type: "schedule_vs_actual",
      forecast_version_id: null,
      schedule_version_id: "SCH-20260511-V1",
      actual_import_version_id: "ACT-20260511-V1",
      business_date_from: "2026-05-11",
      business_date_to: "2026-05-11",
      status: "completed",
      total_results: 1,
      total_gap_agents: null,
      total_late_minutes: 30,
      created_at: "2026-05-11T12:00:00+08:00",
    },
    forecast_schedule_results: [],
    schedule_actual_results: [
      {
        result_id: 50,
        run_id: "RUN-SA-001",
        schedule_version_id: "SCH-20260511-V1",
        actual_import_version_id: "ACT-20260511-V1",
        schedule_detail_id: "DETAIL-B-2001-20260511",
        actual_log_id: "LOG-001",
        business_date: "2026-05-11",
        employee_id: "EMP-001",
        interval_start: "09:00",
        interval_end: "09:30",
        scheduled_minutes: 30,
        actual_productive_minutes: 25,
        late_minutes: 5,
        result_status: "late",
      },
    ],
  };

  const summary = summarizeImportComparisonRunReviewCases({
    detail: saDetail,
    reviewCases: [
      {
        case_id: "CASE-SA-001",
        source_result_type: "schedule_actual",
        source_result_id: 50,
        business_date: "2026-05-11",
        owner_id: "supervisor-03",
        severity: "medium",
        status: "open",
        created_at: "2026-05-11T13:00:00+08:00",
      },
      {
        case_id: "CASE-FS-001",
        source_result_type: "forecast_schedule",
        source_result_id: 50,
        business_date: "2026-05-11",
        owner_id: "supervisor-04",
        severity: "high",
        status: "open",
        created_at: "2026-05-11T13:05:00+08:00",
      },
    ],
    reviewError: null,
  });

  assert.equal(summary.totalCount, 1);
  assert.equal(summary.openCount, 1);
  assert.equal(summary.tone, "warning");
  assert.equal(summary.cases[0].caseId, "CASE-SA-001");
  assert.equal(summary.cases[0].resultLabel, "排班实际 #50");
});

test("review case summary rejects result_id mismatch", () => {
  const summary = summarizeImportComparisonRunReviewCases({
    detail: FORECAST_SCHEDULE_DETAIL,
    reviewCases: [
      {
        case_id: "CASE-MISMATCH",
        source_result_type: "forecast_schedule",
        source_result_id: 999,
        business_date: "2026-05-11",
        owner_id: "supervisor-01",
        severity: "high",
        status: "open",
        created_at: "2026-05-11T10:00:00+08:00",
      },
    ],
    reviewError: null,
  });

  assert.equal(summary.tone, "empty");
  assert.equal(summary.totalCount, 0);
  assert.equal(summary.cases.length, 0);
});
