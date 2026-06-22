import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeMasterDataAgentManagement } = jiti("../../components/master-data-maintenance-model.ts");

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
