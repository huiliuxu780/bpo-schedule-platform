import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const reviewCasesWorkspacePath = new URL(
  "../../components/import-center-review-cases-workspace.tsx",
  import.meta.url,
);
const reviewCaseDetailWorkspacePath = new URL(
  "../../components/import-center-review-case-detail-workspace.tsx",
  import.meta.url,
);

const forbiddenVisibleGovernanceTerms = [
  "Gate",
  "验收矩阵",
  "PM 验收",
  "停机条件",
  "审批",
  "导出",
  "批量",
  "权限",
];

test("review case workspaces render operator processing path sections", async () => {
  const listSource = await readFile(reviewCasesWorkspacePath, "utf8");
  const detailSource = await readFile(reviewCaseDetailWorkspacePath, "utf8");

  assert.equal(
    listSource.includes("summarizeImportReviewCaseAcceptanceBlock"),
    true,
    "review case list workspace should use the queue processing path summary",
  );
  assert.equal(
    listSource.includes("队列处理路径"),
    true,
    "review case list workspace should render operator-facing queue path copy",
  );
  assert.equal(
    detailSource.includes("summarizeImportReviewCaseDetailAcceptance"),
    true,
    "review case detail workspace should use the single-case processing path summary",
  );
  assert.equal(
    detailSource.includes("单案例处理路径"),
    true,
    "review case detail workspace should render operator-facing case path copy",
  );
});

test("review case processing path UI does not expose Gate or PM acceptance language", async () => {
  const sources = [
    ["review case list", await readFile(reviewCasesWorkspacePath, "utf8")],
    ["review case detail", await readFile(reviewCaseDetailWorkspacePath, "utf8")],
  ];

  for (const [label, source] of sources) {
    for (const term of forbiddenVisibleGovernanceTerms) {
      assert.equal(
        source.includes(term),
        false,
        `${label} should not expose governance term ${term} in visible UI source`,
      );
    }
  }
});
