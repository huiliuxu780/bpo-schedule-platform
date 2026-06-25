import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  model: new URL("../../components/import-center-model.ts", import.meta.url),
  types: new URL("../../components/import-center-types.ts", import.meta.url),
  formatters: new URL("../../components/import-center-formatters.ts", import.meta.url),
  navigation: new URL("../../components/import-center-navigation.ts", import.meta.url),
};

test("import-center model first split preserves the legacy public entrypoint", async () => {
  const [model, types, formatters, navigation] = await Promise.all(
    Object.values(files).map((file) => readFile(file, "utf8"))
  );

  assert.match(model, /export type \* from "\.\/import-center-types"/);
  assert.match(model, /export \{[\s\S]*formatImportFileType[\s\S]*\} from "\.\/import-center-formatters"/);
  assert.match(model, /export \{[\s\S]*buildImportApiUrl[\s\S]*\} from "\.\/import-center-navigation"/);
  assert.doesNotMatch(model, /^export type ImportFileType =/m);
  assert.doesNotMatch(model, /^export function buildImportApiUrl/m);
  assert.doesNotMatch(model, /^export function formatImportFileType/m);

  assert.match(types, /^export type ImportFileType =/m);
  assert.match(types, /^export type ImportBatchListRow =/m);
  assert.match(types, /^export type ImportComparisonRunRecord =/m);
  assert.match(types, /^export type ImportFieldMappingTemplate =/m);
  assert.doesNotMatch(types, /^export function /m);

  assert.match(formatters, /from "\.\/import-center-types"/);
  assert.match(formatters, /^export function formatImportFileType/m);
  assert.match(formatters, /^export function formatImportProcessingStatus/m);
  assert.match(formatters, /^export function formatImportBatchDisplayLabel/m);
  assert.doesNotMatch(formatters, /^export function buildImportApiUrl/m);

  assert.match(navigation, /from "\.\/import-center-types"/);
  assert.match(navigation, /^export function buildImportApiUrl/m);
  assert.match(navigation, /^export function buildImportBatchProcessingHref/m);
  assert.match(navigation, /^export function buildImportReviewCaseDetailWorkspaceHref/m);
  assert.doesNotMatch(navigation, /^export function formatImportFileType/m);
});
