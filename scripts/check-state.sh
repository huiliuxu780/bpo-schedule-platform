#!/usr/bin/env bash
set -u

ROOT_DIR="${BPO_STATE_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
MODE="warning"
DIFF_MODE=""

for arg in "$@"; do
  case "$arg" in
    --strict)
      MODE="strict"
      ;;
    --repair-scope)
      MODE="repair-scope"
      ;;
    --diff=working)
      DIFF_MODE="working"
      ;;
    --diff=staged)
      DIFF_MODE="staged"
      ;;
    --diff=none)
      DIFF_MODE="none"
      ;;
    *)
      echo "check-state: unknown argument: $arg" >&2
      exit 2
      ;;
  esac
done

if [[ -z "$DIFF_MODE" ]]; then
  if [[ "$MODE" == "repair-scope" ]]; then
    DIFF_MODE="none"
  else
    DIFF_MODE="working"
  fi
fi

ROOT_DIR="$ROOT_DIR" MODE="$MODE" DIFF_MODE="$DIFF_MODE" node <<'NODE'
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const rootDir = process.env.ROOT_DIR;
const mode = process.env.MODE ?? "warning";
const diffMode = process.env.DIFF_MODE ?? "working";
const strictLike = mode === "strict" || mode === "repair-scope";
const allowedStatuses = new Set(["ready", "in_progress", "blocked"]);
const requiredTaskFields = [
  "gate",
  "branch",
  "allowed_files",
  "traceability_files",
  "forbidden_files",
  "stop_conditions",
  "acceptance_ref",
  "verification",
  "evidence_expected",
];
const currentFiles = [
  "docs/current/PROJECT_CONTEXT.md",
  "docs/current/STORY_QUEUE.yaml",
  "docs/current/ACTIVE_TASKS.yaml",
  "docs/current/BLOCKERS.md",
  "docs/registry/TRACE_INDEX.yaml",
  "docs/registry/DECISION_INDEX.yaml",
];
const currentLineBudgets = [
  ["docs/current/PROJECT_CONTEXT.md", 180],
  ["docs/current/STORY_QUEUE.yaml", 200],
  ["docs/current/ACTIVE_TASKS.yaml", 260],
  ["docs/current/BLOCKERS.md", 120],
];
const traceIndexWarningBudget = 420;
const traceIndexStrictBudget = 480;

let warnings = 0;
let softWarnings = 0;

function log(kind, message) {
  console.log(`${kind}: ${message}`);
}

function warn(message) {
  warnings += 1;
  log("WARN", message);
}

function softWarn(message) {
  softWarnings += 1;
  log("WARN", message);
}

function pass(message) {
  log("PASS", message);
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function cleanScalar(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "null") {
    return null;
  }
  return trimmed;
}

function parseInlineArray(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return null;
  }
  const body = trimmed.slice(1, -1).trim();
  if (!body) {
    return [];
  }
  return body
    .split(",")
    .map((item) => cleanScalar(item))
    .filter((item) => item !== "");
}

function parseListSection(relativePath, sectionName) {
  if (!fileExists(relativePath)) {
    return [];
  }
  return parseListSectionFromContent(readFile(relativePath), sectionName);
}

function parseListSectionFromContent(content, sectionName) {
  const lines = content.split(/\r?\n/);
  const items = [];
  let inSection = false;
  let current = null;
  let currentListField = null;

  const pushCurrent = () => {
    if (current) {
      items.push(current);
      current = null;
      currentListField = null;
    }
  };

  for (const line of lines) {
    if (!inSection) {
      if (line.trim() === `${sectionName}:`) {
        inSection = true;
      }
      continue;
    }

    if (!line.trim()) {
      continue;
    }

    if (/^[A-Za-z_][A-Za-z0-9_]*:/.test(line) && !line.startsWith("  ")) {
      pushCurrent();
      break;
    }

    if (/^  - /.test(line)) {
      pushCurrent();
      current = {};
      currentListField = null;
      const remainder = line.slice(4);
      const separatorIndex = remainder.indexOf(":");
      if (separatorIndex >= 0) {
        const key = remainder.slice(0, separatorIndex).trim();
        const rawValue = remainder.slice(separatorIndex + 1).trim();
        const inlineArray = parseInlineArray(rawValue);
        current[key] = inlineArray ?? cleanScalar(rawValue);
      }
      continue;
    }

    if (/^    [A-Za-z_][A-Za-z0-9_]*:/.test(line) && current) {
      const withoutIndent = line.slice(4);
      const separatorIndex = withoutIndent.indexOf(":");
      const key = withoutIndent.slice(0, separatorIndex).trim();
      const rawValue = withoutIndent.slice(separatorIndex + 1).trim();
      const inlineArray = parseInlineArray(rawValue);
      if (rawValue === "") {
        current[key] = [];
        currentListField = key;
      } else {
        current[key] = inlineArray ?? cleanScalar(rawValue);
        currentListField = null;
      }
      continue;
    }

    if (/^      - /.test(line) && current && currentListField) {
      current[currentListField].push(cleanScalar(line.slice(8)));
    }
  }

  pushCurrent();
  return items;
}

function parseTopLevelObject(relativePath, sectionName) {
  if (!fileExists(relativePath)) {
    return null;
  }
  return parseTopLevelObjectFromContent(readFile(relativePath), sectionName);
}

function parseTopLevelObjectFromContent(content, sectionName) {
  const lines = content.split(/\r?\n/);
  let inSection = false;
  let object = null;
  let currentListField = null;

  for (const line of lines) {
    if (!inSection) {
      if (line.trim() === `${sectionName}:`) {
        inSection = true;
        object = {};
      }
      continue;
    }

    if (!line.trim()) {
      continue;
    }

    if (/^[A-Za-z_][A-Za-z0-9_]*:/.test(line) && !line.startsWith("  ")) {
      break;
    }

    if (/^  [A-Za-z_][A-Za-z0-9_]*:/.test(line)) {
      const withoutIndent = line.slice(2);
      const separatorIndex = withoutIndent.indexOf(":");
      const key = withoutIndent.slice(0, separatorIndex).trim();
      const rawValue = withoutIndent.slice(separatorIndex + 1).trim();
      const inlineArray = parseInlineArray(rawValue);
      if (rawValue === "") {
        object[key] = [];
        currentListField = key;
      } else {
        object[key] = inlineArray ?? cleanScalar(rawValue);
        currentListField = null;
      }
      continue;
    }

    if (/^    - /.test(line) && object && currentListField) {
      object[currentListField].push(cleanScalar(line.slice(6)));
    }
  }

  return object;
}

function parseProjectContextSummary(relativePath) {
  if (!fileExists(relativePath)) {
    return null;
  }
  const content = readFile(relativePath);
  const match = content.match(/```yaml\s+current_summary:\s*([\s\S]*?)```/);
  if (!match) {
    return null;
  }

  const summary = {};
  let currentListField = null;
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.replace(/\t/g, "  ");
    if (/^(?:  )?[A-Za-z_][A-Za-z0-9_]*:/.test(line)) {
      const withoutIndent = line.startsWith("  ") ? line.slice(2) : line;
      const separatorIndex = withoutIndent.indexOf(":");
      const key = withoutIndent.slice(0, separatorIndex).trim();
      const rawValue = withoutIndent.slice(separatorIndex + 1).trim();
      const inlineArray = parseInlineArray(rawValue);
      if (rawValue === "") {
        summary[key] = [];
        currentListField = key;
      } else {
        summary[key] = inlineArray ?? cleanScalar(rawValue);
        currentListField = null;
      }
    } else if (/^(?:    )?- /.test(line) && currentListField) {
      summary[currentListField].push(cleanScalar(line.replace(/^(?:    )?- /, "")));
    }
  }
  return summary;
}

function findDuplicateIds(items) {
  const counts = new Map();
  for (const item of items) {
    if (!item.id) {
      continue;
    }
    counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id]) => id);
}

function parseGateSlugs(relativePath) {
  const slugs = new Set();
  if (!fileExists(relativePath)) {
    return slugs;
  }
  for (const line of readFile(relativePath).split(/\r?\n/)) {
    const match = line.match(/^\|\s*`([^`]+)`\s*\|/);
    if (match) {
      slugs.add(match[1]);
    }
  }
  return slugs;
}

function parseTraceIndex(relativePath) {
  const result = {
    pathEntries: new Set(),
    storyIds: new Set(),
    taskIds: new Set(),
    archiveRefs: [],
  };
  if (!fileExists(relativePath)) {
    return result;
  }

  const lines = readFile(relativePath).split(/\r?\n/);
  let section = "";
  let currentListField = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    if (/^[A-Za-z_][A-Za-z0-9_]*:/.test(line) && !line.startsWith(" ")) {
      section = line.replace(":", "").trim();
      currentListField = null;
      continue;
    }

    if (section === "current_files" && /^  [A-Za-z_][A-Za-z0-9_]*:/.test(line)) {
      const value = cleanScalar(line.split(":").slice(1).join(":"));
      if (value) {
        result.pathEntries.add(value);
      }
      continue;
    }

    if (section === "stories" && /^  [A-Za-z0-9_-]+:/.test(line)) {
      const match = line.match(/^  ([A-Za-z0-9_-]+):/);
      if (match) {
        result.storyIds.add(match[1]);
      }
      if (/archive_refs:/.test(line)) {
        const inlineArray = parseInlineArray(line.split(":").slice(1).join(":").trim());
        if (inlineArray) {
          result.archiveRefs.push(...inlineArray.filter(Boolean));
        }
      }
      currentListField = null;
      continue;
    }

    if (section === "tasks" && /^  [A-Za-z0-9_-]+:/.test(line)) {
      const match = line.match(/^  ([A-Za-z0-9_-]+):/);
      if (match) {
        result.taskIds.add(match[1]);
      }
      if (/archive_refs:/.test(line)) {
        const inlineArray = parseInlineArray(line.split(":").slice(1).join(":").trim());
        if (inlineArray) {
          result.archiveRefs.push(...inlineArray.filter(Boolean));
        }
      }
      currentListField = null;
      continue;
    }

    if (/^\s*file:\s*/.test(line)) {
      const value = cleanScalar(line.split(":").slice(1).join(":"));
      if (value) {
        result.pathEntries.add(value);
      }
      continue;
    }

    if (/^\s*archive_refs:\s*$/.test(line)) {
      currentListField = "archive_refs";
      continue;
    }

    if (/^\s*archive_refs:\s*\[/.test(line)) {
      const inlineArray = parseInlineArray(line.split(":").slice(1).join(":").trim());
      if (inlineArray) {
        result.archiveRefs.push(...inlineArray.filter(Boolean));
      }
      currentListField = null;
      continue;
    }

    if (/^\s*-\s*/.test(line) && currentListField === "archive_refs") {
      result.archiveRefs.push(cleanScalar(line.replace(/^\s*-\s*/, "")));
    }
  }

  return result;
}

function globToRegExp(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "<<<DOUBLE_STAR>>>")
    .replace(/\*/g, "[^/]*")
    .replace(/<<<DOUBLE_STAR>>>/g, ".*");
  return new RegExp(`^${escaped}$`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isGitRepo() {
  const insideWorkTree = childProcess.spawnSync(
    "git",
    ["-C", rootDir, "rev-parse", "--is-inside-work-tree"],
    { encoding: "utf8" },
  );
  return insideWorkTree.status === 0 && insideWorkTree.stdout.trim() === "true";
}

function getCurrentBranch() {
  const branchResult = childProcess.spawnSync(
    "git",
    ["-C", rootDir, "rev-parse", "--abbrev-ref", "HEAD"],
    { encoding: "utf8" },
  );
  if (branchResult.status !== 0) {
    return null;
  }
  return branchResult.stdout.trim();
}

function readGitFile(revision, relativePath) {
  const showResult = childProcess.spawnSync(
    "git",
    ["-C", rootDir, "show", `${revision}:${relativePath}`],
    { encoding: "utf8" },
  );
  if (showResult.status !== 0) {
    return null;
  }
  return showResult.stdout;
}

function getChangedFiles() {
  if (diffMode === "none" || !isGitRepo()) {
    return [];
  }
  const args =
    diffMode === "staged"
      ? ["-C", rootDir, "diff", "--cached", "--name-only", "--relative", "--"]
      : ["-C", rootDir, "diff", "--name-only", "--relative", "HEAD", "--"];
  const diffResult = childProcess.spawnSync("git", args, { encoding: "utf8" });
  if (diffResult.status !== 0) {
    warn(`unable to inspect git ${diffMode} diff for state validation`);
    return [];
  }
  return diffResult.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function matchesAnyPattern(filePath, patterns) {
  return patterns
    .filter((pattern) => typeof pattern === "string" && pattern.length > 0)
    .some((pattern) => globToRegExp(pattern).test(filePath));
}

function parseAcceptanceRef(value) {
  if (!value || typeof value !== "string") {
    return null;
  }
  const index = value.lastIndexOf("#");
  if (index < 0) {
    return { file: value, id: null };
  }
  return {
    file: value.slice(0, index),
    id: value.slice(index + 1),
  };
}

function acceptanceRefTargetExists(relativePath, targetId) {
  if (!relativePath || !fileExists(relativePath)) {
    return false;
  }
  if (!targetId) {
    return true;
  }
  const content = readFile(relativePath);
  const patterns = [
    new RegExp(`\\bid:\\s*${escapeRegExp(targetId)}\\b`),
    new RegExp(`\\b${escapeRegExp(targetId)}\\b`),
    new RegExp(`\`${escapeRegExp(targetId)}\``),
  ];
  return patterns.some((pattern) => pattern.test(content));
}

function unique(values) {
  return [...new Set(values)];
}

for (const relativePath of currentFiles) {
  if (fileExists(relativePath)) {
    pass(`${relativePath} exists`);
  } else {
    warn(`${relativePath} is missing`);
  }
}

const stories = parseListSection("docs/current/STORY_QUEUE.yaml", "stories");
const tasks = parseListSection("docs/current/ACTIVE_TASKS.yaml", "tasks");
const batch = parseTopLevelObject("docs/current/ACTIVE_TASKS.yaml", "batch");
const projectSummary = parseProjectContextSummary("docs/current/PROJECT_CONTEXT.md");
const traceIndex = parseTraceIndex("docs/registry/TRACE_INDEX.yaml");
const gateSlugs = parseGateSlugs("docs/quality/GATE_REGISTRY.md");
const traceContent = fileExists("docs/registry/TRACE_INDEX.yaml")
  ? readFile("docs/registry/TRACE_INDEX.yaml")
  : "";
const duplicateStoryIds = findDuplicateIds(stories);
const duplicateTaskIds = findDuplicateIds(tasks);

if (duplicateStoryIds.length > 0) {
  warn(`duplicate story IDs in docs/current/STORY_QUEUE.yaml: ${duplicateStoryIds.join(", ")}`);
} else {
  pass("story IDs are unique");
}

if (duplicateTaskIds.length > 0) {
  warn(`duplicate task IDs in docs/current/ACTIVE_TASKS.yaml: ${duplicateTaskIds.join(", ")}`);
} else {
  pass("task IDs are unique");
}

for (const story of stories) {
  if (story.status === "done") {
    warn("docs/current/STORY_QUEUE.yaml must not retain done story history");
  } else if (story.status && !allowedStatuses.has(story.status)) {
    warn(`invalid story status in current queue: ${story.id} -> ${story.status}`);
  } else if (story.status) {
    pass(`story status allowed for ${story.id}: ${story.status}`);
  }
}
if (!stories.some((story) => story.status === "done")) {
  pass("current story queue does not retain done history");
}

for (const task of tasks) {
  if (task.status === "done") {
    warn("docs/current/ACTIVE_TASKS.yaml must not retain done task history");
  } else if (task.status && !allowedStatuses.has(task.status)) {
    warn(`invalid task status in active tasks: ${task.id} -> ${task.status}`);
  } else if (task.status) {
    pass(`task status allowed for ${task.id}: ${task.status}`);
  }
}
if (!tasks.some((task) => task.status === "done")) {
  pass("current active tasks do not retain done history");
}

const currentStoryIds = new Set(stories.map((story) => story.id).filter(Boolean));
const taskById = new Map(tasks.map((task) => [task.id, task]));
const activeStoryRefs = new Set(
  tasks.flatMap((task) => (Array.isArray(task.story_ids) ? task.story_ids : [])),
);

for (const story of stories.filter(
  (item) => item.status === "ready" || item.status === "in_progress",
)) {
  if (activeStoryRefs.has(story.id)) {
    pass(`current story ${story.id} has an active task`);
  } else {
    warn(`current story ${story.id} has no matching active task`);
  }
}

for (const task of tasks) {
  for (const storyId of Array.isArray(task.story_ids) ? task.story_ids : []) {
    if (currentStoryIds.has(storyId)) {
      pass(`active task references current story ${storyId}`);
    } else {
      warn(`active task references missing current story ${storyId}`);
    }
  }

  for (const field of requiredTaskFields) {
    const value = task[field];
    const present = Array.isArray(value) ? value.length > 0 : Boolean(value);
    if (present) {
      pass(`active task ${task.id} has required field ${field}`);
    } else {
      warn(`active task ${task.id} is missing required field ${field}`);
    }
  }

  if (task.gate) {
    if (gateSlugs.has(task.gate)) {
      pass(`active task ${task.id} gate exists: ${task.gate}`);
    } else {
      warn(`active task ${task.id} uses unknown gate: ${task.gate}`);
    }
  }

  const acceptanceRef = parseAcceptanceRef(task.acceptance_ref);
  if (!acceptanceRef?.file) {
    warn(`active task ${task.id} has invalid acceptance_ref`);
  } else if (!fileExists(acceptanceRef.file)) {
    warn(`acceptance_ref file missing for ${task.id}: ${acceptanceRef.file}`);
  } else {
    pass(`acceptance_ref file exists for ${task.id}: ${acceptanceRef.file}`);
    if (!acceptanceRefTargetExists(acceptanceRef.file, acceptanceRef.id)) {
      warn(`acceptance_ref target missing for ${task.id}: ${task.acceptance_ref}`);
    } else {
      pass(`acceptance_ref target exists for ${task.id}: ${task.acceptance_ref}`);
    }
  }
}

if (traceContent) {
  if (/(^|[ \t])status[ \t]*:/.test(traceContent)) {
    warn("docs/registry/TRACE_INDEX.yaml must not contain lifecycle state fields");
  } else {
    pass("TRACE_INDEX.yaml does not contain lifecycle state fields");
  }
}

for (const relativePath of traceIndex.pathEntries) {
  if (fileExists(relativePath)) {
    pass(`registry path exists: ${relativePath}`);
  } else {
    warn(`registry path missing: ${relativePath}`);
  }
}

for (const archiveRef of traceIndex.archiveRefs.filter(Boolean)) {
  if (fileExists(archiveRef)) {
    pass(`archive ref exists: ${archiveRef}`);
  } else {
    warn(`archive ref missing: ${archiveRef}`);
  }
}

for (const storyId of currentStoryIds) {
  if (traceIndex.storyIds.has(storyId)) {
    pass(`trace index contains current story entry: ${storyId}`);
  } else {
    warn(`trace index missing story trace entry: ${storyId}`);
  }
}

for (const taskId of tasks.map((task) => task.id).filter(Boolean)) {
  if (traceIndex.taskIds.has(taskId)) {
    pass(`trace index contains current task entry: ${taskId}`);
  } else {
    warn(`trace index missing task trace entry: ${taskId}`);
  }
}

const storyQueueContent = fileExists("docs/current/STORY_QUEUE.yaml")
  ? readFile("docs/current/STORY_QUEUE.yaml")
  : "";
const activeTasksContent = fileExists("docs/current/ACTIVE_TASKS.yaml")
  ? readFile("docs/current/ACTIVE_TASKS.yaml")
  : "";

if (/docs\/archive\/|archive_file:/.test(storyQueueContent) || /docs\/archive\/|archive_file:/.test(activeTasksContent)) {
  warn("current execution queue must not use archive as execution entry");
} else {
  pass("current story queue does not execute from archive");
}

if (projectSummary) {
  const queueState =
    stories.length === 0
      ? "idle"
      : stories.every((story) => story.status === "blocked")
        ? "blocked"
        : "active";
  if (projectSummary.queue_state === queueState) {
    pass(`project context queue_state matches current queue: ${queueState}`);
  } else {
    warn(`project context queue_state mismatch: expected ${queueState}, got ${projectSummary.queue_state}`);
  }

  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const expectedInProgress = inProgressTasks.length === 1 ? inProgressTasks[0].id : null;
  if ((projectSummary.in_progress_task ?? null) === expectedInProgress) {
    pass(`project context in_progress_task matches current state: ${expectedInProgress ?? "null"}`);
  } else {
    warn(`project context in_progress_task mismatch: expected ${expectedInProgress ?? "null"}, got ${projectSummary.in_progress_task ?? "null"}`);
  }

  const readyTaskIds = tasks.filter((task) => task.status === "ready").map((task) => task.id);
  const summaryReadyTaskIds = Array.isArray(projectSummary.ready_tasks) ? projectSummary.ready_tasks : [];
  if (JSON.stringify(summaryReadyTaskIds) === JSON.stringify(readyTaskIds)) {
    pass("project context ready_tasks matches active task state");
  } else {
    warn(`project context ready_tasks mismatch: expected [${readyTaskIds.join(", ")}], got [${summaryReadyTaskIds.join(", ")}]`);
  }

  const expectedBatchId = batch?.id ?? null;
  if ((projectSummary.active_batch_id ?? null) === expectedBatchId) {
    pass(`project context active_batch_id matches current state: ${expectedBatchId ?? "null"}`);
  } else {
    warn(`project context active_batch_id mismatch: expected ${expectedBatchId ?? "null"}, got ${projectSummary.active_batch_id ?? "null"}`);
  }
}

const traceLineCount = fileExists("docs/registry/TRACE_INDEX.yaml")
  ? readFile("docs/registry/TRACE_INDEX.yaml").split(/\r?\n/).length
  : 0;
if (traceLineCount > traceIndexStrictBudget) {
  warn(`TRACE_INDEX.yaml line budget exceeded (${traceLineCount}/${traceIndexStrictBudget})`);
} else if (traceLineCount > traceIndexWarningBudget) {
  softWarn(`TRACE_INDEX.yaml warning budget exceeded (${traceLineCount}/${traceIndexWarningBudget})`);
} else {
  pass(`TRACE_INDEX.yaml line budget ok (${traceLineCount}/${traceIndexWarningBudget}/${traceIndexStrictBudget})`);
}

for (const [relativePath, budget] of currentLineBudgets) {
  if (!fileExists(relativePath)) {
    continue;
  }
  const lineCount = readFile(relativePath).split(/\r?\n/).length;
  if (lineCount > budget) {
    warn(`${path.basename(relativePath)} line budget exceeded (${lineCount}/${budget})`);
  } else {
    pass(`${relativePath} line budget ok (${lineCount}/${budget})`);
  }
}

const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
let scopeTasks = inProgressTasks;
let scopeBranch = batch?.branch ?? (inProgressTasks.length === 1 ? inProgressTasks[0].branch : null);

if (batch && Object.keys(batch).length > 0) {
  for (const field of ["id", "branch", "task_ids", "scope_reason"]) {
    const value = batch[field];
    const present = Array.isArray(value) ? value.length > 0 : Boolean(value);
    if (present) {
      pass(`batch has required field ${field}`);
    } else {
      warn(`batch is missing required field ${field}`);
    }
  }

  const batchTaskIds = Array.isArray(batch.task_ids) ? batch.task_ids : [];
  const batchTasks = batchTaskIds.map((taskId) => taskById.get(taskId)).filter(Boolean);
  if (batchTasks.length !== batchTaskIds.length) {
    const missingTaskIds = batchTaskIds.filter((taskId) => !taskById.has(taskId));
    warn(`batch references missing task IDs: ${missingTaskIds.join(", ")}`);
  } else {
    pass("batch task_ids all exist in active tasks");
  }

  for (const task of batchTasks) {
    if (task.branch === batch.branch) {
      pass(`batch task ${task.id} matches batch branch ${batch.branch}`);
    } else {
      warn(`batch task ${task.id} branch mismatch: expected ${batch.branch}, got ${task.branch}`);
    }
  }

  const batchGates = unique(batchTasks.map((task) => task.gate).filter(Boolean)).sort();
  if (batchGates.length <= 1) {
    pass("batch gate combination uses a single gate");
  } else {
    const allowedCombo = Array.isArray(batch.allowed_gate_combo)
      ? [...batch.allowed_gate_combo].sort()
      : [];
    if (JSON.stringify(batchGates) === JSON.stringify(allowedCombo)) {
      pass(`batch gate combo explicitly allowed: ${batchGates.join(" + ")}`);
    } else {
      warn(`batch gate combo not explicitly allowed: ${batchGates.join(" + ")}`);
    }
  }

  scopeTasks = batchTasks;
  scopeBranch = batch.branch ?? scopeBranch;
}

const changedFiles = getChangedFiles();
const currentBranch = isGitRepo() ? getCurrentBranch() : null;

if (scopeTasks.length === 0 && changedFiles.length > 0) {
  const previousActiveContent = isGitRepo() ? readGitFile("HEAD", "docs/current/ACTIVE_TASKS.yaml") : null;
  const previousTasks = previousActiveContent
    ? parseListSectionFromContent(previousActiveContent, "tasks")
    : [];
  const previousBatch = previousActiveContent
    ? parseTopLevelObjectFromContent(previousActiveContent, "batch")
    : null;
  const previousTaskById = new Map(previousTasks.map((task) => [task.id, task]));
  const previousInProgressTasks = previousTasks.filter((task) => task.status === "in_progress");
  const closeoutTouchesCurrent = changedFiles.some((file) => file.startsWith("docs/current/"));

  if (previousInProgressTasks.length > 0 && closeoutTouchesCurrent) {
    if (previousBatch && Object.keys(previousBatch).length > 0 && Array.isArray(previousBatch.task_ids)) {
      scopeTasks = previousBatch.task_ids
        .map((taskId) => previousTaskById.get(taskId))
        .filter(Boolean);
      scopeBranch = previousBatch.branch ?? scopeBranch;
    } else {
      scopeTasks = previousInProgressTasks;
      scopeBranch = previousInProgressTasks.length === 1 ? previousInProgressTasks[0].branch : scopeBranch;
    }
    pass("closeout transition detected; diff scope derived from HEAD active task contract");
  } else if (
    closeoutTouchesCurrent &&
    changedFiles.every(
      (file) =>
        !/^(app|components|hooks|lib|backend)\//.test(file) &&
        !/^(package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(file),
    )
  ) {
    pass("docs/scripts closeout diff allowed without an active task");
  } else {
    warn(`git ${diffMode} diff exists but there is no in_progress task`);
  }
}

if (!batch && inProgressTasks.length > 1) {
  warn("multiple in_progress tasks require an explicit batch contract");
}

if (currentBranch && scopeBranch) {
  if (currentBranch === scopeBranch) {
    pass(`current git branch matches active task branch: ${currentBranch}`);
  } else {
    warn(`current git branch mismatch: expected ${scopeBranch}, got ${currentBranch}`);
  }
}

const allowedPatterns = unique(
  scopeTasks.flatMap((task) => [
    ...(Array.isArray(task.allowed_files) ? task.allowed_files : []),
    ...(Array.isArray(task.traceability_files) ? task.traceability_files : []),
  ]),
);
const forbiddenPatterns = unique(
  scopeTasks.flatMap((task) =>
    Array.isArray(task.forbidden_files) ? task.forbidden_files : [],
  ),
);
const scopeGates = unique(scopeTasks.map((task) => task.gate).filter(Boolean));
const stateGateOnly = scopeGates.every((gate) => gate === "state-hygiene" || gate === "state-repair");

for (const changedFile of changedFiles) {
  if (matchesAnyPattern(changedFile, forbiddenPatterns)) {
    warn(`git ${diffMode} diff touches forbidden file: ${changedFile}`);
  } else if (forbiddenPatterns.length > 0) {
    pass(`git ${diffMode} diff avoids forbidden scope for: ${changedFile}`);
  }

  if (allowedPatterns.length > 0 && !matchesAnyPattern(changedFile, allowedPatterns)) {
    warn(`git ${diffMode} diff is outside active allowed scope: ${changedFile}`);
  } else if (allowedPatterns.length > 0) {
    pass(`git ${diffMode} diff stays inside allowed scope for: ${changedFile}`);
  }

  if (!stateGateOnly && (changedFile.startsWith("docs/current/") || changedFile.startsWith("docs/registry/"))) {
    warn(`product task diff must not modify current or registry state: ${changedFile}`);
  }
}

if (warnings > 0 || softWarnings > 0) {
  console.log(`check-state completed with ${warnings + softWarnings} warning(s) in ${mode} mode (diff=${diffMode}).`);
  if (strictLike && warnings > 0) {
    if (mode === "repair-scope") {
      console.log("REPAIR FAILURE: state-repair is incomplete; fix current/registry state before resuming normal development.");
    } else {
      console.log("STRICT FAILURE: normal development must stop; only state-repair may proceed until strict state checks pass.");
    }
    process.exit(1);
  }
} else {
  console.log(`check-state passed in ${mode} mode (diff=${diffMode}).`);
}
NODE
