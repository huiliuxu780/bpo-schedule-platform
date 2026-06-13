import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  workbench: new URL(
    "../../components/master-data-maintenance-workbench.tsx",
    import.meta.url
  ),
  actions: new URL(
    "../../components/master-data-maintenance-actions.tsx",
    import.meta.url
  ),
  agents: new URL(
    "../../components/master-data-maintenance-agents.tsx",
    import.meta.url
  ),
  references: new URL(
    "../../components/master-data-maintenance-references.tsx",
    import.meta.url
  ),
  details: new URL(
    "../../components/master-data-maintenance-details.tsx",
    import.meta.url
  ),
  forms: new URL(
    "../../components/master-data-maintenance-forms.tsx",
    import.meta.url
  ),
  fields: new URL(
    "../../components/master-data-maintenance-fields.tsx",
    import.meta.url
  ),
};

test("master-data maintenance workbench is split behind a thin legacy entrypoint", async () => {
  const [workbench, actions, agents, references, details, forms, fields] =
    await Promise.all(Object.values(files).map((file) => readFile(file, "utf8")));

  assert.match(workbench, /from "\.\/master-data-maintenance-actions"/);
  assert.match(workbench, /from "\.\/master-data-maintenance-agents"/);
  assert.match(workbench, /from "\.\/master-data-maintenance-references"/);
  assert.match(workbench, /from "\.\/master-data-maintenance-details"/);
  assert.match(workbench, /from "\.\/master-data-maintenance-forms"/);
  assert.doesNotMatch(workbench, /^export function MasterDataAgentManagementPage/m);
  assert.doesNotMatch(workbench, /^function AgentMaintenanceForm/m);
  assert.ok(
    workbench.split("\n").length <= 140,
    "legacy workbench entrypoint should remain thin"
  );

  assert.match(actions, /^export function MasterDataAgentPageActions/m);
  assert.match(actions, /^export function MasterDataWorkplacePageActions/m);
  assert.match(actions, /^export function MasterDataOrganizationPageActions/m);

  assert.match(agents, /^export function MasterDataAgentManagementPage/m);
  assert.match(agents, /^export function MasterDataAgentDetailPage/m);

  assert.match(references, /^export function MasterDataReferenceManagementPage/m);
  assert.match(references, /^export function MasterDataOrganizationManagementPage/m);

  assert.match(details, /^export function MasterDataWorkplaceDetailPage/m);
  assert.match(details, /^export function MasterDataVendorDetailPage/m);
  assert.match(details, /^export function MasterDataSkillDetailPage/m);

  assert.match(forms, /^export function MasterDataAgentCreatePage/m);
  assert.match(forms, /^export function MasterDataWorkplaceCreatePage/m);
  assert.match(forms, /^export function MasterDataOrganizationEditPage/m);

  assert.match(fields, /^export function MasterDataListError/m);
  assert.match(fields, /^export function MetricCard/m);
  assert.match(fields, /^export function MaintenanceInput/m);
});
