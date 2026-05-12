import { createRequire } from "node:module";
import process from "node:process";

const require = createRequire(import.meta.url);
const expectedNodeMajor = Number.parseInt(
  process.env.BPO_EXPECT_NODE_MAJOR ?? "22",
  10,
);
const actualNodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);

const issues = [];

if (actualNodeMajor !== expectedNodeMajor) {
  issues.push(
    `unsupported frontend runtime: expected Node.js ${expectedNodeMajor}, got ${process.version} at ${process.execPath}`,
  );
}

function resolveLightningcssPackage() {
  if (process.platform === "darwin") {
    return `lightningcss-darwin-${process.arch}`;
  }

  return null;
}

function resolveSwcPackage() {
  if (process.platform === "darwin") {
    return `@next/swc-darwin-${process.arch}`;
  }

  return null;
}

function formatError(error) {
  if (!error) {
    return "unknown error";
  }

  return String(error.stack || error.message || error);
}

const nativeChecks = [
  {
    label: "lightningcss native addon",
    packageName: resolveLightningcssPackage(),
  },
  {
    label: "Next.js SWC native addon",
    packageName: resolveSwcPackage(),
  },
];

for (const check of nativeChecks) {
  if (!check.packageName) {
    continue;
  }

  try {
    require(check.packageName);
  } catch (error) {
    issues.push(
      `native addon preflight failed for ${check.label} (${check.packageName}): ${formatError(error)}`,
    );
  }
}

if (issues.length > 0) {
  console.error("frontend native runtime check failed");

  for (const issue of issues) {
    console.error(`- ${issue}`);
  }

  console.error("");
  console.error("recommended fix:");
  console.error(
    "- use Homebrew Node.js 22 via /opt/homebrew/opt/node@22/bin or BPO_NODE22_BIN",
  );
  console.error("- start the frontend with `npm run dev` or `bash scripts/dev.sh`");
  console.error(
    "- if the error persists after switching to Node.js 22, reinstall dependencies with Node.js 22 and clear the local `.next` cache",
  );
  process.exit(1);
}

console.log(
  `frontend native runtime check passed on Node.js ${process.version} at ${process.execPath}`,
);
