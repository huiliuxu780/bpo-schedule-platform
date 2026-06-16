import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

const scannedRoots = ["app", "components", "lib"];
const scannedExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
]);

const requiredFiles = [
  "lib/api-result.ts",
  "lib/api-error.ts",
  "lib/import-api.ts",
];

const requiredExports = [
  {
    file: "lib/api-error.ts",
    exportName: "formatApiError",
    pattern: /export\s+function\s+formatApiError\s*\(/,
  },
  {
    file: "lib/import-api.ts",
    exportName: "fetchImportBatches",
    pattern: /export\s+async\s+function\s+fetchImportBatches\s*\(/,
  },
  {
    file: "lib/import-api.ts",
    exportName: "fetchImportFieldMappingTemplates",
    pattern: /export\s+async\s+function\s+fetchImportFieldMappingTemplates\s*\(/,
  },
];

const guardedHelpers = [
  {
    name: "formatApiError",
    pattern: /\bfunction\s+formatApiError\s*\(/g,
  },
  {
    name: "fetchImportBatches",
    pattern: /\bfunction\s+fetchImportBatches\s*\(/g,
  },
  {
    name: "fetchImportFieldMappingTemplates",
    pattern: /\bfunction\s+fetchImportFieldMappingTemplates\s*\(/g,
  },
];

async function pathExists(absolutePath) {
  try {
    await stat(absolutePath);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function collectSourceFiles(rootDirectory) {
  const collected = [];

  async function walk(currentDirectory) {
    let entries;
    try {
      entries = await readdir(currentDirectory, { withFileTypes: true });
    } catch (error) {
      if (error && error.code === "ENOENT") {
        return;
      }
      throw error;
    }

    for (const entry of entries) {
      const entryPath = path.join(currentDirectory, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".next") {
          continue;
        }
        await walk(entryPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const extension = path.extname(entry.name);
      if (!scannedExtensions.has(extension)) {
        continue;
      }

      collected.push(entryPath);
    }
  }

  await walk(rootDirectory);
  return collected;
}

test("required shared helper files exist", async () => {
  for (const relativePath of requiredFiles) {
    const absolutePath = path.join(repoRoot, relativePath);
    const exists = await pathExists(absolutePath);
    assert.equal(
      exists,
      true,
      `Expected shared helper file to exist: ${relativePath}`,
    );
  }
});

test("shared helper files export the canonical functions", async () => {
  for (const requirement of requiredExports) {
    const absolutePath = path.join(repoRoot, requirement.file);
    const source = await readFile(absolutePath, "utf8");
    assert.match(
      source,
      requirement.pattern,
      `Expected ${requirement.file} to export ${requirement.exportName}`,
    );
  }
});

test("guarded helpers have exactly one function declaration in app/components/lib", async () => {
  const collectedFiles = [];
  for (const relativeRoot of scannedRoots) {
    const absoluteRoot = path.join(repoRoot, relativeRoot);
    const files = await collectSourceFiles(absoluteRoot);
    collectedFiles.push(...files);
  }

  assert.ok(
    collectedFiles.length > 0,
    "Expected to scan at least one source file under app/, components/, or lib/",
  );

  for (const helper of guardedHelpers) {
    const matchingLocations = [];

    for (const sourcePath of collectedFiles) {
      const source = await readFile(sourcePath, "utf8");
      const matches = source.match(helper.pattern);
      if (!matches) {
        continue;
      }

      for (let index = 0; index < matches.length; index += 1) {
        matchingLocations.push(path.relative(repoRoot, sourcePath));
      }
    }

    assert.equal(
      matchingLocations.length,
      1,
      `Expected exactly one "function ${helper.name}" declaration across app/, components/, and lib/, but found ${matchingLocations.length}: ${matchingLocations.join(", ") || "<none>"}`,
    );
  }
});
