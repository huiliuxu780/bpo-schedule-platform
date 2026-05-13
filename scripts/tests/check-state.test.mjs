import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(import.meta.dirname, "../..");
const checkStateScript = path.join(rootDir, "scripts/check-state.sh");

function createStateRoot({ storyQueue, activeTasks, traceIndex } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), "bpo-state-check-"));

  mkdirSync(path.join(dir, "docs/current"), { recursive: true });
  mkdirSync(path.join(dir, "docs/registry"), { recursive: true });
  mkdirSync(path.join(dir, "docs/quality"), { recursive: true });
  mkdirSync(path.join(dir, "docs/raw"), { recursive: true });

  writeFileSync(
    path.join(dir, "docs/current/PROJECT_CONTEXT.md"),
    "# Project Context\n",
  );
  writeFileSync(path.join(dir, "docs/current/BLOCKERS.md"), "# Blockers\n");
  writeFileSync(
    path.join(dir, "docs/raw/source.md"),
    "# Source\n",
  );
  writeFileSync(
    path.join(dir, "docs/registry/DECISION_INDEX.yaml"),
    "version: 1\n",
  );
  writeFileSync(
    path.join(dir, "docs/quality/GATE_REGISTRY.md"),
    [
      "# Gate Registry",
      "",
      "| required_workflow | Gate | Typical Scope | Extra Stop Conditions |",
      "| --- | --- | --- | --- |",
      "| `state-hygiene` | State Hygiene Gate | Current/registry state model | Business implementation |",
      "| `state-repair` | State Repair Gate | Repair inconsistent current/registry/archive index state | Business code |",
      "",
    ].join("\n"),
  );
  writeFileSync(
    path.join(dir, "docs/current/STORY_QUEUE.yaml"),
    storyQueue ??
      [
        "version: 1",
        "stories:",
        "  - id: US900",
        "    status: in_progress",
        "    task_ids: [H900]",
        "",
      ].join("\n"),
  );
  writeFileSync(
    path.join(dir, "docs/current/ACTIVE_TASKS.yaml"),
    activeTasks ??
      [
        "version: 1",
        "tasks:",
        "  - id: H900",
        "    story_ids: [US900]",
        "    status: in_progress",
        "    gate: state-hygiene",
        "    branch: codex/h900-state-check",
        "    allowed_files:",
        "      - docs/current/**",
        "      - docs/registry/**",
        "    forbidden_files:",
        "      - app/**",
        "    stop_conditions:",
        "      - verification failed",
        "    acceptance_ref: tasks/backlog.yaml#H900",
        "    verification:",
        "      - bash scripts/check-state.sh --strict",
        "    evidence_expected:",
        "      - strict state check passes",
        "",
      ].join("\n"),
  );
  writeFileSync(
    path.join(dir, "docs/registry/TRACE_INDEX.yaml"),
    traceIndex ??
      [
        "version: 1",
        "current_files:",
        "  project_context: docs/current/PROJECT_CONTEXT.md",
        "  story_queue: docs/current/STORY_QUEUE.yaml",
        "  active_tasks: docs/current/ACTIVE_TASKS.yaml",
        "  blockers: docs/current/BLOCKERS.md",
        "stories:",
        "  US900:",
        "    file: docs/raw/source.md",
        "tasks:",
        "  H900:",
        "    file: docs/raw/source.md",
        "",
      ].join("\n"),
  );

  return dir;
}

function runCheckState(stateRoot, args = []) {
  return spawnSync("bash", [checkStateScript, ...args], {
    cwd: rootDir,
    encoding: "utf8",
    env: {
      ...process.env,
      BPO_STATE_ROOT: stateRoot,
    },
  });
}

test("check-state strict mode passes for a consistent current state", () => {
  const stateRoot = createStateRoot();
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /check-state passed in strict mode/);
});

test("check-state warning mode reports missing active task without self-locking", () => {
  const stateRoot = createStateRoot({
    activeTasks: "version: 1\ntasks: []\n",
  });
  const result = runCheckState(stateRoot);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /current story US900 has no matching active task/);
  assert.match(result.stdout, /warning/);
});

test("check-state strict mode fails when ready story has no active task", () => {
  const stateRoot = createStateRoot({
    activeTasks: "version: 1\ntasks: []\n",
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /current story US900 has no matching active task/);
});

test("check-state strict mode rejects lifecycle state in trace index", () => {
  const stateRoot = createStateRoot({
    traceIndex: [
      "version: 1",
      "tasks:",
      "  H900:",
      "    file: docs/raw/source.md",
      "    status: ready",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /TRACE_INDEX.yaml must not contain/);
});

test("check-state warning mode reports done story history without self-locking", () => {
  const stateRoot = createStateRoot({
    storyQueue: [
      "version: 1",
      "stories:",
      "  - id: US900",
      "    status: done",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /must not retain done story history/);
});

test("check-state strict mode rejects done story history in current queue", () => {
  const stateRoot = createStateRoot({
    storyQueue: [
      "version: 1",
      "stories:",
      "  - id: US900",
      "    status: done",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /must not retain done story history/);
});

test("check-state strict mode rejects done task history in active tasks", () => {
  const stateRoot = createStateRoot({
    activeTasks: [
      "version: 1",
      "tasks:",
      "  - id: H900",
      "    story_ids: [US900]",
      "    status: done",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /must not retain done task history/);
});

test("check-state strict mode rejects missing TRACE_INDEX current file paths", () => {
  const stateRoot = createStateRoot({
    traceIndex: [
      "version: 1",
      "current_files:",
      "  project_context: docs/current/MISSING.md",
      "  story_queue: docs/current/STORY_QUEUE.yaml",
      "  active_tasks: docs/current/ACTIVE_TASKS.yaml",
      "  blockers: docs/current/BLOCKERS.md",
      "tasks:",
      "  H900:",
      "    file: docs/raw/source.md",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /registry path missing: docs\/current\/MISSING\.md/);
});

test("check-state strict mode rejects invalid story status in current queue", () => {
  const stateRoot = createStateRoot({
    storyQueue: [
      "version: 1",
      "stories:",
      "  - id: US900",
      "    status: done_now",
      "    task_ids: [H900]",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /invalid story status/);
});

test("check-state strict mode rejects invalid task status in active tasks", () => {
  const stateRoot = createStateRoot({
    activeTasks: [
      "version: 1",
      "tasks:",
      "  - id: H900",
      "    story_ids: [US900]",
      "    status: done_now",
      "    gate: state-hygiene",
      "    branch: codex/h900-state-check",
      "    allowed_files:",
      "      - docs/current/**",
      "    forbidden_files:",
      "      - app/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#H900",
      "    verification:",
      "      - bash scripts/check-state.sh --strict",
      "    evidence_expected:",
      "      - strict state check passes",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /invalid task status/);
});

test("check-state strict mode rejects active task with unknown gate", () => {
  const stateRoot = createStateRoot({
    activeTasks: [
      "version: 1",
      "tasks:",
      "  - id: H900",
      "    story_ids: [US900]",
      "    status: in_progress",
      "    gate: missing-gate",
      "    branch: codex/h900-state-check",
      "    allowed_files:",
      "      - docs/current/**",
      "    forbidden_files:",
      "      - app/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#H900",
      "    verification:",
      "      - bash scripts/check-state.sh --strict",
      "    evidence_expected:",
      "      - strict state check passes",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /unknown gate/);
});

test("check-state strict mode rejects active task missing verification contract", () => {
  const stateRoot = createStateRoot({
    activeTasks: [
      "version: 1",
      "tasks:",
      "  - id: H900",
      "    story_ids: [US900]",
      "    status: in_progress",
      "    gate: state-hygiene",
      "    branch: codex/h900-state-check",
      "    allowed_files:",
      "      - docs/current/**",
      "    forbidden_files:",
      "      - app/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#H900",
      "    evidence_expected:",
      "      - strict state check passes",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /missing required field verification/);
});

test("check-state strict mode rejects current IDs missing trace index entries", () => {
  const stateRoot = createStateRoot({
    traceIndex: [
      "version: 1",
      "current_files:",
      "  project_context: docs/current/PROJECT_CONTEXT.md",
      "  story_queue: docs/current/STORY_QUEUE.yaml",
      "  active_tasks: docs/current/ACTIVE_TASKS.yaml",
      "  blockers: docs/current/BLOCKERS.md",
      "stories:",
      "tasks:",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /missing story trace entry: US900/);
  assert.match(result.stdout, /missing task trace entry: H900/);
});

test("check-state strict mode accepts inline trace index entries", () => {
  const stateRoot = createStateRoot({
    traceIndex: [
      "version: 1",
      "current_files:",
      "  project_context: docs/current/PROJECT_CONTEXT.md",
      "  story_queue: docs/current/STORY_QUEUE.yaml",
      "  active_tasks: docs/current/ACTIVE_TASKS.yaml",
      "  blockers: docs/current/BLOCKERS.md",
      'stories:',
      '  US900: {file: "docs/raw/source.md", requirement_ids: ["R900"], task_ids: ["H900"]}',
      'tasks:',
      '  H900: {file: "docs/raw/source.md", story_ids: ["US900"], gate: "state-hygiene"}',
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /trace index contains current story entry: US900/);
  assert.match(result.stdout, /trace index contains current task entry: H900/);
});

test("check-state strict mode rejects oversized trace index", () => {
  const stateRoot = createStateRoot({
    traceIndex: [
      "version: 1",
      "current_files:",
      "  project_context: docs/current/PROJECT_CONTEXT.md",
      "  story_queue: docs/current/STORY_QUEUE.yaml",
      "  active_tasks: docs/current/ACTIVE_TASKS.yaml",
      "  blockers: docs/current/BLOCKERS.md",
      ...Array.from({ length: 520 }, (_, index) => `  extra_${index}: docs/raw/source.md`),
      "stories:",
      "  US900:",
      "    file: docs/raw/source.md",
      "tasks:",
      "  H900:",
      "    file: docs/raw/source.md",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict"]);

  assert.notEqual(result.status, 0, "expected strict mode to fail");
  assert.match(result.stdout, /TRACE_INDEX.yaml line budget/);
});
