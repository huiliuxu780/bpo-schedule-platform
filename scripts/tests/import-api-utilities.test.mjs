import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const importApiPath = new URL("../../lib/import-api.ts", import.meta.url);

const importBatchTargetFiles = [
  "../../app/schedule-plans/production/page.tsx",
  "../../app/schedule-plans/production/[batchId]/page.tsx",
  "../../app/demand-plans/production/page.tsx",
  "../../app/demand-plans/production/[batchId]/page.tsx",
  "../../app/actual-logs/production/page.tsx",
  "../../app/actual-logs/production/[batchId]/page.tsx",
  "../../app/data-quality/page.tsx",
  "../../app/data-quality/[batchId]/page.tsx",
  "../../app/data-quality/versions/page.tsx",
  "../../app/data-quality/comparison-runs/[runId]/page.tsx",
  "../../app/master-data/agents/data.ts",
];

const fieldMappingTargetFiles = [
  "../../app/schedule-plans/production/page.tsx",
  "../../app/demand-plans/production/page.tsx",
  "../../app/actual-logs/production/page.tsx",
  "../../app/data-quality/[batchId]/page.tsx",
  "../../app/data-quality/uploads/new/page.tsx",
  "../../app/master-data/agents/data.ts",
];

test("shared import API helpers own repeated import batch and field mapping fetches", async () => {
  const importApiSource = await readFile(importApiPath, "utf8");

  assert.match(importApiSource, /export async function fetchImportBatches\(\)/);
  assert.match(importApiSource, /export async function fetchImportFieldMappingTemplates\(\)/);
  assert.match(importApiSource, /buildImportApiUrl\("\/api\/v1\/import-batches"\)/);
  assert.match(importApiSource, /buildImportFieldMappingTemplatesUrl\(\)/);
  assert.match(importApiSource, /导入批次读取失败（状态码 \$\{response\.status\}）/);
  assert.match(importApiSource, /字段映射模板读取失败（状态码 \$\{response\.status\}）/);

  for (const targetFile of importBatchTargetFiles) {
    const source = await readFile(new URL(targetFile, import.meta.url), "utf8");

    assert.equal(
      /(?:export\s+)?async function fetchImportBatches\(\)/.test(source),
      false,
      `${targetFile} must import fetchImportBatches instead of defining it locally`,
    );
  }

  for (const targetFile of fieldMappingTargetFiles) {
    const source = await readFile(new URL(targetFile, import.meta.url), "utf8");

    assert.equal(
      /(?:export\s+)?async function fetchImportFieldMappingTemplates\(\)/.test(source),
      false,
      `${targetFile} must import fetchImportFieldMappingTemplates instead of defining it locally`,
    );
  }
});
