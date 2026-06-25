import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dataQualityBatchPagePath = new URL("../../app/data-quality/[batchId]/page.tsx", import.meta.url);
const dataQualityVersionsPagePath = new URL("../../app/data-quality/versions/page.tsx", import.meta.url);
const dataQualityReviewCasesPagePath = new URL("../../app/data-quality/review-cases/page.tsx", import.meta.url);
const dataQualityReviewCaseDetailPagePath = new URL("../../app/data-quality/review-cases/[caseId]/page.tsx", import.meta.url);
const dataQualityComparisonRunPagePath = new URL("../../app/data-quality/comparison-runs/[runId]/page.tsx", import.meta.url);
const dataQualityTemplateDetailPagePath = new URL("../../app/data-quality/field-mapping-templates/[templateId]/page.tsx", import.meta.url);
const dataQualityUploadPagePath = new URL("../../app/data-quality/uploads/new/page.tsx", import.meta.url);

test("result chain pages do not present import batches as their parent module", async () => {
  const resultPageSources = [
    ["business versions", await readFile(dataQualityVersionsPagePath, "utf8")],
    ["comparison run detail", await readFile(dataQualityComparisonRunPagePath, "utf8")],
    ["review cases", await readFile(dataQualityReviewCasesPagePath, "utf8")],
    ["review case detail", await readFile(dataQualityReviewCaseDetailPagePath, "utf8")],
  ];

  for (const [label, source] of resultPageSources) {
    assert.equal(
      source.includes('{ label: "导入批次", href: "/data-quality" }'),
      false,
      `${label} should not breadcrumb under the import batch ledger`,
    );
  }

  const batchDetailSource = await readFile(dataQualityBatchPagePath, "utf8");
  const uploadSource = await readFile(dataQualityUploadPagePath, "utf8");
  const templateDetailSource = await readFile(dataQualityTemplateDetailPagePath, "utf8");

  assert.equal(
    batchDetailSource.includes('{ label: "导入批次", href: "/data-quality" }'),
    true,
    "batch processing page should keep batch breadcrumb context",
  );
  assert.equal(
    uploadSource.includes('{ label: "导入批次", href: "/data-quality" }'),
    true,
    "internal compatible upload page should keep batch breadcrumb context",
  );
  assert.equal(
    templateDetailSource.includes('{ label: "导入批次", href: "/data-quality" }'),
    true,
    "template page should keep batch/template breadcrumb context",
  );
});
