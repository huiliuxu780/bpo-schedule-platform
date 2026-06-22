import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routeLoadings = [
  { path: "app/dashboard/loading.tsx", title: "经营总览" },
  { path: "app/master-data/loading.tsx", title: "主数据" },
  { path: "app/demand-plans/loading.tsx", title: "需求计划" },
  { path: "app/schedule-plans/loading.tsx", title: "排班计划" },
  { path: "app/actual-logs/production/loading.tsx", title: "登录/状态日志" },
  { path: "app/data-quality/loading.tsx", title: "导入批次" },
];

test("core business routes provide AppShell skeleton loading states", async () => {
  for (const routeLoading of routeLoadings) {
    const source = await readFile(new URL(`../../${routeLoading.path}`, import.meta.url), "utf8");

    assert.equal(source.includes('from "@/components/app-shell"'), true, routeLoading.path);
    assert.equal(source.includes('from "@/components/ui/skeleton"'), true, routeLoading.path);
    assert.match(source, /export default function Loading/);
    assert.match(source, new RegExp(`<AppShell[\\s\\S]*title="${routeLoading.title}"`));
    assert.match(source, /<Skeleton/g);
    assert.equal(source.includes("Loading..."), false, routeLoading.path);
    assert.equal(source.includes("正在加载"), false, routeLoading.path);
  }
});
