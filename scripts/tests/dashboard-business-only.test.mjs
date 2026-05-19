import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dashboardPage = readFileSync(new URL("../../app/dashboard/page.tsx", import.meta.url), "utf8");

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
