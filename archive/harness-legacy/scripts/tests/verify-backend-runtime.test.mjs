import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(import.meta.dirname, "../..");
const verifierScript = path.join(rootDir, "scripts/verify-backend-runtime.sh");
const supportedPython =
  process.env.BPO_SUPPORTED_PYTHON312 ?? "/Users/mac/.local/bin/python3";
const unsupportedPython =
  process.env.BPO_UNSUPPORTED_SYSTEM_PYTHON ?? "/usr/bin/python3";

test("backend verifier accepts the supported Python 3.12 runtime", () => {
  assert.ok(
    existsSync(supportedPython),
    `expected supported python at ${supportedPython}`,
  );

  const result = spawnSync("bash", [verifierScript, "--print-path"], {
    cwd: rootDir,
    encoding: "utf8",
    env: {
      ...process.env,
      BPO_BACKEND_PYTHON: supportedPython,
    },
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.stdout.trim(), supportedPython);
});

test("backend verifier rejects unsupported system Python versions clearly", (t) => {
  if (!existsSync(unsupportedPython)) {
    t.skip(`unsupported runtime probe is unavailable: ${unsupportedPython}`);
    return;
  }

  const result = spawnSync("bash", [verifierScript, "--print-path"], {
    cwd: rootDir,
    encoding: "utf8",
    env: {
      ...process.env,
      BPO_BACKEND_PYTHON: unsupportedPython,
    },
  });

  assert.notEqual(result.status, 0, "expected unsupported python to fail");
  assert.match(
    result.stderr,
    /unsupported backend runtime|expected Python 3\.12/i,
  );
});
