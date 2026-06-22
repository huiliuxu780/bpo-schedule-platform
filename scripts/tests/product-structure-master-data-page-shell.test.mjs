import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const masterDataEntityPagePath = new URL("../../app/master-data/[entityKey]/page.tsx", import.meta.url);
const masterDataAgentCreatePagePath = new URL("../../app/master-data/agents/new/page.tsx", import.meta.url);
const masterDataAgentEditPagePath = new URL("../../app/master-data/agents/[employeeId]/edit/page.tsx", import.meta.url);
const masterDataAgentSkillsEditPagePath = new URL("../../app/master-data/agents/[employeeId]/skills/edit/page.tsx", import.meta.url);
const masterDataWorkplaceDetailPagePath = new URL("../../app/master-data/sites/[workplaceId]/page.tsx", import.meta.url);
const masterDataVendorDetailPagePath = new URL("../../app/master-data/vendors/[vendorId]/page.tsx", import.meta.url);
const masterDataSkillCreatePagePath = new URL("../../app/master-data/skills/new/page.tsx", import.meta.url);
const masterDataSkillEditPagePath = new URL("../../app/master-data/skills/[skillId]/edit/page.tsx", import.meta.url);
const masterDataWorkbenchPath = new URL("../../components/master-data-maintenance-workbench.tsx", import.meta.url);

test("master data pages pass breadcrumbs through AppShell", async () => {
  const pageSources = [
    await readFile(masterDataEntityPagePath, "utf8"),
    await readFile(masterDataAgentCreatePagePath, "utf8"),
    await readFile(masterDataAgentEditPagePath, "utf8"),
    await readFile(masterDataAgentSkillsEditPagePath, "utf8"),
    await readFile(masterDataWorkplaceDetailPagePath, "utf8"),
    await readFile(masterDataVendorDetailPagePath, "utf8"),
    await readFile(masterDataSkillCreatePagePath, "utf8"),
    await readFile(masterDataSkillEditPagePath, "utf8"),
  ];

  for (const source of pageSources) {
    assert.equal(source.includes("breadcrumbItems"), true);
  }
});

test("agent child form pages do not duplicate the global page header", async () => {
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const formShellSource = workbenchSource.slice(
    workbenchSource.indexOf("function AgentFormPageShell"),
    workbenchSource.indexOf("function AgentFormBlockedState"),
  );
  const skillsSectionSource = workbenchSource.slice(
    workbenchSource.indexOf("function AgentSkillMaintenanceSection"),
    workbenchSource.indexOf("type AgentMaintenanceField"),
  );

  assert.equal(
    formShellSource.includes("<h1"),
    false,
    "agent child content should rely on AppShell/SiteHeader for the page title",
  );
  assert.equal(
    formShellSource.includes("返回客服人员"),
    false,
    "agent child content should rely on breadcrumb navigation for returning to the list",
  );
  assert.equal(
    formShellSource.includes("ArrowLeft"),
    false,
    "agent child content should not render a duplicate page-level back action",
  );
  assert.equal(
    formShellSource.includes("description"),
    false,
    "agent child content shell should not repeat page-level explanatory copy",
  );
  assert.equal(
    skillsSectionSource.includes("坐席技能维护"),
    false,
    "skills edit content should not repeat the page title as a section heading",
  );
});

test("master data content pages do not render duplicate page identity headers", async () => {
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const workplaceDetailSource = await readFile(masterDataWorkplaceDetailPagePath, "utf8");
  const vendorDetailSource = await readFile(masterDataVendorDetailPagePath, "utf8");

  assert.equal(
    workbenchSource.includes("<h1"),
    false,
    "master data content should rely on AppShell/SiteHeader for page identity",
  );
  assert.equal(
    workbenchSource.includes("ArrowLeft"),
    false,
    "master data content should rely on breadcrumb links instead of duplicate page back blocks",
  );
  for (const label of ["返回客服人员", "返回职场", "返回供应商"]) {
    assert.equal(workbenchSource.includes(label), false, label);
  }
  assert.equal(
    workplaceDetailSource.includes("title={detailSummary.title}"),
    true,
    "workplace detail SiteHeader should show the actual workplace name",
  );
  assert.equal(
    vendorDetailSource.includes("title={detailSummary.title}"),
    true,
    "vendor detail SiteHeader should show the actual vendor name",
  );
});
