import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const sidebar = readFileSync(new URL("../../components/app-sidebar.tsx", import.meta.url), "utf8");

test("product sidebar does not expose internal production MVP planning pages", () => {
  for (const term of [
    "/production-mvp",
    "生产雏形",
    "总进度",
    "生产缺口",
    "数据底座准备",
    "预测实际对齐",
    "异常识别准备",
    "治理边界准备",
    "验收清单",
  ]) {
    assert.equal(sidebar.includes(term), false, `sidebar must not expose ${term}`);
  }
});

test("fulfillment monitoring navigation exposes only real business destinations", () => {
  assert.equal(sidebar.includes('{ title: "履约日历", href: "/person-timeline", activeMatch: "prefix"'), true);

  for (const term of ["人员时间轴", "坐席状态轨迹", "工时核验", "异常管理", "实时遵守率", 'tag: "新"', 'tag: "P1"']) {
    assert.equal(sidebar.includes(term), false, `sidebar must not expose stale fulfillment entry ${term}`);
  }

  const fulfillmentGroup = sidebar.slice(
    sidebar.indexOf('title: "履约监控"'),
    sidebar.indexOf('title: "结算复盘"'),
  );
  assert.equal(
    fulfillmentGroup.includes('href: "/dashboard"'),
    false,
    "fulfillment monitoring items must not point to the dashboard as placeholders",
  );
});

test("data source concepts are not exposed as dashboard placeholders", () => {
  assert.equal(
    sidebar.includes('{ title: "CORN 状态日志", href: "/dashboard" }'),
    false,
    "CORN status log should not be exposed as a dashboard placeholder entry",
  );
});

test("sidebar does not keep dashboard placeholder business entries", () => {
  const placeholderPattern = /\{\s*title:\s*"([^"]+)",\s*href:\s*"\/dashboard"(?!,\s*activeMatch:\s*"exact")/g;
  const placeholders = [...sidebar.matchAll(placeholderPattern)].map((match) => match[1]);

  assert.deepEqual(placeholders, [], `sidebar dashboard placeholders: ${placeholders.join(", ")}`);
});

test("production MVP planning routes are not product pages", () => {
  assert.throws(
    () => readdirSync(new URL("../../app/production-mvp", import.meta.url)),
    /ENOENT/,
    "internal planning artifacts must stay out of app routes",
  );
});
