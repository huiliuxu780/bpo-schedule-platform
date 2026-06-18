import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportQualityIssueReviewCasesHref,
  buildImportReviewCasesWorkspaceHref,
  summarizeImportReviewCaseProcessingStage,
  filterImportReviewCases,
} = jiti("../../components/import-center-model.ts");

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
