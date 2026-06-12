import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const actionsPath = new URL("../../app/data-quality/actions.ts", import.meta.url);

function functionBody(source, functionName) {
  const marker = `export async function ${functionName}`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `${functionName} should exist`);
  const braceStart = source.indexOf("{", start);
  assert.notEqual(braceStart, -1, `${functionName} should have a body`);

  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    }
    if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(braceStart, index + 1);
      }
    }
  }

  throw new Error(`${functionName} body is not closed`);
}

test("data-quality server actions guard enum and redirect FormData values at runtime", async () => {
  const source = await readFile(actionsPath, "utf8");

  assert.match(source, /function parseImportFileType\(value:\s*string\):\s*ImportFileType\s*\|\s*null/);
  assert.match(source, /function parseComparisonType\(value:\s*string\):\s*ComparisonType\s*\|\s*null/);
  assert.match(source, /function parseUploadResultRedirectTarget\(value:\s*string\):\s*UploadResultRedirectTarget\s*\|\s*null/);
  assert.match(source, /type UploadResultRedirectTarget\s*=/);
  assert.match(source, /const uploadResultRedirectTargets = new Set<UploadResultRedirectTarget>/);

  const uploadBody = functionBody(source, "uploadImportCsvAction");
  assert.match(uploadBody, /const fileType = parseImportFileType\(formText\(formData, "file_type"\)\)/);
  assert.match(uploadBody, /const resultTarget = parseUploadResultRedirectTarget\(formText\(formData, "result_redirect_to"\)\)/);
  assert.match(uploadBody, /reason:\s*"invalid_file_type"/);
  assert.match(uploadBody, /reason:\s*"invalid_redirect_target"/);
  assert.equal(uploadBody.includes("as ImportFileType"), false);

  const createTemplateBody = functionBody(source, "createImportFieldMappingTemplateAction");
  assert.match(createTemplateBody, /const fileType = parseImportFileType\(formText\(formData, "file_type"\)\)/);
  assert.match(createTemplateBody, /reason=invalid_file_type/);
  assert.equal(createTemplateBody.includes("as ImportFileType"), false);

  const applyBody = functionBody(source, "applyImportBatchAction");
  assert.match(applyBody, /const fileType = parseImportFileType\(formText\(formData, "file_type"\)\)/);
  assert.match(applyBody, /reason=invalid_file_type/);
  assert.equal(applyBody.includes("as ImportFileType"), false);

  const batchComparisonBody = functionBody(source, "triggerLocalComparisonRunAction");
  assert.match(batchComparisonBody, /const comparisonType = parseComparisonType\(/);
  assert.match(batchComparisonBody, /compareReason:\s*"invalid_comparison_type"/);
  assert.equal(batchComparisonBody.includes("as ImportComparisonRunRecord"), false);

  const versionComparisonBody = functionBody(source, "triggerVersionWorkbenchLocalComparisonRunAction");
  assert.match(versionComparisonBody, /const comparisonType = parseComparisonType\(/);
  assert.match(versionComparisonBody, /compareReason:\s*"invalid_comparison_type"/);
  assert.equal(versionComparisonBody.includes("as ImportComparisonRunRecord"), false);
});
