import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const errorPagePath = new URL("../../app/error.tsx", import.meta.url);

test("global app error boundary uses shadcn recovery controls", async () => {
  await access(errorPagePath);

  const source = await readFile(errorPagePath, "utf8");

  assert.match(source, /"use client"/);
  assert.match(source, /export default function GlobalError/);
  assert.match(source, /reset:\s*\(\)\s*=>\s*void/);
  assert.equal(source.includes('from "@/components/app-shell"'), true);
  assert.equal(source.includes('from "@/components/ui/alert"'), true);
  assert.equal(source.includes('from "@/components/ui/button"'), true);
  assert.match(source, /<AppShell[\s\S]*title="页面异常"/);
  assert.match(source, /<Alert[\s\S]*variant="destructive"/);
  assert.match(source, /onClick=\{reset\}/);
  assert.match(source, /href="\/dashboard"/);
  assert.doesNotMatch(source, /window\.location/);
});
