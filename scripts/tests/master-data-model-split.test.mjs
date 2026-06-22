import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  model: new URL(
    "../../components/master-data-maintenance-model.ts",
    import.meta.url
  ),
  types: new URL(
    "../../components/master-data-maintenance-types.ts",
    import.meta.url
  ),
  entities: new URL(
    "../../components/master-data-maintenance-entities.ts",
    import.meta.url
  ),
  payloads: new URL(
    "../../components/master-data-maintenance-payloads.ts",
    import.meta.url
  ),
  agents: new URL(
    "../../components/master-data-maintenance-agent-model.ts",
    import.meta.url
  ),
  references: new URL(
    "../../components/master-data-maintenance-reference-model.ts",
    import.meta.url
  ),
  details: new URL(
    "../../components/master-data-maintenance-detail-model.ts",
    import.meta.url
  ),
  importDialog: new URL(
    "../../components/master-data-maintenance-import-dialog-model.ts",
    import.meta.url
  ),
  formatters: new URL(
    "../../components/master-data-maintenance-formatters.ts",
    import.meta.url
  ),
};

test("master-data maintenance model is split behind a thin legacy entrypoint", async () => {
  const [
    model,
    types,
    entities,
    payloads,
    agents,
    references,
    details,
    importDialog,
    formatters,
  ] = await Promise.all(Object.values(files).map((file) => readFile(file, "utf8")));

  assert.match(model, /from "\.\/master-data-maintenance-types"/);
  assert.match(model, /from "\.\/master-data-maintenance-entities"/);
  assert.match(model, /from "\.\/master-data-maintenance-payloads"/);
  assert.match(model, /from "\.\/master-data-maintenance-agent-model"/);
  assert.match(model, /from "\.\/master-data-maintenance-reference-model"/);
  assert.match(model, /from "\.\/master-data-maintenance-detail-model"/);
  assert.match(model, /from "\.\/master-data-maintenance-import-dialog-model"/);
  assert.match(model, /from "\.\/master-data-maintenance-formatters"/);
  assert.doesNotMatch(model, /^export function summarizeMasterDataAgentManagement/m);
  assert.doesNotMatch(model, /^function normalizeMasterDataAgentManagementFilters/m);
  assert.ok(
    model.split("\n").length <= 140,
    "legacy model entrypoint should stay thin"
  );

  assert.match(types, /^export type MasterDataMaintenanceEntityKey/m);
  assert.match(types, /^export type MasterDataAgentManagementSummary/m);
  assert.match(types, /^export type MasterDataWorkplaceServiceTeamType/m);

  assert.match(entities, /^export const MASTER_DATA_MAINTENANCE_ENTITIES/m);
  assert.match(entities, /^export function summarizeMasterDataMaintenanceWorkbench/m);
  assert.match(entities, /^export function getMasterDataMaintenanceEntity/m);

  assert.match(payloads, /^export function buildMasterDataAgentMaintenancePayload/m);
  assert.match(payloads, /^export function buildMasterDataWorkplaceServiceTeamMaintenancePayload/m);
  assert.match(payloads, /^export function summarizeMasterDataMaintenanceFeedback/m);

  assert.match(agents, /^export function summarizeMasterDataEmployeeList/m);
  assert.match(agents, /^export function summarizeMasterDataAgentManagement/m);
  assert.match(agents, /^export function summarizeMasterDataAgentDetail/m);

  assert.match(references, /^export function summarizeMasterDataReferenceManagement/m);
  assert.match(references, /^export function summarizeMasterDataOrganizationManagement/m);
  assert.match(references, /^export function summarizeMasterDataOrganizationDetail/m);

  assert.match(details, /^export function summarizeMasterDataWorkplaceDetail/m);
  assert.match(details, /^export function summarizeMasterDataWorkplaceServiceTeamPeople/m);
  assert.match(details, /^export function summarizeMasterDataVendorDetail/m);
  assert.match(details, /^export function summarizeMasterDataSkillDetail/m);

  assert.match(importDialog, /^export function summarizeMasterDataAgentImportDialog/m);

  assert.match(formatters, /^export function formatMasterDataEmployeeType/m);
  assert.match(formatters, /^export function resolveMasterDataMaintenanceTone/m);
});
