import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const masterDataEntityPagePath = new URL("../../app/master-data/[entityKey]/page.tsx", import.meta.url);
const masterDataAgentsComponentPath = new URL("../../components/master-data-maintenance-agents.tsx", import.meta.url);
const masterDataReferencesComponentPath = new URL("../../components/master-data-maintenance-references.tsx", import.meta.url);
const masterDataAgentImportDialogPath = new URL("../../components/master-data-agent-import-dialog.tsx", import.meta.url);
const masterDataImportDialogModelPath = new URL("../../components/master-data-maintenance-import-dialog-model.ts", import.meta.url);

test("agent list keeps page actions and filter actions in their own zones", async () => {
  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const agentsSource = await readFile(masterDataAgentsComponentPath, "utf8");
  const filterSource = agentsSource.slice(
    agentsSource.indexOf("function AgentManagementFilterPanel"),
    agentsSource.indexOf("function AgentManagementFilterField"),
  );
  const filterCallIndex = agentsSource.indexOf("<AgentManagementFilterPanel");
  const tableCallIndex = agentsSource.indexOf("<MasterDataAgentTable");

  assert.equal(
    entitySource.includes("actions={"),
    true,
    "agent page-level actions should be passed to the shared SiteHeader slot",
  );
  assert.equal(
    entitySource.includes("<MasterDataAgentPageActions"),
    true,
    "agent create/import actions should live in the page header actions slot",
  );
  assert.equal(
    filterCallIndex > -1 && tableCallIndex > filterCallIndex,
    true,
    "agent filter panel should render above the agent table",
  );
  assert.equal(
    agentsSource.includes("AgentManagementListToolbar"),
    false,
    "agent list should not render disabled pseudo bulk actions",
  );
  assert.equal(
    agentsSource.includes("summary.bulkActions.map"),
    false,
    "agent list should not map disabled pseudo bulk actions",
  );
  assert.equal(
    filterSource.includes('action="/master-data/agents"'),
    true,
    "filter actions should remain inside the agent filter form",
  );
  assert.equal(
    filterSource.includes("justify-end"),
    true,
    "agent filter submit/reset actions should align to the lower right of the filter panel",
  );
  assert.equal(
    filterSource.includes("lg:pl-[6.5rem]"),
    false,
    "filter actions should not be visually anchored to the left label column",
  );
  assert.equal(
    filterSource.includes("managementSummary.createHref"),
    false,
    "page-level create action should not be mixed into the filter form",
  );
  assert.equal(
    filterSource.includes("managementSummary.importDialog.openHref"),
    false,
    "page-level import action should not be mixed into the filter form",
  );
});

test("agent bulk import starts from the agent list dialog and leaves details to batch detail pages", async () => {
  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const agentsSource = await readFile(masterDataAgentsComponentPath, "utf8");
  const importDialogSource = await readFile(masterDataAgentImportDialogPath, "utf8");
  const importDialogModelSource = await readFile(masterDataImportDialogModelPath, "utf8");

  assert.equal(
    agentsSource.includes("<AgentImportDialog"),
    true,
    "agent list should render an in-page import dialog",
  );
  assert.equal(
    agentsSource.includes('buildImportUploadWorkspaceHref({ fileType: "master_data" })'),
    false,
    "agent list import entry should not jump to the standalone upload workspace",
  );
  assert.equal(
    entitySource.includes("fetchImportFieldMappingTemplates"),
    true,
    "agent page should load mapping templates for the dialog",
  );
  assert.equal(
    importDialogModelSource.includes("summarizeMasterDataAgentImportDialog"),
    true,
    "dialog flow should be modeled instead of ad hoc page markup",
  );
  assert.equal(
    importDialogSource.includes("查看批次详情"),
    true,
    "full import details should remain on the batch detail page",
  );
  assert.equal(
    importDialogSource.includes("失败行修正"),
    true,
    "failed-row correction should be linked from the result step",
  );
  assert.equal(importDialogSource.includes("DialogContent"), true);
  assert.equal(importDialogSource.includes("AlertTitle"), true);
  assert.equal(importDialogSource.includes("useState<AgentImportStepKey>"), true);
  assert.equal(importDialogSource.includes('hidden={activeStep !== "upload"}'), true);
  assert.equal(importDialogSource.includes('hidden={activeStep !== "mapping"}'), true);
  assert.equal(importDialogSource.includes('hidden={activeStep !== "result"}'), true);
  assert.equal(importDialogSource.includes('action={action}'), true);
  assert.equal(agentsSource.includes('role="dialog"'), false);
});

test("non-agent master data pages do not expose unconfirmed import actions in content", async () => {
  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const referencesSource = await readFile(masterDataReferencesComponentPath, "utf8");

  assert.equal(
    referencesSource.includes("导入主数据"),
    false,
    "reference list content should not expose a standalone import shortcut",
  );
  assert.equal(
    referencesSource.includes("buildImportUploadWorkspaceHref"),
    false,
    "reference list content should not jump to the standalone upload workspace",
  );
  assert.equal(
    entitySource.includes("entity.key === \"agents\" && agentManagementSummary"),
    true,
    "shared Header actions should stay scoped to the confirmed agent actions only",
  );
});
