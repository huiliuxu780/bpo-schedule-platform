import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const comparisonRunWorkspacePath = new URL(
  "../../components/import-center-comparison-run-detail-workspace.tsx",
  import.meta.url,
);

test("comparison run detail primary return uses business version result semantics", async () => {
  const source = await readFile(comparisonRunWorkspacePath, "utf8");

  assert.equal(source.includes('href="/data-quality/versions"'), true);
  assert.equal(source.includes("返回业务版本列表"), true);
  assert.equal(source.includes("返回复核案例"), false);
});
