import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const apiResultPath = new URL("../../lib/api-result.ts", import.meta.url);
const apiErrorPath = new URL("../../lib/api-error.ts", import.meta.url);

const targetFiles = [
  "../../app/schedule-plans/production/page.tsx",
  "../../app/schedule-plans/production/[batchId]/page.tsx",
  "../../app/demand-plans/production/page.tsx",
  "../../app/demand-plans/production/[batchId]/page.tsx",
  "../../app/actual-logs/production/page.tsx",
  "../../app/actual-logs/production/[batchId]/page.tsx",
  "../../app/data-quality/page.tsx",
  "../../app/data-quality/[batchId]/page.tsx",
  "../../app/data-quality/field-mapping-templates/[templateId]/page.tsx",
  "../../app/data-quality/versions/page.tsx",
  "../../app/data-quality/uploads/new/page.tsx",
  "../../app/data-quality/comparison-runs/[runId]/page.tsx",
  "../../app/data-quality/review-cases/page.tsx",
  "../../app/data-quality/review-cases/[caseId]/page.tsx",
  "../../app/master-data/agents/data.ts",
];

test("shared API result and error helpers are the only source of these utilities", async () => {
  const apiResultSource = await readFile(apiResultPath, "utf8");
  const apiErrorSource = await readFile(apiErrorPath, "utf8");

  assert.match(apiResultSource, /export type ApiResult<T>\s*=/);
  assert.match(apiResultSource, /data:\s*T\s*\|\s*null/);
  assert.match(apiResultSource, /error:\s*string\s*\|\s*null/);
  assert.match(apiErrorSource, /export function formatApiError\(error:\s*unknown,\s*fallbackMessage = "读取失败"\):\s*string/);
  assert.match(apiErrorSource, /error instanceof Error/);
  assert.match(apiErrorSource, /return fallbackMessage/);

  for (const targetFile of targetFiles) {
    const targetPath = new URL(targetFile, import.meta.url);
    const source = await readFile(targetPath, "utf8");

    assert.equal(
      /(?:export\s+)?type ApiResult<T>\s*=/.test(source),
      false,
      `${targetFile} must import ApiResult instead of defining it locally`,
    );
    assert.equal(
      /function formatApiError\(error:\s*unknown\):\s*string/.test(source),
      false,
      `${targetFile} must import formatApiError instead of defining it locally`,
    );
  }
});
