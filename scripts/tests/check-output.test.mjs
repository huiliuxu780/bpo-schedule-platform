import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(import.meta.dirname, "../..");

function runStepProbe(script, env = {}) {
  return spawnSync("bash", ["-lc", script], {
    cwd: rootDir,
    encoding: "utf8",
    env: {
      ...process.env,
      ...env,
    },
  });
}

test("quiet check step hides successful command output and prints a pass summary", () => {
  const result = runStepProbe(
    [
      "source scripts/check-output.sh",
      "run_check_step 'sample success' bash -lc 'echo hidden-success-output'",
      "echo after-step",
    ].join("; "),
    { BPO_CHECK_OUTPUT_MODE: "quiet" },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /PASS: sample success/);
  assert.match(result.stdout, /after-step/);
  assert.doesNotMatch(result.stdout, /hidden-success-output/);
});

test("quiet check step expands captured output when a command fails", () => {
  const result = runStepProbe(
    [
      "source scripts/check-output.sh",
      "run_check_step 'sample failure' bash -lc 'echo visible-failure-output; exit 7'",
    ].join("; "),
    { BPO_CHECK_OUTPUT_MODE: "quiet" },
  );

  assert.equal(result.status, 7);
  assert.match(result.stderr, /FAIL: sample failure/);
  assert.match(result.stderr, /visible-failure-output/);
});

test("verbose check step preserves direct command output", () => {
  const result = runStepProbe(
    [
      "source scripts/check-output.sh",
      "run_check_step 'sample verbose' bash -lc 'echo direct-output'",
    ].join("; "),
    { BPO_CHECK_OUTPUT_MODE: "verbose" },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /direct-output/);
  assert.doesNotMatch(result.stdout, /PASS: sample verbose/);
});
