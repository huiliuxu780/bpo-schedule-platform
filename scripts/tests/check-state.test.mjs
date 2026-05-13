import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(import.meta.dirname, "../..");
const checkStateScript = path.join(rootDir, "scripts/check-state.sh");

function writeRelative(stateRoot, relativePath, content) {
  mkdirSync(path.join(stateRoot, path.dirname(relativePath)), { recursive: true });
  writeFileSync(path.join(stateRoot, relativePath), content);
}

function defaultBacklog() {
  return [
    "tasks:",
    "  - id: H900",
    '    title: "state check fixture"',
    "  - id: H901",
    '    title: "ready fixture"',
    "  - id: F900",
    '    title: "frontend fixture"',
    "  - id: Q900",
    '    title: "qa fixture"',
    "",
  ].join("\n");
}

function defaultProjectContext() {
  return [
    "# Current Project Context",
    "",
    "```yaml",
    "current_summary:",
    "  queue_state: active",
    "  active_batch_id: null",
    "  in_progress_task: H900",
    "  ready_tasks: []",
    "```",
    "",
  ].join("\n");
}

function defaultStoryQueue() {
  return [
    "version: 1",
    "stories:",
    "  - id: US900",
    "    status: in_progress",
    "    task_ids: [H900]",
    "",
  ].join("\n");
}

function defaultActiveTasks() {
  return [
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
    "      - docs/quality/**",
    "      - scripts/**",
    "      - tasks/backlog.yaml",
    "    traceability_files:",
    "      - tasks/backlog.yaml",
    "    forbidden_files:",
    "      - app/**",
    "    stop_conditions:",
    "      - verification failed",
    "    acceptance_ref: tasks/backlog.yaml#H900",
    "    verification:",
    "      - bash scripts/check-state.sh --strict --diff=working",
    "    evidence_expected:",
    "      - strict state check passes",
    "",
  ].join("\n");
}

function defaultTraceIndex() {
  return [
    "version: 1",
    "current_files:",
    "  project_context: docs/current/PROJECT_CONTEXT.md",
    "  story_queue: docs/current/STORY_QUEUE.yaml",
    "  active_tasks: docs/current/ACTIVE_TASKS.yaml",
    "  blockers: docs/current/BLOCKERS.md",
    "stories:",
    '  US900: {file: "docs/user-stories.md", requirement_ids: ["R900"], task_ids: ["H900"], archive_refs: []}',
    "tasks:",
    '  H900: {file: "tasks/backlog.yaml", story_ids: ["US900"], gate: "state-hygiene"}',
    "requirements:",
    '  R900: {file: "docs/raw-requirements.md", story_ids: ["US900"], task_ids: ["H900"]}',
    "",
  ].join("\n");
}

function defaultGateRegistry() {
  return [
    "# Gate Registry",
    "",
    "| required_workflow | Gate | Typical Scope | Extra Stop Conditions |",
    "| --- | --- | --- | --- |",
    "| `state-hygiene` | State Hygiene Gate | Current/registry state model | Business implementation |",
    "| `state-repair` | State Repair Gate | Repair inconsistent current/registry/archive index state | Business code |",
    "| `frontend-scaffold` | Frontend Scaffold Gate | Frontend local work | Database |",
    "| `qa` | QA Acceptance Gate | QA closeout | Product feature changes |",
    "",
  ].join("\n");
}

function createStateRoot({
  projectContext,
  storyQueue,
  activeTasks,
  traceIndex,
  gateRegistry,
  backlog,
  extraFiles = {},
} = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), "bpo-state-check-"));

  writeRelative(dir, "docs/current/PROJECT_CONTEXT.md", projectContext ?? defaultProjectContext());
  writeRelative(dir, "docs/current/STORY_QUEUE.yaml", storyQueue ?? defaultStoryQueue());
  writeRelative(dir, "docs/current/ACTIVE_TASKS.yaml", activeTasks ?? defaultActiveTasks());
  writeRelative(dir, "docs/current/BLOCKERS.md", "# Blockers\n");
  writeRelative(dir, "docs/registry/TRACE_INDEX.yaml", traceIndex ?? defaultTraceIndex());
  writeRelative(dir, "docs/registry/DECISION_INDEX.yaml", "version: 1\n");
  writeRelative(dir, "docs/quality/GATE_REGISTRY.md", gateRegistry ?? defaultGateRegistry());
  writeRelative(dir, "tasks/backlog.yaml", backlog ?? defaultBacklog());
  writeRelative(dir, "docs/user-stories.md", "US900\n");
  writeRelative(dir, "docs/raw-requirements.md", "R900\n");

  for (const [relativePath, content] of Object.entries(extraFiles)) {
    writeRelative(dir, relativePath, content);
  }

  return dir;
}

function initGitRepo(stateRoot, branchName = "codex/h900-state-check") {
  const cmds = [
    ["git", ["init", "-b", branchName]],
    ["git", ["config", "user.email", "codex@example.com"]],
    ["git", ["config", "user.name", "Codex"]],
    ["git", ["add", "."]],
    ["git", ["commit", "-m", "fixture"]],
  ];

  for (const [cmd, args] of cmds) {
    const result = spawnSync(cmd, args, {
      cwd: stateRoot,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
  }
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
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /check-state passed in strict mode/);
});

test("check-state strict mode rejects active task missing traceability_files", () => {
  const stateRoot = createStateRoot({
    activeTasks: defaultActiveTasks().replace(/    traceability_files:[\s\S]*?    forbidden_files:/, "    forbidden_files:"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /missing required field traceability_files/);
});

test("check-state strict mode rejects invalid story status", () => {
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
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /invalid story status/);
});

test("check-state strict mode rejects active task with unknown gate", () => {
  const stateRoot = createStateRoot({
    activeTasks: defaultActiveTasks().replace("gate: state-hygiene", "gate: missing-gate"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /unknown gate/);
});

test("check-state strict mode rejects branch mismatch", () => {
  const stateRoot = createStateRoot();
  initGitRepo(stateRoot, "codex/other-branch");
  const result = runCheckState(stateRoot, ["--strict", "--diff=working"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /current git branch mismatch/);
});

test("check-state strict mode rejects missing acceptance_ref file", () => {
  const stateRoot = createStateRoot({
    activeTasks: defaultActiveTasks().replace("tasks/backlog.yaml#H900", "tasks/missing.yaml#H900"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /acceptance_ref file missing/);
});

test("check-state strict mode rejects missing acceptance_ref target id", () => {
  const stateRoot = createStateRoot({
    activeTasks: defaultActiveTasks().replace("tasks/backlog.yaml#H900", "tasks/backlog.yaml#H999"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /acceptance_ref target missing/);
});

test("check-state strict mode rejects staged diff outside the in_progress task scope", () => {
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
      "    traceability_files:",
      "      - tasks/backlog.yaml",
      "    forbidden_files:",
      "      - app/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#H900",
      "    verification:",
      "      - bash scripts/check-state.sh --strict --diff=staged",
      "    evidence_expected:",
      "      - strict state check passes",
      "  - id: H901",
      "    story_ids: [US900]",
      "    status: ready",
      "    gate: state-hygiene",
      "    branch: codex/h900-state-check",
      "    allowed_files:",
      "      - app/**",
      "    traceability_files:",
      "      - tasks/backlog.yaml",
      "    forbidden_files:",
      "      - docs/current/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#H901",
      "    verification:",
      "      - bash scripts/check-state.sh --strict --diff=staged",
      "    evidence_expected:",
      "      - strict state check passes",
      "",
    ].join("\n"),
    extraFiles: { "app/ready.ts": "export const ready = true;\n" },
  });
  initGitRepo(stateRoot);
  writeRelative(stateRoot, "app/ready.ts", "export const ready = false;\n");
  spawnSync("git", ["add", "app/ready.ts"], { cwd: stateRoot, encoding: "utf8" });

  const result = runCheckState(stateRoot, ["--strict", "--diff=staged"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /outside active allowed scope: app\/ready\.ts/);
});

test("check-state strict mode accepts staged diff inside the in_progress scope", () => {
  const stateRoot = createStateRoot();
  initGitRepo(stateRoot);
  writeRelative(stateRoot, "tasks/backlog.yaml", `${defaultBacklog()}# staged\n`);
  spawnSync("git", ["add", "tasks/backlog.yaml"], { cwd: stateRoot, encoding: "utf8" });

  const result = runCheckState(stateRoot, ["--strict", "--diff=staged"]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /stays inside allowed scope/);
});

test("check-state strict mode rejects staged diff when no task is in progress", () => {
  const stateRoot = createStateRoot({
    activeTasks: defaultActiveTasks().replace("status: in_progress", "status: ready"),
  });
  initGitRepo(stateRoot);
  writeRelative(stateRoot, "tasks/backlog.yaml", `${defaultBacklog()}# staged\n`);
  spawnSync("git", ["add", "tasks/backlog.yaml"], { cwd: stateRoot, encoding: "utf8" });

  const result = runCheckState(stateRoot, ["--strict", "--diff=staged"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /no in_progress task/);
});

test("check-state strict mode accepts branch-log-only post-closeout staged diff", () => {
  const stateRoot = createStateRoot({
    projectContext: [
      "# Current Project Context",
      "",
      "```yaml",
      "current_summary:",
      "  queue_state: idle",
      "  active_batch_id: null",
      "  in_progress_task: null",
      "  ready_tasks: []",
      "```",
      "",
    ].join("\n"),
    storyQueue: ["version: 1", "stories: []", ""].join("\n"),
    activeTasks: ["version: 1", "tasks: []", ""].join("\n"),
  });
  initGitRepo(stateRoot);
  writeRelative(stateRoot, "docs/dev/branch-log.md", "# branch log\nbackfill sha\n");
  spawnSync("git", ["add", "docs/dev/branch-log.md"], { cwd: stateRoot, encoding: "utf8" });

  const result = runCheckState(stateRoot, ["--strict", "--diff=staged"]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /traceability-only post-closeout diff allowed/);
});

test("check-state strict mode accepts closeout diff using HEAD active task contract", () => {
  const stateRoot = createStateRoot();
  initGitRepo(stateRoot);
  writeRelative(
    stateRoot,
    "docs/current/PROJECT_CONTEXT.md",
    [
      "# Current Project Context",
      "",
      "```yaml",
      "current_summary:",
      "  queue_state: idle",
      "  active_batch_id: null",
      "  in_progress_task: null",
      "  ready_tasks: []",
      "```",
      "",
    ].join("\n"),
  );
  writeRelative(
    stateRoot,
    "docs/current/STORY_QUEUE.yaml",
    ["version: 1", "stories: []", ""].join("\n"),
  );
  writeRelative(
    stateRoot,
    "docs/current/ACTIVE_TASKS.yaml",
    ["version: 1", "tasks: []", ""].join("\n"),
  );
  writeRelative(stateRoot, "tasks/backlog.yaml", `${defaultBacklog()}# closeout\n`);
  spawnSync("git", ["add", "docs/current/PROJECT_CONTEXT.md", "docs/current/STORY_QUEUE.yaml", "docs/current/ACTIVE_TASKS.yaml", "tasks/backlog.yaml"], {
    cwd: stateRoot,
    encoding: "utf8",
  });

  const result = runCheckState(stateRoot, ["--strict", "--diff=staged"]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /closeout transition detected/);
});

test("check-state strict mode still rejects unrelated no-active-task staged diff", () => {
  const stateRoot = createStateRoot({
    projectContext: [
      "# Current Project Context",
      "",
      "```yaml",
      "current_summary:",
      "  queue_state: idle",
      "  active_batch_id: null",
      "  in_progress_task: null",
      "  ready_tasks: []",
      "```",
      "",
    ].join("\n"),
    storyQueue: ["version: 1", "stories: []", ""].join("\n"),
    activeTasks: ["version: 1", "tasks: []", ""].join("\n"),
  });
  initGitRepo(stateRoot);
  writeRelative(stateRoot, "docs/task-log.md", "# task log\nunscoped edit\n");
  spawnSync("git", ["add", "docs/task-log.md"], { cwd: stateRoot, encoding: "utf8" });

  const result = runCheckState(stateRoot, ["--strict", "--diff=staged"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /no in_progress task/);
});

test("check-state strict mode rejects batch missing scope_reason", () => {
  const stateRoot = createStateRoot({
    activeTasks: [
      "version: 1",
      "batch:",
      "  id: BATCH-900",
      "  branch: codex/h900-state-check",
      "  task_ids: [H900]",
      "tasks:",
      ...defaultActiveTasks().split("\n").slice(2),
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /batch is missing required field scope_reason/);
});

test("check-state strict mode rejects batch referencing a missing task", () => {
  const stateRoot = createStateRoot({
    activeTasks: [
      "version: 1",
      "batch:",
      "  id: BATCH-900",
      "  branch: codex/h900-state-check",
      "  task_ids: [H999]",
      '  scope_reason: "shared scope"',
      "tasks:",
      ...defaultActiveTasks().split("\n").slice(2),
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /batch references missing task IDs: H999/);
});

test("check-state strict mode rejects batch branch mismatch", () => {
  const stateRoot = createStateRoot({
    activeTasks: [
      "version: 1",
      "batch:",
      "  id: BATCH-900",
      "  branch: codex/batch-branch",
      "  task_ids: [H900]",
      '  scope_reason: "shared scope"',
      "tasks:",
      ...defaultActiveTasks().split("\n").slice(2),
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /batch task H900 branch mismatch/);
});

test("check-state strict mode rejects undeclared mixed-gate batch", () => {
  const stateRoot = createStateRoot({
    activeTasks: [
      "version: 1",
      "batch:",
      "  id: BATCH-900",
      "  branch: codex/h900-state-check",
      "  task_ids: [F900, Q900]",
      '  scope_reason: "shared closeout"',
      "tasks:",
      "  - id: F900",
      "    story_ids: [US900]",
      "    status: in_progress",
      "    gate: frontend-scaffold",
      "    branch: codex/h900-state-check",
      "    allowed_files:",
      "      - components/**",
      "    traceability_files:",
      "      - docs/task-log.md",
      "    forbidden_files:",
      "      - docs/current/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#F900",
      "    verification:",
      "      - bash scripts/check-state.sh --strict --diff=none",
      "    evidence_expected:",
      "      - frontend closeout",
      "  - id: Q900",
      "    story_ids: [US900]",
      "    status: ready",
      "    gate: qa",
      "    branch: codex/h900-state-check",
      "    allowed_files:",
      "      - docs/audit-report.md",
      "    traceability_files:",
      "      - docs/task-log.md",
      "    forbidden_files:",
      "      - docs/current/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#Q900",
      "    verification:",
      "      - bash scripts/check-state.sh --strict --diff=none",
      "    evidence_expected:",
      "      - qa closeout",
      "",
    ].join("\n"),
    backlog: [
      "tasks:",
      "  - id: F900",
      "  - id: Q900",
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /batch gate combo not explicitly allowed/);
});

test("check-state strict mode accepts explicitly allowed mixed-gate batch", () => {
  const stateRoot = createStateRoot({
    projectContext: [
      "# Current Project Context",
      "",
      "```yaml",
      "current_summary:",
      "  queue_state: active",
      "  active_batch_id: BATCH-900",
      "  in_progress_task: F900",
      "  ready_tasks: [Q900]",
      "```",
      "",
    ].join("\n"),
    activeTasks: [
      "version: 1",
      "batch:",
      "  id: BATCH-900",
      "  branch: codex/h900-state-check",
      "  task_ids: [F900, Q900]",
      '  scope_reason: "shared closeout"',
      "  allowed_gate_combo: [frontend-scaffold, qa]",
      "tasks:",
      "  - id: F900",
      "    story_ids: [US900]",
      "    status: in_progress",
      "    gate: frontend-scaffold",
      "    branch: codex/h900-state-check",
      "    allowed_files:",
      "      - components/**",
      "    traceability_files:",
      "      - docs/task-log.md",
      "    forbidden_files:",
      "      - docs/current/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#F900",
      "    verification:",
      "      - bash scripts/check-state.sh --strict --diff=staged",
      "    evidence_expected:",
      "      - frontend closeout",
      "  - id: Q900",
      "    story_ids: [US900]",
      "    status: ready",
      "    gate: qa",
      "    branch: codex/h900-state-check",
      "    allowed_files:",
      "      - docs/audit-report.md",
      "    traceability_files:",
      "      - docs/task-log.md",
      "    forbidden_files:",
      "      - docs/current/**",
      "    stop_conditions:",
      "      - verification failed",
      "    acceptance_ref: tasks/backlog.yaml#Q900",
      "    verification:",
      "      - bash scripts/check-state.sh --strict --diff=staged",
      "    evidence_expected:",
      "      - qa closeout",
      "",
    ].join("\n"),
    traceIndex: [
      "version: 1",
      "current_files:",
      "  project_context: docs/current/PROJECT_CONTEXT.md",
      "  story_queue: docs/current/STORY_QUEUE.yaml",
      "  active_tasks: docs/current/ACTIVE_TASKS.yaml",
      "  blockers: docs/current/BLOCKERS.md",
      "stories:",
      '  US900: {file: "docs/user-stories.md", requirement_ids: ["R900"], task_ids: ["F900", "Q900"], archive_refs: []}',
      "tasks:",
      '  F900: {file: "tasks/backlog.yaml", story_ids: ["US900"], gate: "frontend-scaffold"}',
      '  Q900: {file: "tasks/backlog.yaml", story_ids: ["US900"], gate: "qa"}',
      "requirements:",
      '  R900: {file: "docs/raw-requirements.md", story_ids: ["US900"], task_ids: ["F900", "Q900"]}',
      "",
    ].join("\n"),
    backlog: [
      "tasks:",
      "  - id: F900",
      "  - id: Q900",
      "",
    ].join("\n"),
    extraFiles: { "components/x.tsx": "export const x = 1;\n" },
  });
  initGitRepo(stateRoot);
  writeRelative(stateRoot, "components/x.tsx", "export const x = 2;\n");
  spawnSync("git", ["add", "components/x.tsx"], { cwd: stateRoot, encoding: "utf8" });

  const result = runCheckState(stateRoot, ["--strict", "--diff=staged"]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /batch gate combo explicitly allowed/);
});

test("check-state strict mode rejects product-task diff touching docs/current", () => {
  const stateRoot = createStateRoot({
    activeTasks: [
      "version: 1",
      "tasks:",
      "  - id: F900",
      "    story_ids: [US900]",
      "    status: in_progress",
      "    gate: frontend-scaffold",
      "    branch: codex/h900-state-check",
      "    allowed_files:",
      "      - docs/current/**",
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
      "      - scoped product change",
      "",
    ].join("\n"),
    backlog: [
      "tasks:",
      "  - id: F900",
      "",
    ].join("\n"),
  });
  initGitRepo(stateRoot);
  writeRelative(stateRoot, "docs/current/BLOCKERS.md", "# Blockers\nchanged\n");
  spawnSync("git", ["add", "docs/current/BLOCKERS.md"], { cwd: stateRoot, encoding: "utf8" });

  const result = runCheckState(stateRoot, ["--strict", "--diff=staged"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /product task diff must not modify current or registry state/);
});

test("check-state warning mode reports oversized trace index warning budget", () => {
  const stateRoot = createStateRoot({
    traceIndex: [
      ...defaultTraceIndex().trimEnd().split("\n"),
      ...Array.from({ length: 430 }, (_, index) => `# filler ${index}`),
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--diff=none"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /TRACE_INDEX\.yaml warning budget exceeded/);
});

test("check-state strict mode allows oversized trace index warning budget", () => {
  const stateRoot = createStateRoot({
    traceIndex: [
      ...defaultTraceIndex().trimEnd().split("\n"),
      ...Array.from({ length: 430 }, (_, index) => `# filler ${index}`),
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /TRACE_INDEX\.yaml warning budget exceeded/);
});

test("check-state strict mode rejects oversized trace index strict budget", () => {
  const stateRoot = createStateRoot({
    traceIndex: [
      ...defaultTraceIndex().trimEnd().split("\n"),
      ...Array.from({ length: 500 }, (_, index) => `# filler ${index}`),
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /TRACE_INDEX\.yaml line budget exceeded/);
});

test("check-state strict mode rejects missing archive ref paths", () => {
  const stateRoot = createStateRoot({
    traceIndex: [
      "version: 1",
      "current_files:",
      "  project_context: docs/current/PROJECT_CONTEXT.md",
      "  story_queue: docs/current/STORY_QUEUE.yaml",
      "  active_tasks: docs/current/ACTIVE_TASKS.yaml",
      "  blockers: docs/current/BLOCKERS.md",
      "stories:",
      "  US900:",
      '    file: "docs/user-stories.md"',
      "    archive_refs:",
      '      - "docs/archive/2026-05/missing.md"',
      "tasks:",
      '  H900: {file: "tasks/backlog.yaml", story_ids: ["US900"], gate: "state-hygiene"}',
      "requirements:",
      '  R900: {file: "docs/raw-requirements.md", story_ids: ["US900"], task_ids: ["H900"]}',
      "",
    ].join("\n"),
  });
  const result = runCheckState(stateRoot, ["--strict", "--diff=none"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /archive ref missing/);
});
