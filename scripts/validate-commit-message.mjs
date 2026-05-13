#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const messageFile = process.argv[2];
if (!messageFile) {
  console.error("validate-commit-message: missing commit message file argument");
  process.exit(2);
}

const rootDir = process.env.BPO_STATE_ROOT
  ? path.resolve(process.env.BPO_STATE_ROOT)
  : resolveGitRoot();

const subject = fs.readFileSync(messageFile, "utf8").split(/\r?\n/)[0].trim();
const activeTasksPath = path.join(rootDir, "docs/current/ACTIVE_TASKS.yaml");

if (!fs.existsSync(activeTasksPath)) {
  console.error("validate-commit-message: missing docs/current/ACTIVE_TASKS.yaml");
  process.exit(1);
}

const activeTasks = parseListSection(activeTasksPath, "tasks");
const activeTaskIds = new Set(activeTasks.map((task) => task.id).filter(Boolean));
const activeGates = new Set(activeTasks.map((task) => task.gate).filter(Boolean));
const stagedFiles = getStagedFiles(rootDir);
const genericSubjects = new Set(["update", "misc", "fix stuff", "wip"]);
const businessCodeTouched = stagedFiles.some((file) =>
  /^(app|components|hooks|lib|backend)\//.test(file),
);

if (!subject) {
  fail("empty commit subject is not allowed");
}

if (genericSubjects.has(subject.toLowerCase())) {
  fail(`generic commit subject is not allowed: ${subject}`);
}

for (const prefix of ["state-repair:", "harness:", "audit:"]) {
  if (subject.startsWith(prefix)) {
    validateSpecialPrefix(prefix);
    pass();
  }
}

const taskMatch = subject.match(/^([A-Z][0-9]{3}):\s+.+/);
if (!taskMatch) {
  fail("ordinary commit subjects must start with an active task id, for example `H030: tighten hook guard`");
}

const taskId = taskMatch[1];
if (!activeTaskIds.has(taskId)) {
  fail(`commit subject task id is not a current active task: ${taskId}`);
}

pass();

function resolveGitRoot() {
  const result = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    return process.cwd();
  }
  return result.stdout.trim();
}

function parseListSection(filePath, sectionName) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
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
        current[key] = parseInlineArray(rawValue) ?? cleanScalar(rawValue);
      }
      continue;
    }

    if (/^    [A-Za-z_][A-Za-z0-9_]*:/.test(line) && current) {
      const withoutIndent = line.slice(4);
      const separatorIndex = withoutIndent.indexOf(":");
      const key = withoutIndent.slice(0, separatorIndex).trim();
      const rawValue = withoutIndent.slice(separatorIndex + 1).trim();
      if (rawValue === "") {
        current[key] = [];
        currentListField = key;
      } else {
        current[key] = parseInlineArray(rawValue) ?? cleanScalar(rawValue);
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

function getStagedFiles(repoRoot) {
  const result = spawnSync("git", ["-C", repoRoot, "diff", "--cached", "--name-only"], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    return [];
  }
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function validateSpecialPrefix(prefix) {
  if (prefix === "state-repair:" && ![...activeGates].every((gate) => gate === "state-repair")) {
    fail("state-repair commits require state-repair active tasks");
  }

  if (prefix === "harness:" && ![...activeGates].every((gate) => gate === "state-hygiene") && businessCodeTouched) {
    fail("harness commits cannot include business-code staged files outside a state-hygiene task");
  }

  if (prefix === "audit:" && businessCodeTouched) {
    fail("audit commits cannot include staged business-code files");
  }
}

function fail(message) {
  console.error(`validate-commit-message: ${message}`);
  process.exit(1);
}

function pass() {
  process.exit(0);
}
