import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { buildMasterDataAgentMaintenanceApiPath, buildMasterDataAgentMaintenancePayload, buildMasterDataAgentSkillMaintenanceApiPath, buildMasterDataAgentSkillMaintenancePayload, summarizeMasterDataAgentMaintenanceFeedback } = jiti("../../components/master-data-maintenance-model.ts");

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
