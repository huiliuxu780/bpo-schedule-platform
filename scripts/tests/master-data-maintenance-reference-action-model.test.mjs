import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { buildMasterDataOrganizationMaintenanceApiPath, buildMasterDataOrganizationMaintenancePayload, buildMasterDataSkillMaintenanceApiPath, buildMasterDataSkillMaintenancePayload, buildMasterDataVendorMaintenanceApiPath, buildMasterDataVendorMaintenancePayload } = jiti("../../components/master-data-maintenance-model.ts");

test("organization maintenance builders submit hierarchy through the organization API", () => {
  assert.equal(
    buildMasterDataOrganizationMaintenanceApiPath("ORG CCO/退换"),
    "/api/v1/master-data/organizations/ORG%20CCO%2F%E9%80%80%E6%8D%A2/maintenance",
  );

  assert.deepEqual(
    buildMasterDataOrganizationMaintenancePayload({
      action: "create",
      sourceBatchId: "BATCH-MD-001",
      organizationId: "ORG-RETURN",
      organizationName: "集中退换小组",
      organizationLevel: 3,
      parentOrganizationId: "ORG-CCO",
      status: "active",
      effectiveFrom: "2026-06-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "create",
      source_batch_id: "BATCH-MD-001",
      organization_name: "集中退换小组",
      organization_level: 3,
      parent_organization_id: "ORG-CCO",
      status: "active",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
    },
  );
  assert.deepEqual(
    buildMasterDataOrganizationMaintenancePayload({
      action: "freeze",
      sourceBatchId: "BATCH-MD-001",
      organizationId: "ORG-RETURN",
    }),
    {
      action: "freeze",
      source_batch_id: "BATCH-MD-001",
    },
  );
});

test("skill maintenance builders submit category through the reference API", () => {
  assert.equal(
    buildMasterDataSkillMaintenanceApiPath("SKILL 在线/一线"),
    "/api/v1/master-data/skills/SKILL%20%E5%9C%A8%E7%BA%BF%2F%E4%B8%80%E7%BA%BF/maintenance",
  );

  assert.deepEqual(
    buildMasterDataSkillMaintenancePayload({
      action: "create",
      sourceBatchId: "BATCH-MD-001",
      skillId: "SKILL-ONLINE",
      skillName: "在线接待",
      skillCategory: "online",
      status: "active",
      effectiveFrom: "2026-06-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "create",
      source_batch_id: "BATCH-MD-001",
      reference_name: "在线接待",
      skill_category: "online",
      status: "active",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
    },
  );

  assert.deepEqual(
    buildMasterDataSkillMaintenancePayload({
      action: "freeze",
      sourceBatchId: "BATCH-MD-001",
      skillId: "SKILL-ONLINE",
    }),
    {
      action: "freeze",
      source_batch_id: "BATCH-MD-001",
    },
  );
});

test("vendor maintenance payload maps create edit and freeze actions", () => {
  assert.equal(
    buildMasterDataVendorMaintenanceApiPath("SUP 01/华东"),
    "/api/v1/master-data/suppliers/SUP%2001%2F%E5%8D%8E%E4%B8%9C/maintenance",
  );

  assert.deepEqual(
    buildMasterDataVendorMaintenancePayload({
      action: "create",
      sourceBatchId: "BATCH-MD-001",
      vendorId: "SUP-001",
      vendorName: "上海供应商",
      status: "active",
      effectiveFrom: "2026-06-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "create",
      source_batch_id: "BATCH-MD-001",
      reference_name: "上海供应商",
      status: "active",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
    },
  );
  assert.deepEqual(
    buildMasterDataVendorMaintenancePayload({
      action: "edit",
      sourceBatchId: "BATCH-MD-001",
      vendorId: "SUP-001",
      vendorName: "上海供应商二部",
      status: "inactive",
      effectiveFrom: "2026-07-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "edit",
      source_batch_id: "BATCH-MD-001",
      reference_name: "上海供应商二部",
      status: "inactive",
      effective_from: "2026-07-01",
      effective_to: "2026-12-31",
    },
  );
  assert.deepEqual(
    buildMasterDataVendorMaintenancePayload({
      action: "freeze",
      sourceBatchId: "BATCH-MD-001",
      vendorId: "SUP-001",
    }),
    {
      action: "freeze",
      source_batch_id: "BATCH-MD-001",
    },
  );
});
