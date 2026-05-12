import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(import.meta.dirname, "../..");
const preflightScript = path.join(
  rootDir,
  "scripts/verify-frontend-native-runtime.mjs",
);
const supportedNode = "/opt/homebrew/opt/node@22/bin/node";
const unsupportedNode =
  process.env.BPO_UNSUPPORTED_NODE_BIN ?? "/Users/mac/.local/bin/node";
const codexPath =
  process.env.BPO_TEST_NODE24_PATH ??
  "/Users/mac/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin";

test("preflight passes on the supported Node.js 22 runtime", () => {
  assert.ok(
    existsSync(supportedNode),
    `expected supported node at ${supportedNode}`,
  );

  const result = spawnSync(supportedNode, [preflightScript], {
    cwd: rootDir,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /frontend native runtime check passed/i);
});

test("preflight fails clearly on the unsupported default runtime", (t) => {
  if (!existsSync(unsupportedNode)) {
    t.skip(`unsupported runtime probe is unavailable: ${unsupportedNode}`);
    return;
  }

  if (realpathSync(unsupportedNode) === realpathSync(supportedNode)) {
    t.skip("unsupported runtime probe resolves to the supported node binary");
    return;
  }

  const result = spawnSync(unsupportedNode, [preflightScript], {
    cwd: rootDir,
    encoding: "utf8",
  });

  assert.notEqual(result.status, 0, "expected unsupported runtime to fail");
  assert.match(
    result.stderr,
    /unsupported frontend runtime|native addon preflight failed|code signature/i,
  );
});

test("npm run dev uses the hardened wrapper entrypoint", () => {
  const result = spawnSync("npm", ["run", "dev", "--", "--help"], {
    cwd: rootDir,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: codexPath,
      BPO_NODE22_BIN: path.dirname(supportedNode),
      BPO_DEV_DRY_RUN: "1",
    },
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /frontend native runtime check passed/i);
  assert.match(result.stdout, /frontend dev dry run passed/i);
});
