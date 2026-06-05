import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";

const appRootPath = new URL("../../app/", import.meta.url);
const componentsRootPath = new URL("../../components/", import.meta.url);
const dashboardPagePath = new URL("../../app/dashboard/page.tsx", import.meta.url);
const appSidebarPath = new URL("../../components/app-sidebar.tsx", import.meta.url);
const masterDataIndexPagePath = new URL("../../app/master-data/page.tsx", import.meta.url);
const masterDataEntityPagePath = new URL("../../app/master-data/[entityKey]/page.tsx", import.meta.url);
const masterDataActionsPath = new URL("../../app/master-data/[entityKey]/actions.ts", import.meta.url);
const masterDataModelPath = new URL("../../components/master-data-maintenance-model.ts", import.meta.url);

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
    [...source.matchAll(/href: "\/dashboard"/g)].length,
    1,
    "only the business overview entry may point to the dashboard route",
  );
});

test("master data entry redirects to agents and entity pages do not use the old long detail workspace", async () => {
  const indexSource = await readFile(masterDataIndexPagePath, "utf8");
  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsPath, "utf8");
  const modelSource = await readFile(masterDataModelPath, "utf8");
  const forbiddenEntityPageTerms = [
    "  MasterDataMaintenanceEntityDetail,",
    "<MasterDataMaintenanceEntityDetail",
    "submitMasterDataReferenceMaintenance",
    "submitMasterDataBindingMaintenance",
    "详情与引用影响",
    "提交表单",
    "维护动作",
    "来源与引用",
  ];
  const forbiddenActionTerms = [
    "submitMasterDataReferenceMaintenance",
    "submitMasterDataBindingMaintenance",
    "parseBindingAction",
    "parseEntityKey",
    "buildMasterDataReferenceMaintenance",
    "buildMasterDataBindingMaintenance",
  ];
  const forbiddenModelTerms = [
    "MasterDataEntityDetailSummary",
    "summarizeMasterDataMaintenanceEntityDetail",
    "MasterDataMaintenanceWorkspaceTab",
    "workspaceTabs",
    "MasterDataReferenceMaintenancePayload",
    "MasterDataBindingMaintenancePayload",
    "buildMasterDataReferenceMaintenance",
    "buildMasterDataBindingMaintenance",
  ];

  assert.equal(indexSource.includes('redirect("/master-data/agents")'), true);

  for (const term of forbiddenEntityPageTerms) {
    assert.equal(entitySource.includes(term), false, term);
  }

  for (const term of forbiddenActionTerms) {
    assert.equal(actionsSource.includes(term), false, term);
  }

  for (const term of forbiddenModelTerms) {
    assert.equal(modelSource.includes(term), false, term);
  }
});
