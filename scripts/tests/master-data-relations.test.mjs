import assert from "node:assert/strict";
import test from "node:test";

import {
  fallbackMasterDataRelations,
  getEmployeeMasterDataBinding,
  getMasterDataBindingTarget,
  getMasterDataRelationNode,
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
