import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildMasterDataAgentMaintenanceApiPath,
  buildMasterDataAgentMaintenancePayload,
  buildMasterDataAgentSkillMaintenanceApiPath,
  buildMasterDataAgentSkillMaintenancePayload,
  summarizeMasterDataAgentManagement,
  summarizeMasterDataAgentDetail,
  summarizeMasterDataAgentImportDialog,
  summarizeMasterDataEmployeeList,
  summarizeMasterDataAgentMaintenanceFeedback,
} = jiti("../../components/master-data-maintenance-model.ts");

const baseBatch = {
  batch_id: "BATCH-MD-001",
  file_name: "master.csv",
  file_type: "master_data",
  uploaded_by: "ops",
  uploaded_at: "2026-06-03T09:00:00+08:00",
  business_date_from: "2026-06-01",
  business_date_to: "2026-06-30",
  processing_status: "completed",
  total_rows: 18,
  success_rows: 18,
  failed_rows: 0,
  warning_rows: 0,
  version_count: 1,
  application_status: "applied",
  application_target: "master_data",
  import_version_id: "BATCH-MD-001::v1",
  applied_record_count: 18,
};

test("master data employee list summarizes org path type workplace and skills", () => {
  const summary = summarizeMasterDataEmployeeList([
    {
      employee_id: "A-2001",
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
          employee_id: "A-2001",
          skill_id: "SKILL-RETURN-TICKET",
          skill_name: "集中退换工单",
          skill_category: "ticket",
          effective_from: "2026-05-01",
          effective_to: "2026-12-31",
          batch_id: "BATCH-MD-001",
        },
        {
          employee_id: "A-2001",
          skill_id: "SKILL-RETURN-CALL",
          skill_name: "集中退换外呼",
          skill_category: "hotline",
          effective_from: "2026-05-01",
          effective_to: "2026-12-31",
          batch_id: "BATCH-MD-001",
        },
        {
          employee_id: "A-2001",
          skill_id: "SKILL-GENERAL",
          skill_name: "通用技能组",
          skill_category: "online",
          effective_from: "2026-05-01",
          effective_to: "2026-12-31",
          batch_id: "BATCH-MD-001",
        },
      ],
    },
  ]);

  assert.equal(summary.totalEmployees, 1);
  assert.equal(summary.activeEmployees, 1);
  assert.equal(summary.internalEmployees, 1);
  assert.equal(summary.outsourcedEmployees, 0);
  assert.deepEqual({
    employeeTypeLabel: summary.rows[0].display.employeeTypeLabel,
    statusLabel: summary.rows[0].display.statusLabel,
    organizationLabel: summary.rows[0].display.organizationLabel,
    workplaceLabel: summary.rows[0].display.workplaceLabel,
    skillSummary: summary.rows[0].display.skillSummary,
  }, {
    employeeTypeLabel: "自有员工",
    statusLabel: "生效",
    organizationLabel: "CC / CCO / 集中退换小组",
    workplaceLabel: "南京职场",
    skillSummary: "通用技能组（在线技能组）、集中退换外呼（热线技能组）、集中退换工单（工单技能组）",
  });
});

test("agent management page exposes customer service list layout contract", () => {
  const summary = summarizeMasterDataAgentManagement([
    {
      employee_id: "A-2001",
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
          employee_id: "A-2001",
          skill_id: "SKILL-RETURN-TICKET",
          skill_name: "集中退换工单",
          skill_category: "ticket",
          effective_from: "2026-05-01",
          effective_to: "2026-12-31",
          batch_id: "BATCH-MD-001",
        },
      ],
    },
  ]);

  assert.equal(summary.title, "客服人员");
  assert.equal(summary.createHref, "/master-data/agents/new");
  assert.deepEqual(
    summary.filterFields.map((field) => field.label),
    ["客服名", "技能组", "账号", "状态", "组织", "职场", "坐席类型"],
  );
  assert.deepEqual(
    summary.bulkActions.map((action) => action.label),
    ["人员类型", "组织架构", "技能组", "冻结/解冻"],
  );
  assert.deepEqual(
    summary.tableColumns.map((column) => column.label),
    ["姓名", "账号", "工号", "对外展示名", "组织", "技能组", "级别", "状态", "冻结/解冻原因", "ID", "操作"],
  );
  assert.equal(summary.rows[0].display.accountLabel, "A-2001");
  assert.equal(summary.rows[0].display.jobNumberLabel, "未配置");
  assert.equal(summary.rows[0].display.publicNameLabel, "刘晓晓");
  assert.equal(summary.rows[0].display.levelLabel, "自有员工");
  assert.equal(summary.rows[0].display.freezeReasonLabel, "-");
  assert.equal(
    summary.rows[0].display.editHref,
    "/master-data/agents/A-2001/edit",
  );
  assert.equal(
    summary.rows[0].display.freezeHref,
    "/master-data/agents?freeze_employee_id=A-2001",
  );
  assert.equal(
    summary.rows[0].display.skillsEditHref,
    "/master-data/agents/A-2001/skills/edit",
  );
});

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

test("agent management filters use real skill organization and workplace data", () => {
  const employees = [
    {
      employee_id: "A-2001",
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
          employee_id: "A-2001",
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
      employee_id: "A-2002",
      employee_name: "王一一",
      status: "frozen",
      employee_type: "outsourced",
      organization_id: "ORG-HOTLINE",
      organization_path: "CC / CCO / 热线小组",
      workplace_id: "SH-01",
      workplace_name: "上海职场",
      effective_from: "2026-05-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-001",
      skills: [
        {
          employee_id: "A-2002",
          skill_id: "SKILL-HOTLINE",
          skill_name: "热线接待",
          skill_category: "hotline",
          effective_from: "2026-05-01",
          effective_to: "2026-12-31",
          batch_id: "BATCH-MD-001",
        },
      ],
    },
  ];

  const summary = summarizeMasterDataAgentManagement(employees, {
    skill_group: "SKILL-RETURN-TICKET",
    organization: "ORG-RETURN",
    workplace: "NJ-01",
  });

  const skillField = summary.filterFields.find((field) => field.key === "skill_group");
  const organizationField = summary.filterFields.find((field) => field.key === "organization");
  const workplaceField = summary.filterFields.find((field) => field.key === "workplace");

  assert.deepEqual(skillField?.options, [
    { value: "all", label: "全部技能组" },
    { value: "SKILL-HOTLINE", label: "热线接待" },
    { value: "SKILL-RETURN-TICKET", label: "集中退换工单" },
  ]);
  assert.deepEqual(organizationField?.options, [
    { value: "all", label: "全部组织" },
    { value: "ORG-HOTLINE", label: "CC / CCO / 热线小组" },
    { value: "ORG-RETURN", label: "CC / CCO / 集中退换小组" },
  ]);
  assert.deepEqual(workplaceField?.options, [
    { value: "all", label: "全部职场" },
    { value: "NJ-01", label: "南京职场" },
    { value: "SH-01", label: "上海职场" },
  ]);
  assert.deepEqual(summary.rows.map((row) => row.employee_id), ["A-2001"]);
});

test("agent import dialog summary keeps upload flow in the agent list context", () => {
  const summary = summarizeMasterDataAgentImportDialog({
    batches: [
      {
        ...baseBatch,
        batch_id: "BATCH-MD-IMPORT-001",
        uploaded_at: "2026-06-05T09:00:00+08:00",
        total_rows: 3,
        success_rows: 2,
        failed_rows: 1,
        application_status: "not_applied",
        import_version_id: "BATCH-MD-IMPORT-001::v1",
        applied_record_count: 0,
      },
    ],
    templates: [
      {
        template_id: "TPL-MD-AGENT",
        template_name: "客服人员字段映射",
        file_type: "master_data",
        field_mapping: {
          record_type: "record_type",
          employee_id: "employee_id",
          employee_name: "employee_name",
        },
        is_active: true,
        created_by: "ops",
        created_at: "2026-06-05T09:00:00+08:00",
        updated_at: "2026-06-05T09:00:00+08:00",
      },
    ],
    uploadStatus: "success",
    uploadBatchId: "BATCH-MD-IMPORT-001",
  });

  assert.equal(summary.openHref, "/master-data/agents?import_dialog=1");
  assert.equal(summary.closeHref, "/master-data/agents");
  assert.equal(summary.resultRedirectTo, "/master-data/agents?import_dialog=1");
  assert.equal(summary.fileType, "master_data");
  assert.deepEqual(
    summary.steps.map((step) => step.title),
    ["上传文件", "字段映射", "导入结果"],
  );
  assert.equal(summary.mappingModes[0].label, "选择映射模板");
  assert.equal(summary.mappingModes[1].label, "手动映射字段");
  assert.equal(summary.activeTemplates.length, 1);
  assert.equal(summary.result?.batchHref, "/data-quality/import-batches/BATCH-MD-IMPORT-001");
  assert.equal(summary.result?.rowSummary, "成功 2 行 / 失败 1 行");
  assert.equal(summary.result?.nextActionLabel, "查看批次详情");
});

test("agent maintenance payload maps create edit freeze and effective period actions", () => {
  assert.equal(
    buildMasterDataAgentMaintenanceApiPath("A 100/1"),
    "/api/v1/master-data/employees/A%20100%2F1/maintenance",
  );

  assert.deepEqual(
    buildMasterDataAgentMaintenancePayload({
      action: "create",
      sourceBatchId: "BATCH-MD-001",
      employeeId: "A-1001",
      employeeName: "王一",
      status: "active",
      employeeType: "internal",
      organizationId: "ORG-RETURN",
      workplaceId: "NJ-01",
      effectiveFrom: "2026-06-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "create",
      source_batch_id: "BATCH-MD-001",
      employee_name: "王一",
      status: "active",
      employee_type: "internal",
      organization_id: "ORG-RETURN",
      workplace_id: "NJ-01",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
    },
  );
  assert.deepEqual(
    buildMasterDataAgentMaintenancePayload({
      action: "edit",
      sourceBatchId: "BATCH-MD-001",
      employeeId: "A-1001",
      employeeName: "王一-修正",
      status: "inactive",
      employeeType: "outsourced",
      organizationId: "ORG-SUPPORT",
      workplaceId: "SH-01",
    }),
    {
      action: "edit",
      source_batch_id: "BATCH-MD-001",
      employee_name: "王一-修正",
      status: "inactive",
      employee_type: "outsourced",
      organization_id: "ORG-SUPPORT",
      workplace_id: "SH-01",
    },
  );
  assert.deepEqual(
    buildMasterDataAgentMaintenancePayload({
      action: "freeze",
      sourceBatchId: "BATCH-MD-001",
      employeeId: "A-1001",
    }),
    {
      action: "freeze",
      source_batch_id: "BATCH-MD-001",
    },
  );
  assert.deepEqual(
    buildMasterDataAgentMaintenancePayload({
      action: "effective_period",
      sourceBatchId: "BATCH-MD-001",
      employeeId: "A-1001",
      effectiveFrom: "2026-07-01",
      effectiveTo: "2026-10-31",
    }),
    {
      action: "effective_period",
      source_batch_id: "BATCH-MD-001",
      effective_from: "2026-07-01",
      effective_to: "2026-10-31",
    },
  );
});

test("agent skill maintenance payload maps single employee skill replacement", () => {
  assert.equal(
    buildMasterDataAgentSkillMaintenanceApiPath("A 100/1"),
    "/api/v1/master-data/employees/A%20100%2F1/skills/maintenance",
  );
  assert.deepEqual(
    buildMasterDataAgentSkillMaintenancePayload({
      sourceBatchId: "BATCH-MD-001",
      employeeId: "A-1001",
      skillIds: ["SKILL-RETURN-CALL", "SKILL-GENERAL"],
      effectiveFrom: "2026-06-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "replace",
      source_batch_id: "BATCH-MD-001",
      skill_ids: ["SKILL-RETURN-CALL", "SKILL-GENERAL"],
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
    },
  );
});

test("agent maintenance feedback summarizes success and backend error codes", () => {
  assert.deepEqual(
    summarizeMasterDataAgentMaintenanceFeedback({
      maintenance_status: "success",
      employee_id: "A-1001",
      employee_name: "王一",
      employee_status: "active",
      action_status: "created",
    }),
    {
      tone: "success",
      title: "人员保存成功",
      detail: "A-1001 王一 已 created，当前状态 active。",
    },
  );

  assert.deepEqual(
    summarizeMasterDataAgentMaintenanceFeedback({
      maintenance_status: "error",
      maintenance_code: "EMPLOYEE_NOT_FOUND",
      maintenance_message: "EMPLOYEE_NOT_FOUND: A-404",
    }),
    {
      tone: "error",
      title: "人员保存失败",
      detail: "EMPLOYEE_NOT_FOUND: EMPLOYEE_NOT_FOUND: A-404",
    },
  );
});
