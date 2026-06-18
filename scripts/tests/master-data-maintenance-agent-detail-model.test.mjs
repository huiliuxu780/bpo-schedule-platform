import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeMasterDataAgentDetail } = jiti("../../components/master-data-maintenance-model.ts");

test("agent detail resolves read-only personnel context and service teams", () => {
  const detail = summarizeMasterDataAgentDetail({
    employeeId: "A-2001",
    employees: [
      {
        employee_id: "A-2001",
        employee_name: "刘晓晓",
        status: "active",
        employee_type: "outsourced",
        organization_id: "ORG-SUP",
        organization_path: "CC / CCO / 集中退换小组",
        workplace_id: "SH-01",
        workplace_name: "上海职场",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [
          {
            employee_id: "A-2001",
            skill_id: "SKILL-TICKET",
            skill_name: "集中退换工单",
            skill_category: "ticket",
            effective_from: "2026-06-01",
            effective_to: "2026-12-31",
            batch_id: "BATCH-MD-001",
          },
        ],
      },
      {
        employee_id: "A-1001",
        employee_name: "张三",
        status: "active",
        employee_type: "internal",
        organization_id: "ORG-RETURN",
        organization_path: "CC / CCO / 集中退换小组",
        workplace_id: "SH-01",
        workplace_name: "上海职场",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [],
      },
    ],
    bindings: [
      {
        binding_id: "BIND-001",
        employee_id: "A-2001",
        supplier_id: "SUP-001",
        workplace_id: "SH-01",
        skill_id: "SKILL-TICKET",
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
        team_name: "供应商驻场团队",
        organization_id: null,
        supplier_id: "SUP-001",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
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
        service_team_id: "TEAM-OTHER-001",
        workplace_id: "NJ-01",
        team_type: "supplier",
        team_name: "南京供应商团队",
        organization_id: null,
        supplier_id: "SUP-001",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
  });

  assert.equal(detail.found, true);
  assert.equal(detail.title, "刘晓晓");
  assert.equal(detail.employee?.display.employeeTypeLabel, "外包员工");
  assert.equal(detail.employee?.display.organizationLabel, "CC / CCO / 集中退换小组");
  assert.equal(detail.employee?.display.workplaceLabel, "上海职场");
  assert.equal(detail.employee?.display.skillSummary, "集中退换工单（工单技能组）");
  assert.deepEqual(
    detail.serviceTeamRows.map((row) => [
      row.service_team_id,
      row.display.teamNameLabel,
      row.display.teamTypeLabel,
      row.display.matchSourceLabel,
      row.display.detailHref,
    ]),
    [
      [
        "TEAM-SUP-001",
        "供应商驻场团队",
        "供应商团队",
        "同职场同供应商绑定",
        "/master-data/sites/SH-01/service-teams/TEAM-SUP-001",
      ],
    ],
  );
  assert.equal(detail.totalServiceTeams, 1);
  assert.equal(detail.emptyServiceTeamDetail, "暂无该人员关联的服务团队。");
});
