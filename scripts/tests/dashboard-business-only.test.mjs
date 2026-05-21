import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dashboardPage = readFileSync(new URL("../../app/dashboard/page.tsx", import.meta.url), "utf8");
const dashboardData = readFileSync(new URL("../../app/dashboard/data.ts", import.meta.url), "utf8");
const dashboardTable = readFileSync(new URL("../../components/data-table.tsx", import.meta.url), "utf8");

test("business dashboard does not render data access evidence panels", () => {
  assert.equal(
    dashboardPage.includes("DataSyncStatus"),
    false,
    "经营总览不得 import 或渲染 DataSyncStatus；数据接入证据应留在专门页面。",
  );
  assert.equal(
    dashboardPage.includes("数据接入状态"),
    false,
    "经营总览不得出现数据接入状态面板。",
  );
  assert.equal(
    dashboardPage.includes("数据版本"),
    false,
    "经营总览不得出现数据接入或导入版本筛选。",
  );
});

test("business dashboard metrics stay in fulfillment and risk language", () => {
  for (const title of ["计划覆盖率", "登录履约率", "供需缺口", "质量风险"]) {
    assert.equal(dashboardData.includes(`title: "${title}"`), true, `经营总览必须展示 ${title}`);
  }

  for (const term of ["CORN 状态日志计算", "BPO 生效排班版本", "影响结算口径", "占位", "行操作"]) {
    assert.equal(dashboardData.includes(term), false, `经营总览数据不得暴露 ${term}`);
    assert.equal(dashboardTable.includes(term), false, `经营总览表格不得暴露 ${term}`);
  }
});
