import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  fallbackMasterDataRelations,
  getEmployeeMasterDataBinding,
  getMasterDataBindingTarget,
  getMasterDataRelationNode,
  mergeImportedMasterDataBindings,
  mapImportedMasterDataRecord,
  summarizeEmployeeMasterDataBindings,
  summarizeMasterDataRelations,
} from "../../lib/master-data-relations.ts";

test("master data relationship summary counts nodes and dependencies", () => {
  const summary = summarizeMasterDataRelations(fallbackMasterDataRelations);

  assert.equal(summary.nodeCount, 6);
  assert.equal(summary.edgeCount, 8);
  assert.equal(summary.blockingEdgeCount, 4);
  assert.equal(summary.supportedFlows.length, 4);
});

test("master data relationship lookup exposes dependent business flows", () => {
  const node = getMasterDataRelationNode("agent_binding");

  assert.equal(node?.title, "人员绑定关系");
  assert.deepEqual(node?.supports, ["人员级排班", "履约对比", "异常归因"]);
});

test("employee master data bindings expose supplier workplace project skills and validity", () => {
  const summary = summarizeEmployeeMasterDataBindings();
  const binding = getEmployeeMasterDataBinding("A-1001");

  assert.equal(summary.total, 5);
  assert.equal(summary.active, 3);
  assert.equal(summary.needsReview, 1);
  assert.equal(summary.expiringSoon, 1);
  assert.equal(binding?.supplier, "供应商 A");
  assert.equal(binding?.workplace, "上海职场");
  assert.equal(binding?.project, "博西客服");
  assert.deepEqual(binding?.skills, ["热线", "L2"]);
  assert.equal(binding?.effectiveFrom, "2026-01-01");
  assert.equal(binding?.effectiveTo, "2026-12-31");
  assert.equal(binding?.status, "active");
});

test("master data bindings expose reverse lookup targets for anomalies and data quality", () => {
  const missingBinding = getEmployeeMasterDataBinding("A-9931");

  assert.equal(missingBinding?.status, "needs_review");
  assert.ok(missingBinding?.qualityIssueIds.includes("DQ-202605-004"));
  assert.ok(missingBinding?.anomalyIds.includes("AR-202605-007"));
  assert.equal(getMasterDataBindingTarget("A-9931"), "/master-data-relations#employee-A-9931");
});

test("imported master data records map source batch and reference status", () => {
  const record = mapImportedMasterDataRecord({
    employee_id: "E-901",
    employee_name: "赵一",
    supplier_id: "SUP-01",
    supplier_name: "供应商 A",
    workplace_id: "WP-SH",
    workplace_name: "上海职场",
    project_id: "P-BOSCH",
    project_name: "博西客服",
    skill_group: "热线",
    skill_level: "L2",
    effective_from: "2026-05-01",
    effective_to: "2026-12-31",
    status: "active",
    source_batch_id: "BATCH-MD-20260527-001",
    source_version_id: "VER-MD-20260527-001",
    reference_status: "ready",
  });

  assert.equal(record.employeeId, "E-901");
  assert.equal(record.sourceBatchId, "BATCH-MD-20260527-001");
  assert.equal(record.sourceVersionId, "VER-MD-20260527-001");
  assert.equal(record.referenceStatus, "ready");
  assert.deepEqual(record.skills, ["热线", "L2"]);
});

test("imported master data bindings are shown before fallback records", () => {
  const merged = mergeImportedMasterDataBindings([
    {
      employeeId: "E-901",
      employeeName: "赵一",
      supplier: "供应商 A",
      workplace: "上海职场",
      project: "博西客服",
      skills: ["热线", "L2"],
      effectiveFrom: "2026-05-01",
      effectiveTo: "2026-12-31",
      status: "active",
      anomalyIds: [],
      qualityIssueIds: [],
      businessImpact: "主数据已导入，可用于后续业务引用。",
      sourceBatchId: "BATCH-MD-20260527-001",
      sourceVersionId: "VER-MD-20260527-001",
      referenceStatus: "ready",
    },
  ]);

  assert.equal(merged[0].employeeId, "E-901");
  assert.equal(merged[0].sourceBatchId, "BATCH-MD-20260527-001");
  assert.ok(merged.some((row) => row.employeeId === "A-1001"));
});

test("master data page displays import traceability fields", () => {
  const source = readFileSync("app/master-data-relations/page.tsx", "utf8");

  assert.ok(source.includes("来源批次"));
  assert.ok(source.includes("导入版本"));
  assert.ok(source.includes("引用状态"));
});
