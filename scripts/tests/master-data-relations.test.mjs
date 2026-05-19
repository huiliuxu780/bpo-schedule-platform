import assert from "node:assert/strict";
import test from "node:test";

import {
  fallbackMasterDataRelations,
  getMasterDataRelationNode,
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
