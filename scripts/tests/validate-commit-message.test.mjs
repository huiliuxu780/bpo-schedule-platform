import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const rootDir = path.resolve(import.meta.dirname, "../..");
const validatorScript = path.join(rootDir, "scripts/validate-commit-message.mjs");

function writeRelative(repoRoot, relativePath, content) {
  mkdirSync(path.join(repoRoot, path.dirname(relativePath)), { recursive: true });
  writeFileSync(path.join(repoRoot, relativePath), content);
}

function createRepo({ activeTasks, stagedFiles = {}, branch = "codex/h030-harness-hook-guard" } = {}) {
  const repoRoot = mkdtempSync(path.join(tmpdir(), "bpo-commit-msg-"));
  writeRelative(
    repoRoot,
    "docs/current/ACTIVE_TASKS.yaml",
    activeTasks ??
      [
        "version: 1",
        "tasks:",
        "  - id: H030",
        "    story_ids: [US104]",
        "    status: in_progress",
        "    gate: state-hygiene",
        "    branch: codex/h030-harness-hook-guard",
        "    allowed_files:",
        "      - docs/**",
        "    traceability_files:",
        "      - docs/task-log.md",
        "    forbidden_files:",
        "      - app/**",
        "    stop_conditions:",
        "      - verification failed",
        "    acceptance_ref: tasks/backlog.yaml#H030",
        "    verification:",
        "      - bash scripts/check-state.sh --strict --diff=staged",
        "    evidence_expected:",
        "      - harness closeout",
        "",
      ].join("\n"),
  );
  writeRelative(repoRoot, "tasks/backlog.yaml", "tasks:\n  - id: H030\n  - id: F900\n  - id: Q900\n");
  writeRelative(repoRoot, "docs/task-log.md", "# log\n");
  writeRelative(repoRoot, "app/page.tsx", "export default function Page() { return null }\n");

  for (const [relativePath, content] of Object.entries(stagedFiles)) {
    writeRelative(repoRoot, relativePath, content);
  }

  for (const [cmd, args] of [
    ["git", ["init", "-b", branch]],
    ["git", ["config", "user.email", "codex@example.com"]],
    ["git", ["config", "user.name", "Codex"]],
    ["git", ["add", "."]],
    ["git", ["commit", "-m", "fixture"]],
  ]) {
    const result = spawnSync(cmd, args, { cwd: repoRoot, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
  }

  return repoRoot;
}

function stageFile(repoRoot, relativePath, content) {
  writeRelative(repoRoot, relativePath, content);
  const result = spawnSync("git", ["add", relativePath], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function runValidator(repoRoot, subject) {
  const messageFile = path.join(repoRoot, "COMMIT_EDITMSG");
  writeFileSync(messageFile, `${subject}\n`);
  return spawnSync("node", [validatorScript, messageFile], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

test("active task id commit subject passes", () => {
  const repoRoot = createRepo();
  stageFile(repoRoot, "docs/task-log.md", "# log\nchanged\n");
  const result = runValidator(repoRoot, "H030: tighten hook guard");

  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("history-only task id fails for ordinary commit subject", () => {
  const repoRoot = createRepo();
  stageFile(repoRoot, "docs/task-log.md", "# log\nchanged\n");
  const result = runValidator(repoRoot, "F999: stale task");

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /not a current active task/);
});

test("closeout commit subject passes when HEAD provides the active task id", () => {
  const repoRoot = createRepo({
    activeTasks: [
      "version: 1",
      "tasks:",
      "  - id: F900",
      "    story_ids: [US900]",
      "    status: in_progress",
      "    gate: frontend-scaffold",
      "    branch: codex/f900-closeout",
      "    allowed_files:",
      "      - app/**",
      "    traceability_files:",
      "      - docs/current/**",
      "      - docs/task-log.md",
      "    forbidden_files:",
      "      - backend/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#F900",
      "    verification:",
      "      - bash scripts/check-state.sh --strict --diff=staged",
      "    evidence_expected:",
      "      - frontend closeout",
      "",
    ].join("\n"),
  });
  stageFile(repoRoot, "docs/current/ACTIVE_TASKS.yaml", "version: 1\ntasks: []\n");
  stageFile(repoRoot, "app/page.tsx", "export default function Page() { return <main /> }\n");
  const result = runValidator(repoRoot, "F900: close review closeout");

  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("ordinary commit subject still fails without current or HEAD active task context", () => {
  const repoRoot = createRepo({ activeTasks: "version: 1\ntasks: []\n" });
  stageFile(repoRoot, "docs/task-log.md", "# log\nchanged\n");
  const result = runValidator(repoRoot, "F900: stale closeout");

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /not a current active task/);
});

test("harness prefix passes with non-business staged files", () => {
  const repoRoot = createRepo();
  stageFile(repoRoot, "docs/task-log.md", "# log\nchanged\n");
  const result = runValidator(repoRoot, "harness: tighten current state checks");

  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("harness prefix fails with business-code staged files outside state-hygiene task", () => {
  const repoRoot = createRepo({
    activeTasks: [
      "version: 1",
      "tasks:",
      "  - id: F900",
      "    story_ids: [US900]",
      "    status: in_progress",
      "    gate: frontend-scaffold",
      "    branch: codex/h030-harness-hook-guard",
      "    allowed_files:",
      "      - app/**",
      "    traceability_files:",
      "      - docs/task-log.md",
      "    forbidden_files:",
      "      - backend/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#F900",
      "    verification:",
      "      - bash scripts/check-state.sh --strict --diff=staged",
      "    evidence_expected:",
      "      - frontend work",
      "",
    ].join("\n"),
  });
  stageFile(repoRoot, "app/page.tsx", "export default function Page() { return <main /> }\n");
  const result = runValidator(repoRoot, "harness: tighten checks");

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /cannot include business-code staged files/);
});

test("generic commit subjects are rejected", () => {
  const repoRoot = createRepo();
  stageFile(repoRoot, "docs/task-log.md", "# log\nchanged\n");
  const result = runValidator(repoRoot, "update");

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /generic commit subject is not allowed/);
});
