import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const demandForecastProductionPagePath = new URL("../../app/demand-plans/production/page.tsx", import.meta.url);
const personnelScheduleProductionPagePath = new URL("../../app/schedule-plans/production/page.tsx", import.meta.url);
const actualLogProductionPagePath = new URL("../../app/actual-logs/production/page.tsx", import.meta.url);
const demandPlansPagePath = new URL("../../app/demand-plans/page.tsx", import.meta.url);
const demandForecastProductionDetailPagePath = new URL("../../app/demand-plans/production/[batchId]/page.tsx", import.meta.url);
const schedulePlansPagePath = new URL("../../app/schedule-plans/page.tsx", import.meta.url);
const schedulePlanCreatePagePath = new URL("../../app/schedule-plans/new/page.tsx", import.meta.url);
const schedulePlanDetailPagePath = new URL("../../app/schedule-plans/[planId]/page.tsx", import.meta.url);
const schedulePlanEditPagePath = new URL("../../app/schedule-plans/[planId]/edit/page.tsx", import.meta.url);
const personnelScheduleProductionDetailPagePath = new URL("../../app/schedule-plans/production/[batchId]/page.tsx", import.meta.url);
const actualLogProcessingDetailPagePath = new URL("../../app/actual-logs/production/[batchId]/page.tsx", import.meta.url);
const dataQualityPagePath = new URL("../../app/data-quality/page.tsx", import.meta.url);
const dataQualityBatchPagePath = new URL("../../app/data-quality/[batchId]/page.tsx", import.meta.url);
const dataQualityVersionsPagePath = new URL("../../app/data-quality/versions/page.tsx", import.meta.url);
const dataQualityReviewCasesPagePath = new URL("../../app/data-quality/review-cases/page.tsx", import.meta.url);
const dataQualityReviewCaseDetailPagePath = new URL("../../app/data-quality/review-cases/[caseId]/page.tsx", import.meta.url);
const dataQualityComparisonRunPagePath = new URL("../../app/data-quality/comparison-runs/[runId]/page.tsx", import.meta.url);
const dataQualityTemplateDetailPagePath = new URL("../../app/data-quality/field-mapping-templates/[templateId]/page.tsx", import.meta.url);
const dataQualityTemplateCreatePagePath = new URL("../../app/data-quality/field-mapping-templates/new/page.tsx", import.meta.url);
const dataQualityUploadPagePath = new URL("../../app/data-quality/uploads/new/page.tsx", import.meta.url);
const demandForecastProductionWorkbenchPath = new URL("../../components/demand-forecast-production-workbench.tsx", import.meta.url);
const personnelScheduleProductionWorkbenchPath = new URL("../../components/personnel-schedule-production-workbench.tsx", import.meta.url);
const actualLogProductionWorkbenchPath = new URL("../../components/actual-log-production-workbench.tsx", import.meta.url);
const importCenterReviewCasesWorkspacePath = new URL("../../components/import-center-review-cases-workspace.tsx", import.meta.url);
const importCenterReviewCaseDetailWorkspacePath = new URL("../../components/import-center-review-case-detail-workspace.tsx", import.meta.url);
const importCenterComparisonRunDetailWorkspacePath = new URL("../../components/import-center-comparison-run-detail-workspace.tsx", import.meta.url);
const importCenterVersionWorkbenchPath = new URL("../../components/import-center-version-workbench.tsx", import.meta.url);

test("business pages pass breadcrumbs through AppShell", async () => {
  const pagePaths = [
    demandPlansPagePath,
    demandForecastProductionPagePath,
    demandForecastProductionDetailPagePath,
    schedulePlansPagePath,
    schedulePlanCreatePagePath,
    schedulePlanDetailPagePath,
    schedulePlanEditPagePath,
    personnelScheduleProductionPagePath,
    personnelScheduleProductionDetailPagePath,
    actualLogProductionPagePath,
    actualLogProcessingDetailPagePath,
    dataQualityPagePath,
    dataQualityBatchPagePath,
    dataQualityVersionsPagePath,
    dataQualityReviewCasesPagePath,
    dataQualityReviewCaseDetailPagePath,
    dataQualityComparisonRunPagePath,
    dataQualityTemplateDetailPagePath,
    dataQualityTemplateCreatePagePath,
    dataQualityUploadPagePath,
  ];

  for (const pagePath of pagePaths) {
    const source = await readFile(pagePath, "utf8");

    assert.equal(source.includes("breadcrumbItems"), true, pagePath.pathname);
  }
});

test("business content surfaces do not duplicate page identity h1 headings", async () => {
  const contentPaths = [
    demandPlansPagePath,
    schedulePlansPagePath,
    schedulePlanCreatePagePath,
    schedulePlanDetailPagePath,
    schedulePlanEditPagePath,
    demandForecastProductionWorkbenchPath,
    personnelScheduleProductionWorkbenchPath,
    actualLogProductionWorkbenchPath,
    importCenterReviewCasesWorkspacePath,
    importCenterReviewCaseDetailWorkspacePath,
    importCenterComparisonRunDetailWorkspacePath,
    importCenterVersionWorkbenchPath,
  ];

  for (const contentPath of contentPaths) {
    const source = await readFile(contentPath, "utf8");

    assert.equal(source.includes("<h1"), false, contentPath.pathname);
  }
});
