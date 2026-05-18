import assert from "node:assert/strict";
import test from "node:test";

import {
  fallbackProductionMvpContracts,
  summarizeProductionMvpContracts,
} from "../../lib/production-mvp-contracts.ts";

test("production MVP contract summary counts local contract coverage", () => {
  const summary = summarizeProductionMvpContracts(fallbackProductionMvpContracts);

  assert.equal(summary.contractCount, 3);
  assert.equal(summary.sourceCount, 4);
  assert.equal(summary.anomalyRuleCount, 7);
  assert.deepEqual(summary.contractTitles, [
    "主数据导入合同",
    "人员级排班合同",
    "预测/排班/登录/状态对比合同",
  ]);
});

test("production MVP fallback keeps deferred production capabilities explicit", () => {
  const summary = summarizeProductionMvpContracts(fallbackProductionMvpContracts);

  assert.deepEqual(summary.deferredCapabilities, [
    "无数据库持久化",
    "无真实外部导入",
    "无权限/审批/导出/批量操作",
    "无生产公式、结算规则或 charge factor",
  ]);
  assert.equal(summary.hasPersonnelScheduleDetail, true);
  assert.equal(summary.hasHalfHourIntervalAggregation, true);
});
