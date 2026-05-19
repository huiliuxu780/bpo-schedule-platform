import assert from "node:assert/strict";
import test from "node:test";

import {
  fallbackDemandForecastContract,
  summarizeDemandForecastContract,
} from "../../lib/demand-forecast-contract.ts";

test("demand forecast contract defines half-hour forecast grain", () => {
  const contract = fallbackDemandForecastContract;

  assert.equal(contract.entity, "demand_forecast");
  assert.equal(contract.intervalMinutes, 30);
  assert.equal(contract.primaryKey.includes("forecast_id"), true);
  assert.equal(contract.fields.includes("skill_group"), true);
  assert.equal(contract.fields.includes("skill_level"), true);
});

test("demand forecast contract summary keeps required fields and validation traceable", () => {
  const summary = summarizeDemandForecastContract(fallbackDemandForecastContract);

  assert.equal(summary.fieldCount, 15);
  assert.equal(summary.requiredFieldCount, 10);
  assert.equal(summary.validationRuleCount, 7);
  assert.equal(summary.hasSkillDemand, true);
  assert.equal(summary.deferredActions.includes("无真实预测系统接入"), true);
});
