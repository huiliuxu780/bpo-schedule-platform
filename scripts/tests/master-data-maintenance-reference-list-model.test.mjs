import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeMasterDataOrganizationManagement, summarizeMasterDataReferenceManagement } = jiti("../../components/master-data-maintenance-model.ts");

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
