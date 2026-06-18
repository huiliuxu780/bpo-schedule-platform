import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeMasterDataVendorDetail } = jiti(
  "../../components/master-data-maintenance-model.ts",
);

test("vendor detail keeps service workplaces inside the selected supplier", () => {
  const detail = summarizeMasterDataVendorDetail({
    vendorId: "SUP-001",
    vendors: [
      {
        reference_id: "SUP-001",
        reference_name: "上海供应商",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
      {
        reference_id: "SUP-002",
        reference_name: "南京供应商",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
    workplaces: [
      {
        reference_id: "SH-01",
        reference_name: "上海职场",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
      {
        reference_id: "NJ-01",
        reference_name: "南京职场",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
    bindings: [
      {
        binding_id: "BIND-001",
        employee_id: "A-3001",
        supplier_id: "SUP-001",
        workplace_id: "SH-01",
        skill_id: "SKILL-TICKET",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
      {
        binding_id: "BIND-002",
        employee_id: "A-3002",
        supplier_id: "SUP-001",
        workplace_id: "SH-01",
        skill_id: "SKILL-HOTLINE",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
      {
        binding_id: "BIND-003",
        employee_id: "A-3003",
        supplier_id: "SUP-002",
        workplace_id: "NJ-01",
        skill_id: "SKILL-GENERAL",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
    serviceTeams: [
      {
        service_team_id: "TEAM-SUP-001",
        workplace_id: "SH-01",
        team_type: "supplier",
        team_name: "上海供应商驻场团队",
        organization_id: null,
        supplier_id: "SUP-001",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
      {
        service_team_id: "TEAM-SUP-002",
        workplace_id: "NJ-01",
        team_type: "supplier",
        team_name: "南京供应商驻场团队",
        organization_id: null,
        supplier_id: "SUP-002",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
  });

  assert.equal(detail.found, true);
  assert.equal(detail.title, "上海供应商");
  assert.equal(detail.vendor?.display.referenceIdLabel, "SUP-001");
  assert.equal(detail.totalServiceWorkplaces, 1);
  assert.equal(detail.activeServiceWorkplaces, 1);
  assert.deepEqual(
    detail.serviceRows.map((row) => [
      row.display.workplaceLabel,
      row.display.statusLabel,
      row.display.detailHref,
      row.display.sourceLabel,
      row.display.effectivePeriodLabel,
    ]),
    [
      [
        "上海职场",
        "生效",
        "/master-data/sites/SH-01",
        "人员归属记录",
        "2026-06-01 至 2026-12-31",
      ],
    ],
  );
  assert.equal(JSON.stringify(detail).includes("合同"), false);
  assert.equal(JSON.stringify(detail).includes("结算"), false);
  assert.equal(JSON.stringify(detail).includes("最低人力"), false);
  assert.equal(detail.totalServiceTeams, 1);
  assert.deepEqual(
    detail.serviceTeamRows.map((row) => [
      row.display.teamNameLabel,
      row.display.workplaceLabel,
      row.display.statusLabel,
      row.display.detailHref,
    ]),
    [
      [
        "上海供应商驻场团队",
        "上海职场",
        "生效",
        "/master-data/sites/SH-01/service-teams/TEAM-SUP-001",
      ],
    ],
  );
});

test("vendor detail returns not found for unknown supplier id", () => {
  const detail = summarizeMasterDataVendorDetail({
    vendorId: "UNKNOWN",
    vendors: [],
    workplaces: [],
    bindings: [],
  });

  assert.equal(detail.found, false);
  assert.equal(detail.vendor, null);
  assert.equal(detail.serviceRows.length, 0);
});
