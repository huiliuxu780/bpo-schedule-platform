import assert from "node:assert/strict";
import test from "node:test";

import {
  MASTER_DATA_MAINTENANCE_ENTITIES,
  buildMasterDataAgentMaintenanceApiPath,
  buildMasterDataAgentMaintenancePayload,
  buildMasterDataAgentSkillMaintenanceApiPath,
  buildMasterDataAgentSkillMaintenancePayload,
  getMasterDataMaintenanceEntity,
  summarizeMasterDataAgentManagement,
  summarizeMasterDataBindingManagement,
  summarizeMasterDataEmployeeList,
  summarizeMasterDataAgentMaintenanceFeedback,
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceWorkbench,
  summarizeMasterDataReferenceManagement,
  summarizeMasterDataSiteOperatorManagement,
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
    ["坐席", "组织", "职场", "职场运营主体", "供应商", "技能", "绑定关系"],
  );
  assert.equal(getMasterDataMaintenanceEntity("projects"), null);
  assert.equal(getMasterDataMaintenanceEntity("organizations")?.label, "组织");
});

test("master data maintenance workbench shows an empty read-only state without source batches", () => {
  const summary = summarizeMasterDataMaintenanceWorkbench([]);

  assert.equal(summary.tone, "empty");
  assert.equal(summary.totalObjects, 7);
  assert.equal(summary.readyObjects, 0);
  assert.equal(summary.blockedObjects, 7);
  assert.equal(summary.sourceVersionLabel, "暂无主数据业务版本");
  assert.equal(summary.rows.length, 7);
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
  assert.equal(summary.readyObjects, 7);
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
  assert.equal(summary.blockedObjects, 7);
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
  const context = summarizeMasterDataEntitySourceContext("bindings", [
    {
      ...baseBatch,
      batch_id: "BATCH-IM083-SMOKE-002",
      import_version_id: "BATCH-IM083-SMOKE-002::v1",
    },
  ]);

  assert.equal(context.entity.label, "绑定关系");
  assert.equal(context.title, "绑定关系");
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

test("agent source context is the only master data context with submit source batch", () => {
  const agentContext = summarizeMasterDataEntitySourceContext("agents", [baseBatch]);
  const skillContext = summarizeMasterDataEntitySourceContext("skills", [baseBatch]);

  assert.equal(agentContext.agentSubmitSourceBatchId, "BATCH-MD-001");
  assert.equal(skillContext.agentSubmitSourceBatchId, null);
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

test("binding master data management summarizes relationship list rows", () => {
  const summary = summarizeMasterDataBindingManagement([
    {
      binding_id: "BIND-002",
      employee_id: "A-2002",
      supplier_id: "SUP-002",
      workplace_id: "NJ-01",
      project_id: "LEGACY-PROJ-001",
      skill_id: "SKILL-TICKET",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
      batch_id: "BATCH-MD-002",
    },
    {
      binding_id: "BIND-IM083-001",
      employee_id: "A-2001",
      supplier_id: "SUP-IM083-READY",
      workplace_id: "SH-01",
      project_id: "LEGACY-PROJ-001",
      skill_id: "SKILL-ONLINE",
      effective_from: "2026-05-01",
      effective_to: "2026-10-31",
      batch_id: "BATCH-MD-001",
    },
  ]);

  assert.equal(summary.title, "绑定关系");
  assert.equal(summary.totalRecords, 2);
  assert.deepEqual(
    summary.rows.map((row) => [
      row.display.bindingLabel,
      row.display.supplierLabel,
      row.display.workplaceLabel,
      row.display.skillLabel,
      row.display.effectivePeriodLabel,
      row.display.sourceBatchLabel,
    ]),
    [
      [
        "BIND-002",
        "SUP-002",
        "NJ-01",
        "SKILL-TICKET",
        "2026-06-01 至 2026-12-31",
        "BATCH-MD-002",
      ],
      [
        "BIND-业务-001",
        "SUP-业务-READY",
        "SH-01",
        "SKILL-ONLINE",
        "2026-05-01 至 2026-10-31",
        "BATCH-MD-001",
      ],
    ],
  );
  assert.equal("projectLabel" in summary.rows[0].display, false);
});

test("site operator management derives workplace ownership rows without future contract concepts", () => {
  const summary = summarizeMasterDataSiteOperatorManagement({
    employees: [
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
        skills: [],
      },
    ],
    bindings: [
      {
        binding_id: "BIND-001",
        employee_id: "A-3001",
        supplier_id: "SUP-001",
        workplace_id: "SH-01",
        project_id: "LEGACY-PROJ-001",
        skill_id: "SKILL-TICKET",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-002",
      },
    ],
  });

  assert.equal(summary.title, "职场运营主体");
  assert.equal(summary.totalRecords, 2);
  assert.equal(summary.internalRecords, 1);
  assert.equal(summary.supplierRecords, 1);
  assert.deepEqual(
    summary.rows.map((row) => [
      row.display.workplaceLabel,
      row.display.operatorTypeLabel,
      row.display.supplierLabel,
      row.display.statusLabel,
      row.display.effectivePeriodLabel,
      row.display.sourceLabel,
      row.display.sourceBatchLabel,
    ]),
    [
      [
        "NJ-01",
        "自有",
        "无供应商",
        "生效",
        "2026-05-01 至 2026-12-31",
        "人员档案",
        "BATCH-MD-001",
      ],
      [
        "SH-01",
        "供应商",
        "SUP-001",
        "生效",
        "2026-06-01 至 2026-12-31",
        "绑定关系",
        "BATCH-MD-002",
      ],
    ],
  );
  assert.equal(JSON.stringify(summary).includes("合同"), false);
  assert.equal(JSON.stringify(summary).includes("结算"), false);
  assert.equal(JSON.stringify(summary).includes("最低人力"), false);
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
