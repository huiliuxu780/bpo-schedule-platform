import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildMasterDataOrganizationMaintenanceApiPath,
  buildMasterDataOrganizationMaintenancePayload,
  buildMasterDataSkillMaintenanceApiPath,
  buildMasterDataSkillMaintenancePayload,
  buildMasterDataVendorMaintenanceApiPath,
  buildMasterDataVendorMaintenancePayload,
  summarizeMasterDataOrganizationManagement,
  summarizeMasterDataOrganizationDetail,
  summarizeMasterDataReferenceManagement,
  summarizeMasterDataSkillDetail,
} = jiti("../../components/master-data-maintenance-model.ts");

test("reference master data management summarizes list rows by object type", () => {
  const summary = summarizeMasterDataReferenceManagement("skills", [
    {
      reference_id: "SKILL-TICKET",
      reference_name: "集中退换工单",
      status: "frozen",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
      skill_category: "ticket",
    },
    {
      reference_id: "SKILL-IM083-ONLINE",
      reference_name: "IM083在线接待",
      status: "active",
      effective_from: "2026-05-01",
      effective_to: "2026-10-31",
      batch_id: "BATCH-IM083-SMOKE-002",
      skill_category: "online",
    },
  ]);

  assert.equal(summary.title, "技能");
  assert.equal(summary.totalRecords, 2);
  assert.equal(summary.activeRecords, 1);
  assert.equal(summary.frozenRecords, 1);
  assert.deepEqual(
    summary.rows.map((row) => [
      row.display.referenceIdLabel,
      row.display.referenceNameLabel,
      row.display.statusLabel,
      row.display.skillCategoryLabel,
      row.display.effectivePeriodLabel,
      row.display.sourceBatchLabel,
    ]),
    [
      [
        "SKILL-业务-ONLINE",
        "业务在线接待",
        "生效",
        "在线技能组",
        "2026-05-01 至 2026-10-31",
        "BATCH-业务-002",
      ],
      [
        "SKILL-TICKET",
        "集中退换工单",
        "冻结",
        "工单技能组",
        "2026-06-01 至 2026-12-31",
        "BATCH-MD-001",
      ],
    ],
  );
});

test("workplace vendor and skill list rows expose confirmed child entries", () => {
  const siteSummary = summarizeMasterDataReferenceManagement("sites", [
    {
      reference_id: "SH-01",
      reference_name: "上海职场",
      status: "active",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
    },
  ]);
  const vendorSummary = summarizeMasterDataReferenceManagement("vendors", [
    {
      reference_id: "SUP-001",
      reference_name: "上海供应商",
      status: "active",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
    },
  ]);
  const skillSummary = summarizeMasterDataReferenceManagement("skills", [
    {
      reference_id: "SKILL-ONLINE",
      reference_name: "在线接待",
      status: "active",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
      skill_category: "online",
    },
  ]);

  assert.equal(
    siteSummary.rows[0].display.detailHref,
    "/master-data/sites/SH-01",
  );
  assert.equal(
    vendorSummary.rows[0].display.detailHref,
    "/master-data/vendors/SUP-001",
  );
  assert.equal(vendorSummary.createHref, "/master-data/vendors/new");
  assert.equal(
    vendorSummary.rows[0].display.editHref,
    "/master-data/vendors/SUP-001/edit",
  );
  assert.equal(
    vendorSummary.rows[0].display.freezeHref,
    "/master-data/vendors?freeze_vendor_id=SUP-001",
  );
  assert.equal(skillSummary.createHref, "/master-data/skills/new");
  assert.equal(
    skillSummary.rows[0].display.detailHref,
    "/master-data/skills/SKILL-ONLINE",
  );
  assert.equal(
    skillSummary.rows[0].display.editHref,
    "/master-data/skills/SKILL-ONLINE/edit",
  );
  assert.equal(
    skillSummary.rows[0].display.freezeHref,
    "/master-data/skills?freeze_skill_id=SKILL-ONLINE",
  );
});

test("organization management exposes confirmed child entries", () => {
  const summary = summarizeMasterDataOrganizationManagement([
    {
      organization_id: "ORG-RETURN",
      organization_name: "集中退换小组",
      organization_level: 3,
      parent_organization_id: "ORG-CCO",
      status: "active",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
      organization_path: "CC / CCO / 集中退换小组",
    },
  ]);

  assert.equal(summary.createHref, "/master-data/organizations/new");
  assert.equal(
    summary.rows[0].display.editHref,
    "/master-data/organizations/ORG-RETURN/edit",
  );
  assert.equal(
    summary.rows[0].display.freezeHref,
    "/master-data/organizations?freeze_organization_id=ORG-RETURN",
  );
});

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

test("organization detail summarizes direct child organizations and current people", () => {
  const summary = summarizeMasterDataOrganizationDetail({
    organizationId: "ORG-CCO",
    organizations: [
      {
        organization_id: "ORG-CC",
        organization_name: "CC",
        organization_level: 1,
        parent_organization_id: null,
        status: "active",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        organization_path: "CC",
      },
      {
        organization_id: "ORG-CCO",
        organization_name: "CCO",
        organization_level: 2,
        parent_organization_id: "ORG-CC",
        status: "active",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        organization_path: "CC / CCO",
      },
      {
        organization_id: "ORG-RETURN",
        organization_name: "集中退换小组",
        organization_level: 3,
        parent_organization_id: "ORG-CCO",
        status: "active",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        organization_path: "CC / CCO / 集中退换小组",
      },
    ],
    employees: [
      {
        employee_id: "A-1001",
        employee_name: "刘晓晓",
        status: "active",
        employee_type: "internal",
        organization_id: "ORG-CCO",
        organization_path: "CC / CCO",
        workplace_id: "NJ-01",
        workplace_name: "南京职场",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [],
      },
      {
        employee_id: "A-1002",
        employee_name: "王小王",
        status: "active",
        employee_type: "outsourced",
        organization_id: "ORG-RETURN",
        organization_path: "CC / CCO / 集中退换小组",
        workplace_id: "SH-01",
        workplace_name: "上海职场",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [],
      },
    ],
  });

  assert.equal(summary.found, true);
  assert.equal(summary.title, "CCO");
  assert.equal(summary.organization?.display.detailHref, "/master-data/organizations/ORG-CCO");
  assert.equal(summary.totalChildOrganizations, 1);
  assert.equal(summary.childRows[0].organization_id, "ORG-RETURN");
  assert.equal(summary.childRows[0].display.detailHref, "/master-data/organizations/ORG-RETURN");
  assert.equal(summary.totalPeople, 1);
  assert.equal(summary.peopleRows[0].employee_id, "A-1001");
  assert.equal(summary.peopleRows[0].display.detailHref, "/master-data/agents/A-1001");
  assert.equal(
    summary.peopleRows.some((row) => row.employee_id === "A-1002"),
    false,
  );
});

test("skill detail summarizes current people who own the skill", () => {
  const summary = summarizeMasterDataSkillDetail({
    skillId: "SKILL-RETURN-TICKET",
    skills: [
      {
        reference_id: "SKILL-RETURN-TICKET",
        reference_name: "集中退换工单",
        status: "active",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skill_category: "ticket",
      },
    ],
    employees: [
      {
        employee_id: "A-1001",
        employee_name: "刘晓晓",
        status: "active",
        employee_type: "internal",
        organization_id: "ORG-RETURN",
        organization_path: "CC / CCO / 集中退换小组",
        workplace_id: "NJ-01",
        workplace_name: "南京职场",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [
          {
            employee_id: "A-1001",
            skill_id: "SKILL-RETURN-TICKET",
            skill_name: "集中退换工单",
            skill_category: "ticket",
            effective_from: "2026-05-01",
            effective_to: "2026-12-31",
            batch_id: "BATCH-MD-001",
          },
        ],
      },
      {
        employee_id: "A-1002",
        employee_name: "王小王",
        status: "active",
        employee_type: "outsourced",
        organization_id: "ORG-RETURN",
        organization_path: "CC / CCO / 集中退换小组",
        workplace_id: "SH-01",
        workplace_name: "上海职场",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [
          {
            employee_id: "A-1002",
            skill_id: "SKILL-GENERAL",
            skill_name: "通用技能组",
            skill_category: "online",
            effective_from: "2026-05-01",
            effective_to: "2026-12-31",
            batch_id: "BATCH-MD-001",
          },
        ],
      },
    ],
  });

  assert.equal(summary.found, true);
  assert.equal(summary.title, "集中退换工单");
  assert.equal(summary.skill?.display.detailHref, "/master-data/skills/SKILL-RETURN-TICKET");
  assert.equal(summary.totalPeople, 1);
  assert.equal(summary.peopleRows[0].employee_id, "A-1001");
  assert.equal(summary.peopleRows[0].display.detailHref, "/master-data/agents/A-1001");
  assert.equal(
    summary.peopleRows.some((row) => row.employee_id === "A-1002"),
    false,
  );
});
