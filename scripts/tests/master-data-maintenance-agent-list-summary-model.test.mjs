import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeMasterDataEmployeeList } = jiti("../../components/master-data-maintenance-model.ts");

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
