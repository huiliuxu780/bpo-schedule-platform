import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeMasterDataWorkplaceServiceTeamPeople } = jiti(
  "../../components/master-data-maintenance-model.ts",
);

test("service-team detail resolves read-only people by team ownership", () => {
  const employees = [
    {
      employee_id: "A-1001",
      employee_name: "刘晓晓",
      status: "active",
      employee_type: "internal",
      organization_id: "ORG-RETURN",
      organization_path: "CC / CCO / 集中退换小组",
      workplace_id: "SH-01",
      workplace_name: "上海职场",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
      skills: [
        {
          employee_id: "A-1001",
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
      employee_id: "A-1002",
      employee_name: "张三",
      status: "active",
      employee_type: "internal",
      organization_id: "ORG-OTHER",
      organization_path: "CC / CCO / 在线小组",
      workplace_id: "SH-01",
      workplace_name: "上海职场",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
      skills: [],
    },
    {
      employee_id: "A-2001",
      employee_name: "李四",
      status: "frozen",
      employee_type: "outsourced",
      organization_id: "ORG-SUP",
      organization_path: "供应商团队",
      workplace_id: "SH-01",
      workplace_name: "上海职场",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
      skills: [
        {
          employee_id: "A-2001",
          skill_id: "SKILL-HOTLINE",
          skill_name: "热线接待",
          skill_category: "hotline",
          effective_from: "2026-06-01",
          effective_to: "2026-12-31",
          batch_id: "BATCH-MD-001",
        },
      ],
    },
    {
      employee_id: "A-2002",
      employee_name: "王五",
      status: "active",
      employee_type: "outsourced",
      organization_id: "ORG-SUP",
      organization_path: "供应商团队",
      workplace_id: "NJ-01",
      workplace_name: "南京职场",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
      skills: [],
    },
  ];
  const bindings = [
    {
      binding_id: "BIND-001",
      employee_id: "A-2001",
      supplier_id: "SUP-001",
      workplace_id: "SH-01",
      skill_id: "SKILL-HOTLINE",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
    },
    {
      binding_id: "BIND-002",
      employee_id: "A-2001",
      supplier_id: "SUP-001",
      workplace_id: "SH-01",
      skill_id: "SKILL-TICKET",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
    },
    {
      binding_id: "BIND-003",
      employee_id: "A-2002",
      supplier_id: "SUP-001",
      workplace_id: "NJ-01",
      skill_id: "SKILL-HOTLINE",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
    },
  ];

  const internalPeople = summarizeMasterDataWorkplaceServiceTeamPeople({
    serviceTeam: {
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
    employees,
    bindings,
  });
  const supplierPeople = summarizeMasterDataWorkplaceServiceTeamPeople({
    serviceTeam: {
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
    employees,
    bindings,
  });

  assert.deepEqual(
    internalPeople.rows.map((row) => [
      row.employee_id,
      row.display.employeeNameLabel,
      row.display.employeeTypeLabel,
      row.display.organizationLabel,
      row.display.skillSummary,
      row.display.matchSourceLabel,
    ]),
    [
      [
        "A-1001",
        "刘晓晓",
        "自有员工",
        "CC / CCO / 集中退换小组",
        "集中退换工单（工单技能组）",
        "同职场同组织",
      ],
    ],
  );
  assert.deepEqual(
    supplierPeople.rows.map((row) => [
      row.employee_id,
      row.display.employeeNameLabel,
      row.display.employeeTypeLabel,
      row.display.statusLabel,
      row.display.matchSourceLabel,
    ]),
    [["A-2001", "李四", "外包员工", "冻结", "同职场同供应商绑定"]],
  );
  assert.equal(supplierPeople.totalPeople, 1);
  assert.equal(supplierPeople.emptyDetail, "暂无通过供应商归属记录匹配的人员。");
});
