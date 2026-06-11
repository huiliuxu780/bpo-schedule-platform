import assert from "node:assert/strict";
import test from "node:test";

import {
  MASTER_DATA_MAINTENANCE_ENTITIES,
  buildMasterDataAgentMaintenanceApiPath,
  buildMasterDataAgentMaintenancePayload,
  buildMasterDataAgentSkillMaintenanceApiPath,
  buildMasterDataAgentSkillMaintenancePayload,
  buildMasterDataOrganizationMaintenanceApiPath,
  buildMasterDataOrganizationMaintenancePayload,
  buildMasterDataSkillMaintenanceApiPath,
  buildMasterDataSkillMaintenancePayload,
  buildMasterDataVendorMaintenanceApiPath,
  buildMasterDataVendorMaintenancePayload,
  buildMasterDataWorkplaceMaintenanceApiPath,
  buildMasterDataWorkplaceMaintenancePayload,
  getMasterDataMaintenanceEntity,
  summarizeMasterDataAgentManagement,
  summarizeMasterDataAgentImportDialog,
  summarizeMasterDataEmployeeList,
  summarizeMasterDataAgentMaintenanceFeedback,
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceWorkbench,
  summarizeMasterDataOrganizationManagement,
  summarizeMasterDataReferenceManagement,
  summarizeMasterDataVendorDetail,
  summarizeMasterDataWorkplaceDetail,
} from "../../components/master-data-maintenance-model.ts";

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

test("master data maintenance defines the core people-oriented maintenance objects without project", () => {
  assert.deepEqual(
    MASTER_DATA_MAINTENANCE_ENTITIES.map((entity) => entity.label),
    ["坐席", "组织", "职场", "供应商", "技能"],
  );
  assert.equal(getMasterDataMaintenanceEntity("projects"), null);
  assert.equal(getMasterDataMaintenanceEntity("site-operators"), null);
  assert.equal(getMasterDataMaintenanceEntity("bindings"), null);
  assert.equal(getMasterDataMaintenanceEntity("organizations")?.label, "组织");
});

test("master data maintenance workbench shows an empty read-only state without source batches", () => {
  const summary = summarizeMasterDataMaintenanceWorkbench([]);

  assert.equal(summary.tone, "empty");
  assert.equal(summary.totalObjects, 5);
  assert.equal(summary.readyObjects, 0);
  assert.equal(summary.blockedObjects, 5);
  assert.equal(summary.sourceVersionLabel, "暂无主数据业务版本");
  assert.equal(summary.rows.length, 5);
  assert.equal(summary.rows[0].statusLabel, "待导入");
  assert.equal(summary.rows[0].blockerSummary, "尚未发现主数据导入批次");
  assert.equal(summary.rows[0].sourceBatchHref, null);
});

test("master data maintenance workbench uses the latest applied master data version", () => {
  const summary = summarizeMasterDataMaintenanceWorkbench([
    {
      ...baseBatch,
      batch_id: "BATCH-SCH-001",
      file_type: "personnel_schedule",
      import_version_id: "BATCH-SCH-001::v1",
    },
    baseBatch,
  ]);

  assert.equal(summary.tone, "ready");
  assert.equal(summary.readyObjects, 5);
  assert.equal(summary.blockedObjects, 0);
  assert.equal(summary.sourceVersionLabel, "BATCH-MD-001::v1");
  assert.equal(summary.latestBatchLabel, "BATCH-MD-001");
  assert.equal(summary.rows[0].statusLabel, "可查看");
  assert.equal(summary.rows[0].nextActionLabel, "查看列表");
  assert.equal(summary.rows[0].sourceBatchHref, "/data-quality/import-batches/BATCH-MD-001");
  assert.equal(summary.rows[0].sourceVersionHref, "/data-quality/versions?domain=master_data");
  assert.equal(summary.rows[0].detailHref, "/master-data/agents");
});

test("master data maintenance workbench blocks freshness when the newest master data batch is not applied", () => {
  const summary = summarizeMasterDataMaintenanceWorkbench([
    baseBatch,
    {
      ...baseBatch,
      batch_id: "BATCH-MD-002",
      uploaded_at: "2026-06-03T10:00:00+08:00",
      application_status: "not_applied",
      import_version_id: "BATCH-MD-002::v1",
      applied_record_count: 0,
    },
  ]);

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.readyObjects, 0);
  assert.equal(summary.blockedObjects, 5);
  assert.equal(summary.sourceVersionLabel, "BATCH-MD-001::v1");
  assert.equal(summary.latestBatchLabel, "BATCH-MD-002");
  assert.match(summary.detail, /最新主数据批次尚未应用/);
  assert.equal(summary.rows[0].statusLabel, "待同步");
  assert.equal(summary.rows[0].blockerSummary, "最新主数据批次尚未应用，当前仍按上一已应用版本展示");
});

test("master data maintenance resolves known entity keys", () => {
  assert.equal(getMasterDataMaintenanceEntity("skills")?.label, "技能");
  assert.equal(getMasterDataMaintenanceEntity("missing"), null);
});

test("master data entity source context keeps list source state only", () => {
  const context = summarizeMasterDataEntitySourceContext("skills", [
    {
      ...baseBatch,
      batch_id: "BATCH-IM083-SMOKE-002",
      import_version_id: "BATCH-IM083-SMOKE-002::v1",
    },
  ]);

  assert.equal(context.entity.label, "技能");
  assert.equal(context.title, "技能");
  assert.equal(context.sourceVersionLabel, "BATCH-业务-002::v1");
  assert.equal(
    context.sourceBatchHref,
    "/data-quality/import-batches/BATCH-IM083-SMOKE-002",
  );
  assert.equal(context.agentSubmitSourceBatchId, null);
  assert.equal("workspaceTabs" in context, false);
  assert.equal("maintenanceActions" in context, false);
  assert.equal("referenceImpacts" in context, false);
});

test("agent workplace and vendor source contexts expose submit source batches for confirmed forms", () => {
  const agentContext = summarizeMasterDataEntitySourceContext("agents", [baseBatch]);
  const workplaceContext = summarizeMasterDataEntitySourceContext("sites", [baseBatch]);
  const vendorContext = summarizeMasterDataEntitySourceContext("vendors", [baseBatch]);
  const skillContext = summarizeMasterDataEntitySourceContext("skills", [baseBatch]);

  assert.equal(agentContext.agentSubmitSourceBatchId, "BATCH-MD-001");
  assert.equal(workplaceContext.workplaceSubmitSourceBatchId, "BATCH-MD-001");
  assert.equal(vendorContext.vendorSubmitSourceBatchId, "BATCH-MD-001");
  assert.equal(skillContext.agentSubmitSourceBatchId, null);
  assert.equal(skillContext.workplaceSubmitSourceBatchId, null);
  assert.equal(skillContext.vendorSubmitSourceBatchId, null);
  assert.equal(skillContext.skillSubmitSourceBatchId, "BATCH-MD-001");
});

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
  assert.equal(skillSummary.rows[0].display.detailHref, null);
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

test("master data source context keeps a blocked source state when no applied version exists", () => {
  const context = summarizeMasterDataEntitySourceContext("agents", [
    {
      ...baseBatch,
      application_status: "not_applied",
      applied_record_count: 0,
    },
  ]);

  assert.equal(context.tone, "blocked");
  assert.equal(context.sourceVersionLabel, "暂无主数据业务版本");
  assert.match(context.detail, /尚未应用/);
  assert.equal(context.agentSubmitSourceBatchId, "BATCH-MD-001");
});
