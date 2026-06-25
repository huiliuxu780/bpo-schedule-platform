import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  model: new URL("../../components/import-center-model.ts", import.meta.url),
  list: new URL("../../components/import-center-list-model.ts", import.meta.url),
  version: new URL("../../components/import-center-version-model.ts", import.meta.url),
  review: new URL("../../components/import-center-review-model.ts", import.meta.url),
  batch: new URL("../../components/import-center-batch-model.ts", import.meta.url),
  template: new URL("../../components/import-center-template-model.ts", import.meta.url),
  comparison: new URL(
    "../../components/import-center-comparison-model.ts",
    import.meta.url
  ),
};

test("import-center summaries are split behind the legacy entrypoint", async () => {
  const [model, list, version, review, batch, template, comparison] =
    await Promise.all(Object.values(files).map((file) => readFile(file, "utf8")));

  assert.match(model, /from "\.\/import-center-list-model"/);
  assert.match(model, /from "\.\/import-center-version-model"/);
  assert.match(model, /from "\.\/import-center-review-model"/);
  assert.match(model, /from "\.\/import-center-batch-model"/);
  assert.match(model, /from "\.\/import-center-template-model"/);
  assert.match(model, /from "\.\/import-center-comparison-model"/);
  assert.doesNotMatch(model, /^export function summarizeImport/m);
  assert.doesNotMatch(model, /^function formatReviewCase/m);
  assert.ok(
    model.split("\n").length <= 180,
    "legacy model entrypoint should stay thin"
  );

  assert.match(list, /^export function summarizeImportBatches/m);
  assert.match(list, /^export function filterImportBatches/m);

  assert.match(version, /^export function summarizeImportVersionWorkbench/m);
  assert.match(version, /^export function summarizeImportAppliedVersionResultContext/m);
  assert.match(version, /^export function summarizeImportVersionComparisonTrigger/m);

  assert.match(review, /^export function summarizeImportReviewCasesWorkspace/m);
  assert.match(review, /^export function summarizeImportReviewCaseDetail/m);
  assert.match(review, /^export function buildImportReviewEvidenceWritePayload/m);

  assert.match(batch, /^export function summarizeImportBatchDetail/m);
  assert.match(batch, /^export function summarizeImportQualityExceptionTrace/m);
  assert.match(batch, /^export function summarizeImportApplyActionGuidance/m);

  assert.match(template, /^export function summarizeImportFieldMappingTemplates/m);
  assert.match(template, /^export function summarizeImportTemplateFitDetail/m);
  assert.match(template, /^export function formatFieldMappingTemplateSummary/m);

  assert.match(comparison, /^export function summarizeImportComparisonRunDetail/m);
  assert.match(comparison, /^export function summarizeImportComparisonRunReturnLinks/m);
});
