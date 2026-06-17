import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildMasterDataWorkplaceMaintenanceApiPath,
  buildMasterDataWorkplaceMaintenancePayload,
  summarizeMasterDataVendorDetail,
  summarizeMasterDataWorkplaceDetail,
  summarizeMasterDataWorkplaceServiceTeamPeople,
} = jiti("../../components/master-data-maintenance-model.ts");

test("workplace detail groups service teams inside the selected workplace", () => {
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
      {
        reference_id: "NJ-01",
        reference_name: "南京职场",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
    employees: [
      {
        employee_id: "A-1001",
        employee_name: "张三",
        status: "active",
        employee_type: "internal",
        organization_id: "ORG-SELF",
        organization_path: "CC / CCO / 自有团队",
        workplace_id: "SH-01",
        workplace_name: "上海职场",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [],
      },
      {
        employee_id: "A-1002",
        employee_name: "王五",
        status: "active",
        employee_type: "internal",
        organization_id: "ORG-SELF",
        organization_path: "CC / CCO / 自有团队",
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
        status: "active",
        employee_type: "internal",
        organization_id: "ORG-NJ",
        organization_path: "CC / CCO / 南京团队",
        workplace_id: "NJ-01",
        workplace_name: "南京职场",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [],
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
        binding_id: "BIND-003",
        employee_id: "A-3003",
        supplier_id: "SUP-001",
        workplace_id: "SH-01",
        skill_id: "SKILL-HOTLINE",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
      {
        binding_id: "BIND-002",
        employee_id: "A-3002",
        supplier_id: "SUP-002",
        workplace_id: "NJ-01",
        skill_id: "SKILL-HOTLINE",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
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
  });

  assert.equal(detail.found, true);
  assert.equal(detail.title, "上海职场");
  assert.equal(detail.workplace?.display.referenceIdLabel, "SH-01");
  assert.equal(detail.totalOperators, 2);
  assert.equal(detail.internalOperators, 1);
  assert.equal(detail.supplierOperators, 1);
  assert.deepEqual(
    detail.operatorRows.map((row) => [
      row.display.operatorTypeLabel,
      row.display.operatorNameLabel,
      row.display.supplierLabel,
      row.display.recordCountLabel,
      row.display.sourceLabel,
      row.display.effectivePeriodLabel,
    ]),
    [
      [
        "自有团队",
        "CC / CCO / 自有团队",
        "无供应商",
        "2 人",
        "人员档案",
        "2026-06-01 至 2026-12-31",
      ],
      [
        "供应商团队",
        "上海供应商",
        "上海供应商",
        "2 条绑定",
        "人员归属记录",
        "2026-06-01 至 2026-12-31",
      ],
    ],
  );
  assert.equal(JSON.stringify(detail).includes("合同"), false);
  assert.equal(JSON.stringify(detail).includes("结算"), false);
  assert.equal(JSON.stringify(detail).includes("最低人力"), false);
});

test("workplace detail returns not found for unknown workplace id", () => {
  const detail = summarizeMasterDataWorkplaceDetail({
    workplaceId: "UNKNOWN",
    workplaces: [],
    employees: [],
    bindings: [],
  });

  assert.equal(detail.found, false);
  assert.equal(detail.workplace, null);
  assert.equal(detail.operatorRows.length, 0);
});

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

test("workplace maintenance payload maps create edit and freeze actions", () => {
  assert.equal(
    buildMasterDataWorkplaceMaintenanceApiPath("SH 01/华东"),
    "/api/v1/master-data/workplaces/SH%2001%2F%E5%8D%8E%E4%B8%9C/maintenance",
  );

  assert.deepEqual(
    buildMasterDataWorkplaceMaintenancePayload({
      action: "create",
      sourceBatchId: "BATCH-MD-001",
      workplaceId: "SH-01",
      workplaceName: "上海职场",
      status: "active",
      effectiveFrom: "2026-06-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "create",
      source_batch_id: "BATCH-MD-001",
      reference_name: "上海职场",
      status: "active",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
    },
  );
  assert.deepEqual(
    buildMasterDataWorkplaceMaintenancePayload({
      action: "edit",
      sourceBatchId: "BATCH-MD-001",
      workplaceId: "SH-01",
      workplaceName: "上海职场东区",
      status: "inactive",
      effectiveFrom: "2026-07-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "edit",
      source_batch_id: "BATCH-MD-001",
      reference_name: "上海职场东区",
      status: "inactive",
      effective_from: "2026-07-01",
      effective_to: "2026-12-31",
    },
  );
  assert.deepEqual(
    buildMasterDataWorkplaceMaintenancePayload({
      action: "freeze",
      sourceBatchId: "BATCH-MD-001",
      workplaceId: "SH-01",
    }),
    {
      action: "freeze",
      source_batch_id: "BATCH-MD-001",
    },
  );
});
