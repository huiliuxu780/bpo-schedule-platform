import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const demandForecastProductionPagePath = new URL("../../app/demand-plans/production/page.tsx", import.meta.url);
const personnelScheduleProductionPagePath = new URL("../../app/schedule-plans/production/page.tsx", import.meta.url);
const actualLogProductionPagePath = new URL("../../app/actual-logs/production/page.tsx", import.meta.url);
const demandForecastProductionWorkbenchPath = new URL("../../components/demand-forecast-production-workbench.tsx", import.meta.url);
const personnelScheduleProductionWorkbenchPath = new URL("../../components/personnel-schedule-production-workbench.tsx", import.meta.url);
const actualLogProductionWorkbenchPath = new URL("../../components/actual-log-production-workbench.tsx", import.meta.url);

test("production child routes use business object wording instead of production module wording", async () => {
  const pageExpectations = [
    {
      source: await readFile(demandForecastProductionPagePath, "utf8"),
      forbidden: ['title="预测生产"'],
      required: ['title="预测版本"'],
    },
    {
      source: await readFile(personnelScheduleProductionPagePath, "utf8"),
      forbidden: ['title="排班生产"'],
      required: ['title="排班版本"'],
    },
    {
      source: await readFile(actualLogProductionPagePath, "utf8"),
      forbidden: ['title="登录/状态日志生产"'],
      required: ['title="登录/状态日志"'],
    },
  ];
  const workbenchExpectations = [
    {
      source: await readFile(demandForecastProductionWorkbenchPath, "utf8"),
      forbidden: ["预测生产", "需求预测生产台账", "返回预测生产"],
      required: ["预测版本", "预测版本列表", "返回需求计划"],
    },
    {
      source: await readFile(personnelScheduleProductionWorkbenchPath, "utf8"),
      forbidden: ["排班生产", "人员排班生产台账", "返回排班生产", "生产版本"],
      required: ["排班版本", "排班版本列表", "返回排班计划"],
    },
    {
      source: await readFile(actualLogProductionWorkbenchPath, "utf8"),
      forbidden: ["登录/状态日志生产", "登录/状态日志生产台账", "返回日志生产"],
      required: ["登录日志", "状态日志", "日志处理列表"],
    },
  ];

  for (const { source, forbidden, required } of [...pageExpectations, ...workbenchExpectations]) {
    for (const phrase of forbidden) {
      assert.equal(source.includes(phrase), false, phrase);
    }

    for (const phrase of required) {
      assert.equal(source.includes(phrase), true, phrase);
    }
  }
});
