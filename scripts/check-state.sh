#!/usr/bin/env bash
set -u

ROOT_DIR="${BPO_STATE_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
MODE="warning"

for arg in "$@"; do
  case "$arg" in
    --strict)
      MODE="strict"
      ;;
    --repair-scope)
      MODE="repair-scope"
      ;;
    *)
      echo "check-state: unknown argument: $arg" >&2
      exit 2
      ;;
  esac
done

ROOT_DIR="$ROOT_DIR" MODE="$MODE" node <<'NODE'
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const rootDir = process.env.ROOT_DIR;
const mode = process.env.MODE ?? "warning";
const allowedStatuses = new Set(["ready", "in_progress", "blocked"]);
const currentFiles = [
  "docs/current/PROJECT_CONTEXT.md",
  "docs/current/STORY_QUEUE.yaml",
  "docs/current/ACTIVE_TASKS.yaml",
  "docs/current/BLOCKERS.md",
  "docs/registry/TRACE_INDEX.yaml",
  "docs/registry/DECISION_INDEX.yaml",
];
const lineBudgets = [
  ["docs/current/PROJECT_CONTEXT.md", 160],
  ["docs/current/STORY_QUEUE.yaml", 200],
  ["docs/current/ACTIVE_TASKS.yaml", 220],
  ["docs/current/BLOCKERS.md", 120],
  ["docs/registry/TRACE_INDEX.yaml", 480],
];
const requiredTaskFields = [
  "gate",
  "branch",
  "allowed_files",
  "forbidden_files",
  "stop_conditions",
  "acceptance_ref",
  "verification",
  "evidence_expected",
];

let warnings = 0;

function warn(message) {
  warnings += 1;
  console.log(`WARN: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
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

  return body.split(",").map((item) => cleanScalar(item)).filter(Boolean);
}

function parseCurrentItems(relativePath, sectionName) {
  if (!fileExists(relativePath)) {
    return [];
  }

  const lines = readFile(relativePath).split(/\r?\n/);
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

    if (/^[A-Za-z_][A-Za-z0-9_]*:/.test(line)) {
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

function parseTraceIndex(relativePath) {
  const result = {
    pathEntries: new Set(),
    storyIds: new Set(),
    taskIds: new Set(),
  };

  if (!fileExists(relativePath)) {
    return result;
  }

  const lines = readFile(relativePath).split(/\r?\n/);
  let section = "";

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    if (/^[A-Za-z_][A-Za-z0-9_]*:/.test(line)) {
      section = line.replace(":", "").trim();
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
      continue;
    }

    if (section === "tasks" && /^  [A-Za-z0-9_-]+:/.test(line)) {
      const match = line.match(/^  ([A-Za-z0-9_-]+):/);
      if (match) {
        result.taskIds.add(match[1]);
      }
      continue;
    }

    if (/^\s*file:\s*/.test(line)) {
      const value = cleanScalar(line.split(":").slice(1).join(":"));
      if (value) {
        result.pathEntries.add(value);
      }
    }
  }

  return result;
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

function globToRegExp(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "<<<DOUBLE_STAR>>>")
    .replace(/\*/g, ".*")
    .replace(/<<<DOUBLE_STAR>>>/g, ".*");

  return new RegExp(`^${escaped}$`);
}

function runGitDiffChecks(tasks) {
  const gitDir = path.join(rootDir, ".git");
  if (!fs.existsSync(gitDir) || tasks.length === 0) {
    return;
  }

  const insideWorkTree = childProcess.spawnSync(
    "git",
    ["-C", rootDir, "rev-parse", "--is-inside-work-tree"],
    { encoding: "utf8" },
  );

  if (insideWorkTree.status !== 0) {
    return;
  }

  const diffResult = childProcess.spawnSync(
    "git",
    ["-C", rootDir, "diff", "--name-only", "--relative", "HEAD", "--"],
    { encoding: "utf8" },
  );

  if (diffResult.status !== 0) {
    warn("unable to inspect git diff for active-task scope validation");
    return;
  }

  const changedFiles = diffResult.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const allowedPatterns = tasks.flatMap((task) =>
    Array.isArray(task.allowed_files) ? task.allowed_files : [],
  );
  const forbiddenPatterns = tasks.flatMap((task) =>
    Array.isArray(task.forbidden_files) ? task.forbidden_files : [],
  );
  const allowedRegexes = allowedPatterns.map(globToRegExp);
  const forbiddenRegexes = forbiddenPatterns.map(globToRegExp);

  for (const changedFile of changedFiles) {
    if (forbiddenRegexes.some((regex) => regex.test(changedFile))) {
      warn(`git diff touches forbidden file: ${changedFile}`);
    } else {
      pass(`git diff avoids forbidden scope for: ${changedFile}`);
    }

    if (
      allowedRegexes.length > 0 &&
      !allowedRegexes.some((regex) => regex.test(changedFile))
    ) {
      warn(`git diff is outside active allowed scope: ${changedFile}`);
    } else if (allowedRegexes.length > 0) {
      pass(`git diff stays inside allowed scope for: ${changedFile}`);
    }
  }
}

for (const relativePath of currentFiles) {
  if (fileExists(relativePath)) {
    pass(`${relativePath} exists`);
  } else {
    warn(`${relativePath} is missing`);
  }
}

const stories = parseCurrentItems("docs/current/STORY_QUEUE.yaml", "stories");
const tasks = parseCurrentItems("docs/current/ACTIVE_TASKS.yaml", "tasks");
const traceIndex = parseTraceIndex("docs/registry/TRACE_INDEX.yaml");
const gateSlugs = parseGateSlugs("docs/quality/GATE_REGISTRY.md");
const traceContent = fileExists("docs/registry/TRACE_INDEX.yaml")
  ? readFile("docs/registry/TRACE_INDEX.yaml")
  : "";

const duplicateStoryIds = findDuplicateIds(stories);
if (duplicateStoryIds.length > 0) {
  warn(`duplicate story IDs in docs/current/STORY_QUEUE.yaml: ${duplicateStoryIds.join(", ")}`);
} else {
  pass("story IDs are unique");
}

const duplicateTaskIds = findDuplicateIds(tasks);
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

const currentStoryIds = new Set(stories.map((story) => story.id).filter(Boolean));
for (const task of tasks) {
  for (const storyId of Array.isArray(task.story_ids) ? task.story_ids : []) {
    if (currentStoryIds.has(storyId)) {
      pass(`active task references current story ${storyId}`);
    } else {
      warn(`active task references missing current story ${storyId}`);
    }
  }
}

for (const task of tasks) {
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
}

if (traceContent) {
  if (/(^|[ \t])status[ \t]*:/.test(traceContent)) {
    warn("docs/registry/TRACE_INDEX.yaml must not contain lifecycle state fields");
  } else {
    pass("TRACE_INDEX.yaml does not contain lifecycle state fields");
  }
}

for (const relativePath of traceIndex.pathEntries) {
  if (!relativePath) {
    continue;
  }
  if (fileExists(relativePath)) {
    pass(`registry path exists: ${relativePath}`);
  } else {
    warn(`registry path missing: ${relativePath}`);
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

for (const [relativePath, budget] of lineBudgets) {
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

runGitDiffChecks(tasks);

if (warnings > 0) {
  console.log(`check-state completed with ${warnings} warning(s) in ${mode} mode.`);
  if (mode === "strict") {
    console.log("STRICT FAILURE: normal development must stop; only state-repair may proceed until strict state checks pass.");
    process.exit(1);
  }
} else {
  console.log(`check-state passed in ${mode} mode.`);
}
NODE
