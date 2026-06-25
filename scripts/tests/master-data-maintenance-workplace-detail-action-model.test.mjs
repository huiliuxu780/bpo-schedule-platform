import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeMasterDataWorkplaceDetail } = jiti(
  "../../components/master-data-maintenance-model.ts",
);

test("workplace detail prefers maintained service-team records with action links", () => {
  const detail = summarizeMasterDataWorkplaceDetail({
    workplaceId: "SH-01",
    workplaces: [
      {
        reference_id: "SH-01",
        reference_name: "上海职场",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
    employees: [],
    bindings: [],
    suppliers: [
      {
        reference_id: "SUP-001",
        reference_name: "上海供应商",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
    serviceTeams: [
      {
        service_team_id: "TEAM-INTERNAL-001",
        workplace_id: "SH-01",
        team_type: "internal",
        team_name: "集中退换小组",
        organization_id: "ORG-RETURN",
        supplier_id: null,
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
      {
        service_team_id: "TEAM-SUP-001",
        workplace_id: "SH-01",
        team_type: "supplier",
        team_name: "供应商驻场团队",
        organization_id: null,
        supplier_id: "SUP-001",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
  });

  assert.equal(detail.totalOperators, 2);
  assert.equal(detail.internalOperators, 1);
  assert.equal(detail.supplierOperators, 1);
  assert.equal(
    detail.createServiceTeamHref,
    "/master-data/sites/SH-01/service-teams/new",
  );
  assert.deepEqual(
    detail.operatorRows.map((row) => [
      row.operator_key,
      row.operator_name,
      row.display.supplierLabel,
      row.display.detailHref,
      row.display.editHref,
      row.display.freezeHref,
    ]),
    [
      [
        "TEAM-INTERNAL-001",
        "集中退换小组",
        "-",
        "/master-data/sites/SH-01/service-teams/TEAM-INTERNAL-001",
        "/master-data/sites/SH-01/service-teams/TEAM-INTERNAL-001/edit",
        "/master-data/sites/SH-01?freeze_service_team_id=TEAM-INTERNAL-001",
      ],
      [
        "TEAM-SUP-001",
        "供应商驻场团队",
        "上海供应商",
        "/master-data/sites/SH-01/service-teams/TEAM-SUP-001",
        "/master-data/sites/SH-01/service-teams/TEAM-SUP-001/edit",
        "/master-data/sites/SH-01?freeze_service_team_id=TEAM-SUP-001",
      ],
    ],
  );
});
