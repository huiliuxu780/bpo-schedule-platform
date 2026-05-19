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

test("production MVP planning routes are not product pages", () => {
  assert.throws(
    () => readdirSync(new URL("../../app/production-mvp", import.meta.url)),
    /ENOENT/,
    "internal planning artifacts must stay out of app routes",
  );
});
