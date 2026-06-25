import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeMasterDataOrganizationDetail, summarizeMasterDataSkillDetail } = jiti("../../components/master-data-maintenance-model.ts");

test("organization detail summarizes direct child organizations and current people", () => {
  const summary = summarizeMasterDataOrganizationDetail({
    organizationId: "ORG-CCO",
    organizations: [
      {
        organization_id: "ORG-CC",
        organization_name: "CC",
        organization_level: 1,
        parent_organization_id: null,
        status: "active",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        organization_path: "CC",
      },
      {
        organization_id: "ORG-CCO",
        organization_name: "CCO",
        organization_level: 2,
        parent_organization_id: "ORG-CC",
        status: "active",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        organization_path: "CC / CCO",
      },
      {
        organization_id: "ORG-RETURN",
        organization_name: "集中退换小组",
        organization_level: 3,
        parent_organization_id: "ORG-CCO",
        status: "active",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        organization_path: "CC / CCO / 集中退换小组",
      },
    ],
    employees: [
      {
        employee_id: "A-1001",
        employee_name: "刘晓晓",
        status: "active",
        employee_type: "internal",
        organization_id: "ORG-CCO",
        organization_path: "CC / CCO",
        workplace_id: "NJ-01",
        workplace_name: "南京职场",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [],
      },
      {
        employee_id: "A-1002",
        employee_name: "王小王",
        status: "active",
        employee_type: "outsourced",
        organization_id: "ORG-RETURN",
        organization_path: "CC / CCO / 集中退换小组",
        workplace_id: "SH-01",
        workplace_name: "上海职场",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [],
      },
    ],
  });

  assert.equal(summary.found, true);
  assert.equal(summary.title, "CCO");
  assert.equal(summary.organization?.display.detailHref, "/master-data/organizations/ORG-CCO");
  assert.equal(summary.totalChildOrganizations, 1);
  assert.equal(summary.childRows[0].organization_id, "ORG-RETURN");
  assert.equal(summary.childRows[0].display.detailHref, "/master-data/organizations/ORG-RETURN");
  assert.equal(summary.totalPeople, 1);
  assert.equal(summary.peopleRows[0].employee_id, "A-1001");
  assert.equal(summary.peopleRows[0].display.detailHref, "/master-data/agents/A-1001");
  assert.equal(
    summary.peopleRows.some((row) => row.employee_id === "A-1002"),
    false,
  );
});

test("skill detail summarizes current people who own the skill", () => {
  const summary = summarizeMasterDataSkillDetail({
    skillId: "SKILL-RETURN-TICKET",
    skills: [
      {
        reference_id: "SKILL-RETURN-TICKET",
        reference_name: "集中退换工单",
        status: "active",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skill_category: "ticket",
      },
    ],
    employees: [
      {
        employee_id: "A-1001",
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
            employee_id: "A-1001",
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
        employee_id: "A-1002",
        employee_name: "王小王",
        status: "active",
        employee_type: "outsourced",
        organization_id: "ORG-RETURN",
        organization_path: "CC / CCO / 集中退换小组",
        workplace_id: "SH-01",
        workplace_name: "上海职场",
        effective_from: "2026-05-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [
          {
            employee_id: "A-1002",
            skill_id: "SKILL-GENERAL",
            skill_name: "通用技能组",
            skill_category: "online",
            effective_from: "2026-05-01",
            effective_to: "2026-12-31",
            batch_id: "BATCH-MD-001",
          },
        ],
      },
    ],
  });

  assert.equal(summary.found, true);
  assert.equal(summary.title, "集中退换工单");
  assert.equal(summary.skill?.display.detailHref, "/master-data/skills/SKILL-RETURN-TICKET");
  assert.equal(summary.totalPeople, 1);
  assert.equal(summary.peopleRows[0].employee_id, "A-1001");
  assert.equal(summary.peopleRows[0].display.detailHref, "/master-data/agents/A-1001");
  assert.equal(
    summary.peopleRows.some((row) => row.employee_id === "A-1002"),
    false,
  );
});
