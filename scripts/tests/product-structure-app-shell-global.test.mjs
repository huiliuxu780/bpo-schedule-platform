import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";

const appRootPath = new URL("../../app/", import.meta.url);
const componentsRootPath = new URL("../../components/", import.meta.url);
const dashboardPagePath = new URL("../../app/dashboard/page.tsx", import.meta.url);
const appSidebarPath = new URL("../../components/app-sidebar.tsx", import.meta.url);
const masterDataAgentImportDialogPath = new URL("../../components/master-data-agent-import-dialog.tsx", import.meta.url);
const globalsCssPath = new URL("../../app/globals.css", import.meta.url);
const uiButtonPath = new URL("../../components/ui/button.tsx", import.meta.url);
const uiTablePath = new URL("../../components/ui/table.tsx", import.meta.url);

async function collectSourceFiles(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryUrl = new URL(entry.name, directoryUrl);

    if (entry.isDirectory()) {
      files.push(...await collectSourceFiles(new URL(`${entry.name}/`, directoryUrl)));
      continue;
    }

    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      const entryStat = await stat(entryUrl);
      if (entryStat.isFile()) {
        files.push(entryUrl);
      }
    }
  }

  return files;
}

test("dashboard overview does not expose data ingestion status panel", async () => {
  const source = await readFile(dashboardPagePath, "utf8");

  assert.equal(source.includes("DataSyncStatus"), false);
  assert.equal(source.includes("data-sync-status"), false);
});

test("ui typography and density baseline is not overridden by component drift", async () => {
  const globalsSource = await readFile(globalsCssPath, "utf8");
  const buttonSource = await readFile(uiButtonPath, "utf8");
  const tableSource = await readFile(uiTablePath, "utf8");
  const agentImportDialogSource = await readFile(masterDataAgentImportDialogPath, "utf8");

  assert.equal(
    /button,\s*input,\s*select\s*\{\s*font:\s*inherit;\s*\}/s.test(globalsSource),
    false,
    "global form reset must not override component typography utilities",
  );
  assert.equal(
    buttonSource.includes("text-[0.8rem]"),
    false,
    "Button small size must not use a non-standard 12.8px font size",
  );
  assert.equal(
    /xs:\s*"[^"]*text-xs/.test(buttonSource),
    false,
    "Button extra-small text actions must not render at 12px against 14px page actions",
  );
  assert.equal(
    /TableHead[\s\S]*text-xs/.test(tableSource),
    false,
    "TableHead must not force 12px headers against 14px table body text",
  );
  assert.equal(
    agentImportDialogSource.includes("text-xs"),
    false,
    "agent import dialog body, steps, mapping controls, and result copy should keep the 14px baseline",
  );
});

test("application source does not retain rejected center-first visible wording", async () => {
  const sourceFiles = [
    ...await collectSourceFiles(appRootPath),
    ...await collectSourceFiles(componentsRootPath),
  ];
  const forbiddenVisiblePhrases = [
    "数据接入状态",
    "导入中心",
    "数据质量",
    "质量中心",
    "接入批次",
    "CORN",
    "local-operator",
    " 服务",
  ];
  const forbiddenTaskCodePattern = /\b(?:F|B|Q|IM|US|DB)\d{3}\b/;

  for (const fileUrl of sourceFiles) {
    const source = await readFile(fileUrl, "utf8");

    for (const phrase of forbiddenVisiblePhrases) {
      assert.equal(source.includes(phrase), false, `${fileUrl.pathname}: ${phrase}`);
    }

    assert.equal(
      forbiddenTaskCodePattern.test(source),
      false,
      `${fileUrl.pathname}: task code label`,
    );
  }
});

test("sidebar does not expose placeholder or deferred product capabilities", async () => {
  const source = await readFile(appSidebarPath, "utf8");
  const forbiddenLabels = [
    "今日履约",
    "异常预警",
    "时段缺口热力图",
    "智能排班",
    "工时核验",
    "坐席状态轨迹",
    "异常管理",
    "实时遵守率",
    "异常复核",
    "月度结算",
    "报表中心",
    "供应商复盘",
    "结算锁账",
    "数据源管理",
    "文件导入",
    "业务版本",
    "接入批次",
    "数据质量",
    "质量中心",
    "导入中心",
    "预测生产",
    "排班生产",
    "主数据维护",
    "字段映射",
    "接口集成",
    "组织与人员",
    "供应商管理",
    "规则配置",
    "权限管理",
    "操作审计",
  ];

  for (const label of forbiddenLabels) {
    assert.equal(source.includes(`title: "${label}"`), false, label);
  }

  assert.equal(
    source.includes('href: "/demand-plans/production"'),
    false,
    "demand production route should not be exposed as its own sidebar item",
  );
  assert.equal(
    source.includes('href: "/schedule-plans/production"'),
    false,
    "schedule production route should not be exposed as its own sidebar item",
  );
  assert.equal(
    source.includes('excludePrefixes: ["/schedule-plans/production"]'),
    false,
    "schedule parent navigation should own production child routes",
  );

  assert.equal(
    [...source.matchAll(/href: "\/dashboard"/g)].length,
    1,
    "only the business overview entry may point to the dashboard route",
  );
});
