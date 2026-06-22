import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const rootDir = resolve(import.meta.dirname, "../..");
const initScript = join(rootDir, "harness-template/scripts/init-harness.sh");

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: rootDir,
    encoding: "utf8",
    ...options,
  });
}

test("harness template initializes a clean current-state Harness in another project", () => {
  const targetDir = mkdtempSync(join(tmpdir(), "harness-template-target-"));
  const initResult = run("bash", [
    initScript,
    targetDir,
    "sample-ops-platform",
  ]);

  assert.equal(initResult.status, 0, initResult.stderr || initResult.stdout);

  const requiredFiles = [
    "AGENTS.md",
    "docs/current/PROJECT_CONTEXT.md",
    "docs/current/STORY_QUEUE.yaml",
    "docs/current/ACTIVE_TASKS.yaml",
    "docs/current/BLOCKERS.md",
    "docs/registry/TRACE_INDEX.yaml",
    "docs/registry/DECISION_INDEX.yaml",
    "docs/quality/GATE_REGISTRY.md",
    "docs/quality/GIT_BRANCH_WORKFLOW.md",
    "docs/quality/STATE_MANAGEMENT.md",
    "docs/quality/GATE_PLAN_TEMPLATE.md",
    "docs/quality/DONE_REPORT_TEMPLATE.md",
    "scripts/check-state.sh",
    "scripts/check.sh",
    "scripts/tests/check-state.test.mjs",
    "scripts/tests/check-script-coverage.test.mjs",
  ];

  for (const file of requiredFiles) {
    assert.equal(existsSync(join(targetDir, file)), true, `missing ${file}`);
  }

  const agents = readFileSync(join(targetDir, "AGENTS.md"), "utf8");
  assert.match(agents, /Project name: `sample-ops-platform`/);
  assert.doesNotMatch(agents, /bpo-schedule-platform|BPO WFM/);

  const context = readFileSync(
    join(targetDir, "docs/current/PROJECT_CONTEXT.md"),
    "utf8",
  );
  assert.match(context, /There is no executable ready story/);
  assert.doesNotMatch(context, /US[0-9]+\/IM[0-9]+/);

  const checkStateResult = spawnSync("bash", ["scripts/check-state.sh", "--strict"], {
    cwd: targetDir,
    encoding: "utf8",
  });
  assert.equal(
    checkStateResult.status,
    0,
    checkStateResult.stderr || checkStateResult.stdout,
  );
  assert.match(checkStateResult.stdout, /check-state passed in strict mode/);
});
