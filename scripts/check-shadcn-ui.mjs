#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_SCAN_DIRS = ["app", "components", "hooks", "lib"];
const DEFAULT_BASELINE_PATH = "scripts/shadcn-ui-baseline.json";
const PROJECT_CODE_EXTENSIONS = new Set([".ts", ".tsx"]);

const RULES = [
  {
    id: "no-space-axis",
    message: "Use flex/grid gap utilities instead of space-x/space-y.",
    pattern: /\bspace-[xy]-[^\s"'`<>]+/,
  },
  {
    id: "no-hardcoded-tailwind-colors",
    message: "Use shadcn semantic tokens instead of hardcoded Tailwind color scales.",
    pattern:
      /\b(?:neutral|gray|slate|zinc|stone|amber|emerald|red|blue|green|yellow|orange|purple|pink|rose|cyan|teal|lime|indigo|violet|sky)-[0-9]{2,3}(?:\/[0-9]+)?\b/,
  },
  {
    id: "no-arbitrary-radius",
    message: "Use shadcn radius tokens such as rounded-md or rounded-lg.",
    pattern: /\brounded-\[[^\]]+\]/,
  },
];

export async function runShadcnUiChecks({
  baselinePath,
  rootDir = process.cwd(),
  scanDirs = DEFAULT_SCAN_DIRS,
} = {}) {
  const normalizedRoot = path.resolve(rootDir);
  const baseline = await readBaseline(
    path.resolve(normalizedRoot, baselinePath ?? DEFAULT_BASELINE_PATH)
  );
  const violations = [
    ...(await checkProjectConfig(normalizedRoot)),
    ...(await checkProjectFiles({ rootDir: normalizedRoot, scanDirs })),
  ];
  const allowed = new Set(baseline.allowedViolations ?? []);
  const baselined = violations.filter((violation) => allowed.has(violation.fingerprint));
  const failed = violations.filter((violation) => !allowed.has(violation.fingerprint));

  return {
    baselined,
    failed,
    scannedFiles: new Set(violations.map((violation) => violation.file)).size,
    violations,
  };
}

async function checkProjectConfig(rootDir) {
  const configPath = path.join(rootDir, "components.json");
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const checks = [
    ["style", config.style === "radix-nova", "components.json must keep style radix-nova."],
    ["rsc", config.rsc === true, "components.json must keep React Server Components enabled."],
    ["tsx", config.tsx === true, "components.json must keep TSX enabled."],
    [
      "iconLibrary",
      config.iconLibrary === "lucide",
      "components.json must keep lucide as the icon library.",
    ],
    [
      "aliases.ui",
      config.aliases?.ui === "@/components/ui",
      "components.json must keep the ui alias at @/components/ui.",
    ],
  ];

  return checks
    .filter(([, passes]) => !passes)
    .map(([token, , message]) =>
      createViolation({
        file: "components.json",
        line: 1,
        message,
        ruleId: "shadcn-project-config",
        token,
        sourceLine: token,
      })
    );
}

async function checkProjectFiles({ rootDir, scanDirs }) {
  const files = (
    await Promise.all(
      scanDirs.map((scanDir) => collectSourceFiles(path.join(rootDir, scanDir), rootDir))
    )
  ).flat();
  const violations = [];

  for (const filePath of files) {
    const relativePath = normalizePath(path.relative(rootDir, filePath));
    const source = await readFile(filePath, "utf8");
    const lines = source.split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const rule of RULES) {
        const match = line.match(rule.pattern);
        if (!match) {
          continue;
        }

        violations.push(
          createViolation({
            file: relativePath,
            line: index + 1,
            message: rule.message,
            ruleId: rule.id,
            sourceLine: line,
            token: match[0],
          })
        );
      }
    });
  }

  return violations;
}

async function collectSourceFiles(directoryPath, rootDir) {
  let entries;
  try {
    entries = await readdir(directoryPath, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name);
      const relativePath = normalizePath(path.relative(rootDir, entryPath));

      if (entry.isDirectory()) {
        if (relativePath === "components/ui" || relativePath.startsWith("components/ui/")) {
          return [];
        }

        return collectSourceFiles(entryPath, rootDir);
      }

      if (!PROJECT_CODE_EXTENSIONS.has(path.extname(entry.name))) {
        return [];
      }

      return [entryPath];
    })
  );

  return files.flat();
}

async function readBaseline(baselinePath) {
  try {
    return JSON.parse(await readFile(baselinePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return { allowedViolations: [] };
    }

    throw error;
  }
}

function createViolation({ file, line, message, ruleId, sourceLine, token }) {
  const normalizedLine = sourceLine.trim().replace(/\s+/g, " ");

  return {
    file,
    fingerprint: `${file}:${line}|${ruleId}|${token}|${hashText(normalizedLine)}`,
    line,
    message,
    ruleId,
    token,
  };
}

function hashText(value) {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash.toString(16).padStart(8, "0");
}

function normalizePath(value) {
  return value.split(path.sep).join("/");
}

function formatViolation(violation) {
  return [
    `${violation.file}:${violation.line}`,
    violation.ruleId,
    violation.message,
    `token: ${violation.token}`,
    `baseline: ${violation.fingerprint}`,
  ].join("\n  ");
}

async function main() {
  const result = await runShadcnUiChecks();

  if (result.failed.length > 0) {
    console.error("shadcn/ui convention check failed:");
    console.error(result.failed.map(formatViolation).join("\n\n"));
    console.error(
      `\n${result.failed.length} new violation(s), ${result.baselined.length} documented baseline violation(s).`
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `shadcn/ui convention check passed (${result.baselined.length} documented baseline violation(s), ${result.violations.length} total finding(s)).`
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
