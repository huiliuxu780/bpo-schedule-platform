import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  fallbackDataQualityIssues,
  summarizeDataQualityDayViewOrder,
  summarizeDataQualityFieldImpactSummary,
  summarizeDataQualityGapOwnerSourcePressure,
  summarizeDataQualityNextReviewRecommendation,
  summarizeDataQualityReviewImportBatchImpact,
  filterDataQualityIssues,
  getDataQualityIssue,
  summarizeDataQualityExceptionCauses,
  summarizeDataQualityExceptionImpact,
  summarizeDataQualityPersonViewOrder,
  summarizeDataQualityReviewCoverageGap,
  summarizeDataQualityReviewPathSequence,
  summarizeDataQualityReviewPriorityRationale,
  summarizeDataQualityExceptionTop,
  summarizeDataQualityImportBatchImpact,
  summarizeDataQualityIssues,
} from "../../lib/data-quality.ts";
import {
  fallbackImportBatches,
  mapImportBatchResult,
} from "../../lib/import-batch-history.ts";

test("data quality summary counts local issue coverage", () => {
  const summary = summarizeDataQualityIssues(fallbackDataQualityIssues);

  assert.equal(summary.total, 10);
  assert.equal(summary.open, 6);
  assert.equal(summary.highSeverity, 3);
  assert.equal(summary.blockedRows, 221);
  assert.deepEqual(summary.sourceCounts.master_data, 4);
  assert.deepEqual(summary.sourceCounts.personnel_schedule, 3);
});

test("data quality filters support source, status, severity, and query", () => {
  const rows = filterDataQualityIssues(fallbackDataQualityIssues, {
    source: "status_log",
    status: "open",
    severity: "high",
    query: "重叠",
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].code, "status_overlap");
});

test("data quality issue lookup exposes recommendation and deferred actions", () => {
  const row = getDataQualityIssue("DQ-202605-004");
  const summary = summarizeDataQualityIssues(fallbackDataQualityIssues);

  assert.equal(row?.entity, "agent_binding");
  assert.equal(row?.fieldName, "employee_id");
  assert.equal(row?.sourceTemplateId, "TPL-MASTER-DATA");
  assert.equal(row?.sourceField, "agent_binding.employee_id");
  assert.equal(row?.originalValue, "A-9931");
  assert.equal(row?.errorCode, "unknown_foreign_key");
  assert.ok(row?.affectedObjects.some((object) => object.type === "人员排班"));
  assert.ok(
    row?.impactLinks.some(
      (link) => link.target === "/master-data-relations#employee-A-9931"
    )
  );
  assert.equal(row?.recommendation.includes("补齐"), true);
  assert.equal(summary.deferredActions.includes("无真实数据修复"), true);
});

test("data quality issue detail exposes business impact chain", () => {
  const row = getDataQualityIssue("DQ-202605-010");

  assert.ok(row);
  assert.equal(row.sourceTemplateId, "TPL-STATUS-LOG");
  assert.equal(row.affectedObjects[0].objectId, "A-1002");
  assert.ok(row.impactLinks.some((link) => link.type === "status_log"));
  assert.ok(row.impactLinks.some((link) => link.label.includes("个人履约")));
});

test("data quality import batch impact summarizes linked fallback batches", () => {
  const issue = getDataQualityIssue("DQ-202605-004");
  assert.ok(issue);

  const summary = summarizeDataQualityImportBatchImpact(issue, fallbackImportBatches);

  assert.equal(summary.totalBatchCount, 1);
  assert.equal(summary.totalFailedRows, 19);
  assert.ok(summary.matchedFields.includes("employee_id"));
  assert.ok(summary.affectedObjects.includes("人员排班"));
  assert.equal(summary.items[0].batchId, "BATCH-20260519-001");
  assert.equal(summary.items[0].href, "/import-batches/BATCH-20260519-001");
  assert.ok(summary.items[0].reviewHint.includes("员工"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality import batch impact matches direct failure rows", () => {
  const issue = getDataQualityIssue("DQ-202605-010");
  assert.ok(issue);
  const batch = mapImportBatchResult({
    batch_id: "BATCH-SL-20260526-101",
    entity: "status_log",
    file_name: "status_log_overlap.csv",
    uploaded_by: "现场主管",
    uploaded_at: "2026-05-26T23:00:00+08:00",
    status: "completed_with_errors",
    total_rows: 2,
    success_rows: 1,
    failed_rows: 1,
    warning_rows: 0,
    error_codes: ["status_overlap"],
    failure_rows: [
      {
        batch_id: "BATCH-SL-20260526-101",
        entity: "status_log",
        failed_row_number: 2,
        field_name: "status_start_at",
        error_code: "status_overlap",
        error_message: "状态时间段重叠",
        raw_value: "11:00-11:30",
      },
    ],
  });

  const summary = summarizeDataQualityImportBatchImpact(issue, [batch]);

  assert.equal(summary.totalBatchCount, 1);
  assert.equal(summary.totalFailedRows, 1);
  assert.ok(summary.matchedFields.includes("status_start_at"));
  assert.ok(summary.affectedObjects.includes("状态日志"));
  assert.ok(summary.items[0].reviewHint.includes("失败行"));
});

test("data quality import batch impact exposes empty state", () => {
  const issue = getDataQualityIssue("DQ-202605-009");
  assert.ok(issue);

  const summary = summarizeDataQualityImportBatchImpact(issue, []);

  assert.equal(summary.totalBatchCount, 0);
  assert.equal(summary.totalFailedRows, 0);
  assert.deepEqual(summary.matchedFields, []);
  assert.deepEqual(summary.affectedObjects, []);
  assert.deepEqual(summary.items, []);
});

test("data quality exception top summarizes impacted anomalies", () => {
  const summary = summarizeDataQualityExceptionTop(fallbackDataQualityIssues);

  assert.equal(summary.totalIssueCount, 2);
  assert.equal(summary.totalImpactedExceptionCount, 2);
  assert.equal(summary.totalImpactedPeopleCount, 2);
  assert.equal(summary.topIssue?.issueId, "DQ-202605-010");
  assert.equal(summary.topIssue?.href, "/data-quality/DQ-202605-010");
  assert.equal(summary.topIssue?.impactedExceptionCount, 1);
  assert.ok(summary.topIssue?.impactedPeople.includes("A-1002"));
  assert.ok(summary.topIssue?.affectedObjects.includes("小组成员矩阵异常"));
  assert.ok(summary.topIssue?.nextViewHint.includes("个人履约"));
  assert.ok(summary.items.some((item) => item.issueId === "DQ-202605-004"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality exception top exposes empty state", () => {
  const summary = summarizeDataQualityExceptionTop([]);

  assert.equal(summary.totalIssueCount, 0);
  assert.equal(summary.totalImpactedExceptionCount, 0);
  assert.equal(summary.totalImpactedPeopleCount, 0);
  assert.equal(summary.topIssue, undefined);
  assert.deepEqual(summary.items, []);
});

test("data quality issue exception impact summarizes one issue", () => {
  const issue = getDataQualityIssue("DQ-202605-010");
  assert.ok(issue);

  const summary = summarizeDataQualityExceptionImpact(issue);

  assert.equal(summary.impactedExceptionCount, 1);
  assert.equal(summary.impactedPeopleCount, 1);
  assert.ok(summary.impactedPeople.includes("A-1002"));
  assert.equal(summary.primaryException?.label, "小组成员矩阵异常");
  assert.equal(summary.primaryException?.objectId, "late_login");
  assert.ok(summary.affectedObjects.includes("A-1002 2026-05-11 状态轨道"));
  assert.ok(summary.nextViewHint.includes("个人履约"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality issue exception impact exposes no-impact state", () => {
  const issue = getDataQualityIssue("DQ-202605-009");
  assert.ok(issue);

  const summary = summarizeDataQualityExceptionImpact(issue);

  assert.equal(summary.impactedExceptionCount, 0);
  assert.equal(summary.impactedPeopleCount, 0);
  assert.equal(summary.primaryException, undefined);
  assert.deepEqual(summary.items, []);
});

test("data quality exception causes summarize impacted reasons", () => {
  const summary = summarizeDataQualityExceptionCauses(fallbackDataQualityIssues);

  assert.equal(summary.totalCauseCount, 2);
  assert.equal(summary.totalImpactedExceptionCount, 2);
  assert.equal(summary.totalImpactedPeopleCount, 2);
  assert.equal(summary.topCause?.errorCode, "status_overlap");
  assert.equal(summary.topCause?.source, "status_log");
  assert.equal(summary.topCause?.sourceField, "status_log.status_start_at/status_end_at");
  assert.equal(summary.topCause?.impactedExceptionCount, 1);
  assert.ok(summary.topCause?.impactedPeople.includes("A-1002"));
  assert.equal(summary.topCause?.representativeIssueId, "DQ-202605-010");
  assert.equal(summary.topCause?.href, "/data-quality/DQ-202605-010");
  assert.ok(summary.topCause?.nextViewHint.includes("个人履约"));
  assert.ok(summary.items.some((item) => item.errorCode === "unknown_foreign_key"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality exception causes expose empty state", () => {
  const summary = summarizeDataQualityExceptionCauses([]);

  assert.equal(summary.totalCauseCount, 0);
  assert.equal(summary.totalImpactedExceptionCount, 0);
  assert.equal(summary.totalImpactedPeopleCount, 0);
  assert.equal(summary.topCause, undefined);
  assert.deepEqual(summary.items, []);
});

test("data quality person view order summarizes impacted people", () => {
  const summary = summarizeDataQualityPersonViewOrder(fallbackDataQualityIssues);

  assert.equal(summary.totalPersonCount, 2);
  assert.equal(summary.totalImpactedExceptionCount, 2);
  assert.equal(summary.topPerson?.employeeId, "A-1002");
  assert.equal(summary.topPerson?.representativeCause, "status_overlap");
  assert.equal(summary.topPerson?.representativeIssueId, "DQ-202605-010");
  assert.equal(summary.topPerson?.href, "/person-timeline/A-1002?date=2026-05-11");
  assert.equal(summary.topPerson?.impactedExceptionCount, 1);
  assert.equal(summary.topPerson?.causeCount, 1);
  assert.ok(summary.topPerson?.nextViewHint.includes("个人履约"));
  assert.ok(summary.items.some((item) => item.employeeId === "A-9931"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality person view order exposes empty state", () => {
  const summary = summarizeDataQualityPersonViewOrder([]);

  assert.equal(summary.totalPersonCount, 0);
  assert.equal(summary.totalImpactedExceptionCount, 0);
  assert.equal(summary.topPerson, undefined);
  assert.deepEqual(summary.items, []);
});

test("data quality day view order summarizes impacted fulfillment dates", () => {
  const summary = summarizeDataQualityDayViewOrder(fallbackDataQualityIssues);

  assert.equal(summary.totalDateCount, 1);
  assert.equal(summary.totalImpactedExceptionCount, 2);
  assert.equal(summary.totalImpactedPeopleCount, 2);
  assert.equal(summary.topDate?.businessDate, "2026-05-11");
  assert.equal(summary.topDate?.representativeCause, "status_overlap");
  assert.equal(summary.topDate?.representativeIssueId, "DQ-202605-010");
  assert.equal(summary.topDate?.href, "/person-timeline/A-1002?date=2026-05-11");
  assert.equal(summary.topDate?.impactedExceptionCount, 2);
  assert.equal(summary.topDate?.impactedPeopleCount, 2);
  assert.ok(summary.topDate?.nextViewHint.includes("个人履约"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality day view order exposes empty state", () => {
  const summary = summarizeDataQualityDayViewOrder([]);

  assert.equal(summary.totalDateCount, 0);
  assert.equal(summary.totalImpactedExceptionCount, 0);
  assert.equal(summary.totalImpactedPeopleCount, 0);
  assert.equal(summary.topDate, undefined);
  assert.deepEqual(summary.items, []);
});

test("data quality field impact summary cross-summarizes impacted fields", () => {
  const summary = summarizeDataQualityFieldImpactSummary(fallbackDataQualityIssues);

  assert.equal(summary.totalFieldCount, 2);
  assert.equal(summary.totalImpactedExceptionCount, 2);
  assert.equal(summary.totalAffectedDateCount, 1);
  assert.equal(summary.totalAffectedPeopleCount, 2);
  assert.equal(summary.topField?.sourceField, "status_log.status_start_at/status_end_at");
  assert.equal(summary.topField?.source, "status_log");
  assert.equal(summary.topField?.representativeCause, "status_overlap");
  assert.equal(summary.topField?.representativeIssueId, "DQ-202605-010");
  assert.equal(summary.topField?.href, "/data-quality/DQ-202605-010");
  assert.equal(summary.topField?.affectedDateCount, 1);
  assert.equal(summary.topField?.affectedPeopleCount, 1);
  assert.ok(summary.items.some((item) => item.sourceField === "agent_binding.employee_id"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality field impact summary exposes empty state", () => {
  const summary = summarizeDataQualityFieldImpactSummary([]);

  assert.equal(summary.totalFieldCount, 0);
  assert.equal(summary.totalImpactedExceptionCount, 0);
  assert.equal(summary.totalAffectedDateCount, 0);
  assert.equal(summary.totalAffectedPeopleCount, 0);
  assert.equal(summary.topField, undefined);
  assert.deepEqual(summary.items, []);
});

test("data quality review priority rationale explains first review target", () => {
  const summary = summarizeDataQualityReviewPriorityRationale(fallbackDataQualityIssues);

  assert.equal(summary.headline, "先复核 DQ-202605-010 / 状态时间段重叠");
  assert.equal(summary.priorityIssueId, "DQ-202605-010");
  assert.equal(summary.priorityCause, "status_overlap");
  assert.equal(summary.priorityField, "status_log.status_start_at/status_end_at");
  assert.equal(summary.priorityDate, "2026-05-11");
  assert.equal(summary.priorityPerson, "A-1002");
  assert.equal(summary.href, "/data-quality/DQ-202605-010");
  assert.equal(summary.impactedExceptionCount, 1);
  assert.equal(summary.impactedPeopleCount, 1);
  assert.ok(summary.reasons.some((reason) => reason.includes("字段")));
  assert.ok(summary.reasons.some((reason) => reason.includes("日期")));
  assert.ok(summary.reasons.some((reason) => reason.includes("人员")));
  assert.ok(summary.nextViewHint.includes("查看问题"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality review priority rationale exposes empty state", () => {
  const summary = summarizeDataQualityReviewPriorityRationale([]);

  assert.equal(summary.headline, "暂无需要优先复核的数据质量问题");
  assert.equal(summary.priorityIssueId, undefined);
  assert.deepEqual(summary.reasons, []);
});

test("data quality review path sequence orders first review steps", () => {
  const summary = summarizeDataQualityReviewPathSequence(fallbackDataQualityIssues);

  assert.equal(summary.headline, "先看 DQ-202605-010，再按字段、日期、人员和原因展开");
  assert.equal(summary.stepCount, 5);
  assert.equal(summary.firstStep?.type, "issue");
  assert.equal(summary.firstStep?.title, "DQ-202605-010 / 状态时间段重叠");
  assert.equal(summary.firstStep?.href, "/data-quality/DQ-202605-010");
  assert.deepEqual(summary.steps.map((step) => step.type), [
    "issue",
    "field",
    "date",
    "person",
    "cause",
  ]);
  assert.ok(summary.steps.some((step) => step.title.includes("status_log.status_start_at/status_end_at")));
  assert.ok(summary.steps.some((step) => step.title.includes("2026-05-11")));
  assert.ok(summary.steps.some((step) => step.title.includes("A-1002")));
  assert.ok(summary.steps.some((step) => step.title.includes("status_overlap")));
  assert.ok(summary.nextViewHint.includes("路径步骤"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality review path sequence exposes empty state", () => {
  const summary = summarizeDataQualityReviewPathSequence([]);

  assert.equal(summary.headline, "暂无可排序的数据质量复核路径");
  assert.equal(summary.stepCount, 0);
  assert.equal(summary.firstStep, undefined);
  assert.deepEqual(summary.steps, []);
});

test("data quality review coverage gap summarizes uncovered impacted issues", () => {
  const summary = summarizeDataQualityReviewCoverageGap(fallbackDataQualityIssues);

  assert.equal(summary.headline, "还有 1 个影响异常的数据质量问题未进入当前复核路径");
  assert.equal(summary.totalImpactedIssueCount, 2);
  assert.equal(summary.coveredIssueCount, 1);
  assert.equal(summary.gapIssueCount, 1);
  assert.equal(summary.firstGap?.issueId, "DQ-202605-004");
  assert.equal(summary.firstGap?.title, "人员绑定缺失");
  assert.equal(summary.firstGap?.href, "/data-quality/DQ-202605-004");
  assert.ok(summary.gapFields.includes("agent_binding.employee_id"));
  assert.ok(summary.gapPeople.includes("A-9931"));
  assert.ok(summary.nextViewHint.includes("缺口问题"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality review coverage gap exposes all-covered empty state", () => {
  const summary = summarizeDataQualityReviewCoverageGap([]);

  assert.equal(summary.headline, "当前复核路径已覆盖全部影响异常的数据质量问题");
  assert.equal(summary.totalImpactedIssueCount, 0);
  assert.equal(summary.coveredIssueCount, 0);
  assert.equal(summary.gapIssueCount, 0);
  assert.equal(summary.firstGap, undefined);
  assert.deepEqual(summary.items, []);
});

test("data quality gap owner source pressure summarizes uncovered review gaps", () => {
  const summary = summarizeDataQualityGapOwnerSourcePressure(fallbackDataQualityIssues);

  assert.equal(summary.gapIssueCount, 1);
  assert.equal(summary.impactedExceptionCount, 1);
  assert.equal(summary.impactedPeopleCount, 1);
  assert.equal(summary.topOwner, "数据管理员");
  assert.equal(summary.topSource, "master_data");
  assert.equal(summary.topItem?.representativeIssueId, "DQ-202605-004");
  assert.ok(summary.topItem?.sourceFields.includes("agent_binding.employee_id"));
  assert.ok(summary.topItem?.impactedPeople.includes("A-9931"));
  assert.ok(summary.topItem?.href.includes("DQ-202605-004"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality gap owner source pressure exposes empty state", () => {
  const summary = summarizeDataQualityGapOwnerSourcePressure([]);

  assert.equal(summary.headline, "当前复核路径已覆盖影响异常的数据质量问题");
  assert.equal(summary.gapIssueCount, 0);
  assert.equal(summary.impactedExceptionCount, 0);
  assert.equal(summary.impactedPeopleCount, 0);
  assert.equal(summary.topOwner, undefined);
  assert.equal(summary.topSource, undefined);
  assert.deepEqual(summary.items, []);
});

test("data quality next review recommendation summarizes the next read-only steps", () => {
  const summary = summarizeDataQualityNextReviewRecommendation(fallbackDataQualityIssues);

  assert.equal(summary.headline, "建议下一轮先复核 DQ-202605-004");
  assert.equal(summary.topOwner, "数据管理员");
  assert.equal(summary.topSource, "master_data");
  assert.equal(summary.representativeIssueId, "DQ-202605-004");
  assert.equal(summary.href, "/data-quality/DQ-202605-004");
  assert.equal(summary.impactedExceptionCount, 1);
  assert.equal(summary.impactedPeopleCount, 1);
  assert.equal(summary.steps.length, 3);
  assert.equal(summary.steps[0].label, "查看代表问题");
  assert.ok(summary.steps[1].description.includes("数据管理员"));
  assert.ok(summary.steps[1].description.includes("主数据"));
  assert.ok(summary.steps[2].description.includes("复核路径"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality next review recommendation exposes empty state", () => {
  const summary = summarizeDataQualityNextReviewRecommendation([]);

  assert.equal(summary.headline, "当前没有需要追加的缺口复核建议");
  assert.equal(summary.topOwner, undefined);
  assert.equal(summary.topSource, undefined);
  assert.equal(summary.representativeIssueId, undefined);
  assert.equal(summary.impactedExceptionCount, 0);
  assert.equal(summary.impactedPeopleCount, 0);
  assert.deepEqual(summary.steps, []);
});

test("data quality review import batch impact summarizes recommendation batch links", () => {
  const summary = summarizeDataQualityReviewImportBatchImpact(
    fallbackDataQualityIssues,
    fallbackImportBatches
  );

  assert.equal(summary.representativeIssueId, "DQ-202605-004");
  assert.equal(summary.totalBatchCount, 1);
  assert.equal(summary.totalFailedRows, 19);
  assert.ok(summary.matchedFields.includes("employee_id"));
  assert.ok(summary.affectedObjects.includes("人员排班"));
  assert.equal(summary.firstBatch?.batchId, "BATCH-20260519-001");
  assert.equal(summary.firstBatch?.href, "/import-batches/BATCH-20260519-001");
  assert.ok(summary.nextViewHint.includes("关联批次"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality review import batch impact exposes empty state", () => {
  const summary = summarizeDataQualityReviewImportBatchImpact([], fallbackImportBatches);

  assert.equal(summary.representativeIssueId, undefined);
  assert.equal(summary.totalBatchCount, 0);
  assert.equal(summary.totalFailedRows, 0);
  assert.deepEqual(summary.items, []);
});

test("data quality page renders exception top summary", () => {
  const pageSource = readFileSync(new URL("../../app/data-quality/page.tsx", import.meta.url), "utf8");

  assert.ok(pageSource.includes("summarizeDataQualityDayViewOrder"));
  assert.ok(pageSource.includes("summarizeDataQualityFieldImpactSummary"));
  assert.ok(pageSource.includes("summarizeDataQualityGapOwnerSourcePressure"));
  assert.ok(pageSource.includes("summarizeDataQualityNextReviewRecommendation"));
  assert.ok(pageSource.includes("summarizeDataQualityGroupReviewSequence"));
  assert.ok(pageSource.includes("summarizeDataQualityGroupStepImpactDrilldown"));
  assert.ok(pageSource.includes("summarizeDataQualityGroupStepOwnerLoad"));
  assert.ok(pageSource.includes("summarizeDataQualityGroupStepOwnerReviewQueue"));
  assert.ok(pageSource.includes("summarizeDataQualityGroupStepOwnerHandoffBrief"));
  assert.ok(pageSource.includes("summarizeDataQualityGroupStepOwnerHandoffRiskSummary"));
  assert.ok(pageSource.includes("summarizeDataQualityGroupStepOwnerHandoffImportImpact"));
  assert.ok(pageSource.includes("summarizeDataQualityGroupExceptionCoverage"));
  assert.ok(pageSource.includes("summarizeDataQualityReviewGroupLink"));
  assert.ok(pageSource.includes("summarizeDataQualityReviewImportBatchImpact"));
  assert.ok(pageSource.includes("summarizeDataQualityReviewCoverageGap"));
  assert.ok(pageSource.includes("summarizeDataQualityReviewPathSequence"));
  assert.ok(pageSource.includes("summarizeDataQualityReviewPriorityRationale"));
  assert.ok(pageSource.includes("summarizeDataQualityExceptionTop"));
  assert.ok(pageSource.includes("summarizeDataQualityExceptionCauses"));
  assert.ok(pageSource.includes("summarizeDataQualityPersonViewOrder"));
  assert.ok(pageSource.includes("影响异常 Top"));
  assert.ok(pageSource.includes("异常影响原因汇总"));
  assert.ok(pageSource.includes("人员履约查看顺序"));
  assert.ok(pageSource.includes("履约日期查看顺序"));
  assert.ok(pageSource.includes("字段影响交叉摘要"));
  assert.ok(pageSource.includes("复核优先级说明"));
  assert.ok(pageSource.includes("复核路径顺序"));
  assert.ok(pageSource.includes("复核覆盖缺口摘要"));
  assert.ok(pageSource.includes("缺口 owner/来源压力"));
  assert.ok(pageSource.includes("缺口下一轮复核建议"));
  assert.ok(pageSource.includes("复核建议导入批次影响"));
  assert.ok(pageSource.includes("复核建议质量分组"));
  assert.ok(pageSource.includes("质量分组异常影响覆盖"));
  assert.ok(pageSource.includes("质量分组复核顺序"));
  assert.ok(pageSource.includes("分组步骤影响对象"));
  assert.ok(pageSource.includes("分组步骤 owner/人员负载"));
  assert.ok(pageSource.includes("分组步骤 owner 复核队列"));
  assert.ok(pageSource.includes("分组步骤 owner 交接摘要"));
  assert.ok(pageSource.includes("分组步骤 owner 交接风险摘要"));
  assert.ok(pageSource.includes("交接风险关联导入批次影响"));
  assert.ok(pageSource.includes("查看个人履约"));
  assert.ok(pageSource.includes("查看履约日期"));
  assert.ok(pageSource.includes("查看字段问题"));
  assert.ok(pageSource.includes("查看优先问题"));
  assert.ok(pageSource.includes("查看路径步骤"));
  assert.ok(pageSource.includes("查看缺口问题"));
  assert.ok(pageSource.includes("查看压力问题"));
  assert.ok(pageSource.includes("查看建议问题"));
  assert.ok(pageSource.includes("查看关联批次"));
  assert.ok(pageSource.includes("查看质量分组"));
  assert.ok(pageSource.includes("查看影响分组"));
  assert.ok(pageSource.includes("查看分组步骤"));
  assert.ok(pageSource.includes("查看影响对象"));
  assert.ok(pageSource.includes("查看 owner 负载"));
  assert.ok(pageSource.includes("查看队列问题"));
  assert.ok(pageSource.includes("查看交接问题"));
  assert.ok(pageSource.includes("查看风险问题"));
  assert.ok(pageSource.includes("查看风险批次"));
  assert.ok(pageSource.includes("影响异常"));
  assert.ok(pageSource.includes("影响人员"));
  assert.ok(pageSource.includes("下一查看"));
});

test("data quality issue page renders exception impact drilldown", () => {
  const pageSource = readFileSync(new URL("../../app/data-quality/[issueId]/page.tsx", import.meta.url), "utf8");

  assert.ok(pageSource.includes("summarizeDataQualityExceptionImpact"));
  assert.ok(pageSource.includes("影响异常拆解"));
  assert.ok(pageSource.includes("首要异常"));
  assert.ok(pageSource.includes("影响人员"));
  assert.ok(pageSource.includes("下一查看"));
});
