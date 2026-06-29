import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const masterDataEntityPagePath = new URL("../../app/master-data/[entityKey]/page.tsx", import.meta.url);
const masterDataActionsPath = new URL("../../app/master-data/[entityKey]/actions.ts", import.meta.url);
const masterDataReferenceComponentPath = new URL("../../components/master-data-maintenance-references.tsx", import.meta.url);
const masterDataReferenceTablePath = new URL("../../components/master-data-reference-table.tsx", import.meta.url);
const masterDataPayloadsPath = new URL("../../components/master-data-maintenance-payloads.ts", import.meta.url);
const masterDataEntitiesPath = new URL("../../components/master-data-maintenance-entities.ts", import.meta.url);
const masterDataWorkplaceCreatePagePath = new URL("../../app/master-data/sites/new/page.tsx", import.meta.url);
const masterDataWorkplaceEditPagePath = new URL("../../app/master-data/sites/[workplaceId]/edit/page.tsx", import.meta.url);
const masterDataVendorCreatePagePath = new URL("../../app/master-data/vendors/new/page.tsx", import.meta.url);
const masterDataVendorEditPagePath = new URL("../../app/master-data/vendors/[vendorId]/edit/page.tsx", import.meta.url);
const masterDataSkillCreatePagePath = new URL("../../app/master-data/skills/new/page.tsx", import.meta.url);
const masterDataSkillEditPagePath = new URL("../../app/master-data/skills/[skillId]/edit/page.tsx", import.meta.url);
const masterDataOrganizationCreatePagePath = new URL("../../app/master-data/organizations/new/page.tsx", import.meta.url);
const masterDataOrganizationEditPagePath = new URL("../../app/master-data/organizations/[organizationId]/edit/page.tsx", import.meta.url);

test("skill maintenance uses child pages and a freeze dialog instead of list-page forms", async () => {
  await access(masterDataSkillCreatePagePath);
  await access(masterDataSkillEditPagePath);

  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsPath, "utf8");
  const payloadSource = await readFile(masterDataPayloadsPath, "utf8");
  const entitiesSource = await readFile(masterDataEntitiesPath, "utf8");
  const referencesSource = await readFile(masterDataReferenceComponentPath, "utf8");
  const createPageSource = await readFile(masterDataSkillCreatePagePath, "utf8");
  const editPageSource = await readFile(masterDataSkillEditPagePath, "utf8");

  assert.equal(entitySource.includes("MasterDataSkillPageActions"), true);
  assert.equal(entitySource.includes("freeze_skill_id"), true);
  assert.equal(entitySource.includes("submitMasterDataSkillMaintenance"), true);
  assert.equal(actionsSource.includes("submitMasterDataSkillMaintenance"), true);
  assert.equal(actionsSource.includes("parseSkillAction"), true);
  assert.equal(payloadSource.includes("buildMasterDataSkillMaintenancePayload"), true);
  assert.equal(entitiesSource.includes("skillSubmitSourceBatchId"), true);
  assert.equal(referencesSource.includes("MasterDataSkillFreezeDialog"), true);
  assert.equal(referencesSource.includes("<DialogContent"), true);
  assert.equal(referencesSource.includes("SkillMaintenanceForm"), false);
  assert.equal(createPageSource.includes("MasterDataSkillCreatePage"), true);
  assert.equal(editPageSource.includes("MasterDataSkillEditPage"), true);
  assert.equal(editPageSource.includes("notFound()"), true);
});

test("master data reference detail actions use a consistent view label", async () => {
  const referencesSource = await readFile(masterDataReferenceComponentPath, "utf8");
  const referenceTableSource = await readFile(masterDataReferenceTablePath, "utf8");

  assert.equal(
    `${referencesSource}\n${referenceTableSource}`.includes(">详情</Link>"),
    false,
    "reference master-data rows should not mix 详情 with the established 查看 row action label",
  );
  assert.equal(
    referenceTableSource.includes("查看"),
    true,
    "reference master-data rows should expose the detail link as 查看",
  );
  assert.equal(referenceTableSource.includes("detailHref"), true);
});

test("workplace maintenance uses child pages and freeze dialog instead of list-page forms", async () => {
  await access(masterDataWorkplaceCreatePagePath);
  await access(masterDataWorkplaceEditPagePath);

  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsPath, "utf8");
  const payloadSource = await readFile(masterDataPayloadsPath, "utf8");
  const referencesSource = await readFile(masterDataReferenceComponentPath, "utf8");
  const createPageSource = await readFile(masterDataWorkplaceCreatePagePath, "utf8");
  const editPageSource = await readFile(masterDataWorkplaceEditPagePath, "utf8");

  assert.equal(
    entitySource.includes("MasterDataWorkplacePageActions"),
    true,
    "workplace list should use Header actions for create",
  );
  assert.equal(
    entitySource.includes("freeze_workplace_id"),
    true,
    "workplace freeze should be controlled by list-page dialog state",
  );
  assert.equal(
    actionsSource.includes("submitMasterDataWorkplaceMaintenance"),
    true,
    "workplace forms should use a workplace-specific server action",
  );
  assert.equal(
    payloadSource.includes("buildMasterDataWorkplaceMaintenancePayload"),
    true,
    "workplace maintenance should be modeled explicitly",
  );
  assert.equal(referencesSource.includes("WorkplaceMaintenanceForm"), false);
  assert.equal(referencesSource.includes("MasterDataWorkplaceFreezeDialog"), true);
  assert.equal(referencesSource.includes("DialogContent"), true);
  assert.equal(createPageSource.includes("MasterDataWorkplaceCreatePage"), true);
  assert.equal(editPageSource.includes("MasterDataWorkplaceEditPage"), true);
  assert.equal(editPageSource.includes("notFound()"), true);
});

test("vendor maintenance uses child pages and freeze dialog instead of list-page forms", async () => {
  await access(masterDataVendorCreatePagePath);
  await access(masterDataVendorEditPagePath);

  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsPath, "utf8");
  const payloadSource = await readFile(masterDataPayloadsPath, "utf8");
  const referencesSource = await readFile(masterDataReferenceComponentPath, "utf8");
  const createPageSource = await readFile(masterDataVendorCreatePagePath, "utf8");
  const editPageSource = await readFile(masterDataVendorEditPagePath, "utf8");

  assert.equal(
    entitySource.includes("MasterDataVendorPageActions"),
    true,
    "vendor list should use Header actions for create",
  );
  assert.equal(
    entitySource.includes("freeze_vendor_id"),
    true,
    "vendor freeze should be controlled by list-page dialog state",
  );
  assert.equal(
    actionsSource.includes("submitMasterDataVendorMaintenance"),
    true,
    "vendor forms should use a vendor-specific server action",
  );
  assert.equal(
    payloadSource.includes("buildMasterDataVendorMaintenancePayload"),
    true,
    "vendor maintenance should be modeled explicitly",
  );
  assert.equal(referencesSource.includes("VendorMaintenanceForm"), false);
  assert.equal(referencesSource.includes("MasterDataVendorFreezeDialog"), true);
  assert.equal(referencesSource.includes("DialogContent"), true);
  assert.equal(createPageSource.includes("MasterDataVendorCreatePage"), true);
  assert.equal(editPageSource.includes("MasterDataVendorEditPage"), true);
  assert.equal(editPageSource.includes("notFound()"), true);
});

test("organization maintenance uses child pages and freeze dialog instead of list-page forms", async () => {
  await access(masterDataOrganizationCreatePagePath);
  await access(masterDataOrganizationEditPagePath);

  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsPath, "utf8");
  const payloadSource = await readFile(masterDataPayloadsPath, "utf8");
  const referencesSource = await readFile(masterDataReferenceComponentPath, "utf8");
  const createPageSource = await readFile(masterDataOrganizationCreatePagePath, "utf8");
  const editPageSource = await readFile(masterDataOrganizationEditPagePath, "utf8");

  assert.equal(
    entitySource.includes("MasterDataOrganizationPageActions"),
    true,
    "organization list should use Header actions for create",
  );
  assert.equal(
    entitySource.includes("freeze_organization_id"),
    true,
    "organization freeze should be controlled by list-page dialog state",
  );
  assert.equal(
    actionsSource.includes("submitMasterDataOrganizationMaintenance"),
    true,
    "organization forms should use an organization-specific server action",
  );
  assert.equal(
    payloadSource.includes("buildMasterDataOrganizationMaintenancePayload"),
    true,
    "organization maintenance should be modeled explicitly",
  );
  assert.equal(referencesSource.includes("OrganizationMaintenanceForm"), false);
  assert.equal(referencesSource.includes("MasterDataOrganizationFreezeDialog"), true);
  assert.equal(referencesSource.includes("DialogContent"), true);
  assert.equal(createPageSource.includes("MasterDataOrganizationCreatePage"), true);
  assert.equal(editPageSource.includes("MasterDataOrganizationEditPage"), true);
  assert.equal(editPageSource.includes("notFound()"), true);
});
