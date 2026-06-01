import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { runShadcnUiChecks } from "../check-shadcn-ui.mjs";

async function createProject(files = {}) {
  const rootDir = await mkdtemp(path.join(tmpdir(), "bpo-shadcn-check-"));
  await writeFile(
    path.join(rootDir, "components.json"),
    JSON.stringify(
      {
        style: "radix-nova",
        rsc: true,
        tsx: true,
        iconLibrary: "lucide",
        aliases: {
          ui: "@/components/ui",
        },
      },
      null,
      2
    )
  );

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(rootDir, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content);
  }

  return rootDir;
}

test("shadcn ui check passes for radix-nova project code using semantic tokens", async () => {
  const rootDir = await createProject({
    "app/page.tsx": `
      import { Button } from "@/components/ui/button";
      import { Search } from "lucide-react";

      export default function Page() {
        return (
          <section className="grid gap-4 rounded-md border bg-card p-4 text-card-foreground">
            <Button>
              <Search data-icon="inline-start" />
              Search
            </Button>
          </section>
        );
      }
    `,
  });

  const result = await runShadcnUiChecks({ rootDir });

  assert.equal(result.failed.length, 0);
  assert.equal(result.violations.length, 0);
});

test("shadcn ui check reports project convention drift outside the baseline", async () => {
  const rootDir = await createProject({
    "components/bad-panel.tsx": `
      export function BadPanel() {
        return (
          <div className="space-y-4 rounded-[20px] border border-emerald-500/30 bg-amber-500/10 text-gray-700">
            Bad panel
          </div>
        );
      }
    `,
  });

  const result = await runShadcnUiChecks({ rootDir });

  assert.deepEqual(
    result.failed.map((violation) => violation.ruleId),
    [
      "no-space-axis",
      "no-hardcoded-tailwind-colors",
      "no-arbitrary-radius",
    ]
  );
});

test("shadcn ui check allows documented baseline violations but reports new ones", async () => {
  const rootDir = await createProject({
    "components/bad-panel.tsx": `
      export function BadPanel() {
        return (
          <div className="space-y-4 rounded-[20px] border border-emerald-500/30 bg-amber-500/10 text-gray-700">
            Bad panel
          </div>
        );
      }
    `,
  });
  const baselinePath = path.join(rootDir, "scripts", "shadcn-ui-baseline.json");
  await mkdir(path.dirname(baselinePath), { recursive: true });
  const firstRun = await runShadcnUiChecks({ rootDir });
  await writeFile(
    baselinePath,
    JSON.stringify(
      {
        allowedViolations: firstRun.violations
          .filter((violation) =>
            ["no-space-axis", "no-hardcoded-tailwind-colors"].includes(
              violation.ruleId
            )
          )
          .map((violation) => violation.fingerprint),
      },
      null,
      2
    )
  );

  const result = await runShadcnUiChecks({ baselinePath, rootDir });

  assert.deepEqual(
    result.failed.map((violation) => violation.ruleId),
    ["no-arbitrary-radius"]
  );
  assert.equal(result.baselined.length, 2);
});
