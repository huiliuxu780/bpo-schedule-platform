import assert from "node:assert/strict";
import test from "node:test";

import {
  MASTER_DATA_MAINTENANCE_ENTITIES,
  buildMasterDataAgentMaintenanceApiPath,
  buildMasterDataAgentMaintenancePayload,
  buildMasterDataAgentSkillMaintenanceApiPath,
  buildMasterDataAgentSkillMaintenancePayload,
  buildMasterDataBindingMaintenanceApiPath,
  buildMasterDataBindingMaintenancePayload,
  buildMasterDataReferenceMaintenanceApiPath,
  buildMasterDataReferenceMaintenancePayload,
  getMasterDataMaintenanceEntity,
  summarizeMasterDataAgentManagement,
  summarizeMasterDataEmployeeList,
  summarizeMasterDataAgentMaintenanceFeedback,
  summarizeMasterDataMaintenanceEntityDetail,
  summarizeMasterDataMaintenanceWorkbench,
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

test("master data maintenance defines the six read-only maintenance objects", () => {
  assert.deepEqual(
    MASTER_DATA_MAINTENANCE_ENTITIES.map((entity) => entity.label),
    ["坐席", "职场", "供应商", "项目", "技能", "绑定关系"],
  );
});

test("master data maintenance workbench shows an empty read-only state without source batches", () => {
  const summary = summarizeMasterDataMaintenanceWorkbench([]);

  assert.equal(summary.tone, "empty");
  assert.equal(summary.totalObjects, 6);
  assert.equal(summary.readyObjects, 0);
  assert.equal(summary.blockedObjects, 6);
  assert.equal(summary.sourceVersionLabel, "暂无主数据业务版本");
  assert.equal(summary.rows.length, 6);
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
  assert.equal(summary.readyObjects, 6);
  assert.equal(summary.blockedObjects, 0);
  assert.equal(summary.sourceVersionLabel, "BATCH-MD-001::v1");
  assert.equal(summary.latestBatchLabel, "BATCH-MD-001");
  assert.equal(summary.rows[0].statusLabel, "只读可查看");
  assert.equal(summary.rows[0].nextActionLabel, "查看详情与受控动作");
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
  assert.equal(summary.blockedObjects, 6);
  assert.equal(summary.sourceVersionLabel, "BATCH-MD-001::v1");
  assert.equal(summary.latestBatchLabel, "BATCH-MD-002");
  assert.match(summary.detail, /最新主数据批次尚未应用/);
  assert.equal(summary.rows[0].statusLabel, "待同步");
  assert.equal(summary.rows[0].blockerSummary, "最新主数据批次尚未应用，当前仍按上一已应用版本只读展示");
});

test("master data maintenance resolves known entity keys", () => {
  assert.equal(getMasterDataMaintenanceEntity("skills")?.label, "技能");
  assert.equal(getMasterDataMaintenanceEntity("missing"), null);
});

test("master data entity detail exposes source context and empty reference impact without fabrication", () => {
  const detail = summarizeMasterDataMaintenanceEntityDetail("bindings", [baseBatch]);

  assert.equal(detail.entity.label, "绑定关系");
  assert.deepEqual(detail.workspaceTabs, [
    { key: "overview", label: "总览" },
    { key: "source", label: "来源与引用" },
    { key: "actions", label: "受控动作" },
    { key: "submit", label: "提交表单" },
    { key: "boundary", label: "维护边界" },
  ]);
  assert.equal(detail.sourceVersionLabel, "BATCH-MD-001::v1");
  assert.equal(detail.sourceBatchHref, "/data-quality/import-batches/BATCH-MD-001");
  assert.equal(detail.effectivePeriodLabel, "暂无实体级有效期明细");
  assert.equal(detail.freezeStatusLabel, "暂无实体级冻结明细");
  assert.equal(detail.referenceImpacts.length, 4);
  assert.deepEqual(
    detail.referenceImpacts.map((impact) => impact.label),
    ["排班引用", "预测引用", "登录/状态引用", "比对与复核引用"],
  );
  assert.equal(detail.referenceImpacts[0].countLabel, "不伪造数量");
  assert.equal(detail.referenceImpacts[0].tone, "empty");
  assert.deepEqual(
    detail.maintenanceActions.map((action) => action.label),
    ["新增绑定关系", "编辑绑定关系", "冻结绑定关系", "调整绑定关系有效期"],
  );
  assert.equal(detail.maintenanceActions[0].canSubmit, true);
  assert.equal(detail.maintenanceActions[0].submitLabel, "提交新增");
  assert.match(detail.maintenanceActions[0].referenceCheckLabel, /引用影响校验/);
  assert.match(detail.maintenanceActions[0].failureBoundary, /主数据单对象 API/);
});

test("agent detail enables controlled submit actions only for agents", () => {
  const agentDetail = summarizeMasterDataMaintenanceEntityDetail("agents", [baseBatch]);
  const skillDetail = summarizeMasterDataMaintenanceEntityDetail("skills", [baseBatch]);

  assert.equal(agentDetail.maintenanceActions[0].canSubmit, true);
  assert.equal(agentDetail.maintenanceActions[0].submitLabel, "提交新增");
  assert.equal(agentDetail.maintenanceActions[1].submitLabel, "提交编辑");
  assert.equal(agentDetail.maintenanceActions[2].submitLabel, "提交冻结");
  assert.equal(agentDetail.maintenanceActions[3].submitLabel, "提交有效期");
  assert.equal(agentDetail.agentSubmitSourceBatchId, "BATCH-MD-001");
  assert.deepEqual(
    agentDetail.workspaceTabs.map((tab) => tab.label),
    ["总览", "来源与引用", "受控动作", "提交表单", "技能维护", "维护边界"],
  );
  assert.equal(skillDetail.maintenanceActions[0].canSubmit, true);
  assert.equal(skillDetail.maintenanceActions[0].submitLabel, "提交新增");
  assert.equal(skillDetail.referenceSubmitSourceBatchId, "BATCH-MD-001");
  assert.deepEqual(
    skillDetail.workspaceTabs.map((tab) => tab.label),
    ["总览", "来源与引用", "受控动作", "提交表单", "维护边界"],
  );
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

test("reference maintenance payload maps non-agent master data objects", () => {
  assert.equal(
    buildMasterDataReferenceMaintenanceApiPath("skills", "SKILL 100/1"),
    "/api/v1/master-data/skills/SKILL%20100%2F1/maintenance",
  );
  assert.deepEqual(
    buildMasterDataReferenceMaintenancePayload({
      action: "create",
      sourceBatchId: "BATCH-MD-001",
      referenceId: "SKILL-1001",
      referenceName: "粤语",
      status: "active",
      effectiveFrom: "2026-06-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "create",
      source_batch_id: "BATCH-MD-001",
      reference_name: "粤语",
      status: "active",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
    },
  );
});

test("binding maintenance payload maps relationship references and keeps freeze disabled", () => {
  const detail = summarizeMasterDataMaintenanceEntityDetail("bindings", [baseBatch]);

  assert.equal(detail.bindingSubmitSourceBatchId, "BATCH-MD-001");
  assert.deepEqual(
    detail.maintenanceActions.map((action) => [action.key, action.canSubmit]),
    [
      ["create", true],
      ["edit", true],
      ["freeze", false],
      ["effective_period", true],
    ],
  );
  assert.equal(
    buildMasterDataBindingMaintenanceApiPath("BIND 100/1"),
    "/api/v1/master-data/bindings/BIND%20100%2F1/maintenance",
  );
  assert.deepEqual(
    buildMasterDataBindingMaintenancePayload({
      action: "create",
      sourceBatchId: "BATCH-MD-001",
      bindingId: "BIND-1001",
      employeeId: "A-1001",
      supplierId: "SUP-001",
      workplaceId: "SITE-001",
      projectId: "PROJ-001",
      skillId: "SKILL-001",
      effectiveFrom: "2026-06-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "create",
      source_batch_id: "BATCH-MD-001",
      employee_id: "A-1001",
      supplier_id: "SUP-001",
      workplace_id: "SITE-001",
      project_id: "PROJ-001",
      skill_id: "SKILL-001",
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
      title: "主数据维护已提交",
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
      title: "主数据维护提交失败",
      detail: "EMPLOYEE_NOT_FOUND: EMPLOYEE_NOT_FOUND: A-404",
    },
  );
});

test("master data entity detail keeps a blocked source state when no applied version exists", () => {
  const detail = summarizeMasterDataMaintenanceEntityDetail("agents", [
    {
      ...baseBatch,
      application_status: "not_applied",
      applied_record_count: 0,
    },
  ]);

  assert.equal(detail.tone, "blocked");
  assert.equal(detail.sourceVersionLabel, "暂无主数据业务版本");
  assert.match(detail.detail, /尚未应用/);
  assert.equal(detail.referenceImpacts[0].detail, "来源版本未就绪，暂不展示引用影响。");
  assert.equal(detail.maintenanceActions[0].statusLabel, "来源阻塞");
  assert.equal(detail.maintenanceActions[0].canSubmit, true);
  assert.equal(detail.agentSubmitSourceBatchId, "BATCH-MD-001");
  assert.equal(detail.maintenanceActions[0].referenceCheckLabel, "来源版本未就绪，禁止进入写入。");
  assert.equal(detail.maintenanceActions[0].failureBoundary, "先应用主数据来源批次，再重新检查引用影响。");
});
